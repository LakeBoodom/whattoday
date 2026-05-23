'use client';

import React from 'react';

interface TodayOnEarthProps {
  longestDayCity?: string;
  longestDayCountry?: string;
  longestDayLat?: string;
  longestDayDuration?: string;
  shortestDayCity?: string;
  shortestDayCountry?: string;
  shortestDayLat?: string;
  shortestDayDuration?: string;
  solsticeCountdown?: number;
  nextSolsticeName?: string;
}

export default function TodayOnEarth({
  longestDayCity = 'Tromsø',
  longestDayCountry = 'Norway',
  longestDayLat = '69° N',
  longestDayDuration = '24 hours of daylight',
  shortestDayCity = 'Ushuaia',
  shortestDayCountry = 'Argentina',
  shortestDayLat = '54° S',
  shortestDayDuration = '7h 12m of daylight',
  solsticeCountdown = 20,
  nextSolsticeName = 'June Solstice',
}: TodayOnEarthProps) {

  const cardStyle: React.CSSProperties = {
    background: 'linear-gradient(145deg, #07111f, #0d1a2b)',
    border: '1px solid rgba(120,145,190,0.22)',
    borderRadius: 32,
    boxShadow: '0 30px 80px rgba(0,0,0,.35)',
    padding: '36px 32px',
    width: '100%',
    display: 'flex',
    gap: 32,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontFamily: 'Inter, sans-serif',
    display: 'block',
    marginBottom: 4,
  };

  return (
    <div style={cardStyle}>

      {/* Left: editorial text */}
      <div style={{ flex: '1 1 0', minWidth: 0, zIndex: 1 }}>

        {/* Section label */}
        <p style={{ ...labelStyle, color: 'var(--text-faint)', marginBottom: 16 }}>
          Today on Earth
        </p>

        {/* Hero headline */}
        <h2 style={{
          fontSize: 'clamp(22px, 4vw, 32px)',
          fontWeight: 300,
          lineHeight: 1.25,
          color: '#e7e8ee',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          marginBottom: 10,
        }}>
          Today exists<br/>
          differently<br/>
          across Earth.
        </h2>

        {/* Subtext */}
        <p style={{
          fontSize: 13,
          color: '#8d96a8',
          lineHeight: 1.6,
          fontFamily: 'Inter, sans-serif',
          marginBottom: 28,
        }}>
          Different places.<br/>
          Different light.<br/>
          One shared today.
        </p>

        {/* Longest day */}
        <div style={{ marginBottom: 20 }}>
          <span style={{ ...labelStyle, color: '#c8e6a2', opacity: 0.85 }}>
            ☀ Today&apos;s Longest Day
          </span>
          <p style={{
            fontSize: 18,
            fontWeight: 300,
            color: '#e7e8ee',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            marginBottom: 2,
          }}>
            {longestDayCity}, {longestDayCountry}
          </p>
          <p style={{ fontSize: 16, color: '#c8e6a2', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {longestDayDuration}
          </p>
        </div>

        {/* Shortest day */}
        <div style={{ marginBottom: 28 }}>
          <span style={{ ...labelStyle, color: '#f0b36f', opacity: 0.85 }}>
            ☽ Today&apos;s Shortest Day
          </span>
          <p style={{
            fontSize: 18,
            fontWeight: 300,
            color: '#e7e8ee',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            marginBottom: 2,
          }}>
            {shortestDayCity}, {shortestDayCountry}
          </p>
          <p style={{ fontSize: 16, color: '#f0b36f', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
            {shortestDayDuration}
          </p>
        </div>

        {/* Solstice countdown pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(167,166,255,0.08)',
          border: '1px solid rgba(167,166,255,0.18)',
          borderRadius: 20,
          padding: '8px 16px',
        }}>
          <span style={{ fontSize: 14, color: '#a7a6ff' }}>◎</span>
          <div>
            <span style={{ fontSize: 8, fontWeight: 600, letterSpacing: '0.1em', color: '#a7a6ff', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', display: 'block' }}>
              The Year&apos;s Rhythm
            </span>
            <span style={{ fontSize: 13, color: '#e7e8ee', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              <strong style={{ fontWeight: 400 }}>{solsticeCountdown} days</strong>
              <span style={{ color: '#8d96a8' }}> until {nextSolsticeName}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right: ambient Earth visualization */}
      <div style={{ flexShrink: 0, width: 200, height: 280, position: 'relative' }} aria-hidden="true">
        <EarthViz
          longestCityLabel={longestDayCity}
          longestLat={longestDayLat}
          shortestCityLabel={shortestDayCity}
          shortestLat={shortestDayLat}
        />
      </div>

    </div>
  );
}

function EarthViz({ longestCityLabel, longestLat, shortestCityLabel, shortestLat }: {
  longestCityLabel: string;
  longestLat: string;
  shortestCityLabel: string;
  shortestLat: string;
}) {
  const w = 200;
  const h = 280;
  // Globe circle: large, partially cropped on right
  const gx = 130; // center x (pushed right so it bleeds off edge)
  const gy = 140; // center y
  const gr = 150; // radius

  // City dots
  // Longest (Tromsø) ~69°N → upper area of globe
  const longestY = gy - gr * 0.62;
  const longestX = gx - gr * 0.35;
  // Shortest (Ushuaia) ~54°S → lower area
  const shortestY = gy + gr * 0.48;
  const shortestX = gx - gr * 0.28;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        {/* Globe base gradient */}
        <radialGradient id="globeBase" cx="38%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#0d2240"/>
          <stop offset="60%" stopColor="#071425"/>
          <stop offset="100%" stopColor="#03080f"/>
        </radialGradient>
        {/* Blue rim glow (left edge) */}
        <radialGradient id="rimBlue" cx="20%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#4a7aff" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#4a7aff" stopOpacity="0"/>
        </radialGradient>
        {/* Amber glow (lower right) */}
        <radialGradient id="rimAmber" cx="80%" cy="75%" r="50%">
          <stop offset="0%" stopColor="#f0a050" stopOpacity="0.16"/>
          <stop offset="100%" stopColor="#f0a050" stopOpacity="0"/>
        </radialGradient>
        {/* City lights scatter */}
        <radialGradient id="cityLights" cx="45%" cy="48%" r="50%">
          <stop offset="0%" stopColor="#ffe8a0" stopOpacity="0.07"/>
          <stop offset="100%" stopColor="#ffe8a0" stopOpacity="0"/>
        </radialGradient>
        {/* Clip to globe circle */}
        <clipPath id="globeClip">
          <circle cx={gx} cy={gy} r={gr}/>
        </clipPath>
        {/* Glow filter */}
        <filter id="cityGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="dotGlow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Globe base */}
      <circle cx={gx} cy={gy} r={gr} fill="url(#globeBase)"/>

      {/* Internal layers (clipped) */}
      <g clipPath="url(#globeClip)">
        <circle cx={gx} cy={gy} r={gr} fill="url(#rimBlue)"/>
        <circle cx={gx} cy={gy} r={gr} fill="url(#rimAmber)"/>
        <circle cx={gx} cy={gy} r={gr} fill="url(#cityLights)"/>

        {/* Subtle continent silhouettes as abstract patches */}
        <ellipse cx={gx - 55} cy={gy - 30} rx={30} ry={20} fill="rgba(255,255,255,0.025)" transform="rotate(-15, 75, 110)"/>
        <ellipse cx={gx - 25} cy={gy + 40} rx={22} ry={14} fill="rgba(255,255,255,0.02)"/>
        <ellipse cx={gx - 70} cy={gy + 20} rx={14} ry={22} fill="rgba(255,255,255,0.02)"/>
        <ellipse cx={gx + 10} cy={gy - 50} rx={18} ry={10} fill="rgba(255,255,255,0.02)" transform="rotate(25, 140, 90)"/>

        {/* Tiny city-light dots */}
        {[
          [gx-45, gy-22, 1.2], [gx-38, gy-18, 0.9], [gx-50, gy-10, 0.8],
          [gx-20, gy+35, 1.0], [gx-28, gy+42, 0.8], [gx-15, gy+28, 0.7],
          [gx-60, gy+18, 0.9], [gx-65, gy+28, 0.7], [gx+5, gy-45, 0.8],
          [gx-10, gy-40, 1.0], [gx-30, gy-55, 0.7], [gx-42, gy+55, 0.8],
        ].map(([cx2, cy2, s], i) => (
          <circle key={i} cx={cx2} cy={cy2} r={s} fill="#ffe8a0" opacity={0.5} filter="url(#cityGlow)"/>
        ))}
      </g>

      {/* Globe border with rim glow */}
      <circle cx={gx} cy={gy} r={gr} fill="none" stroke="rgba(80,130,220,0.22)" strokeWidth={2}/>
      {/* Left rim highlight */}
      <path
        d={`M ${gx + gr * Math.cos(Math.PI * 0.6)} ${gy + gr * Math.sin(Math.PI * 0.6)} 
            A ${gr} ${gr} 0 0 1 ${gx + gr * Math.cos(Math.PI * 1.4)} ${gy + gr * Math.sin(Math.PI * 1.4)}`}
        fill="none"
        stroke="rgba(100,160,255,0.35)"
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* Dotted latitude arc */}
      <ellipse cx={gx} cy={gy} rx={gr} ry={gr * 0.28}
        fill="none"
        stroke="rgba(167,166,255,0.18)"
        strokeWidth={1}
        strokeDasharray="3 6"
        transform={`rotate(-10 ${gx} ${gy})`}
      />

      {/* Connecting lines from dots to labels */}
      <line x1={longestX} y1={longestY} x2={longestX - 8} y2={longestY - 36}
        stroke="rgba(200,230,162,0.4)" strokeWidth={1} strokeDasharray="2 3"/>
      <line x1={shortestX} y1={shortestY} x2={shortestX - 8} y2={shortestY + 36}
        stroke="rgba(240,179,111,0.4)" strokeWidth={1} strokeDasharray="2 3"/>

      {/* Longest day city dot (green) */}
      <circle cx={longestX} cy={longestY} r={7} fill="#c8e6a2" opacity={0.15} filter="url(#dotGlow)"/>
      <circle cx={longestX} cy={longestY} r={4} fill="#c8e6a2" opacity={0.7}/>
      <circle cx={longestX} cy={longestY} r={2} fill="#e8ffcc"/>

      {/* Longest city label */}
      <text x={longestX - 10} y={longestY - 42} textAnchor="middle"
        fontSize="8" fontWeight="600" letterSpacing="0.1em" fill="#c8e6a2"
        fontFamily="Inter, sans-serif" opacity={0.85}>
        {longestCityLabel.toUpperCase()}
      </text>
      <text x={longestX - 10} y={longestY - 30} textAnchor="middle"
        fontSize="8" fill="#8d96a8" fontFamily="Inter, sans-serif">
        {longestLat}
      </text>

      {/* Shortest day city dot (amber) */}
      <circle cx={shortestX} cy={shortestY} r={7} fill="#f0b36f" opacity={0.15} filter="url(#dotGlow)"/>
      <circle cx={shortestX} cy={shortestY} r={4} fill="#f0b36f" opacity={0.7}/>
      <circle cx={shortestX} cy={shortestY} r={2} fill="#ffe4b8"/>

      {/* Shortest city label */}
      <text x={shortestX - 8} y={shortestY + 46} textAnchor="middle"
        fontSize="8" fontWeight="600" letterSpacing="0.1em" fill="#f0b36f"
        fontFamily="Inter, sans-serif" opacity={0.85}>
        {shortestCityLabel.toUpperCase()}
      </text>
      <text x={shortestX - 8} y={shortestY + 58} textAnchor="middle"
        fontSize="8" fill="#8d96a8" fontFamily="Inter, sans-serif">
        {shortestLat}
      </text>
    </svg>
  );
}
