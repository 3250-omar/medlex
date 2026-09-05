import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, context: RouteParams) {
  const { slug } = await context.params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "authentication_required" },
      { status: 401 },
    );
  }

  // 1. Check certificate status & progress
  const { data: statusData, error: statusError } = await supabase.rpc(
    "get_course_certificate_status",
    { target_course_slug: slug },
  );

  if (statusError || !statusData) {
    return NextResponse.json(
      { error: statusError?.message || "Failed to retrieve course status" },
      { status: 500 },
    );
  }

  const status = statusData as {
    enrolled: boolean;
    eligible: boolean;
    progress_percent: number;
    user_name: string;
    completion_date?: string;
    certificate?: {
      id: string;
      certificate_number: string;
      recipient_name: string;
      issued_at: string;
    } | null;
  };

  if (!status.enrolled) {
    return NextResponse.json(
      { error: "You are not enrolled in this course." },
      { status: 403 },
    );
  }

  if (!status.eligible) {
    return NextResponse.json(
      {
        error: `A minimum of 50% course progress is required to obtain a certificate. Your current progress is ${status.progress_percent}%.`,
      },
      { status: 403 },
    );
  }

  // 2. Issue or fetch certificate record
  let recipientName = status.certificate?.recipient_name || status.user_name || "Learner";
  let issuedAtDate = status.certificate?.issued_at
    ? new Date(status.certificate.issued_at)
    : new Date();
  let certificateId = status.certificate?.id;

  if (!status.certificate) {
    const { data: issueData, error: issueError } = await supabase.rpc(
      "issue_course_certificate",
      { target_course_slug: slug },
    );

    if (!issueError && issueData) {
      const issued = issueData as {
        certificate_id?: string;
        recipient_name?: string;
        issued_at?: string;
      };
      if (issued.recipient_name) recipientName = issued.recipient_name;
      if (issued.issued_at) issuedAtDate = new Date(issued.issued_at);
      if (issued.certificate_id) certificateId = issued.certificate_id;
    }
  }

  // Format date: e.g. "5 September 2026"
  const formattedDate = issuedAtDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // 3. Load PDF template
  const templatePath = path.join(
    process.cwd(),
    "public",
    "certificates",
    "casc-academy-template.pdf",
  );

  if (!fs.existsSync(templatePath)) {
    return NextResponse.json(
      { error: "Certificate template file not found on server." },
      { status: 500 },
    );
  }

  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPages()[0];

  // Flatten existing form fields
  try {
    const form = pdfDoc.getForm();
    const nameField = form.getTextField("certificate_name");
    const dateField = form.getTextField("certificate_date");
    nameField.setText("");
    dateField.setText("");
    form.flatten();
  } catch {
    // Form fields might already be empty or flat
  }

  // Embed fonts
  const fontTimesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Position Name in white box: { x: 205.26, y: 330.24, width: 431.37, height: 31.18 }
  const nameSize = recipientName.length > 30 ? 17 : 21;
  const nameWidth = fontTimesBold.widthOfTextAtSize(recipientName, nameSize);
  const nameBoxX = 205.26;
  const nameBoxW = 431.37;
  const nameBoxY = 330.24;
  const nameBoxH = 31.18;

  const nameX = Math.max(nameBoxX + 10, nameBoxX + (nameBoxW - nameWidth) / 2);
  const nameY = nameBoxY + (nameBoxH - nameSize) / 2 + 2;

  page.drawText(recipientName, {
    x: nameX,
    y: nameY,
    size: nameSize,
    font: fontTimesBold,
    color: rgb(0.06, 0.12, 0.22), // Deep Navy
  });

  // Position Date in white box: { x: 197.17, y: 148.90, width: 175.42, height: 22.68 }
  const dateSize = 12;
  const dateWidth = fontHelveticaBold.widthOfTextAtSize(formattedDate, dateSize);
  const dateBoxX = 197.17;
  const dateBoxW = 175.42;
  const dateBoxY = 148.90;
  const dateBoxH = 22.68;

  const dateX = Math.max(dateBoxX + 5, dateBoxX + (dateBoxW - dateWidth) / 2);
  const dateY = dateBoxY + (dateBoxH - dateSize) / 2 + 1;

  page.drawText(formattedDate, {
    x: dateX,
    y: dateY,
    size: dateSize,
    font: fontHelveticaBold,
    color: rgb(0.06, 0.12, 0.22),
  });

  // Record download event asynchronously if certificate exists
  if (certificateId) {
    try {
      void supabase
        .from("certificate_download_events")
        .insert({
          certificate_id: certificateId,
          user_id: user.id,
        })
        .then();
    } catch {
      // Non-blocking download event logging
    }
  }

  const generatedPdfBytes = await pdfDoc.save();

  return new NextResponse(Buffer.from(generatedPdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="MedLex-Certificate-${slug}.pdf"`,
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    },
  });
}
