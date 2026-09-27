import { horsePoses } from "./inquiry-horse-poses";
import styles from "./inquiry-trail-animation.module.css";

/** Original equestrian linework; the form owns the accessible sending status. */
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

      <g transform="translate(98 5) scale(.59)">
        <ellipse className={styles.shadow} cx="157" cy="202" rx="101" ry="4" />
        <svg
          width="320"
          height="210"
          viewBox="0 0 320 210"
          className={styles.poseViewport}
          data-horse-viewport=""
          aria-hidden="true"
          focusable="false"
        >
          <g className={styles.poseStrip}>
            {horsePoses.map((pose, frame) => (
              <g key={frame} data-horse-pose={frame} transform={`translate(0 ${frame * 210})`}>
                <path className={styles.farLeg} d={pose.farHind} />
                <path className={styles.farLeg} d={pose.farFront} />
                <path className={styles.nearLeg} d={pose.nearHind} />
                <path className={styles.nearLeg} d={pose.nearFront} />
              </g>
            ))}
          </g>
        </svg>

        <g className={styles.tail}>
          <path d="M65 55C40 49 33 67 31 92c-1 19-4 38-15 53 14-5 28-23 30-45 2-17 5-30 20-35Z" />
          <path className={styles.tailLines} d="M55 61C36 79 44 111 24 135M49 68c-9 22-4 34-15 51" />
        </g>

        <g className={styles.body}>
          <path className={styles.bodyFill} d="M59 57C75 43 97 47 120 52c24 5 43 3 62-5 21-9 34-23 62-25l10-1 4-9 2 12 8-7-3 13c7 8 12 19 15 30l15 20c4 6 1 11-5 12-6 1-10-3-14-9l-17-17c-7-6-13-7-17-6-3 12-7 17-14 22 1 19-6 36-22 41-11 4-22 3-35 1-26 0-44-3-62-9-12-3-17-7-21-12-7 12-17 18-31 11-21-10-23-39-1-55Z" />
          <path className={styles.contour} d="M59 57C75 43 97 47 120 52c24 5 43 3 62-5 21-9 34-23 62-25l10-1 4-9 2 12 8-7-3 13c7 8 12 19 15 30l15 20c4 6 1 11-5 12-6 1-10-3-14-9l-17-17c-7-6-13-7-17-6-3 12-7 17-14 22 1 11-1 20-5 27M108 110c24 9 49 12 79 11M59 57C45 66 44 88 51 99" />
          <path className={styles.mane} d="M250 24c-26 3-43 15-66 25l-9 9q10-2 16-7-8 9-5 13 9-4 14-12-6 10-2 13 10-6 16-16-4 8-2 10 10-8 17-17-5 8-1 7l15-15 8-2Z" />
          <path className={styles.detail} d="M249 28l7 4m8-6 2 8M287 75l4 3m-3 8 6 1M246 60c-12 10-19 22-23 35M215 70c-9 12-11 23-8 36M77 60c14 6 23 19 23 36m-24-29c8 7 13 14 14 23M123 108c18 4 34 6 52 5" />
          <ellipse className={styles.eye} cx="268" cy="45" rx="2.1" ry="1.7" />
        </g>
      </g>
    </svg>
  );
}
