import assert from "node:assert/strict";
import test from "node:test";
import {
  buildInquiryEmail,
  deliveryFailure,
  handleInquiryRequest,
  inquiryFieldsSchema,
  inquiryBodyLimit,
  isAllowedInquiryOrigin,
} from "../src/lib/inquiries";
import type { InquiryEnvironment } from "../src/lib/inquiries";

const now = Date.UTC(2026, 8, 26, 12);
const requestId = "7213c53c-3af7-42ba-b9f5-0dd72a4a6c89";
const env: InquiryEnvironment = {
  NODE_ENV: "production",
  NEXT_PUBLIC_SITE_URL: "https://happytrailsshindigs.com",
  RESEND_API_KEY: "test-not-a-real-key",
  INQUIRY_FROM_EMAIL: "website@happytrailsshindigs.com",
};
const validFields = {
  name: "  Jordan & Casey  ",
  email: "jordan@example.com",
  eventType: "Wedding",
  phone: "(903) 555-0123",
  eventDate: "2027-05-15",
  guestCount: "120",
  message: "We would love to visit.\nIs a weekend tour possible?",
};
const validBody = { ...validFields, requestId, website: "", startedAt: now - 10_000 };

function request(body: unknown = validBody, headers: Record<string, string> = {}) {
  return new Request("https://happytrailsshindigs.com/api/inquiries", {
    method: "POST",
    headers: {
      origin: "https://happytrailsshindigs.com",
      "content-type": "application/json",
      "idempotency-key": requestId,
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

async function submit(
  body: unknown = validBody,
  environment = env,
  headers: Record<string, string> = {},
) {
  let calls = 0;
  const response = await handleInquiryRequest(request(body, headers), {
    env: environment,
    now: () => now,
    send: async () => {
      calls += 1;
      return { data: { id: "test-email-id" } };
    },
  });
  return { response, calls, result: await response.json() };
}

test("valid inquiries trim fields and normalize guest estimates", () => {
  const result = inquiryFieldsSchema.parse(validFields);
  assert.equal(result.name, "Jordan & Casey");
  assert.equal(result.guestCount, 120);
});

test("optional details may be omitted without inventing a date or guest count", () => {
  const result = inquiryFieldsSchema.parse({
    name: "Jordan",
    email: "jordan@example.com",
    eventType: "Birthday",
    guestCount: "",
  });
  assert.equal(result.guestCount, undefined);
  assert.equal(result.eventDate, "");
  assert.equal(result.message, "");
});

test("invalid dates, negative or fractional guests, and unknown event types fail", () => {
  for (const fields of [
    { eventDate: "2027-02-29" },
    { eventDate: "2026-13-01" },
    { guestCount: -1 },
    { guestCount: 1.4 },
    { guestCount: true },
    { guestCount: [10] },
    { guestCount: null },
    { eventType: "Anything" },
  ]) {
    assert.equal(inquiryFieldsSchema.safeParse({ ...validFields, ...fields }).success, false);
  }
  assert.equal(
    inquiryFieldsSchema.safeParse({ ...validFields, eventDate: "2028-02-29" }).success,
    true,
  );
});

test("single-line fields reject embedded header injection and messages reject null bytes", () => {
  for (const fields of [
    { name: "Jordan\r\nBCC: other@example.com" },
    { email: "jordan@example.com\r\nCC: other@example.com" },
    { phone: "123\n456" },
    { message: "Hello\u0000there" },
  ]) {
    assert.equal(inquiryFieldsSchema.safeParse({ ...validFields, ...fields }).success, false);
  }
});

test("overlong content fails field validation", async () => {
  const { response, calls, result } = await submit({ ...validBody, message: "a".repeat(3_001) });
  assert.equal(response.status, 400);
  assert.equal(calls, 0);
  assert.ok(result.fieldErrors.message);
});

test("email uses fixed headers, reply-to guest, plain text, and no booking promise", () => {
  const fields = inquiryFieldsSchema.parse({
    ...validFields,
    message: "<script>alert('x')</script>",
  });
  const email = buildInquiryEmail(
    fields,
    "website@happytrailsshindigs.com",
    "admin@happytrailsshindigs.com",
  );
  assert.equal(email.replyTo, "jordan@example.com");
  assert.equal(email.subject, "Happy Trails inquiry: Wedding");
  assert.equal("html" in email, false);
  assert.ok(email.text.includes("not a confirmed booking"));
});

test("success requires provider acknowledgement and forwards stable idempotency key", async () => {
  const keys: string[] = [];
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await handleInquiryRequest(request(), {
      env,
      now: () => now,
      send: async (email, key) => {
        keys.push(key);
        assert.deepEqual(email.to, ["admin@happytrailsshindigs.com"]);
        return { data: { id: "same-provider-id" } };
      },
    });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).ok, true);
  }
  assert.deepEqual(keys, [
    `happy-trails-inquiry/${requestId}`,
    `happy-trails-inquiry/${requestId}`,
  ]);
});

test("missing email credentials fail honestly without invoking delivery", async () => {
  for (const environment of [
    { ...env, RESEND_API_KEY: undefined },
    { ...env, INQUIRY_FROM_EMAIL: undefined },
    { ...env, INQUIRY_FROM_EMAIL: "invalid sender" },
    { ...env, INQUIRY_TO_EMAIL: "not-an-email" },
  ]) {
    const { response, calls, result } = await submit(validBody, environment);
    assert.equal(response.status, 503);
    assert.equal(calls, 0);
    assert.equal(result.ok, false);
  }
});

test("malformed JSON, unsupported content type, and request ID mismatch never send", async () => {
  const scenarios: { body: unknown; headers: Record<string, string>; status: number }[] = [
    { body: "{oops", headers: {}, status: 400 },
    { body: validBody, headers: { "content-type": "text/plain" }, status: 415 },
    { body: validBody, headers: { "idempotency-key": "different" }, status: 400 },
  ];
  for (const scenario of scenarios) {
    const { response, calls } = await submit(scenario.body, env, scenario.headers);
    assert.equal(response.status, scenario.status);
    assert.equal(calls, 0);
  }
});

test("body size is enforced without trusting Content-Length", async () => {
  const { response, calls } = await submit(
    JSON.stringify({ ...validBody, message: "é".repeat(inquiryBodyLimit) }),
    env,
    { "content-length": "100" },
  );
  assert.equal(response.status, 413);
  assert.equal(calls, 0);
});

test("oversized Content-Length rejects before delivery", async () => {
  const { response, calls } = await submit(validBody, env, {
    "content-length": String(inquiryBodyLimit + 1),
  });
  assert.equal(response.status, 413);
  assert.equal(calls, 0);
});

test("cross-site and absent origins are forbidden", async () => {
  const scenarios: Record<string, string>[] = [
    { origin: "https://example.com" },
    { origin: "" },
    { "sec-fetch-site": "cross-site" },
  ];
  for (const headers of scenarios) {
    const { response, calls } = await submit(validBody, env, headers);
    assert.equal(response.status, 403);
    assert.equal(calls, 0);
  }
});

test("only configured Vercel preview origins are allowed", () => {
  assert.equal(
    isAllowedInquiryOrigin(request(validBody, { origin: "https://project-123.vercel.app" }), {
      ...env,
      VERCEL_URL: "project-123.vercel.app",
    }),
    true,
  );
  assert.equal(
    isAllowedInquiryOrigin(request(validBody, { origin: "https://other.vercel.app" }), {
      ...env,
      VERCEL_URL: "project-123.vercel.app",
    }),
    false,
  );
  assert.equal(
    isAllowedInquiryOrigin(
      request(validBody, { origin: "https://www.happytrailsshindigs.com" }),
      env,
    ),
    true,
  );
});

test("Vercel production alias accepts inquiries without allowing unrelated origins", async () => {
  const environment = {
    ...env,
    VERCEL_URL: "happytrails-deployment-team.vercel.app",
    VERCEL_BRANCH_URL: "happytrails-git-main-team.vercel.app",
    VERCEL_PROJECT_PRODUCTION_URL: "happytrails.vercel.app",
  };
  const accepted = await submit(validBody, environment, {
    origin: "https://happytrails.vercel.app",
    "sec-fetch-site": "same-origin",
  });
  assert.equal(accepted.response.status, 200);
  assert.equal(accepted.calls, 1);

  for (const origin of [
    "https://other.vercel.app",
    "https://happytrails.vercel.app.example.com",
    "http://happytrails.vercel.app",
  ]) {
    const rejected = await submit(validBody, environment, { origin });
    assert.equal(rejected.response.status, 403);
    assert.equal(rejected.calls, 0);
  }
});

test("localhost origin is accepted in development only", () => {
  const local = new Request("http://localhost:3000/api/inquiries", {
    headers: { origin: "http://localhost:3000" },
  });
  assert.equal(isAllowedInquiryOrigin(local, { NODE_ENV: "development" }), true);
  assert.equal(isAllowedInquiryOrigin(local, env), false);
});

test("honeypot, implausibly fast, future, and expired forms never send", async () => {
  for (const scenario of [
    { body: { ...validBody, website: "spam.example" }, status: 400 },
    { body: { ...validBody, startedAt: now - 100 }, status: 429 },
    { body: { ...validBody, startedAt: now + 60_000 }, status: 429 },
    { body: { ...validBody, startedAt: now - 86_400_001 }, status: 400 },
  ]) {
    const { response, calls } = await submit(scenario.body);
    assert.equal(response.status, scenario.status);
    assert.equal(calls, 0);
  }
});

test("rate limiting, conflicting idempotency keys, and delivery failures are mapped safely", async () => {
  for (const scenario of [
    { error: { statusCode: 429 }, status: 429 },
    { error: { name: "rate_limit_exceeded" }, status: 429 },
    { error: { statusCode: 409 }, status: 409 },
    { error: { name: "invalid_idempotent_request" }, status: 409 },
    { error: { statusCode: 401 }, status: 503 },
    { error: { statusCode: 500 }, status: 503 },
  ]) {
    const response = deliveryFailure(scenario.error);
    assert.equal(response.status, scenario.status);
    assert.equal((await response.json()).ok, false);
    if (scenario.status === 429) assert.equal(response.headers.get("Retry-After"), "60");
  }
});

test("transport exceptions, provider errors, and missing provider IDs never become success", async () => {
  for (const send of [
    async () => {
      throw new Error("simulated network error");
    },
    async () => ({ error: { statusCode: 503 } }),
    async () => ({ data: null, error: null }),
  ]) {
    const response = await handleInquiryRequest(request(), { env, now: () => now, send });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).ok, false);
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
});


test("referral answers are optional, bounded choices and appear in the owner email", () => {
  const fields = inquiryFieldsSchema.parse({ ...validFields, referralSource: "Event vendor" });
  assert.match(buildInquiryEmail(fields, "website@example.com", "owner@example.com").text, /How they found us: Event vendor/);
  assert.equal(inquiryFieldsSchema.parse(validFields).referralSource, "");
  assert.equal(inquiryFieldsSchema.safeParse({ ...validFields, referralSource: "Injected\\nHeader" }).success, false);
});
