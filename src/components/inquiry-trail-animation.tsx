import styles from "./inquiry-trail-animation.module.css";

/** A small, original ink drawing. The form owns the accessible sending status. */
export function InquiryTrailAnimation() {
  return (
    <svg
      className={styles.scene}
      viewBox="0 0 420 150"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g className={styles.landscape}>
        <path d="M16 100c31-10 62-9 91-4m135-11c24-8 42-8 62-5m54 3c17 0 32 4 46 9" />
        <path d="M32 114c13-2 22-2 31-1m283-15c17-4 29-3 45 0" />
        <path d="m35 96-1-5m3 5 3-4m68 22-2-5m3 4 3-3m166-24-1-5m3 4 2-3m103 20-1-5m3 4 2-3" />

        <g className={styles.fence}>
          <path d="M53 97V77m26 18V76m26 21V80M52 83l54 3M53 91l53 3" />
          <path d="m51 77 2-2 2 2m22-1 2-2 2 2m22 4 2-2 2 2" />
        </g>

        <g className={styles.tree}>
          <path d="M40 89V68m0 6-8-6m8 10 8-9" />
          <path d="M31 70c-8 0-11-6-7-11-3-6 1-12 7-12 1-7 11-10 16-3 7-2 13 5 10 11 7 5 3 14-5 14-3 5-10 5-14 1-3 2-5 2-7 0Z" />
          <path d="M28 60c3-3 6-3 8-1m11-8c4 1 5 4 4 7" />
        </g>

        <g className={styles.barn}>
          <path d="m318 67 18-20 23 18v23h-41V67Z" />
          <path d="m315 68 21-24 26 20m-26-17v14m-5-5h10" />
          <path d="M331 88V70h16v18m-16-18 16 18m0-18-16 18m8-18v18" />
          <path d="M323 68v16m31-15v15m-26-21 8-9 12 9" />
          <path d="m359 67 15 5v16h-15m15-16 3 1" />
        </g>

        <circle className={styles.sun} cx="302" cy="35" r="9" />
        <path className={styles.birds} d="M104 43q4-5 8-1 4-5 8-2m-19-11q3-3 6-1 3-3 6-1" />
      </g>

      <g className={styles.trailBase}>
        <path d="M16 135c50-28 92-13 142-13 52 0 79-8 96-21 21-16 37-13 54-12 15 1 22-1 29-4" />
        <path d="M66 146c34-16 73-12 107-12 47 0 77-16 89-27 18-17 35-13 48-13 15 0 23-4 28-7" />
      </g>
      <g className={styles.trailInk}>
        <path pathLength="1" d="M16 135c50-28 92-13 142-13 52 0 79-8 96-21 21-16 37-13 54-12 15 1 22-1 29-4" />
        <path pathLength="1" d="M66 146c34-16 73-12 107-12 47 0 77-16 89-27 18-17 35-13 48-13 15 0 23-4 28-7" />
      </g>

      <g transform="translate(133 10)">
        <g className={styles.traveler}>
          <ellipse className={styles.shadow} cx="64" cy="115" rx="54" ry="3" />
          <g className={styles.horse}>
            <g className={styles.farLegs}>
              <path className={styles.farHindLeg} d="M26 57 21 78 31 94 30 111 35 116H26l-3-4 1-16-12-17 3-17Z" />
              <path className={styles.farFrontLeg} d="m91 58 5 24-9 20-4 11 5 3H78l1-10 7-24V64Z" />
            </g>

            <g className={styles.tail}>
              <path d="M22 41C5 43 12 66 1 78c12-2 17-14 18-28l7-5" />
              <path d="M19 47C10 52 16 65 7 73m8-12c-1 8-4 11-7 13" />
            </g>

            <g className={styles.nearHindLeg}>
              <path d="M31 61c7 9 8 17 2 26l-9 21 4 5-2 3h-9l1-6 7-25-2-13Z" />
              <path d="m18 111 8 1m0-26 5 2" />
            </g>
            <g className={styles.nearFrontLeg}>
              <path d="m89 61 3 23 4 23 8 5-1 4H93l-3-5-5-25-4-15Z" />
              <path d="m92 110 9 1m-16-23 6-2" />
            </g>

            <path d="M25 39c10-5 19-3 29-1 12 3 19 2 26-8l9-15c4-6 10-9 17-7l7 10c-5 8-9 16-11 26-1 9-4 19-10 25-8 8-20 7-33 3-10-3-17-4-25-2-9 1-15-6-16-15-1-7 1-12 7-16Z" />

            <g className={styles.head}>
              <path className={styles.headShape} d="m98 11 6-2 5-5 1 8 5-6-1 10c3 3 5 4 7 7l11 12c3 3 1 7-3 8l-7 1c-4-2-6-5-9-8l-8-4-8-3" />
              <path d="m105 13 5 3m10 12 4 5m4 4 2 1m-18-7c-3 3-3 6-2 8" />
              <circle className={styles.eye} cx="115" cy="24" r="1.15" />
            </g>

            <path className={styles.mane} d="M103 9c-7 6-12 13-16 23l-5 8-4-1 5-12c5-11 11-19 20-18Z" />
            <g className={styles.etching}>
              <path d="m99 13-7 10m5-4-8 11m5-3-7 10M25 43c-4 5-4 12-1 17m4-18c-3 4-4 8-3 11M80 45c7 3 10 9 8 16m-8-11c3 2 5 5 5 9M38 65c9-2 14 0 21 2m7 1 8 1" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
