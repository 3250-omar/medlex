import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "o5913440@gmail.com",
    pass: "eccgwqyseijelsry",
  },
});

transporter.sendMail({
  from: "MedLex System <o5913440@gmail.com>",
  to: "info@medlexsolutions.com",
  subject: "Test Email from MedLex System",
  text: "This is a test email to verify that info@medlexsolutions.com receives emails correctly.",
}).then(info => {
  console.log("Sent successfully! Message ID:", info.messageId);
}).catch(err => {
  console.error("Failed to send email:", err);
});
