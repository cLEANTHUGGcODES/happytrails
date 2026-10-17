"use client";
import { useEffect } from "react";

export function FaqDeepLinks() {
  useEffect(() => {
    function openAnswer() {
      const hash = window.location.hash.slice(1);
      if (!hash.startsWith("faq-")) return;
      const answer = document.getElementById(hash);
      if (answer instanceof HTMLDetailsElement) {
        answer.open = true;
        answer.scrollIntoView({ block: "start", behavior: "instant" });
      }
    }
    openAnswer();
    function followAnswer(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#faq-"]') : null;
      if (!target) return;
      const answer = document.getElementById(target.hash.slice(1));
      if (answer instanceof HTMLDetailsElement) answer.open = true;
    }
    document.addEventListener("click", followAnswer);
    window.addEventListener("hashchange", openAnswer);
    return () => {
      document.removeEventListener("click", followAnswer);
      window.removeEventListener("hashchange", openAnswer);
    };
  }, []);
  return null;
}
