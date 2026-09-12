import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(120),
  email: z.string().trim().email("Invalid email address").max(150),
  phone: z.string().trim().min(3, "Phone number is required").max(50),
  professionalRole: z
    .string()
    .trim()
    .min(2, "Professional role is required")
    .max(150),
  organisation: z.string().trim().max(150).optional().default(""),
  pathway: z.string().trim().min(1, "Pathway is required").max(150),
  notes: z.string().trim().max(3000).optional().default(""),
  locale: z.string().trim().max(10).optional().default("en"),
  _hp: z.string().optional().default(""), // Honeypot field for bot spam prevention
});

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => null);

    // 1. Silent rejection of spam bots filling honeypot
    if (rawBody?._hp) {
      console.warn("[Contact API] Bot submission suppressed via honeypot.");
      return NextResponse.json({
        success: true,
        message: "Message received successfully",
      });
    }

    // 2. Validate incoming payload
    const parsed = contactSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const {
      fullName,
      email,
      phone,
      professionalRole,
      organisation,
      pathway,
      notes,
      locale,
    } = parsed.data;

    // 3. Save contact request to Supabase
    const adminClient = createAdminClient();
    const { error: dbError } = await adminClient
      .from("contacts_requests")
      .insert({
        full_name: fullName,
        gmail: email,
        phone,
        professional_role: professionalRole,
        organisation: organisation || null,
        pathway,
        notes: notes || null,
        locale,
        status: "pending",
      });

    if (dbError) {
      console.error("[Contact API] Database insertion error:", dbError);
      return NextResponse.json(
        { error: "Failed to save contact request. Please try again later." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Contact request saved successfully",
    });
  } catch (error: unknown) {
    console.error("[Contact API Error]:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
