"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";
import styles from "./video-tour.module.css";

export function VideoTour({ full = false }: { full?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const source = full ? "/videos/full-property-tour.mp4" : "/videos/property-tour.mp4";

  return (
    <figure className={styles.tour}>
      <div className={styles.frame}>
        {playing ? (
          <video
            className={styles.video}
            controls
            playsInline
            autoPlay
            preload="none"
            poster="/images/tour-poster.webp"
            aria-label={full ? "Full Happy Trails property tour" : "Happy Trails property tour"}
            tabIndex={0}
            ref={(element) => element?.focus({ preventScroll: true })}
            onError={() => setPlaybackError(true)}
            src={source}
          >
            Your browser does not support this video. <a href={source}>Open the property tour.</a>
          </video>
        ) : (
          <button
            className={styles.playButton}
            type="button"
            onClick={() => setPlaying(true)}
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
          This video could not play. <a href={source}>Open the property tour directly</a> to try
          again.
        </p>
      )}
    </figure>
  );
}
