export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          avatar_path: string | null;
          exam_date: string | null;
          role: "learner" | "admin";
          gift_downloaded_at: string | null;
          gift_1_downloaded_at: string | null;
          gift_2_downloaded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["profiles"]["Row"],
          | "created_at"
          | "updated_at"
          | "avatar_path"
          | "exam_date"
          | "gift_downloaded_at"
          | "gift_1_downloaded_at"
          | "gift_2_downloaded_at"
        > & {
          created_at?: string;
          updated_at?: string;
          avatar_path?: string | null;
          exam_date?: string | null;
          gift_downloaded_at?: string | null;
          gift_1_downloaded_at?: string | null;
          gift_2_downloaded_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          slug: string;
          title_en: string;
          title_ar: string | null;
          description_en: string | null;
          description_ar: string | null;
          price: number;
          access_duration_days: number;
          points_on_completion: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["courses"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
        Relationships: [];
      };
      course_releases: {
        Row: {
          id: string;
          course_id: string;
          version_number: number;
          status: "draft" | "published" | "archived";
          source_sha256: string | null;
          settings: Json;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["course_releases"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["course_releases"]["Insert"]
        >;
        Relationships: [];
      };
      learning_units: {
        Row: {
          id: string;
          release_id: string;
          parent_unit_id: string | null;
          unit_kind_id: string;
          source_key: string;
          slug: string;
          unit_code: string | null;
          sequence_number: number;
          position_in_parent: number;
          estimated_seconds: number | null;
          is_required: boolean;
          is_published: boolean;
          title: string;
          summary: string | null;
          eyebrow: string | null;
          lens_text: string | null;
          completion_title: string | null;
          completion_body: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["learning_units"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["learning_units"]["Insert"]
        >;
        Relationships: [];
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          release_id: string;
          last_accessed_unit_id: string | null;
          status: "active" | "completed" | "expired" | "paused" | "cancelled";
          enrolled_at: string;
          access_starts_at: string;
          expires_at: string | null;
          completed_at: string | null;
          updated_at: string;
          cancellation_waiver_accepted?: boolean;
          cancellation_waiver_accepted_at?: string | null;
          cancellation_waiver_text?: string | null;
          cancellation_waiver_ip?: string | null;
          cancellation_waiver_user_agent?: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["enrollments"]["Row"],
          "id" | "enrolled_at" | "access_starts_at" | "updated_at"
        > & {
          id?: string;
          enrolled_at?: string;
          access_starts_at?: string;
          updated_at?: string;
          cancellation_waiver_accepted?: boolean;
          cancellation_waiver_accepted_at?: string | null;
          cancellation_waiver_text?: string | null;
          cancellation_waiver_ip?: string | null;
          cancellation_waiver_user_agent?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["enrollments"]["Insert"]>;
        Relationships: [];
      };
      unit_progress: {
        Row: {
          enrollment_id: string;
          unit_id: string;
          status: "not_started" | "in_progress" | "completed";
          progress_percent: number;
          started_at: string | null;
          completed_at: string | null;
          last_accessed_at: string | null;
          updated_at: string;
          exam_completed?: boolean;
          exam_completed_at?: string | null;
          exam_score?: number | null;
          exam_total?: number | null;
        };
        Insert: {
          enrollment_id: string;
          unit_id: string;
          status?: "not_started" | "in_progress" | "completed";
          progress_percent?: number;
          started_at?: string | null;
          completed_at?: string | null;
          last_accessed_at?: string | null;
          updated_at?: string;
          exam_completed?: boolean;
          exam_completed_at?: string | null;
          exam_score?: number | null;
          exam_total?: number | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["unit_progress"]["Insert"]
        >;
        Relationships: [];
      };
      cancellation_waivers: {
        Row: {
          id: string;
          user_id: string;
          enrollment_id: string | null;
          course_slug: string;
          waiver_text: string;
          accepted: boolean;
          accepted_at: string;
          ip_address: string | null;
          user_agent: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          enrollment_id?: string | null;
          course_slug: string;
          waiver_text: string;
          accepted?: boolean;
          accepted_at?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["cancellation_waivers"]["Insert"]
        >;
        Relationships: [];
      };
      certificates: {
        Row: {
          id: string;
          certificate_number: string;
          enrollment_id: string;
          recipient_name_snapshot: string;
          course_title_snapshot: string;
          release_version_snapshot: number;
          issued_at: string;
          revoked_at: string | null;
          revocation_reason: string | null;
          storage_path: string | null;
        };
        Insert: {
          id?: string;
          certificate_number: string;
          enrollment_id: string;
          recipient_name_snapshot: string;
          course_title_snapshot: string;
          release_version_snapshot?: number;
          issued_at?: string;
          revoked_at?: string | null;
          revocation_reason?: string | null;
          storage_path?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["certificates"]["Insert"]>;
        Relationships: [];
      };
      certificate_download_events: {
        Row: {
          id: number;
          certificate_id: string;
          user_id: string | null;
          downloaded_at: string;
        };
        Insert: {
          id?: number;
          certificate_id: string;
          user_id?: string | null;
          downloaded_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["certificate_download_events"]["Insert"]
        >;
        Relationships: [];
      };
      contacts_requests: {
        Row: {
          id: number;
          full_name: string;
          gmail: string;
          phone: string;
          professional_role: string | null;
          organisation: string | null;
          pathway: string;
          notes: string | null;
          locale: string;
          status: "pending" | "responded" | "ignored";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          full_name: string;
          gmail: string;
          phone: string;
          professional_role?: string | null;
          organisation?: string | null;
          pathway: string;
          notes?: string | null;
          locale?: string;
          status?: "pending" | "responded" | "ignored";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["contacts_requests"]["Insert"]
        >;
        Relationships: [];
      };
      private_session_hosts: {
        Row: {
          id: string;
          profile_id: string;
          display_name: string;
          timezone: string;
          google_calendar_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          display_name: string;
          timezone?: string;
          google_calendar_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["private_session_hosts"]["Insert"]>;
        Relationships: [];
      };
      private_session_offers: {
        Row: {
          id: string;
          course_id: string;
          code: "direct" | "package_5" | "package_10";
          kind: "direct" | "package";
          session_count: 1 | 5 | 10;
          price_minor: number;
          currency: string;
          title_en: string;
          title_ar: string;
          is_active: boolean;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          code: "direct" | "package_5" | "package_10";
          kind: "direct" | "package";
          session_count: 1 | 5 | 10;
          price_minor: number;
          currency: string;
          title_en: string;
          title_ar: string;
          is_active?: boolean;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["private_session_offers"]["Insert"]>;
        Relationships: [];
      };
      offer_country_prices: {
        Row: {
          id: string;
          offer_id: string;
          country_code: string;
          price_minor: number;
          currency: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          offer_id: string;
          country_code: string;
          price_minor: number;
          currency?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["offer_country_prices"]["Insert"]>;
        Relationships: [];
      };
      private_session_slots: {
        Row: {
          id: string;
          course_id: string;
          host_id: string;
          starts_at: string;
          ends_at: string;
          source_timezone: string;
          status: "available" | "held" | "booked" | "withdrawn" | "completed";
          created_by: string | null;
          updated_by: string | null;
          withdrawn_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          host_id: string;
          starts_at: string;
          ends_at: string;
          source_timezone?: string;
          status?: "available" | "held" | "booked" | "withdrawn" | "completed";
          created_by?: string | null;
          updated_by?: string | null;
          withdrawn_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["private_session_slots"]["Insert"]>;
        Relationships: [];
      };
      session_payment_attempts: {
        Row: {
          id: string;
          idempotency_key: string;
          user_id: string;
          course_id: string;
          offer_id: string;
          purpose: "direct" | "package";
          slot_id: string | null;
          quantity_snapshot: 1 | 5 | 10;
          amount_minor: number;
          currency: string;
          provider: string;
          provider_order_id: string | null;
          provider_transaction_id: string | null;
          status: "created" | "pending" | "paid" | "failed" | "cancelled" | "expired" | "paid_unfulfilled";
          hold_expires_at: string | null;
          failure_code: string | null;
          failure_detail: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          idempotency_key: string;
          user_id: string;
          course_id: string;
          offer_id: string;
          purpose: "direct" | "package";
          slot_id?: string | null;
          quantity_snapshot: 1 | 5 | 10;
          amount_minor: number;
          currency: string;
          provider?: string;
          provider_order_id?: string | null;
          provider_transaction_id?: string | null;
          status?: "created" | "pending" | "paid" | "failed" | "cancelled" | "expired" | "paid_unfulfilled";
          hold_expires_at?: string | null;
          failure_code?: string | null;
          failure_detail?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["session_payment_attempts"]["Insert"]>;
        Relationships: [];
      };
      session_payment_webhook_events: {
        Row: {
          id: string;
          provider_event_id: string;
          provider_transaction_id: string | null;
          payload_hash: string;
          verified: boolean;
          processing_status: "received" | "processed" | "duplicate" | "rejected" | "failed";
          attempt_id: string | null;
          error_detail: string | null;
          received_at: string;
          processed_at: string | null;
        };
        Insert: {
          id?: string;
          provider_event_id: string;
          provider_transaction_id?: string | null;
          payload_hash: string;
          verified?: boolean;
          processing_status?: "received" | "processed" | "duplicate" | "rejected" | "failed";
          attempt_id?: string | null;
          error_detail?: string | null;
          received_at?: string;
          processed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["session_payment_webhook_events"]["Insert"]>;
        Relationships: [];
      };
      session_entitlements: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          offer_id: string;
          payment_attempt_id: string;
          purchased_quantity: 5 | 10;
          reserved_quantity: number;
          consumed_quantity: number;
          remaining_quantity: number;
          amount_minor: number;
          currency: string;
          status: "active" | "exhausted" | "suspended";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          offer_id: string;
          payment_attempt_id: string;
          purchased_quantity: 5 | 10;
          reserved_quantity?: number;
          consumed_quantity?: number;
          remaining_quantity?: number;
          amount_minor: number;
          currency: string;
          status?: "active" | "exhausted" | "suspended";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["session_entitlements"]["Insert"]>;
        Relationships: [];
      };
      session_credit_ledger: {
        Row: {
          id: string;
          entitlement_id: string;
          booking_id: string | null;
          delta: number;
          reason: "purchase_grant" | "booking_consumed" | "booking_restored";
          idempotency_key: string;
          actor_type: "system" | "learner" | "admin";
          actor_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          entitlement_id: string;
          booking_id?: string | null;
          delta: number;
          reason: "purchase_grant" | "booking_consumed" | "booking_restored";
          idempotency_key: string;
          actor_type: "system" | "learner" | "admin";
          actor_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["session_credit_ledger"]["Insert"]>;
        Relationships: [];
      };
      sessions_booking: {
        Row: {
          id: string;
          slot_id: string;
          user_id: string;
          course_id: string;
          host_id: string;
          funding_type: "direct_payment" | "package_credit";
          payment_attempt_id: string | null;
          entitlement_id: string | null;
          status: "pending_payment" | "confirmed" | "fulfillment_pending" | "ready" | "expired" | "failed" | "cancelled";
          starts_at: string;
          ends_at: string;
          amount_minor: number;
          currency: string;
          session_link: string | null;
          idempotency_key: string;
          confirmed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slot_id: string;
          user_id: string;
          course_id: string;
          host_id: string;
          funding_type: "direct_payment" | "package_credit";
          payment_attempt_id?: string | null;
          entitlement_id?: string | null;
          status?: "pending_payment" | "confirmed" | "fulfillment_pending" | "ready" | "expired" | "failed" | "cancelled";
          starts_at: string;
          ends_at: string;
          amount_minor: number;
          currency: string;
          session_link?: string | null;
          idempotency_key: string;
          confirmed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sessions_booking"]["Insert"]>;
        Relationships: [];
      };
      private_session_meetings: {
        Row: {
          id: string;
          booking_id: string;
          provider: string;
          provider_event_id: string | null;
          conference_id: string | null;
          join_url: string | null;
          meeting_status: "pending" | "creating" | "ready" | "failed";
          email_status: "pending" | "sending" | "sent" | "failed";
          meeting_attempts: number;
          email_attempts: number;
          last_error_code: string | null;
          last_error_at: string | null;
          email_sent_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          provider?: string;
          provider_event_id?: string | null;
          conference_id?: string | null;
          join_url?: string | null;
          meeting_status?: "pending" | "creating" | "ready" | "failed";
          email_status?: "pending" | "sending" | "sent" | "failed";
          meeting_attempts?: number;
          email_attempts?: number;
          last_error_code?: string | null;
          last_error_at?: string | null;
          email_sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["private_session_meetings"]["Insert"]>;
        Relationships: [];
      };
      private_session_outbox: {
        Row: {
          id: string;
          booking_id: string;
          job_type: "create_meeting" | "send_confirmation_email";
          deduplication_key: string;
          status: "pending" | "processing" | "completed" | "failed";
          available_at: string;
          locked_at: string | null;
          locked_by: string | null;
          attempt_count: number;
          max_attempts: number;
          last_error_code: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          booking_id: string;
          job_type: "create_meeting" | "send_confirmation_email";
          deduplication_key: string;
          status?: "pending" | "processing" | "completed" | "failed";
          available_at?: string;
          locked_at?: string | null;
          locked_by?: string | null;
          attempt_count?: number;
          max_attempts?: number;
          last_error_code?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["private_session_outbox"]["Insert"]>;
        Relationships: [];
      };
      private_session_audit_events: {
        Row: {
          id: string;
          actor_type: "system" | "learner" | "admin" | "provider";
          actor_id: string | null;
          entity_type: string;
          entity_id: string;
          action: string;
          before_state: Json | null;
          after_state: Json | null;
          correlation_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_type: "system" | "learner" | "admin" | "provider";
          actor_id?: string | null;
          entity_type: string;
          entity_id: string;
          action: string;
          before_state?: Json | null;
          after_state?: Json | null;
          correlation_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["private_session_audit_events"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      mark_unit_completed: {
        Args: {
          target_course_slug: string;
          target_unit_slug: string;
        };
        Returns: Json;
      };
      record_unit_opened: {
        Args: {
          target_course_slug: string;
          target_unit_slug: string;
        };
        Returns: Json;
      };
      get_course_certificate_status: {
        Args: {
          target_course_slug: string;
        };
        Returns: Json;
      };
      issue_course_certificate: {
        Args: {
          target_course_slug: string;
          recipient_name_override?: string | null;
        };
        Returns: Json;
      };
      get_pathway_feedback: {
        Args: {
          target_scope?: string;
          feedback_limit?: number;
        };
        Returns: {
          feedback: string;
          updated_at: string;
          course_slug: string;
          course_name: string | null;
          course_name_ar: string | null;
          certificate_date: string | null;
          full_name: string | null;
          exam_date: string | null;
          avatar_path: string | null;
        }[];
      };
      create_direct_session_hold: {
        Args: {
          p_slot_id: string;
          p_course_slug: string;
          p_idempotency_key: string;
        };
        Returns: {
          booking_id: string;
          payment_attempt_id: string;
          amount_minor: number;
          currency: string;
          hold_expires_at: string;
        };
      };
      expire_direct_session_hold: {
        Args: {
          p_payment_attempt_id: string;
        };
        Returns: boolean;
      };
      confirm_direct_session_payment: {
        Args: {
          p_payment_attempt_id: string;
          p_provider_order_id?: string | null;
          p_provider_transaction_id?: string | null;
        };
        Returns: {
          booking_id: string;
          status: string;
        };
      };
      grant_private_session_package: {
        Args: {
          p_payment_attempt_id: string;
          p_provider_order_id?: string | null;
          p_provider_transaction_id?: string | null;
        };
        Returns: {
          entitlement_id: string;
          remaining_quantity: number;
        };
      };
      redeem_private_session_credit: {
        Args: {
          p_slot_id: string;
          p_entitlement_id: string;
          p_idempotency_key: string;
        };
        Returns: {
          booking_id: string;
          remaining_credits: number;
          status: string;
        };
      };
      list_eligible_private_session_slots: {
        Args: {
          p_course_slug: string;
          p_from?: string | null;
          p_to?: string | null;
        };
        Returns: {
          id: string;
          starts_at: string;
          ends_at: string;
          source_timezone: string;
          host_display_name: string;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type PrivateSessionOfferRow = Database["public"]["Tables"]["private_session_offers"]["Row"];
export type OfferCountryPriceRow = Database["public"]["Tables"]["offer_country_prices"]["Row"];
export type PrivateSessionSlotRow = Database["public"]["Tables"]["private_session_slots"]["Row"];
export type SessionPaymentAttemptRow = Database["public"]["Tables"]["session_payment_attempts"]["Row"];
export type SessionPaymentWebhookEventRow = Database["public"]["Tables"]["session_payment_webhook_events"]["Row"];
export type SessionEntitlementRow = Database["public"]["Tables"]["session_entitlements"]["Row"];
export type SessionCreditLedgerRow = Database["public"]["Tables"]["session_credit_ledger"]["Row"];
export type SessionsBookingRow = Database["public"]["Tables"]["sessions_booking"]["Row"];
export type PrivateSessionMeetingRow = Database["public"]["Tables"]["private_session_meetings"]["Row"];
export type PrivateSessionHostRow = Database["public"]["Tables"]["private_session_hosts"]["Row"];
export type PrivateSessionOutboxRow = Database["public"]["Tables"]["private_session_outbox"]["Row"];
export type PrivateSessionAuditEventRow = Database["public"]["Tables"]["private_session_audit_events"]["Row"];

export type PrivateSessionOfferCode = "direct" | "package_5" | "package_10";
export type PrivateSessionOfferKind = "direct" | "package";
export type PrivateSessionSlotStatus = "available" | "held" | "booked" | "withdrawn" | "completed";
export type SessionPaymentPurpose = "direct" | "package";
export type SessionPaymentStatus = "created" | "pending" | "paid" | "failed" | "cancelled" | "expired" | "paid_unfulfilled";
export type SessionEntitlementStatus = "active" | "exhausted" | "suspended";
export type SessionCreditLedgerReason = "purchase_grant" | "booking_consumed" | "booking_restored";
export type SessionBookingFundingType = "direct_payment" | "package_credit";
export type SessionBookingStatus = "pending_payment" | "confirmed" | "fulfillment_pending" | "ready" | "expired" | "failed" | "cancelled";
export type PrivateSessionMeetingStatus = "pending" | "creating" | "ready" | "failed";
export type PrivateSessionEmailStatus = "pending" | "sending" | "sent" | "failed";
export type PrivateSessionOutboxJobType = "create_meeting" | "send_confirmation_email";
export type PrivateSessionOutboxStatus = "pending" | "processing" | "completed" | "failed";
export type PrivateSessionActorType = "system" | "learner" | "admin" | "provider";

export interface PrivateSessionOfferDTO {
  id: string;
  code: PrivateSessionOfferCode;
  kind: PrivateSessionOfferKind;
  sessionCount: 1 | 5 | 10;
  priceMinor: number;
  currency: string;
  titleEn: string;
  titleAr: string;
  isActive: boolean;
}

export interface EligibleSlotDTO {
  id: string;
  startsAt: string;
  endsAt: string;
  sourceTimezone: string;
  hostDisplayName: string;
}

export interface LearnerEntitlementSummaryDTO {
  id: string;
  purchasedQuantity: number;
  reservedQuantity: number;
  consumedQuantity: number;
  remainingQuantity: number;
  currency: string;
  status: SessionEntitlementStatus;
}

export interface PrivateSessionContextDTO {
  offers: PrivateSessionOfferDTO[];
  user: {
    id: string;
    email: string;
    fullName: string | null;
    emailVerified: boolean;
  } | null;
  activeEntitlements: LearnerEntitlementSummaryDTO[];
}

