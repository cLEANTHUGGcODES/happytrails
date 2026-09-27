"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import type { MediaItem } from "@/lib/content";
import styles from "./photo-gallery.module.css";

gsap.registerPlugin(Flip);

export type GalleryView = "grid" | "slideshow";
type Motion = { animation?: gsap.core.Animation; cleanup: () => void };

function photoBounds(button: HTMLElement, item: MediaItem, view: GalleryView) {
  const rect = button.getBoundingClientRect();
  if (view === "grid") return rect;
  // The slideshow shows the whole photograph, including portrait-oriented images.
  const scale = Math.min(rect.width / item.width, rect.height / item.height);
  const width = item.width * scale;
  const height = item.height * scale;
  return {
    left: rect.left + (rect.width - width) / 2,
    top: rect.top + (rect.height - height) / 2,
    width,
    height,
  };
}

export function useGalleryMotion() {
  const motion = useRef<Motion | null>(null);
  const finish = useCallback(() => {
    const current = motion.current;
    motion.current = null;
    current?.animation?.kill();
    current?.cleanup();
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    preference.addEventListener("change", finish);
    window.addEventListener("resize", finish);
    return () => {
      finish();
      preference.removeEventListener("change", finish);
      window.removeEventListener("resize", finish);
    };
  }, [finish]);

  function transition(
    source: HTMLElement | null,
    item: MediaItem,
    from: GalleryView,
    to: GalleryView,
    updateLayout: () => void,
    getTarget: () => HTMLElement | null,
  ) {
    finish();
    const sourceImage = source?.querySelector("img");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const box = source ? photoBounds(source, item, from) : null;
    const visible = box && box.top < innerHeight && box.top + box.height > 0;
    let layer: HTMLDivElement | undefined;
    let state: Flip.FlipState | undefined;

    if (!reduced && visible && sourceImage?.complete && sourceImage.naturalWidth) {
      layer = document.createElement("div");
      layer.className = styles.transitionPhoto;
      layer.dataset.galleryTransition = "";
      layer.setAttribute("aria-hidden", "true");
      Object.assign(layer.style, {
        left: `${box.left}px`,
        top: `${box.top}px`,
        width: `${box.width}px`,
        height: `${box.height}px`,
        backgroundImage: `url(${JSON.stringify(sourceImage.currentSrc || sourceImage.src)})`,
        backgroundPosition: from === "grid" ? item.position || "center" : "center",
      });
      document.body.append(layer);
      state = Flip.getState(layer);
    }

    // React retains ownership of every real image. Only this decorative layer
    // travels in viewport coordinates, so an intentional scroll can't distort it.
    updateLayout();
    const target = getTarget();
    const targetImage = target?.querySelector("img");
    if (!layer || !state || !target || !targetImage) {
      layer?.remove();
      return;
    }

    const destination = photoBounds(target, item, to);
    Object.assign(layer.style, {
      left: `${destination.left}px`,
      top: `${destination.top}px`,
      width: `${destination.width}px`,
      height: `${destination.height}px`,
      backgroundPosition: to === "grid" ? item.position || "center" : "center",
    });
    const visibility = targetImage.style.visibility;
    targetImage.style.visibility = "hidden";
    const travelingPhoto = layer;
    const initialScroll = { x: window.scrollX, y: window.scrollY };
    const onScroll = () => {
      // Ignore the queued event from the intentional layout scroll above.
      if (window.scrollX !== initialScroll.x || window.scrollY !== initialScroll.y) finish();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const current: Motion = {
      cleanup: () => {
        window.removeEventListener("scroll", onScroll);
        targetImage.style.visibility = visibility;
        travelingPhoto.remove();
      },
    };
    motion.current = current;
    current.animation = Flip.from(state, {
      duration: window.matchMedia("(max-width: 760px)").matches ? 0.42 : 0.65,
      ease: "power3.inOut",
      scale: false,
      onComplete: finish,
    });
  }

  function reveal(button: HTMLElement | null, direction: number) {
    finish();
    const image = button?.querySelector("img");
    if (!image || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const clear = () => {
      image.style.removeProperty("opacity");
      image.style.removeProperty("transform");
      image.style.removeProperty("clip-path");
    };
    const current: Motion = {
      cleanup: () => {
        image.removeEventListener("load", play);
        image.removeEventListener("error", finish);
        clear();
      },
    };
    const play = () => {
      if (motion.current !== current) return;
      current.animation = gsap.fromTo(
        image,
        {
          opacity: 0,
          xPercent: direction * 3,
          clipPath: `inset(0 ${direction > 0 ? 5 : 0}% 0 ${direction < 0 ? 5 : 0}%)`,
        },
        {
          opacity: 1,
          xPercent: 0,
          clipPath: "inset(0 0% 0 0%)",
          duration: 0.45,
          ease: "power2.out",
          onComplete: finish,
        },
      );
    };
    motion.current = current;
    if (image.complete && image.naturalWidth) play();
    else {
      image.style.opacity = "0";
      image.addEventListener("load", play, { once: true });
      image.addEventListener("error", finish, { once: true });
    }
  }

  return { transition, reveal, finish };
}
