# Website inquiries

The contact form sends a plain-text email to the Happy Trails team through Resend. It does not reserve dates, create bookings, or store an inquiry database. Only an acknowledgement containing a provider email ID produces a success message; acknowledgement is not proof of inbox delivery.

## Configuration

Copy `.env.example` to `.env.local` for local configuration. Configure matching variables in the appropriate Vercel environment before deployment:

| Variable               | Purpose                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | Canonical HTTPS origin; defaults to `https://happytrailsshindigs.com`.                                                                           |
| `RESEND_API_KEY`       | Server-only Resend API credential with email send access.                                                                                        |
| `INQUIRY_FROM_EMAIL`   | A bare sender address on a domain verified in Resend, for example `website@happytrailsshindigs.com`. Display names are added by the application. |
| `INQUIRY_TO_EMAIL`     | Destination mailbox; defaults to `admin@happytrailsshindigs.com`.                                                                                |

The application works without email credentials for development and design review. Form submissions then return a clear failure with a direct email alternative. Never use production credentials for automated tests. For previews, configure a dedicated test recipient if delivery verification is needed. Vercel's automatically provided deployment, branch, and production origins (`VERCEL_URL`, `VERCEL_BRANCH_URL`, and `VERCEL_PROJECT_PRODUCTION_URL`) are accepted; arbitrary `vercel.app` origins are not. This allows the project's stable production URL to accept inquiries before its custom domain is connected. Keep Vercel's system environment variables enabled; see [Vercel system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables). Localhost is accepted only outside production.

Verify the sending domain, publish the required DNS records, and check one authorized real inquiry and reply before launch. Review Resend delivery events for bounces and delayed or failed mail. A successful API request alone does not prove the recipient received the email. See the [Resend Next.js guide](https://resend.com/docs/send-with-nextjs).

## Production bot protection

Before public launch, add a project-level Vercel Firewall custom rule matching request path `/api/inquiries` and method `POST`. Use a rate limit of five requests per source IP per 60 seconds and return HTTP 429 when exceeded. This is enforced at the platform edge across instances; it is a deployment configuration step and is not created by this repository. Review traffic after launch and adjust only when legitimate shared-network visitors are being limited. See [Vercel WAF rate limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).

The route also requires a trusted Origin, JSON content, a matching UUID request header/body, and a body smaller than 16 KiB. It validates lengths and types, rejects header control characters, and checks an empty honeypot and a form age between 1.5 seconds and 24 hours. Honeypot/timing checks deter basic bots; they can be bypassed and do not replace the WAF rule. There is no process-memory rate limiter or claim of durable per-IP limits in application code.

## Retries and failure behavior

The browser disables duplicate submission while a request is pending. Retrying unchanged content reuses its UUID. The server passes that UUID to Resend as `happy-trails-inquiry/<uuid>`. Resend retains [idempotency keys for 24 hours](https://resend.com/docs/dashboard/emails/idempotency-keys), preventing duplicate sends across instances during that window. Editing the inquiry creates a new UUID. Reloading the page also begins a new inquiry; contact the team directly if uncertain about an earlier send.

While sending, an original SVG horse walks along a drawn trail in an accessible status panel. A fast successful request keeps the illustration visible for a total of 1.6 seconds before confirmation; slower requests add no decorative delay. Errors appear immediately and retain the form details. Reduced-motion settings show a still illustration and skip the minimum display time, including when the preference changes mid-request. The request times out after 30 seconds, and leaving the page cancels the client request and animation wait. Confirmation still requires a successful API response.

Field errors return HTTP 400 with `fieldErrors`; invalid origin returns 403; oversize body returns 413; wrong content type returns 415; rate limits return 429; provider idempotency conflicts return 409; missing credentials and delivery failures return 503. Responses use `Cache-Control: no-store` and never reveal credentials or provider internals. The client preserves field values after failure, focuses an accessible summary, and keeps a direct email alternative visible.

## Validation

Visit `/preview/horse` to review the exact shared loading illustration and confirmation panel without submitting the contact form. The page loops the animation and offers pause/play, restart, desktop/mobile widths, and a success-screen toggle. It contains no form or delivery calls; its confirmation explicitly says no inquiry was sent. It respects reduced motion, is marked `noindex`, and is omitted from navigation and the sitemap.

The horse uses original vector artwork and a 25-pose, four-beat walk. Its anatomy and motion were informed by the public-domain walking studies in Eadweard Muybridge’s [Descriptive Zoopraxography (1893), page 46](https://www.gutenberg.org/files/40215/40215-h/40215-h.htm), with additional motion reference from the Smithsonian’s [Horse Walking, 12 Phases](https://www.si.edu/object/52-horse-walking-12-phases%3Anmah_1971008). The site ships its own vector paths, with no externally hosted animation, paid asset, or animation player. One pose remains visible when motion is reduced; the preview can also pause the entire scene.

Run `npm test` for validation, field-injection, body-limit, origin, timing, credential, idempotency-forwarding, and delivery-error tests. Every provider response is a local stub; these tests never send an email. Test browser submission with mocked API responses for validation focus, pending-state locking, success, and failed delivery. Production delivery verification and the WAF rule require the actual service accounts and remain launch checks.
