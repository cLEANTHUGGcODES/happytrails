"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { eventTypes, fieldErrorsFromIssues, inquiryFieldsSchema } from "@/lib/inquiries";
import type { InquiryFieldErrors, InquiryResponse } from "@/lib/inquiries";
import styles from "./inquiry-form.module.css";

type Status = "idle" | "submitting" | "error" | "success";
const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function InquiryForm() {
  const hydrated = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<InquiryFieldErrors>({});
  const [notice, setNotice] = useState("");
  const startedAt = useRef(0);
  const submitting = useRef(false);
  const lastRequest = useRef<{ signature: string; id: string } | null>(null);
  const noticeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "error" || status === "success") noticeRef.current?.focus();
  }, [status, notice]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = new FormData(event.currentTarget);
    const fields = Object.fromEntries(form.entries());
    const parsed = inquiryFieldsSchema.safeParse(fields);
    if (!parsed.success) {
      setErrors(fieldErrorsFromIssues(parsed.error.issues));
      setNotice("A few details need your attention. Please check the fields below.");
      setStatus("error");
      requestAnimationFrame(() => noticeRef.current?.focus());
      return;
    }

    submitting.current = true;
    setStatus("submitting");
    setErrors({});
    setNotice("");
    const signature = JSON.stringify(parsed.data);
    if (lastRequest.current?.signature !== signature)
      lastRequest.current = { signature, id: crypto.randomUUID() };
    const requestId = lastRequest.current.id;

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": requestId },
        body: JSON.stringify({
          ...parsed.data,
          requestId,
          website: form.get("website") || "",
          startedAt: startedAt.current,
        }),
        signal: AbortSignal.timeout(30_000),
      });
      const result = (await response.json()) as InquiryResponse;
      if (response.ok && result.ok) {
        setNotice(result.message);
        setStatus("success");
      } else {
        setErrors(result.fieldErrors || {});
        setNotice(
          result.message ||
            "Your inquiry could not be sent. Please try again or email us directly.",
        );
        setStatus("error");
      }
    } catch {
      setNotice(
        "We couldn’t confirm your inquiry was sent. Please try again, or email admin@happytrailsshindigs.com.",
      );
      setStatus("error");
    } finally {
      submitting.current = false;
    }
  }

  if (status === "success") {
    return (
      <div className={styles.success} ref={noticeRef} tabIndex={-1} role="status">
        <span className={styles.successIcon}>
          <Check aria-hidden="true" size={26} strokeWidth={1.5} />
        </span>
        <p className={styles.eyebrow}>A good beginning</p>
        <h2>We’re glad you found us.</h2>
        <p>{notice}</p>
        <p className={styles.small}>Your date and tour will be confirmed directly with you.</p>
      </div>
    );
  }

  const fieldError = (field: keyof InquiryFieldErrors) =>
    errors[field] ? (
      <span className={styles.fieldError} id={`${field}-error`}>
        {errors[field]}
      </span>
    ) : null;
  const describedBy = (field: keyof InquiryFieldErrors, help?: string) =>
    [errors[field] ? `${field}-error` : "", help || ""].filter(Boolean).join(" ") || undefined;

  return (
    <form
      className={styles.form}
      method="post"
      action="/api/inquiries"
      onSubmit={submit}
      noValidate
      aria-label="Celebration inquiry"
    >
      <div className={styles.intro}>
        <p className={styles.eyebrow}>Let’s make a little history</p>
        <h2>Tell us what you’re dreaming of.</h2>
        <p>
          A wedding, a reunion, or a reason to get everyone together. We’d love to hear about it.
        </p>
      </div>

      {status === "error" && (
        <div className={styles.errorSummary} ref={noticeRef} tabIndex={-1} role="alert">
          <p>{notice}</p>
          {Object.keys(errors).length > 0 && (
            <ul>
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>
                  <a href={`#inquiry-${field}`}>{message}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <fieldset className={styles.fields} disabled={!hydrated || status === "submitting"}>
        <legend className={styles.srOnly}>Your celebration details</legend>
        <div className={styles.field}>
          <label htmlFor="inquiry-name">
            Your name <span>Required</span>
          </label>
          <input
            id="inquiry-name"
            name="name"
            autoComplete="name"
            placeholder="First and last name"
            required
            maxLength={100}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("name")}
          />
          {fieldError("name")}
        </div>
        <div className={styles.field}>
          <label htmlFor="inquiry-email">
            Email address <span>Required</span>
          </label>
          <input
            id="inquiry-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            maxLength={254}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
          />
          {fieldError("email")}
        </div>
        <div className={styles.field}>
          <label htmlFor="inquiry-eventType">
            What are you celebrating? <span>Required</span>
          </label>
          <select
            id="inquiry-eventType"
            name="eventType"
            required
            defaultValue=""
            aria-invalid={!!errors.eventType}
            aria-describedby={describedBy("eventType")}
          >
            <option value="" disabled>
              Select your celebration
            </option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {fieldError("eventType")}
        </div>
        <div className={styles.field}>
          <label htmlFor="inquiry-phone">
            Phone number <span>Optional</span>
          </label>
          <input
            id="inquiry-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="(555) 555-0123"
            maxLength={40}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone")}
          />
          {fieldError("phone")}
        </div>
        <div className={styles.field}>
          <label htmlFor="inquiry-eventDate">
            Preferred event date <span>Optional</span>
          </label>
          <input
            id="inquiry-eventDate"
            name="eventDate"
            type="date"
            aria-invalid={!!errors.eventDate}
            aria-describedby={describedBy("eventDate", "event-date-help")}
          />
          <span className={styles.help} id="event-date-help">
            Still deciding? Leave this open.
          </span>
          {fieldError("eventDate")}
        </div>
        <div className={styles.field}>
          <label htmlFor="inquiry-guestCount">
            Estimated guests <span>Optional</span>
          </label>
          <input
            id="inquiry-guestCount"
            name="guestCount"
            type="number"
            inputMode="numeric"
            min={1}
            max={5_000}
            step={1}
            placeholder="Your best guess"
            aria-invalid={!!errors.guestCount}
            aria-describedby={describedBy("guestCount")}
          />
          {fieldError("guestCount")}
        </div>
        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label htmlFor="inquiry-message">
            A little about your plans <span>Optional</span>
          </label>
          <textarea
            id="inquiry-message"
            name="message"
            rows={4}
            maxLength={3_000}
            placeholder="Tell us about your celebration, ask a question, or let us know you’d like to visit."
            aria-invalid={!!errors.message}
            aria-describedby={describedBy("message")}
          />
          {fieldError("message")}
        </div>
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="inquiry-website">Leave this field empty</label>
          <input
            id="inquiry-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            maxLength={200}
          />
        </div>
      </fieldset>

      <div className={styles.formFooter}>
        <p>
          We’ll use these details to respond to your inquiry. Sending a note doesn’t reserve a date.
        </p>
        <button
          className={styles.submit}
          type="submit"
          disabled={!hydrated || status === "submitting"}
          aria-busy={status === "submitting"}
        >
          {status === "submitting" ? "Sending your note…" : "Send your inquiry"}
          <ArrowUpRight size={18} strokeWidth={1.6} aria-hidden="true" />
        </button>
      </div>
      <p className={styles.emailAlternative}>
        Prefer email?{" "}
        <a href="mailto:admin@happytrailsshindigs.com">admin@happytrailsshindigs.com</a>
      </p>
      <noscript>
        <p>
          Please enable JavaScript to use this form, or email{" "}
          <a href="mailto:admin@happytrailsshindigs.com">admin@happytrailsshindigs.com</a>.
        </p>
      </noscript>
    </form>
  );
}
