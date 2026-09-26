import { Resend } from "resend";
import { handleInquiryRequest } from "@/lib/inquiries";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  return handleInquiryRequest(request, {
    env: process.env,
    send: async (email, idempotencyKey) => {
      const resend = new Resend(process.env.RESEND_API_KEY);
      return resend.emails.send(email, { idempotencyKey });
    },
  });
}
