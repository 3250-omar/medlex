import "server-only";

interface CreateMeetingParams {
  bookingId: string;
  startsAt: string;
  endsAt: string;
  learnerEmail: string;
  learnerName?: string | null;
  hostEmail?: string | null;
  calendarId?: string | null;
}

export interface GoogleCalendarMeetingResult {
  providerEventId: string;
  conferenceId: string | null;
  joinUrl: string;
}

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  // Return cached token if valid with 2-minute buffer
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 120_000) {
    return cachedAccessToken;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    cachedAccessToken = data.access_token;
    tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;
    return cachedAccessToken;
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

export async function createGoogleCalendarEvent({
  bookingId,
  startsAt,
  endsAt,
  learnerEmail,
  learnerName,
  hostEmail,
  calendarId,
}: CreateMeetingParams): Promise<GoogleCalendarMeetingResult> {
  const targetCalendarId =
    calendarId ||
    process.env.GOOGLE_CALENDAR_ID ||
    "primary";

  const token = await getAccessToken();

  // If credentials are not configured or in development, return a deterministic meeting link
  if (!token) {
    if (process.env.NODE_ENV === "production" && process.env.GOOGLE_OAUTH_CLIENT_ID) {
      throw new Error("Failed to obtain Google Calendar access token");
    }

    const mockConferenceId = `casc-${bookingId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10)}`;
    return {
      providerEventId: `dev-event-${bookingId}`,
      conferenceId: mockConferenceId,
      joinUrl: `https://meet.google.com/${mockConferenceId}`,
    };
  }

  const deterministicRequestId = `meet-${bookingId}`;
  const attendees = [
    { email: learnerEmail, displayName: learnerName || "Candidate" },
  ];
  if (hostEmail) {
    attendees.push({ email: hostEmail, displayName: "Instructor" });
  }

  const eventPayload = {
    summary: "MedLex: CASC One-to-One Session",
    description: `Online one-to-one CASC intensive station practice and examiner feedback.\nCandidate: ${learnerName || learnerEmail}\nBooking ID: ${bookingId}`,
    start: { dateTime: startsAt },
    end: { dateTime: endsAt },
    attendees,
    conferenceData: {
      createRequest: {
        requestId: deterministicRequestId,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        targetCalendarId
      )}/events?conferenceDataVersion=1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventPayload),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Calendar API error (${response.status}): ${errorText}`);
    }

    const event = (await response.json()) as {
      id?: string;
      hangoutLink?: string;
      conferenceData?: {
        conferenceId?: string;
        entryPoints?: Array<{ entryPointType?: string; uri?: string }>;
      };
    };
    const joinUrl =
      event.hangoutLink ||
      event.conferenceData?.entryPoints?.find((ep) => ep.entryPointType === "video")?.uri ||
      "";

    const conferenceId = event.conferenceData?.conferenceId || null;

    if (!joinUrl || !event.id) {
      throw new Error("Google Calendar event created without Google Meet video conference link");
    }

    return {
      providerEventId: event.id,
      conferenceId,
      joinUrl,
    };
  } catch (err: unknown) {
    clearTimeout(timeout);
    throw err;
  }
}
