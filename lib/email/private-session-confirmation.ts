import "server-only";

export interface BookingConfirmationEmailParams {
  learnerName?: string | null;
  startsAtFormatted: string;
  joinUrl: string;
  hostName?: string | null;
  locale?: string;
}

export function generateBookingConfirmationEmail({
  learnerName,
  startsAtFormatted,
  joinUrl,
  hostName,
  locale = "en",
}: BookingConfirmationEmailParams): {
  subject: string;
  html: string;
  text: string;
} {
  const isArabic = locale === "ar";
  const displayName = learnerName || (isArabic ? "زميلنا العزيز" : "Valued Colleague");
  const instructorName = hostName || (isArabic ? "مدرب الأكاديمية" : "CASC Lead Instructor");

  if (isArabic) {
    const subject = "تأكيد موعد جلسة التدريب الفردي لاختبار CASC — ميدليكس";
    const text = `مرحباً ${displayName}،\n\nتم تأكيد موعد جلستك التدريبية الفردية بنجاح:\n\nالموعد: ${startsAtFormatted}\nالمدرب: ${instructorName}\nالمدة: 60 دقيقة\n\nرابط لقاء Google Meet:\n${joinUrl}\n\nنتمنى لك كل التوفيق في التحضير.\nفريق ميدليكس`;

    const html = `
      <div dir="rtl" style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; rounded: 12px;">
        <h2 style="color: #0f172a; margin-bottom: 16px;">تم تأكيد حجز جلستك التدريبية بنجاح</h2>
        <p style="font-size: 15px; line-height: 1.6;">مرحباً <strong>${displayName}</strong>،</p>
        <p style="font-size: 15px; line-height: 1.6;">يسعدنا تأكيد موعد جلستك التدريبية الفردية لاختبار CASC عبر الإنترنت.</p>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 18px; margin: 24px 0; border: 1px solid #e2e8f0;">
          <p style="margin: 6px 0; font-size: 14px;"><strong>الموعد:</strong> ${startsAtFormatted}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>المدرب:</strong> ${instructorName}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>المدة:</strong> 60 دقيقة</p>
        </div>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${joinUrl}" style="background-color: #047857; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block;">الانضمام إلى لقاء Google Meet</a>
        </div>

        <p style="font-size: 13px; color: #64748b; line-height: 1.5;">يرجى الانضمام قبل الموعد بخمس دقائق والتأكد من جودة اتصال الإنترنت والميكروفون والكاميرا.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">منظومة ميدليكس للتدريب الطبي والقانوني</p>
      </div>
    `;

    return { subject, html, text };
  }

  const subject = "MedLex: CASC One-to-One Session Confirmation";
  const text = `Hello ${displayName},\n\nYour one-to-one CASC intensive practice session has been confirmed.\n\nDate & Time: ${startsAtFormatted}\nInstructor: ${instructorName}\nDuration: 60 minutes\n\nGoogle Meet Join Link:\n${joinUrl}\n\nWe look forward to working with you.\nMedLex System`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #0f172a; margin-bottom: 16px;">Your CASC Session is Confirmed</h2>
      <p style="font-size: 15px; line-height: 1.6;">Hello <strong>${displayName}</strong>,</p>
      <p style="font-size: 15px; line-height: 1.6;">Your private one-to-one CASC practice station session has been booked and scheduled.</p>
      
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 18px; margin: 24px 0; border: 1px solid #e2e8f0;">
        <p style="margin: 6px 0; font-size: 14px;"><strong>Date & Time:</strong> ${startsAtFormatted}</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Instructor:</strong> ${instructorName}</p>
        <p style="margin: 6px 0; font-size: 14px;"><strong>Duration:</strong> 60 minutes</p>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${joinUrl}" style="background-color: #047857; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block;">Join Google Meet</a>
      </div>

      <p style="font-size: 13px; color: #64748b; line-height: 1.5;">Please join 5 minutes before your scheduled start time and ensure your camera and microphone are operational.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">MedLex Medicolegal & Psychiatric Training</p>
    </div>
  `;

  return { subject, html, text };
}
