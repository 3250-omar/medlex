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
        };
        Insert: Omit<
          Database["public"]["Tables"]["enrollments"]["Row"],
          "id" | "enrolled_at" | "access_starts_at" | "updated_at"
        > & {
          id?: string;
          enrolled_at?: string;
          access_starts_at?: string;
          updated_at?: string;
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
        };
        Update: Partial<
          Database["public"]["Tables"]["unit_progress"]["Insert"]
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
        Update: Partial<Database["public"]["Tables"]["certificate_download_events"]["Insert"]>;
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
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
