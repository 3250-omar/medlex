export interface MessageContent {
  subject: string;
  preview: string;
  paragraphs: string[];
}

const paths = {
  start: "/en/academy/courses/casc-academy/learn/start-here",
  workbook: "/gifts/Twelve%20Weeks%20to%20the%20CASC.pdf",
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderNote(
  note: MessageContent,
  firstName: string,
  environment: string,
) {
  if (environment !== "development" && environment !== "production")
    throw new Error("Invalid EXAMINERS_NOTES_ENV");
  if (!note.subject || !Array.isArray(note.paragraphs) || !note.paragraphs.every((item) => typeof item === "string"))
    throw new Error("Invalid note content");
  const host =
    environment === "development"
      ? "https://dev.medlexsolutions.com"
      : "https://medlexsolutions.com";
  const start = host + paths.start;
  const workbook = host + paths.workbook;
  const name = firstName.trim() || "Colleague";
  const text = note.paragraphs
    .filter((paragraph, index) => !(/^Dr Ahmed$/i.test(paragraph.trim()) && /^Dr Ahmed Abouelghit$/i.test(note.paragraphs[index + 1]?.trim() ?? "")))
    .map((paragraph) =>
      paragraph
        .replaceAll("[First name]", name)
        .replaceAll("[START HERE]", start)
        .replaceAll("[WORKBOOK]", workbook),
    )
    .join("\n\n");
  const formatParagraph = (paragraph: string) =>
    escapeHtml(paragraph)
      .replaceAll("[First name]", escapeHtml(name))
      .replaceAll("[START HERE]", `<a href="${start}" style="color:#1a365d;font-weight:700;text-decoration:underline;">Start here</a>`)
      .replaceAll("[WORKBOOK]", `<a href="${workbook}" style="color:#1a365d;font-weight:700;text-decoration:underline;">Workbook</a>`);

  const body: string[] = [];
  for (let index = 0; index < note.paragraphs.length; index++) {
    const paragraph = note.paragraphs[index];
    if (paragraph.trim().toLowerCase() === "this week") {
      const actions: string[] = [];
      while (index + 1 < note.paragraphs.length && !/^Next Monday:/i.test(note.paragraphs[index + 1]) && !/^Dr Ahmed$/i.test(note.paragraphs[index + 1])) {
        actions.push(note.paragraphs[++index]);
      }
      body.push(`<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:30px 0;background:#f6f2e6;border-left:4px solid #d4af37;"><tr><td style="padding:24px 24px 10px;"><p style="margin:0 0 18px;color:#785e17;font:700 12px/1.4 Arial,sans-serif;letter-spacing:1.8px;text-transform:uppercase;">${formatParagraph(paragraph)}</p>${actions.map((action) => `<p style="margin:0 0 14px;color:#23303f;font:15px/1.7 Arial,sans-serif;">${formatParagraph(action)}</p>`).join("")}</td></tr></table>`);
    } else if (/^Next Monday:/i.test(paragraph)) {
      body.push(`<p style="margin:28px 0;color:#5c636c;font:italic 16px/1.7 Georgia,serif;">${formatParagraph(paragraph)}</p>`);
    } else if (/^Dr Ahmed$/i.test(paragraph.trim()) && /^Dr Ahmed Abouelghit$/i.test(note.paragraphs[index + 1]?.trim() ?? "")) {
      continue;
    } else if (/^Dr Ahmed Abouelghit$/i.test(paragraph.trim())) {
      body.push(`<p style="margin:32px 0 12px;padding-top:24px;border-top:1px solid #e6e6e0;color:#1a365d;font:600 19px/1.5 Georgia,serif;">${formatParagraph(paragraph)}</p>`);
    } else if (/^You are receiving this as a member/i.test(paragraph)) {
      body.push(`<p style="margin:28px 0 0;padding-top:20px;border-top:1px solid #e6e6e0;color:#5c636c;font:12px/1.7 Arial,sans-serif;">${formatParagraph(paragraph)}</p>`);
    } else {
      body.push(`<p style="margin:0 0 19px;color:#313538;font:16px/1.8 Arial,sans-serif;">${formatParagraph(paragraph)}</p>`);
    }
  }
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(note.subject)}</title></head><body style="margin:0;padding:0;background:#f6f2e6;"><div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(note.preview)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f6f2e6;"><tr><td align="center" style="padding:28px 12px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background:#ffffff;"><tr><td style="background:#1a365d;padding:30px 32px;border-bottom:4px solid #d4af37;"><p style="margin:0 0 24px;"><img src="https://medlexsolutions.com/images/new-logo-transparent.png" alt="MedLex" width="140" style="display:block;width:140px;max-width:100%;height:auto;border:0;color:#ffffff;font:700 19px Georgia,serif;"></p><p style="margin:0 0 10px;color:#e8d4a0;font:700 11px/1.5 Arial,sans-serif;letter-spacing:1.8px;text-transform:uppercase;">The CASC Academy &nbsp; / &nbsp; The Examiner’s Notes</p><h1 style="margin:0;color:#ffffff;font:normal 29px/1.25 Georgia,serif;">${escapeHtml(note.subject)}</h1></td></tr><tr><td style="padding:32px 32px 36px;">${body.join("\n")}</td></tr><tr><td style="background:#142a49;padding:20px 32px;color:#d7dee8;font:12px/1.6 Arial,sans-serif;">The CASC Academy by MedLex &nbsp; &middot; &nbsp; Where Medicine Meets Justice</td></tr></table></td></tr></table></body></html>`;
  return {
    subject: note.subject,
    text,
    html,
  };
}
