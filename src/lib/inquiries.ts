import { z } from "zod";

export const eventTypes = ["Wedding", "Birthday", "Family reunion", "Other celebration"] as const;
export const inquiryBodyLimit = 16_384;
export const minimumFormTime = 1_500;
const maximumFormAge = 24 * 60 * 60 * 1_000;
const singleLine = (value: string) =>
  !Array.from(value).some(
    (character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
  );

const optionalText = (maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum)
    .refine(singleLine, "Please use a single line.")
    .optional()
    .default("");

export const inquiryFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "Please keep your name under 100 characters.")
    .refine(singleLine, "Please use a single line for your name."),
  email: z.string().trim().max(254).email("Please enter a valid email address."),
  eventType: z.enum(eventTypes, { error: "Please choose a celebration type." }),
  phone: optionalText(40).refine(
    (value) => !value || /^[+()\d\s.\-xext]+$/i.test(value),
    "Please enter a valid phone number.",
  ),
  eventDate: optionalText(10).refine((value) => {
    if (!value) return true;
    const date = new Date(`${value}T12:00:00.000Z`);
    return (
      /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  }, "Please enter a valid date."),
  guestCount: z.preprocess(
    (value) => {
      if (typeof value !== "string") return value;
      const trimmed = value.trim();
      if (!trimmed) return undefined;
      return /^\d+$/.test(trimmed) ? Number(trimmed) : value;
    },
    z
      .number({ error: "Please enter a whole number of guests." })
      .int("Please enter a whole number.")
      .min(1, "Please enter at least one guest.")
      .max(5_000, "Please enter fewer than 5,001 guests.")
      .optional(),
  ),
  message: z
    .string()
    .trim()
    .max(3_000, "Please keep your message under 3,000 characters.")
    .refine(
      (value) =>
        !Array.from(value).some((character) => {
          const code = character.charCodeAt(0);
          return (code < 32 && ![9, 10, 13].includes(code)) || code === 127;
        }),
      "Please remove unusual characters from your message.",
    )
    .optional()
    .default(""),
});

export const inquirySchema = inquiryFieldsSchema.extend({
  requestId: z.uuid(),
  website: z.string().max(200).default(""),
  startedAt: z.number().int().positive(),
});

export type InquiryFields = z.infer<typeof inquiryFieldsSchema>;
export type Inquiry = z.infer<typeof inquirySchema>;
export type InquiryFieldErrors = Partial<Record<keyof InquiryFields, string>>;
export type InquiryResponse = {
  ok: boolean;
  message: string;
  fieldErrors?: InquiryFieldErrors;
};

export function fieldErrorsFromIssues(issues: z.core.$ZodIssue[]): InquiryFieldErrors {
  const errors: InquiryFieldErrors = {};
  for (const issue of issues) {
    const field = issue.path[0] as keyof InquiryFields;
    if (field in inquiryFieldsSchema.shape && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

export type InquiryEnvironment = {
  NODE_ENV?: string;
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_URL?: string;
  VERCEL_BRANCH_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
  RESEND_API_KEY?: string;
  INQUIRY_FROM_EMAIL?: string;
  INQUIRY_TO_EMAIL?: string;
};

export type InquiryEmail = {
  from: string;
  to: string[];
  replyTo: string;
  subject: string;
  text: string;
};

type DeliveryResult = {
  data?: { id: string } | null;
  error?: { name?: string; statusCode?: number | null } | null;
};

type InquiryDependencies = {
  env: InquiryEnvironment;
  send: (email: InquiryEmail, idempotencyKey: string) => Promise<DeliveryResult>;
  now?: () => number;
};

export function isAllowedInquiryOrigin(request: Request, env: InquiryEnvironment): boolean {
  const origin = request.headers.get("origin");
  if (!origin || request.headers.get("sec-fetch-site") === "cross-site") return false;
  const allowed = new Set<string>();
  try {
    const site = new URL(env.NEXT_PUBLIC_SITE_URL || "https://happytrailsshindigs.com");
    allowed.add(site.origin);
    if (site.hostname === "happytrailsshindigs.com")
      allowed.add("https://www.happytrailsshindigs.com");
    for (const deployment of [
      env.VERCEL_URL,
      env.VERCEL_BRANCH_URL,
      env.VERCEL_PROJECT_PRODUCTION_URL,
    ]) {
      if (deployment) allowed.add(new URL(`https://${deployment}`).origin);
    }
    if (env.NODE_ENV !== "production") {
      const local = new URL(request.url);
      if (["localhost", "127.0.0.1", "[::1]"].includes(local.hostname)) allowed.add(local.origin);
    }
  } catch {
    return false;
  }
  return allowed.has(origin);
}

export function buildInquiryEmail(inquiry: InquiryFields, from: string, to: string): InquiryEmail {
  return {
    from: `Happy Trails Website <${from}>`,
    to: [to],
    replyTo: inquiry.email,
    subject: `Happy Trails inquiry: ${inquiry.eventType}`,
    text: [
      "A new Happy Trails website inquiry",
      "",
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      `Celebration: ${inquiry.eventType}`,
      `Phone: ${inquiry.phone || "Not provided"}`,
      `Preferred event date: ${inquiry.eventDate || "Not decided"}`,
      `Estimated guests: ${inquiry.guestCount ?? "Not provided"}`,
      "",
      "Message:",
      inquiry.message || "No additional message.",
      "",
      "This is an inquiry, not a confirmed booking. Reply to this email to contact the guest.",
    ].join("\n"),
  };
}

function respond(status: number, message: string, fieldErrors?: InquiryFieldErrors) {
  return Response.json(
    {
      ok: status === 200,
      message,
      ...(fieldErrors ? { fieldErrors } : {}),
    } satisfies InquiryResponse,
    {
      status,
      headers: { "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": "60" } : {}) },
    },
  );
}

export function deliveryFailure(error: DeliveryResult["error"]): Response {
  if (error?.statusCode === 429 || error?.name === "rate_limit_exceeded") {
    return respond(
      429,
      "Please wait a minute before trying again. You can also email us directly.",
    );
  }
  if (error?.statusCode === 409 || error?.name === "invalid_idempotent_request") {
    return respond(
      409,
      "We couldn’t confirm this request. Please try again, or email us directly if the issue continues.",
    );
  }
  return respond(
    503,
    "Your inquiry could not be sent right now. Please try again or email admin@happytrailsshindigs.com.",
  );
}

async function readLimitedJson(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > inquiryBodyLimit)
    throw new Error("body_too_large");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid_json");
  let bytesRead = 0;
  let text = "";
  const decoder = new TextDecoder("utf-8", { fatal: true });
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > inquiryBodyLimit) {
        await reader.cancel();
        throw new Error("body_too_large");
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } finally {
    reader.releaseLock();
  }
}

export async function handleInquiryRequest(
  request: Request,
  { env, send, now = Date.now }: InquiryDependencies,
): Promise<Response> {
  if (!isAllowedInquiryOrigin(request, env))
    return respond(403, "Please send your inquiry through the Happy Trails website.");
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json")
    return respond(415, "Please send your inquiry through the form.");

  let body: unknown;
  try {
    body = await readLimitedJson(request);
  } catch (error) {
    return error instanceof Error && error.message === "body_too_large"
      ? respond(413, "Your inquiry is too long. Please shorten your message.")
      : respond(400, "We couldn’t read your inquiry. Please try again.");
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success)
    return respond(
      400,
      "Please check the highlighted fields and try again.",
      fieldErrorsFromIssues(parsed.error.issues),
    );
  const inquiry = parsed.data;
  if (request.headers.get("idempotency-key") !== inquiry.requestId)
    return respond(400, "Please refresh the page and try again.");
  if (inquiry.website !== "")
    return respond(400, "We couldn’t accept this inquiry. Please email us directly.");
  const age = now() - inquiry.startedAt;
  if (age < minimumFormTime)
    return respond(429, "Please take a moment, then try sending your inquiry again.");
  if (age > maximumFormAge)
    return respond(400, "This form has expired. Please refresh the page and try again.");

  const from = z.email().safeParse(env.INQUIRY_FROM_EMAIL);
  const to = z.email().safeParse(env.INQUIRY_TO_EMAIL || "admin@happytrailsshindigs.com");
  if (!env.RESEND_API_KEY?.trim() || !from.success || !to.success) return deliveryFailure(null);

  try {
    const result = await send(
      buildInquiryEmail(inquiry, from.data, to.data),
      `happy-trails-inquiry/${inquiry.requestId}`,
    );
    if (result.error || !result.data?.id) return deliveryFailure(result.error);
    return respond(
      200,
      "Your inquiry is on its way. Jennifer and Randy will be in touch to talk about your celebration.",
    );
  } catch {
    return deliveryFailure(null);
  }
}
