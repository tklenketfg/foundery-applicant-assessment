import { Resend } from "resend";
import { siteConfig } from "@/config/site";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendAdminNotification(name: string, email: string, totalScore: number) {
  if (!resend) return;

  await resend.emails.send({
    from: "Foundery Hiring <no-reply@updates.example.com>",
    to: siteConfig.adminRecipients,
    subject: `New candidate assessment: ${name}`,
    html: `<p>${name} (${email}) submitted an assessment. Total score: <strong>${totalScore}</strong>.</p>`
  });
}
