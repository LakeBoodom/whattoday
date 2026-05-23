'use client';

import React from 'react';

interface YearArcProps {
  currentMonthLabel?: string;
  yearProgress?: number;   // 0–100
  daysPassed?: number;
  daysRemaining?: number;
  weekendsLeft?: number;
}

export default function YearArc({
  currentMonthLabel = 'Late May',
  yearProgress = 39,
  daysPassed = 143,
  daysRemaining = 222,
  weekendsLeft = 32,
}: YearArcProps) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const r = 110;
  const strokeW = 7;

  // Coordinate system: 0° = top (12 o'clock), clockwise.
  // The YEAR goes COUNTER-CLOCKWISE:
  //   WINTER = top (0°)  →  SPRING = left (270°)  →  SUMMER = bottom (180°)  →  AUTUMN = right (90°)
  // So yearProgress 0%→100% maps to 0°→360° counter-clockwise
  // In CW degrees: progressDeg = 360 - (yearProgress / 100) * 360

  const progressDeg = 360 - (yearProgress / 100) * 360;

  // Convert degree (CW from top) to SVG x,y on the ring
  function toXY(deg: number) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  // Clockwise arc path (for season segment fills and CCW passed arc)
  function cwArcPath(startDeg: number, endDeg: number) {
    let eDeg = endDeg;
    if (eDeg < startDeg) eDeg += 360;
    const largeArc = eDeg - startDeg > 180 ? 1 : 0;
    const s = toXY(startDeg);
    const e = toXY(endDeg < startDeg ? endDeg + 360 : endDeg);
    const eActual = toXY(endDeg);
    void e;
    const end = toXY(eDeg % 360);
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }

  // Counter-clockwise arc path (for the "year passed so far" overlay)
  function ccwArcPath(startDeg: number, endDeg: number) {
    // Goes counter-clockwise from startDeg to endDeg
    let sDeg = startDeg;
    let eDeg = endDeg;
    // counterclockwise: startDeg > endDeg (in CW terms, we go the other way)
    if (sDeg <= eDeg) sDeg += 360;
    const span = sDeg - eDeg; // how many degrees CCW
    const largeArc = span > 180 ? 1 : 0;
    const s = toXY(startDeg);
    const e = toXY(endDeg);
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 0 ${e.x} ${e.y}`;
  }

  // Season segments — arranged counter-clockwise:
  // WINTER: 315°→45° (top), SPRING: 225°→315° (left), SUMMER: 135°→225° (bottom), AUTUMN: 45°→135° (right)
  const seasons = [
    { name: 'WINTER', icon: '❄',  labelDeg: 0,   color: '#a7a6ff', startDeg: 315, endDeg: 45  },
    { name: 'SPRING', icon: '🌿', labelDeg: 270, color: '#c8e6a2', startDeg: 225, endDeg: 315 },
    { name: 'SUMMER', icon: '☀',  labelDeg: 180, color: '#f0b96f', startDeg: 135, endDeg: 225 },
    { name: 'AUTUMN', icon: '🍂', labelDeg: 90,  color: '#d99b64', startDeg: 45,  endDeg: 135 },
  ];

  function labelPos(deg: number, offset = 46) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + (r + offset) * Math.cos(rad), y: cy + (r + offset) * Math.sin(rad) };
  }

  // Current position dot
  const dot = toXY(progressDeg);

  // Dotted "ahead" segment: CCW from progressDeg a bit further
  const dottedEndDeg = progressDeg - 15;
  const dottedStart = toXY(progressDeg);
  const dottedEnd = toXY(dottedEndDeg);

  const cardStyle: React.CSSProperties = {
    background: 'linear-gradient(145deg, #07111f 0%, #0c1828 100%)',
    border: '1px solid rgba(120,145,190,0.22)',
    borderRadius: 32,
    boxShadow: '0 28px 80px rgba(0,0,0,.35)',
    padding: '32px 28px 28px',
    width: '100%',
  };

  return (
    <div style={cardStyle}>
      {/* Header */}
      <p style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--text-faint)',
        fontFamily: 'Inter, sans-serif',
        marginBottom: 24,
      }}>
        Year Arc
      </p>

      {/* SVG ring */}
      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
          <defs>
            <filter id="glow-gold">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-ring">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="progressGrad" gradientUnits="userSpaceOnUse"
              x1={cx} y1={cy - r} x2={cx - r * 0.7} y2={cy + r * 0.5}>
              <stop offset="0%" stopColor="#a7a6ff"/>
              <stop offset="45%" stopColor="#c8e6a2"/>
              <stop offset="100%" stopColor="#f0b96f"/>
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(127,167,232,0.08)" strokeWidth={strokeW + 2}/>

          {/* Seasonal arc segments (dim background) */}
          {seasons.map((s) => (
            <path
              key={s.name}
              d={cwArcPath(s.startDeg, s.endDeg)}
              fill="none"
              stroke={s.color}
              strokeWidth={strokeW}
              strokeLinecap="round"
              opacity={0.3}
            />
          ))}

          {/* Passed portion — counter-clockwise from top (0°) to current position */}
          <path
            d={ccwArcPath(0, progressDeg)}
            fill="none"
            stroke="url(#progressGrad)"
            strokeWidth={strokeW}
            strokeLinecap="round"
            opacity={0.9}
            filter="url(#glow-ring)"
          />

          {/* Dotted segment "ahead" (CCW) */}
          <path
            d={`M ${dottedStart.x} ${dottedStart.y} A ${r} ${r} 0 0 0 ${dottedEnd.x} ${dottedEnd.y}`}
            fill="none"
            stroke="#f0b96f"
            strokeWidth={3}
            strokeDasharray="3 5"
            strokeLinecap="round"
            opacity={0.4}
          />

          {/* Current position dot */}
          <circle cx={dot.x} cy={dot.y} r={11} fill="#f0b96f" opacity={0.15} filter="url(#glow-gold)"/>
          <circle cx={dot.x} cy={dot.y} r={6.5} fill="#f0b96f" opacity={0.75} filter="url(#glow-gold)"/>
          <circle cx={dot.x} cy={dot.y} r={3.5} fill="#ffe9b3"/>

          {/* Season labels */}
          {seasons.map((s) => {
            const pos = labelPos(s.labelDeg, 46);
            // dot on ring at mid of season
            const midDeg = (s.startDeg + (s.endDeg < s.startDeg ? s.endDeg + 360 : s.endDeg)) / 2;
            const midDot = toXY(midDeg % 360);
            return (
              <g key={s.name + '-label'}>
                <text x={pos.x} y={pos.y - 8} textAnchor="middle"
                  fontSize="8" fontWeight="600" letterSpacing="0.1em"
                  fill={s.color} fontFamily="Inter, sans-serif" opacity={0.7}>
                  {s.name}
                </text>
                <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="13" fill={s.color} opacity={0.55}>
                  {s.icon}
                </text>
                <circle cx={midDot.x} cy={midDot.y} r={3} fill={s.color} opacity={0.4}/>
              </g>
            );
          })}

          {/* Center text */}
          <text x={cx} y={cy - 22} textAnchor="middle" fontSize="9" fontWeight="500"
            letterSpacing="0.12em" fill="var(--text-faint)" fontFamily="Inter, sans-serif">
            YOU ARE IN
          </text>
          <text x={cx} y={cy + 8} textAnchor="middle" fontSize="26" fontWeight="300"
            fill="var(--text-primary)" fontFamily="'Cormorant Garamond', Georgia, serif">
            {currentMonthLabel}
          </text>
          <text x={cx} y={cy + 28} textAnchor="middle" fontSize="11"
            fill="var(--accent-gold)" fontFamily="'Cormorant Garamond', Georgia, serif" fontWeight="300">
            ——  ·  ——
          </text>
          <text x={cx} y={cy + 50} textAnchor="middle" fontSize="19" fontWeight="300"
            fill="var(--accent-gold)" fontFamily="'Cormorant Garamond', Georgia, serif">
            {Math.round(yearProgress)}%
          </text>
          <text x={cx} y={cy + 65} textAnchor="middle" fontSize="8" fontWeight="500"
            letterSpacing="0.1em" fill="var(--text-faint)" fontFamily="Inter, sans-serif">
            OF THE YEAR COMPLETED
          </text>
        </svg>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1px 1fr 1px 1fr',
        marginTop: 28,
        paddingTop: 24,
        borderTop: '1px solid rgba(120,145,190,0.12)',
      }}>
        {[
          { icon: '🌿', value: daysPassed, label: 'BEHIND YOU', color: '#c8e6a2' },
          null,
          { icon: '◎', value: weekendsLeft, label: 'WEEKENDS LEFT', color: '#f0b96f' },
          null,
          { icon: '☽', value: daysRemaining, label: 'AHEAD', color: '#a7a6ff' },
        ].map((item, i) =>
          item === null ? (
            <div key={i} style={{ width: 1, background: 'rgba(120,145,190,0.14)', margin: '0 auto' }}/>
          ) : (
            <div key={i} style={{ textAlign: 'center', padding: '0 8px' }}>
              <div style={{ fontSize: 18, marginBottom: 6, opacity: 0.5 }}>{item.icon}</div>
              <div style={{
                fontSize: 28, fontWeight: 300, color: item.color, lineHeight: 1,
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}>{item.value}</div>
              <div style={{
                fontSize: 8, fontWeight: 600, letterSpacing: '0.1em',
                color: 'var(--text-faint)', fontFamily: 'Inter, sans-serif', marginTop: 6,
              }}>{item.label}</div>
            </div>
          )
        )}
      </div>

      {/* Quote */}
      <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(120,145,190,0.08)' }}>
        <p style={{
          fontSize: 13, fontStyle: 'italic', color: 'var(--text-muted)', fontWeight: 300, lineHeight: 1.6,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
        }}>
          Time is moving.<br/>Make space for what matters.
        </p>
      </div>
    </div>
  );
}
