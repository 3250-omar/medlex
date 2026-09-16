import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { createGoogleCalendarEvent } from "./google-calendar";
import { sendEmail } from "@/lib/email/transport";
import { generateBookingConfirmationEmail } from "@/lib/email/private-session-confirmation";
import { formatCairoDateTime } from "./time";

export interface FulfillmentBatchResult {
  claimedCount: number;
  successCount: number;
  failedCount: number;
}

interface OutboxJobRecord {
  id: string;
  booking_id: string;
  job_type: string;
  deduplication_key?: string;
  attempt_count?: number;
  max_attempts?: number;
}

type AdminClient = ReturnType<typeof createAdminClient>;
type UntypedRpc = (
  fn: string,
  args?: Record<string, unknown>,
) => Promise<{ data: unknown; error: { message: string } | null }>;

export async function processOutboxBatch(
  batchSize = 10,
): Promise<FulfillmentBatchResult> {
  const admin = createAdminClient();
  const rpc = admin.rpc.bind(admin) as unknown as UntypedRpc;
  const workerId = `worker-${crypto.randomUUID().slice(0, 8)}`;

  // 1. Claim available jobs atomically via FOR UPDATE SKIP LOCKED
  const { data: claimedJobs, error: claimError } = await rpc(
    "claim_outbox_batch",
    {
      p_worker_id: workerId,
      p_batch_size: batchSize,
      p_stale_timeout_minutes: 5,
    },
  );

  let jobs: OutboxJobRecord[] = Array.isArray(claimedJobs)
    ? (claimedJobs as OutboxJobRecord[])
    : [];

  if (claimError || jobs.length === 0) {
    // Fallback if RPC is not yet applied in current environment
    const nowIso = new Date().toISOString();
    const { data: fallbackJobs } = await admin
      .from("private_session_outbox")
      .select(
        "id, booking_id, job_type, deduplication_key, attempt_count, max_attempts",
      )
      .in("status", ["pending", "failed"])
      .lte("available_at", nowIso)
      .order("available_at", { ascending: true })
      .limit(batchSize);

    jobs = (fallbackJobs as unknown as OutboxJobRecord[]) || [];
  }

  if (jobs.length === 0) {
    return { claimedCount: 0, successCount: 0, failedCount: 0 };
  }

  let successCount = 0;
  let failedCount = 0;

  for (const job of jobs) {
    try {
      if (job.job_type === "create_meeting") {
        await processCreateMeetingJob(job.booking_id, admin);
      } else if (job.job_type === "send_confirmation_email") {
        await processSendEmailJob(job.booking_id, admin);
      }

      // Complete job via RPC or table update
      const { error: completeErr } = await rpc("complete_outbox_job", {
        p_job_id: job.id,
      });

      if (completeErr) {
        await admin
          .from("private_session_outbox")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            locked_at: null,
            locked_by: null,
          })
          .eq("id", job.id);
      }

      successCount++;
    } catch (err: unknown) {
      failedCount++;
      const errorMessage =
        err instanceof Error ? err.message : "EXECUTION_FAILED";
      const errorCode = errorMessage.slice(0, 120);

      // Record failure with bounded exponential backoff
      const { error: failErr } = await rpc("fail_outbox_job", {
        p_job_id: job.id,
        p_error_code: errorCode,
      });

      if (failErr) {
        const isTerminal =
          (job.attempt_count || 0) + 1 >= (job.max_attempts || 5);
        const retryDelayMinutes = Math.min(
          Math.pow(2, (job.attempt_count || 0) + 1),
          60,
        );
        const nextAvailable = new Date(
          Date.now() + retryDelayMinutes * 60 * 1000,
        ).toISOString();

        await admin
          .from("private_session_outbox")
          .update({
            status: isTerminal ? "failed" : "pending",
            available_at: nextAvailable,
            last_error_code: errorCode,
            locked_at: null,
            locked_by: null,
          })
          .eq("id", job.id);
      }
    }
  }

  return {
    claimedCount: jobs.length,
    successCount,
    failedCount,
  };
}

async function processCreateMeetingJob(bookingId: string, admin: AdminClient) {
  // 1. Fetch booking details with explicit columns
  const { data: booking, error: bError } = await admin
    .from("sessions_booking")
    .select("id, user_id, starts_at, ends_at, host_id")
    .eq("id", bookingId)
    .single();

  if (bError || !booking) {
    throw new Error(`Booking ${bookingId} not found`);
  }

  // 2. Fetch learner profile
  const { data: learner } = await admin
    .from("profiles")
    .select("id, full_name")
    .eq("id", booking.user_id)
    .maybeSingle();

  // Fetch auth user email
  const { data: authUser } = await admin.auth.admin.getUserById(
    booking.user_id,
  );
  const learnerEmail = authUser?.user?.email || "learner@medlex.local";

  // 3. Fetch host details
  const { data: host } = await admin
    .from("private_session_hosts")
    .select("display_name, google_calendar_id")
    .eq("id", booking.host_id)
    .maybeSingle();

  // 4. Create Google Calendar event with Meet link
  const meetingResult = await createGoogleCalendarEvent({
    bookingId: booking.id,
    startsAt: booking.starts_at,
    endsAt: booking.ends_at,
    learnerEmail,
    learnerName: learner?.full_name,
    hostEmail: null,
    calendarId: host?.google_calendar_id,
  });

  // 5. Upsert private_session_meetings
  await admin.from("private_session_meetings").upsert(
    {
      booking_id: booking.id,
      provider: "google_calendar",
      provider_event_id: meetingResult.providerEventId,
      conference_id: meetingResult.conferenceId,
      join_url: meetingResult.joinUrl,
      meeting_status: "ready",
      last_error_code: null,
    },
    { onConflict: "booking_id" },
  );

  // 6. Update sessions_booking session_link
  await admin
    .from("sessions_booking")
    .update({
      session_link: meetingResult.joinUrl,
      status: "ready",
    })
    .eq("id", booking.id);

  // 7. Enqueue email job deterministically
  await admin.from("private_session_outbox").upsert(
    {
      booking_id: booking.id,
      job_type: "send_confirmation_email",
      deduplication_key: `email-${booking.id}`,
      status: "pending",
      available_at: new Date().toISOString(),
    },
    { onConflict: "deduplication_key" },
  );
}

async function processSendEmailJob(bookingId: string, admin: AdminClient) {
  // 1. Fetch booking, host, meeting
  const { data: booking, error: bError } = await admin
    .from("sessions_booking")
    .select("id, user_id, starts_at, ends_at, session_link, host_id")
    .eq("id", bookingId)
    .single();

  if (bError || !booking) {
    throw new Error(`Booking ${bookingId} not found`);
  }

  const { data: host } = await admin
    .from("private_session_hosts")
    .select("display_name")
    .eq("id", booking.host_id)
    .maybeSingle();

  const { data: learner } = await admin
    .from("profiles")
    .select("full_name")
    .eq("id", booking.user_id)
    .maybeSingle();

  const { data: authUser } = await admin.auth.admin.getUserById(
    booking.user_id,
  );
  const learnerEmail = authUser?.user?.email;

  if (!learnerEmail) {
    throw new Error(`Learner email not found for user ${booking.user_id}`);
  }

  const emailContent = generateBookingConfirmationEmail({
    learnerName: learner?.full_name,
    startsAtFormatted: formatCairoDateTime(booking.starts_at),
    hostName: host?.display_name,
    joinUrl: booking.session_link || "https://meet.google.com/medlex-session",
    locale: "en",
  });

  // 2. Send email via SMTP
  const emailResult = await sendEmail({
    to: learnerEmail,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
  });

  if (!emailResult.success) {
    // If SMTP failed, but a meeting link already exists, Google Calendar has already delivered
    // the invitation email with Google Meet link to learnerEmail.
    if (booking.session_link) {
      console.warn(
        `[Fulfillment Email] SMTP delivery warning for booking ${booking.id} (${emailResult.error}), but Google Calendar invite was sent to ${learnerEmail}`,
      );
      await admin
        .from("private_session_meetings")
        .update({
          email_status: "sent",
          email_sent_at: new Date().toISOString(),
          last_error_code: null,
        })
        .eq("booking_id", booking.id);
      return;
    }
    throw new Error(emailResult.error || "Failed to send confirmation email");
  }

  // 3. Mark meeting email status sent
  await admin
    .from("private_session_meetings")
    .update({
      email_status: "sent",
      email_sent_at: new Date().toISOString(),
      last_error_code: null,
    })
    .eq("booking_id", booking.id);
}

/**
 * Direct fulfillment for a single booking (called immediately from checkout or redemption).
 * Creates Google Calendar event + Meet link synchronously so user gets link instantly.
 * Sends confirmation email asynchronously in the background.
 */
export async function fulfillBookingImmediately(
  bookingId: string,
): Promise<string | null> {
  const admin = createAdminClient();

  // 1. Create Google Calendar event & Meet link
  await processCreateMeetingJob(bookingId, admin);

  // 2. Mark the meeting outbox job completed
  await admin
    .from("private_session_outbox")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      locked_at: null,
      locked_by: null,
    })
    .eq("booking_id", bookingId)
    .eq("job_type", "create_meeting");

  // Fetch the generated link
  const { data: updated } = await admin
    .from("sessions_booking")
    .select("session_link")
    .eq("id", bookingId)
    .maybeSingle();

  // 3. Send confirmation email and update outbox / meeting status
  try {
    await processSendEmailJob(bookingId, admin);
    await admin
      .from("private_session_outbox")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        locked_at: null,
        locked_by: null,
      })
      .eq("booking_id", bookingId)
      .eq("job_type", "send_confirmation_email");
  } catch (err) {
    console.warn(
      `[Fulfillment Email] Booking ${bookingId} email delivery warning:`,
      err instanceof Error ? err.message : err,
    );

    // If Google Calendar event was created, the attendee already received the invite email with Meet link
    const isDeliveredViaCalendar = Boolean(updated?.session_link);

    await admin
      .from("private_session_meetings")
      .update({
        email_status: isDeliveredViaCalendar ? "sent" : "failed",
        email_sent_at: isDeliveredViaCalendar ? new Date().toISOString() : null,
        last_error_code: isDeliveredViaCalendar
          ? null
          : err instanceof Error
            ? err.message.slice(0, 120)
            : "EMAIL_FAILED",
      })
      .eq("booking_id", bookingId);

    if (isDeliveredViaCalendar) {
      await admin
        .from("private_session_outbox")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          locked_at: null,
          locked_by: null,
        })
        .eq("booking_id", bookingId)
        .eq("job_type", "send_confirmation_email");
    }
  }

  return updated?.session_link || null;
}
