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

  // Temporarily disabled: require at least 50% course progress before downloading.
  // Keep this condition for straightforward restoration later.
  // if (!status.eligible) {
  //   return NextResponse.json(
  //     {
  //       error: `A minimum of 50% course progress is required to obtain a certificate. Your current progress is ${status.progress_percent}%.`,
  //     },
  //     { status: 403 },
  //   );
  // }

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

  // 3. Load certificate template
  const templatePath = path.join(
    process.cwd(),
    "public",
    "certificates",
    "casc-academy-template.png",
  );

  if (!fs.existsSync(templatePath)) {
    return NextResponse.json(
      { error: "Certificate template file not found on server." },
      { status: 500 },
    );
  }

  const pngBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.create();
  const pngImage = await pdfDoc.embedPng(pngBytes);

  // A4 Landscape: 841.8898 x 595.2756
  const width = 841.8898;
  const height = 595.2756;
  const page = pdfDoc.addPage([width, height]);

  // Draw authentic template image
  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width,
    height,
  });

  // Embed fonts
  const fontTimesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Center Name horizontally above the gold line (y=329.28 in PDF coordinates)
  const nameSize = recipientName.length > 30 ? 20 : 24;
  const nameWidth = fontTimesBold.widthOfTextAtSize(recipientName, nameSize);
  const nameX = (width - nameWidth) / 2;
  const nameY = 329.28 + 6;

  page.drawText(recipientName, {
    x: nameX,
    y: nameY,
    size: nameSize,
    font: fontTimesBold,
    color: rgb(1, 1, 1), // Pure White
  });

  // Center Date horizontally above the date line (y=148.68 in PDF coordinates)
  const dateSize = 13;
  const dateWidth = fontHelveticaBold.widthOfTextAtSize(formattedDate, dateSize);
  const dateCenter = (197.17 + 372.59) / 2;
  const dateX = dateCenter - dateWidth / 2;
  const dateY = 148.68 + 5;

  page.drawText(formattedDate, {
    x: dateX,
    y: dateY,
    size: dateSize,
    font: fontHelveticaBold,
    color: rgb(0.92, 0.94, 0.98), // Light off-white
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
