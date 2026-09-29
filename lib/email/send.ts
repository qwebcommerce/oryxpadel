import "server-only";
import { Resend } from "resend";
import { emailFrom } from "@/lib/email/config";

function client() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

function failureMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return "Email send failed";
}

export async function sendStoreEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const resend = client();
  if (!resend) {
    console.warn("Resend is not configured. Set RESEND_API_KEY to send email.");
    return { skipped: true as const };
  }
  const recipient = to.trim();
  if (!recipient) return { error: "Missing email recipient" };

  try {
    const { data, error } = await resend.emails.send({
      from: emailFrom(),
      to: recipient,
      subject,
      html,
      text,
    });
    if (error) {
      console.error("Resend send failed:", error.message);
      return { error: error.message };
    }
    if (!data?.id) {
      console.error("Resend send failed: no message id returned");
      return { error: "Resend did not return a message id" };
    }
    return { ok: true as const };
  } catch (error) {
    const message = failureMessage(error);
    console.error("Resend send failed:", message);
    return { error: message };
  }
}
