"use client";

import { useState } from "react";
import { Check, Monitor, Pause, Play, RotateCcw, Smartphone } from "lucide-react";
import { InquirySending, InquirySuccess } from "./inquiry-feedback";
import styles from "./inquiry-animation-preview.module.css";

export function InquiryAnimationPreview() {
  const [paused, setPaused] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [replay, setReplay] = useState(0);

  function restart() {
    setReplay((current) => current + 1);
    setPaused(false);
    setSuccess(false);
  }

  return (
    <section className={styles.preview} aria-labelledby="preview-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Animation preview</p>
        <h1 id="preview-title">A little walk down the trail.</h1>
        <p>
          Watch the trail lead to the barn. This is the same animation used on the
          contact form, with room to pause, replay, and try the finishing touch.
        </p>
        <span className={styles.badge}>Preview only · No inquiries or emails are sent</span>
      </header>

      <div className={styles.controls}>
        <div className={styles.playback} role="group" aria-label="Animation controls">
          <button
            type="button"
            onClick={() => setPaused((current) => !current)}
            disabled={success}
          >
            {paused ? <Play aria-hidden="true" size={16} /> : <Pause aria-hidden="true" size={16} />}
            {paused ? "Play animation" : "Pause animation"}
          </button>
          <button type="button" onClick={restart}>
            <RotateCcw aria-hidden="true" size={16} />
            Restart animation
          </button>
          <button
            type="button"
            onClick={() => {
              setSuccess((current) => !current);
              setPaused(false);
            }}
          >
            {success ? <Play aria-hidden="true" size={16} /> : <Check aria-hidden="true" size={16} />}
            {success ? "Show animation" : "Show success"}
          </button>
        </div>
        <div className={styles.sizes} role="group" aria-label="Preview width">
          <button type="button" aria-pressed={!mobile} onClick={() => setMobile(false)}>
            <Monitor aria-hidden="true" size={16} />
            Desktop
          </button>
          <button type="button" aria-pressed={mobile} onClick={() => setMobile(true)}>
            <Smartphone aria-hidden="true" size={16} />
            Mobile
          </button>
        </div>
      </div>

      <div className={styles.canvas}>
        <div
          className={styles.stage}
          data-testid="inquiry-preview-stage"
          data-paused={paused}
          data-mobile={mobile}
        >
          {success ? (
            <InquirySuccess message="Preview only — no inquiry has been sent." />
          ) : (
            <InquirySending key={replay} />
          )}
        </div>
      </div>
      <p className={styles.note}>
        The animation loops until you pause it. Reduced-motion device settings are respected.
      </p>
    </section>
  );
}
