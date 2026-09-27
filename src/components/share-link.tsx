"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { absoluteUrl } from "@/lib/site-url";

export function ShareLink({ path, title, label = "Share this page" }: {
  path: string; title: string; label?: string;
}) {
  const [status, setStatus] = useState("");
  const [showLink, setShowLink] = useState(false);
  const url = absoluteUrl(path);
  async function share() {
    setStatus("");
    setShowLink(false);
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setStatus("Link copied.");
    } catch {
      setShowLink(true);
      setStatus("Select and copy the link below.");
    }
  }
  return (
    <div className="share-link-control">
      <button type="button" className="text-link" onClick={share}>
        <Share2 size={16} aria-hidden="true" /> {label}
      </button>
      <span role="status" aria-live="polite">{status}</span>
      {showLink && <label className="share-link-fallback">Share link
        <input readOnly value={url} onFocus={(event) => event.target.select()} />
      </label>}
    </div>
  );
}
