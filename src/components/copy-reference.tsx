"use client";

import { useId, useRef, useState } from "react";
import styles from "./copy-reference.module.css";

export function CopyReference({ label, value }: { label: string; value: string }) {
  const id = useId();
  const field = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("Copied.");
    } catch {
      field.current?.focus();
      field.current?.select();
      setStatus("Text selected. Copy it using your device’s copy command.");
    }
  }
  return <div className={styles.reference}>
    <label htmlFor={id}>{label}</label>
    <textarea id={id} ref={field} readOnly value={value} rows={4} spellCheck={false} />
    <button type="button" className="button button-outline" onClick={copy}>Copy {label.toLowerCase()}</button>
    <p role="status" aria-live="polite">{status}</p>
  </div>;
}
