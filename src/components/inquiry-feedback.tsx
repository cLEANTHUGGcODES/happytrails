import type { Ref } from "react";
import { Check } from "lucide-react";
import { InquiryTrailAnimation } from "./inquiry-trail-animation";
import styles from "./inquiry-form.module.css";

export function InquirySending({ focusRef }: { focusRef?: Ref<HTMLDivElement> }) {
  return (
    <div
      className={styles.sending}
      ref={focusRef}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-testid="inquiry-sending"
    >
      <InquiryTrailAnimation />
      <p className={styles.sendingTitle}>Sending your note…</p>
      <p className={styles.sendingDetail}>A little hello, headed to Jennifer and Randy.</p>
    </div>
  );
}

export function InquirySuccess({
  message,
  focusRef,
}: {
  message: string;
  focusRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div className={styles.success} ref={focusRef} tabIndex={-1} role="status">
      <span className={styles.successIcon}>
        <Check aria-hidden="true" size={26} strokeWidth={1.5} />
      </span>
      <p className={styles.eyebrow}>A good beginning</p>
      <h2>We’re glad you found us.</h2>
      <p>{message}</p>
      <p className={styles.small}>Your date and tour will be confirmed directly with you.</p>
    </div>
  );
}
