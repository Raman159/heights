
import React, { useId } from "react";

const LEAVES = [
  { x: -16, y: -102, angle: -42 },
  { x: 19, y: -84, angle: 43 },
  { x: -22, y: -58, angle: -45 },
  { x: 23, y: -37, angle: 45 },
  { x: -25, y: -12, angle: -48 },
  { x: 25, y: 10, angle: 46 },
  { x: -22, y: 37, angle: -48 },
  { x: 21, y: 57, angle: 42 },
];

const BotanicalBranch = ({
  x,
  y,
  scale = 1,
  rotate = 0,
}) => (
  <g
    transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
    stroke="#7D9B80"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <path
      d="M0 115 Q12 0 0 -130"
      fill="none"
      opacity=".55"
    />

    {LEAVES.map((leaf, index) => (
      <ellipse
        key={index}
        cx={leaf.x}
        cy={leaf.y}
        rx="14"
        ry="31"
        transform={`rotate(${leaf.angle} ${leaf.x} ${leaf.y})`}
        fill="#A8BEA4"
        fillOpacity=".16"
        strokeOpacity=".42"
      />
    ))}
  </g>
);

export default function Design() {
  const id = useId().replace(/:/g, "");
  const haloId = `${id}-halo`;
  const waveId = `${id}-wave`;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 block h-full w-full"
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    >
      <defs>
        {/* Soft green ambient glow */}
        <radialGradient id={haloId}>
          <stop
            offset="0%"
            stopColor="#C8DCC0"
            stopOpacity=".45"
          />
          <stop
            offset="100%"
            stopColor="#C8DCC0"
            stopOpacity="0"
          />
        </radialGradient>

        {/* Flow line gradient */}
        <linearGradient
          id={waveId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop
            offset="0%"
            stopColor="#B5CBB0"
            stopOpacity="0"
          />
          <stop
            offset="45%"
            stopColor="#9AB59A"
            stopOpacity=".43"
          />
          <stop
            offset="100%"
            stopColor="#D8C8B2"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      {/* Static ambient lighting */}
      <g>
        <circle
          cx="1120"
          cy="180"
          r="380"
          fill={`url(#${haloId})`}
        />

        <circle
          cx="240"
          cy="520"
          r="260"
          fill={`url(#${haloId})`}
          opacity=".55"
        />
      </g>

      {/* Organic flow lines across full width */}
      <g strokeLinecap="round">
        <path
          d="M-100 390 C170 100 360 510 670 300 S1100 60 1550 280"
          stroke={`url(#${waveId})`}
          strokeWidth="2"
        />

        <path
          d="M-100 420 C190 130 380 540 700 335 S1130 100 1550 315"
          stroke="#B1C9AD"
          strokeOpacity=".25"
          strokeWidth="1.3"
        />

        <path
          d="M-100 450 C210 160 400 570 730 370 S1160 140 1550 350"
          stroke="#D3BEA5"
          strokeOpacity=".2"
          strokeWidth="1"
        />
      </g>

      {/* Right botanical branch - moved inward */}
      <BotanicalBranch
        x={1130}
        y={320}
        scale={1.45}
        rotate={-18}
      />

      {/* Left botanical branch - moved inward */}
      <g opacity=".4">
        <BotanicalBranch
          x={220}
          y={490}
          scale={0.8}
          rotate={28}
        />
      </g>

      {/* Subtle natural decorative dots */}
      {[
        [300, 110, 2],
        [530, 470, 1.5],
        [880, 120, 2],
        [1010, 440, 1.5],
        [1350, 90, 2],
      ].map(([x, y, r], index) => (
        <circle
          key={index}
          cx={x}
          cy={y}
          r={r}
          fill="#A8BEA4"
          opacity=".35"
        />
      ))}
    </svg>
  );
}
