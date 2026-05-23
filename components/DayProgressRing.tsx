'use client';

interface DayProgressRingProps {
  progress: number; // 0–100
  timeString: string;
  size?: number;
}

export default function DayProgressRing({ progress, timeString, size = 320 }: DayProgressRingProps) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.41;          // tick radius
  const tickLen = size * 0.042;   // tick length
  const dotR = size * 0.022;

  const totalTicks = 72;
  const filledTicks = Math.round((progress / 100) * totalTicks);

  // Progress dot position
  const dotAngleDeg = (progress / 100) * 360 - 90;
  const dotAngleRad = (dotAngleDeg * Math.PI) / 180;
  const dotX = cx + (R + tickLen * 0.2) * Math.cos(dotAngleRad);
  const dotY = cy + (R + tickLen * 0.2) * Math.sin(dotAngleRad);

  // Hour label positions
  const hourLabels = [
    { label: '00', angle: -90 },
    { label: '06', angle: 0 },
    { label: '12', angle: 90 },
    { label: '18', angle: 180 },
  ];

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <filter id="goldGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="dotGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Tick marks */}
        {Array.from({ length: totalTicks }).map((_, i) => {
          const angleDeg = (i / totalTicks) * 360 - 90;
          const angleRad = (angleDeg * Math.PI) / 180;
          const isFilled = i < filledTicks;
          const innerR = R - tickLen / 2;
          const outerR = R + tickLen / 2;
          const x1 = cx + innerR * Math.cos(angleRad);
          const y1 = cy + innerR * Math.sin(angleRad);
          const x2 = cx + outerR * Math.cos(angleRad);
          const y2 = cy + outerR * Math.sin(angleRad);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isFilled ? '#F6C66A' : 'rgba(127,167,232,0.18)'}
              strokeWidth={isFilled ? size * 0.011 : size * 0.007}
              strokeLinecap="round"
              opacity={isFilled ? 0.92 : 1}
              filter={isFilled && i === filledTicks - 1 ? 'url(#goldGlow)' : undefined}
            />
          );
        })}

        {/* Progress dot */}
        <circle
          cx={dotX} cy={dotY} r={dotR}
          fill="white"
          opacity={0.95}
          filter="url(#dotGlow)"
        />

        {/* Hour labels */}
        {hourLabels.map(({ label, angle }) => {
          const rad = (angle * Math.PI) / 180;
          const labelR = R + tickLen * 0.5 + size * 0.07;
          const x = cx + labelR * Math.cos(rad);
          const y = cy + labelR * Math.sin(rad);
          return (
            <text
              key={label}
              x={x} y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={size * 0.036}
              fill="var(--text-faint)"
              fontFamily="Inter, system-ui, sans-serif"
            >
              {label}
            </text>
          );
        })}

        {/* Center: time */}
        <text
          x={cx} y={cy - size * 0.065}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.115}
          fill="var(--text-primary)"
          fontWeight="300"
          fontFamily="'Cormorant Garamond', 'Playfair Display', Georgia, serif"
          letterSpacing="1"
        >
          {timeString}
        </text>

        {/* Center: % */}
        <text
          x={cx} y={cy + size * 0.075}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.052}
          fill="var(--text-secondary)"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="300"
        >
          {Math.round(progress)}%
        </text>

        {/* Center: label */}
        <text
          x={cx} y={cy + size * 0.145}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.036}
          fill="var(--text-muted)"
          fontFamily="Inter, system-ui, sans-serif"
        >
          of today completed
        </text>
      </svg>
    </div>
  );
}
