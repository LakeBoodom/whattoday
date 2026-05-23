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
    <div style={{
      background: 'linear-gradient(145deg, #07111f, #0d1a2b)',
      border: '1px solid rgba(120,145,190,0.22)',
      borderRadius: 32,
      boxShadow: '0 30px 80px rgba(0,0,0,.35)',
      padding: '32px 28px',
      width: '100%',
    }}>
      {/* Section label */}
      <p style={{ ...labelStyle, color: 'var(--text-faint)', marginBottom: 20 }}>
        Today on Earth
      </p>

      {/* Hero headline */}
      <h2 style={{
        fontSize: 'clamp(24px, 5vw, 34px)',
        fontWeight: 300,
        lineHeight: 1.2,
        color: '#e7e8ee',
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        marginBottom: 10,
      }}>
        Today exists<br/>differently<br/>across Earth.
      </h2>

      {/* Subtext */}
      <p style={{
        fontSize: 13,
        color: '#8d96a8',
        lineHeight: 1.6,
        fontFamily: 'Inter, sans-serif',
        marginBottom: 24,
      }}>
        Different places. Different light. One shared today.
      </p>

      {/* Mobile: globe centered between headline and data points */}
      {/* Desktop: globe on the right in a row */}
      <div className="flex flex-col md:flex-row md:items-start md:gap-8">

        {/* Left text column */}
        <div className="flex-1 min-w-0">

          {/* Globe — mobile only (between text and data points) */}
          <div className="flex justify-center mb-6 md:hidden" aria-hidden="true">
            <EarthViz
              longestCityLabel={longestDayCity}
              longestLat={longestDayLat}
              shortestCityLabel={shortestDayCity}
              shortestLat={shortestDayLat}
              size={220}
            />
          </div>

          {/* Data points — 2-column grid on mobile, stacked on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-5 mb-6">
            {/* Longest day */}
            <div>
              <span style={{ ...labelStyle, color: '#c8e6a2', opacity: 0.85 }}>
                ☀ Today&apos;s Longest Day
              </span>
              <p style={{
                fontSize: 16,
                fontWeight: 300,
                color: '#e7e8ee',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                marginBottom: 2,
                lineHeight: 1.3,
              }}>
                {longestDayCity},<br className="md:hidden" /> {longestDayCountry}
              </p>
              <p style={{ fontSize: 14, color: '#c8e6a2', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
                {longestDayDuration}
              </p>
            </div>

            {/* Shortest day */}
            <div>
              <span style={{ ...labelStyle, color: '#f0b36f', opacity: 0.85 }}>
                ☽ Today&apos;s Shortest Day
              </span>
              <p style={{
                fontSize: 16,
                fontWeight: 300,
                color: '#e7e8ee',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                marginBottom: 2,
                lineHeight: 1.3,
              }}>
                {shortestDayCity},<br className="md:hidden" /> {shortestDayCountry}
              </p>
              <p style={{ fontSize: 14, color: '#f0b36f', fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300 }}>
                {shortestDayDuration}
              </p>
            </div>
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

        {/* Globe — desktop only, on the right */}
        <div className="hidden md:flex md:flex-shrink-0 md:items-center" aria-hidden="true">
          <EarthViz
            longestCityLabel={longestDayCity}
            longestLat={longestDayLat}
            shortestCityLabel={shortestDayCity}
            shortestLat={shortestDayLat}
            size={260}
          />
        </div>
      </div>
    </div>
  );
}

function EarthViz({ longestCityLabel, longestLat, shortestCityLabel, shortestLat, size = 200 }: {
  longestCityLabel: string;
  longestLat: string;
  shortestCityLabel: string;
  shortestLat: string;
  size?: number;
}) {
  const w = size;
  const h = size * 1.3;
  const scale = size / 200;
  const gr = 100 * scale;
  const gx = w * 0.58;
  const gy = h * 0.5;

  const longestY = gy - gr * 0.58;
  const longestX = gx - gr * 0.38;
  const shortestY = gy + gr * 0.45;
  const shortestX = gx - gr * 0.28;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id={`globeBase-${size}`} cx="38%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#0d2240"/>
          <stop offset="60%" stopColor="#071425"/>
          <stop offset="100%" stopColor="#03080f"/>
        </radialGradient>
        <radialGradient id={`rimBlue-${size}`} cx="20%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#4a7aff" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#4a7aff" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`rimAmber-${size}`} cx="80%" cy="75%" r="50%">
          <stop offset="0%" stopColor="#f0a050" stopOpacity="0.16"/>
          <stop offset="100%" stopColor="#f0a050" stopOpacity="0"/>
        </radialGradient>
        <clipPath id={`globeClip-${size}`}>
          <circle cx={gx} cy={gy} r={gr}/>
        </clipPath>
        <filter id={`dotGlow-${size}`}>
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <circle cx={gx} cy={gy} r={gr} fill={`url(#globeBase-${size})`}/>
      <g clipPath={`url(#globeClip-${size})`}>
        <circle cx={gx} cy={gy} r={gr} fill={`url(#rimBlue-${size})`}/>
        <circle cx={gx} cy={gy} r={gr} fill={`url(#rimAmber-${size})`}/>
        <ellipse cx={gx - 55 * scale} cy={gy - 30 * scale} rx={30 * scale} ry={20 * scale}
          fill="rgba(255,255,255,0.025)" transform={`rotate(-15, ${gx - 55 * scale}, ${gy - 30 * scale})`}/>
        <ellipse cx={gx - 25 * scale} cy={gy + 40 * scale} rx={22 * scale} ry={14 * scale}
          fill="rgba(255,255,255,0.02)"/>
        {[
          [gx - 45 * scale, gy - 22 * scale], [gx - 38 * scale, gy - 18 * scale],
          [gx - 20 * scale, gy + 35 * scale], [gx - 28 * scale, gy + 42 * scale],
          [gx - 60 * scale, gy + 18 * scale], [gx + 5 * scale, gy - 45 * scale],
        ].map(([cx2, cy2], i) => (
          <circle key={i} cx={cx2} cy={cy2} r={1.2 * scale} fill="#ffe8a0" opacity={0.5}/>
        ))}
      </g>
      <circle cx={gx} cy={gy} r={gr} fill="none" stroke="rgba(80,130,220,0.22)" strokeWidth={1.5}/>
      {/* Left rim glow */}
      <path
        d={`M ${gx + gr * Math.cos(Math.PI * 0.6)} ${gy + gr * Math.sin(Math.PI * 0.6)}
            A ${gr} ${gr} 0 0 1 ${gx + gr * Math.cos(Math.PI * 1.4)} ${gy + gr * Math.sin(Math.PI * 1.4)}`}
        fill="none" stroke="rgba(100,160,255,0.35)" strokeWidth={2.5} strokeLinecap="round"/>
      {/* Latitude arc */}
      <ellipse cx={gx} cy={gy} rx={gr} ry={gr * 0.28}
        fill="none" stroke="rgba(167,166,255,0.18)" strokeWidth={1}
        strokeDasharray="3 6" transform={`rotate(-10 ${gx} ${gy})`}/>

      {/* Connecting lines */}
      <line x1={longestX} y1={longestY} x2={longestX - 6 * scale} y2={longestY - 32 * scale}
        stroke="rgba(200,230,162,0.4)" strokeWidth={1} strokeDasharray="2 3"/>
      <line x1={shortestX} y1={shortestY} x2={shortestX - 6 * scale} y2={shortestY + 32 * scale}
        stroke="rgba(240,179,111,0.4)" strokeWidth={1} strokeDasharray="2 3"/>

      {/* Longest day dot */}
      <circle cx={longestX} cy={longestY} r={6 * scale} fill="#c8e6a2" opacity={0.15} filter={`url(#dotGlow-${size})`}/>
      <circle cx={longestX} cy={longestY} r={3.5 * scale} fill="#c8e6a2" opacity={0.75}/>
      <circle cx={longestX} cy={longestY} r={1.8 * scale} fill="#e8ffcc"/>
      <text x={longestX - 8 * scale} y={longestY - 37 * scale} textAnchor="middle"
        fontSize={7 * scale} fontWeight="600" letterSpacing="0.1em" fill="#c8e6a2"
        fontFamily="Inter, sans-serif" opacity={0.9}>{longestCityLabel.toUpperCase()}</text>
      <text x={longestX - 8 * scale} y={longestY - 26 * scale} textAnchor="middle"
        fontSize={7 * scale} fill="#8d96a8" fontFamily="Inter, sans-serif">{longestLat}</text>

      {/* Shortest day dot */}
      <circle cx={shortestX} cy={shortestY} r={6 * scale} fill="#f0b36f" opacity={0.15} filter={`url(#dotGlow-${size})`}/>
      <circle cx={shortestX} cy={shortestY} r={3.5 * scale} fill="#f0b36f" opacity={0.75}/>
      <circle cx={shortestX} cy={shortestY} r={1.8 * scale} fill="#ffe4b8"/>
      <text x={shortestX - 6 * scale} y={shortestY + 40 * scale} textAnchor="middle"
        fontSize={7 * scale} fontWeight="600" letterSpacing="0.1em" fill="#f0b36f"
        fontFamily="Inter, sans-serif" opacity={0.9}>{shortestCityLabel.toUpperCase()}</text>
      <text x={shortestX - 6 * scale} y={shortestY + 50 * scale} textAnchor="middle"
        fontSize={7 * scale} fill="#8d96a8" fontFamily="Inter, sans-serif">{shortestLat}</text>
    </svg>
  );
}
