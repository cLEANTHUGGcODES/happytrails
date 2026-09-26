"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Native scrolling with optional, scoped photo and whole-block entrances. */
export function ScrollAnimations({ children }: { children: ReactNode }) {
  const container = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const main = container.current;
      if (!main) return;

      const media = gsap.matchMedia();
      let disposed = false;
      let refreshTimer: ReturnType<typeof setTimeout> | undefined;
      const refresh = () => {
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => {
          if (!disposed) ScrollTrigger.refresh(true);
        }, 150);
      };

      media.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          animated: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 761px)",
        },
        ({ conditions }) => {
          if (conditions?.reduced) {
            main.dataset.scrollAnimations = "reduced";
            return;
          }

          const desktop = Boolean(conditions?.desktop);
          const pending = new Map<HTMLElement, gsap.core.Timeline>();
          const targets = main.querySelectorAll<HTMLElement>("[data-motion]");

          for (const target of targets) {
            // Never hide content already on screen, above a restored scroll position,
            // or receiving focus while the page hydrates.
            if (
              target.getBoundingClientRect().top < window.innerHeight ||
              target.contains(document.activeElement)
            ) {
              continue;
            }

            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: target,
                start: "top 92%",
                once: true,
                fastScrollEnd: true,
                onLeave: (trigger) => trigger.animation?.progress(1),
              },
              onComplete: () => {
                // Detach completed entrances before later layout refreshes can
                // reapply a fromTo start state. Preserve the revealed styles.
                timeline.scrollTrigger?.kill(false);
                pending.delete(target);
              },
            });
            pending.set(target, timeline);

            if (target.dataset.motion === "image") {
              const photo = target.querySelector("img");
              timeline.fromTo(
                target,
                { clipPath: `inset(${desktop ? 18 : 9}% 0% ${desktop ? 18 : 9}% 0%)` },
                {
                  clipPath: "inset(0% 0% 0% 0%)",
                  duration: desktop ? 1.15 : 0.75,
                  ease: "power3.out",
                  clearProps: "clipPath",
                },
                0,
              );
              if (photo) {
                timeline.fromTo(
                  photo,
                  { yPercent: desktop ? -6 : -3, scale: desktop ? 1.14 : 1.07 },
                  {
                    yPercent: 0,
                    scale: 1,
                    duration: desktop ? 1.15 : 0.75,
                    ease: "power3.out",
                    clearProps: "transform",
                  },
                  0,
                );
              }
            } else {
              // Copy always travels as one block: no split or staggered text.
              timeline.fromTo(
                target,
                { y: desktop ? 28 : 14 },
                {
                  y: 0,
                  duration: desktop ? 0.85 : 0.6,
                  ease: "power3.out",
                  clearProps: "transform",
                },
              );
            }
          }

          const finishWithin = (element: Element) => {
            for (const [target, timeline] of pending) {
              if (element.contains(target) || target.contains(element)) {
                timeline.progress(1);
                timeline.scrollTrigger?.kill(false);
              }
            }
          };
          const finishHash = (hash: string) => {
            if (!hash) return;
            try {
              const destination = document.getElementById(decodeURIComponent(hash.slice(1)));
              if (destination && main.contains(destination)) finishWithin(destination);
            } catch {
              // Malformed fragment URLs should never break the readable page.
            }
          };
          const onHashChange = () => finishHash(window.location.hash);
          const onFocus = (event: FocusEvent) => {
            if (event.target instanceof Element && event.target !== main) {
              finishWithin(event.target);
            }
          };
          const onAnchor = (event: MouseEvent) => {
            if (!(event.target instanceof Element)) return;
            const anchor = event.target.closest("a[href]");
            if (!(anchor instanceof HTMLAnchorElement)) return;
            const destination = new URL(anchor.href);
            if (
              destination.origin === window.location.origin &&
              destination.pathname === window.location.pathname
            ) {
              finishHash(destination.hash);
            }
          };

          // The hero stays visible from the first render. Only its photograph
          // drifts with desktop scrolling; text, navigation and controls stay put.
          const hero = main.querySelector<HTMLElement>("[data-motion-hero]");
          const heroPhoto = hero?.querySelector<HTMLElement>(".hero-photo");
          if (desktop && hero && heroPhoto) {
            gsap.fromTo(
              heroPhoto,
              { yPercent: 0 },
              {
                yPercent: 12,
                ease: "none",
                scrollTrigger: {
                  trigger: hero,
                  start: "top top",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          }

          finishHash(window.location.hash);
          main.addEventListener("focusin", onFocus);
          main.addEventListener("click", onAnchor, true);
          window.addEventListener("hashchange", onHashChange);
          main.dataset.scrollAnimations = "ready";

          return () => {
            main.removeEventListener("focusin", onFocus);
            main.removeEventListener("click", onAnchor, true);
            window.removeEventListener("hashchange", onHashChange);
          };
        },
        main,
      );

      // Gallery filtering, FAQ expansion and font loading can move later sections.
      const resizeObserver = new ResizeObserver(refresh);
      resizeObserver.observe(main);
      void document.fonts.ready.then(() => {
        if (!disposed) refresh();
      });
      window.addEventListener("pageshow", refresh);

      return () => {
        disposed = true;
        clearTimeout(refreshTimer);
        resizeObserver.disconnect();
        window.removeEventListener("pageshow", refresh);
        media.revert();
        delete main.dataset.scrollAnimations;
      };
    },
    { scope: container, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <main id="main-content" tabIndex={-1} ref={container}>
      {children}
    </main>
  );
}
