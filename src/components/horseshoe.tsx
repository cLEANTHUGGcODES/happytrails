type HorseshoeProps = {
  className?: string;
  width?: number | string;
  height?: number | string;
  strokeWidth?: number;
};

export function Horseshoe({ className, width, height, strokeWidth = 1.7 }: HorseshoeProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 40 44"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8 3 4.5 17C1 31 8.5 40 20 40S39 31 35.5 17L32 3l-7 2 3.5 14C30.5 27 27 32 20 32s-10.5-5-8.5-13L15 5 8 3Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 .5m-4 9h2m-.5 9 1.7-1M31 12l-2 .5m4 9h-2m.5 9-1.7-1M19 36h2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
