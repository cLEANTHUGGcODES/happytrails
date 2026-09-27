"use client";

import Image, { getImageProps } from "next/image";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./video-tour.module.css";

// Browsers fetch native video posters even with preload="none". Use a compact
// optimized fallback; the visible play overlay keeps its responsive photograph.
const videoPoster = getImageProps({
  src: "/images/tour-poster.webp",
  alt: "",
  width: 480,
  height: 270,
}).props.src;

export function VideoTour({ full = false }: { full?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const playButton = useRef<HTMLButtonElement>(null);
  const source = full ? "/videos/full-property-tour.mp4" : "/videos/property-tour.mp4";

  useEffect(() => {
    if (playing) video.current?.focus({ preventScroll: true });
    else if (playbackError) playButton.current?.focus({ preventScroll: true });
  }, [playing, playbackError]);

  function handlePlaybackError() {
    setPlaying(false);
    setPlaybackError(true);
  }

  async function playTour() {
    const element = video.current;
    if (!element) return;
    setPlaybackError(false);
    setPlaying(true);
    try {
      // A failed media request needs a fresh load before the visitor retries.
      if (element.error) element.load();
      await element.play();
    } catch {
      handlePlaybackError();
    }
  }

  return (
    <figure className={styles.tour}>
      <div className={styles.frame}>
        <video
          className={styles.video}
          controls={playing}
          playsInline
          preload="none"
          poster={videoPoster}
          aria-label={full ? "Full Happy Trails property tour" : "Happy Trails property tour"}
          aria-hidden={!playing}
          tabIndex={playing ? 0 : -1}
          ref={video}
          onError={handlePlaybackError}
          src={source}
        >
          Your browser does not support this video.{" "}
          <a href={source} tabIndex={playing ? 0 : -1}>
            Open the property tour.
          </a>
        </video>
        {!playing && (
          <button
            className={styles.playButton}
            type="button"
            ref={playButton}
            onClick={playTour}
            aria-label={
              full
                ? "Watch the full tour: play the Happy Trails property tour"
                : "Take a little look around: play the Happy Trails property tour"
            }
          >
            <Image
              src="/images/tour-poster.webp"
              alt="A preview of the Happy Trails property tour"
              fill
              sizes="(max-width: 767px) calc(100vw - 40px), 90vw"
              className={styles.poster}
            />
            <span className={styles.shade} aria-hidden="true" />
            <span className={styles.playContent} aria-hidden="true">
              <span className={styles.playIcon}>
                <Play size={27} strokeWidth={1.4} fill="currentColor" />
              </span>
              <span className={styles.playLabel}>
                {full ? "Watch the full tour" : "Take a little look around"}
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className={styles.caption}>
        <span className={styles.title}>Take a tour of Happy Trails</span>
        <span className={styles.note}>A little Texas hospitality, before you arrive.</span>
      </figcaption>
      {playbackError && (
        <p role="alert" className={styles.error}>
          This video could not play. Use the play button to try again, or{" "}
          <a href={source}>open the property tour directly</a>.
        </p>
      )}
    </figure>
  );
}
