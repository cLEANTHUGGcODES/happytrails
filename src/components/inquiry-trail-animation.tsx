import styles from "./inquiry-trail-animation.module.css";

/** A countryside ink drawing. The form owns the accessible sending status. */
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

        <g className={styles.grainBin}>
          <path d="M246 61h40v25c-11 6-29 6-40 0V61Z" />
          <path className={styles.corrugation} d="M246 65q20 7 40 0m-40 5q20 7 40 0m-40 5q20 7 40 0m-40 5q20 7 40 0m-40 5q20 7 40 0" />
          <path d="m243 61 23-20 23 20q-23 9-46 0Z" />
          <path className={styles.corrugation} d="m266 42-13 21m13-21v23m0-23 13 21" />
          <path d="M264 41v-3h4v3M260 89V78h12v11M262 69v-5h8v5Z" />
        </g>

        <g className={styles.barn}>
          <path d="m307 53 29-29 27 29v35h-56V53Z" />
          <path d="m363 53 34 6v28l-34 1V53Z" />
          <path className={styles.barnRoof} d="m336 24 36 6 30 28-39-5-27-29Z" />
          <path d="m303 55 33-34 30 32m-30-32 38 6 29 30" />
          <path className={styles.barnDetail} d="m347 27 28 28m-16-26 28 28m-16-26 28 28" />
          <path d="M320 88V62h30v26m-15-26v26m-15-26 15 26m0-26-15 26m15-26 15 26m0-26-15 26" />
          <path d="M331 48v-9h9v9Zm4-9v9m-4-4h9" />
          <path className={styles.barnDetail} d="M312 57v27m5-27v27m37-27v27m5-27v27M368 63v19m9-18v18m9-16v16m7-15v15" />
          <path className={styles.barnDetail} d="M310 54q26 13 51 0m-42 3v3m10-1v3m11-3v3m11-5v3" />
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

    </svg>
  );
}
