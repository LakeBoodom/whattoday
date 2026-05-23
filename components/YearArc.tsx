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
  const circ = 2 * Math.PI * r;

  // We split the arc into 4 seasonal segments
  // Winter: 270°→360°+0°→90° (top), Spring: 90°→180° (left→bottom),
  // Summer: 180°→270° (bottom), Autumn: 270°→360° (right)
  // SVG 0° = 3 o'clock; we rotate -90° so 0° = top = Winter

  // Seasonal arc segments (degrees from top, clockwise)
  // Winter: 315–45 (top), Spring: 45–135, Summer: 135–225, Autumn: 225–315
  const seasons = [
    { name: 'WINTER', icon: '❄', deg: 0,   color: '#a7a6ff', startDeg: 315, endDeg: 45  },
    { name: 'SPRING', icon: '🌿', deg: 270, color: '#c8e6a2', startDeg: 45,  endDeg: 135 },
    { name: 'SUMMER', icon: '☀', deg: 180, color: '#f0b96f', startDeg: 135, endDeg: 225 },
    { name: 'AUTUMN', icon: '🍂', deg: 90,  color: '#d99b64', startDeg: 225, endDeg: 315 },
  ];

  // Position label around circle
  function labelPos(deg: number, offset = 44) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return {
      x: cx + (r + offset) * Math.cos(rad),
      y: cy + (r + offset) * Math.sin(rad),
    };
  }

  // Build a conic arc path segment
  function arcPath(startDeg: number, endDeg: number) {
    const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
    let sDeg = startDeg;
    let eDeg = endDeg;
    if (eDeg < sDeg) eDeg += 360;
    const largeArc = eDeg - sDeg > 180 ? 1 : 0;
    const sx = cx + r * Math.cos(toRad(sDeg));
    const sy = cy + r * Math.sin(toRad(sDeg));
    const ex = cx + r * Math.cos(toRad(eDeg));
    const ey = cy + r * Math.sin(toRad(eDeg));
    return `M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey}`;
  }

  // Current position dot: yearProgress maps 0–100 → 0–360 degrees (from top)
  const progressDeg = (yearProgress / 100) * 360;
  const dotRad = ((progressDeg - 90) * Math.PI) / 180;
  const dotX = cx + r * Math.cos(dotRad);
  const dotY = cy + r * Math.sin(dotRad);

  // Dotted segment ahead (next 10% of year)
  const dottedEndDeg = progressDeg + 18; // ~5% ahead
  function dottedPath() {
    const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
    const sx = cx + r * Math.cos(toRad(progressDeg));
    const sy = cy + r * Math.sin(toRad(progressDeg));
    const ex = cx + r * Math.cos(toRad(dottedEndDeg));
    const ey = cy + r * Math.sin(toRad(dottedEndDeg));
    return `M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`;
  }

  const cardStyle: React.CSSProperties = {
    background: 'linear-gradient(145deg, #07111f 0%, #0c1828 100%)',
    border: '1px solid rgba(120,145,190,0.22)',
    borderRadius: 32,
    boxShadow: '0 28px 80px rgba(0,0,0,.35)',
    padding: '32px 28px 28px',
    width: '100%',
    maxWidth: 520,
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
              <feGaussianBlur stdDeviation="5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(127,167,232,0.08)" strokeWidth={strokeW + 2}/>

          {/* Seasonal arc segments */}
          {seasons.map((s) => (
            <path
              key={s.name}
              d={arcPath(s.startDeg, s.endDeg)}
              fill="none"
              stroke={s.color}
              strokeWidth={strokeW}
              strokeLinecap="round"
              opacity={0.55}
            />
          ))}

          {/* Passed portion overlay (brighter) */}
          <path
            d={arcPath(0, progressDeg)}
            fill="none"
            stroke="url(#progressGrad)"
            strokeWidth={strokeW}
            strokeLinecap="round"
            opacity={0.85}
            filter="url(#glow-ring)"
          />

          <defs>
            <linearGradient id="progressGrad" gradientUnits="userSpaceOnUse"
              x1={cx} y1={cy - r} x2={cx + r * 0.7} y2={cy + r * 0.7}>
              <stop offset="0%" stopColor="#a7a6ff"/>
              <stop offset="40%" stopColor="#c8e6a2"/>
              <stop offset="100%" stopColor="#f0b96f"/>
            </linearGradient>
          </defs>

          {/* Dotted segment ahead */}
          <path
            d={dottedPath()}
            fill="none"
            stroke="#f0b96f"
            strokeWidth={3}
            strokeDasharray="3 5"
            strokeLinecap="round"
            opacity={0.45}
          />

          {/* Current position dot */}
          <circle cx={dotX} cy={dotY} r={10} fill="#f0b96f" opacity={0.18} filter="url(#glow-gold)"/>
          <circle cx={dotX} cy={dotY} r={6} fill="#f0b96f" opacity={0.7} filter="url(#glow-gold)"/>
          <circle cx={dotX} cy={dotY} r={3.5} fill="#ffe9b3"/>

          {/* Season labels */}
          {seasons.map((s) => {
            const pos = labelPos(s.deg, 46);
            return (
              <g key={s.name + '-label'}>
                <text
                  x={pos.x} y={pos.y - 8}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="600"
                  letterSpacing="0.1em"
                  fill={s.color}
                  fontFamily="Inter, sans-serif"
                  opacity={0.7}
                  style={{ textTransform: 'uppercase' }}
                >
                  {s.name}
                </text>
                <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="13" fill={s.color} opacity={0.6}>
                  {s.icon}
                </text>
                {/* Season dot on ring */}
                {(() => {
                  const midDeg = (s.startDeg + (s.endDeg < s.startDeg ? s.endDeg + 360 : s.endDeg)) / 2;
                  const mRad = ((midDeg - 90) * Math.PI) / 180;
                  const mx = cx + r * Math.cos(mRad);
                  const my = cy + r * Math.sin(mRad);
                  return <circle cx={mx} cy={my} r={3} fill={s.color} opacity={0.5}/>;
                })()}
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
          <text x={cx} y={cy + 30} textAnchor="middle" fontSize="11"
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
        gap: 0,
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
                fontSize: 28,
                fontWeight: 300,
                color: item.color,
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                lineHeight: 1,
              }}>{item.value}</div>
              <div style={{
                fontSize: 8,
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: 'var(--text-faint)',
                fontFamily: 'Inter, sans-serif',
                marginTop: 6,
              }}>{item.label}</div>
            </div>
          )
        )}
      </div>

      {/* Quote */}
      <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(120,145,190,0.08)' }}>
        <p style={{
          fontSize: 13,
          fontStyle: 'italic',
          color: 'var(--text-muted)',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 300,
          lineHeight: 1.6,
        }}>
          Time is moving.<br/>Make space for what matters.
        </p>
      </div>
    </div>
  );
}
