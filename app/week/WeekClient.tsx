'use client';

import { useState, useEffect } from 'react';
import { computeDateStats } from '@/lib/dateUtils';
import { useLocation } from '@/lib/locationContext';

const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(21,36,61,0.78), rgba(10,23,42,0.78))',
  border: '1px solid var(--border-card)',
  borderRadius: 'var(--radius-card)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.22)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  padding: '20px 22px',
};

// Smooth Catmull-Rom SVG path
function catmullRomPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function WeekFlowFull({ todayIdx }: { todayIdx: number }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const w = 500;
  const h = 140;
  const pad = 36;
  const spacing = (w - pad * 2) / 6;
  const yOffsets = [0, -8, 6, -5, -12, 4, 8];
  const baseY = 68;

  const points = days.map((_, i) => ({
    x: pad + i * spacing,
    y: baseY + yOffsets[i],
  }));

  const pastPoints = points.slice(0, todayIdx + 1);

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ overflow: 'visible', display: 'block' }}>
        <defs>
          <linearGradient id="weekLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F6C66A" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F6C66A" stopOpacity="0.85" />
          </linearGradient>
          <filter id="dayGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Full week line — faint */}
        <path d={catmullRomPath(points)} fill="none" stroke="rgba(127,167,232,0.12)" strokeWidth="1.5" />

        {/* Past + today line — gold */}
        {pastPoints.length > 1 && (
          <path d={catmullRomPath(pastPoints)} fill="none" stroke="url(#weekLineGrad)" strokeWidth="2" />
        )}

        {/* Day dots */}
        {points.map((pt, i) => {
          const isPast = i < todayIdx;
          const isToday = i === todayIdx;
          return (
            <g key={i}>
              <circle
                cx={pt.x} cy={pt.y}
                r={isToday ? 11 : 6}
                fill={
                  isToday
                    ? 'radial-gradient(circle, #F6C66A 0%, #9B6A2E 100%)'
                    : isPast
                    ? 'rgba(246,198,106,0.38)'
                    : 'rgba(127,167,232,0.18)'
                }
                stroke={isToday ? 'rgba(255,255,255,0.28)' : 'none'}
                strokeWidth={isToday ? 1.5 : 0}
                filter={isToday ? 'url(#dayGlow)' : undefined}
              />
              {/* Today uses a filled gold circle drawn on top for the gradient effect */}
              {isToday && (
                <circle
                  cx={pt.x} cy={pt.y}
                  r={11}
                  fill="none"
                  stroke="rgba(246,198,106,0.5)"
                  strokeWidth="1.5"
                />
              )}
              {isToday && (
                <circle cx={pt.x} cy={pt.y} r={7} fill="#F6C66A" opacity={0.9} />
              )}

              {/* Day label */}
              <text
                x={pt.x} y={pt.y - 20}
                textAnchor="middle"
                fontSize="11"
                fill={isToday ? 'var(--text-secondary)' : 'var(--text-faint)'}
                fontWeight={isToday ? '500' : '400'}
                fontFamily="Inter, system-ui, sans-serif"
              >
                {days[i]}
              </text>

              {isToday && (
                <text
                  x={pt.x} y={pt.y + 24}
                  textAnchor="middle"
                  fontSize="9"
                  fill="var(--text-muted)"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  here
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function StatPill({ label, value, sub }: { label: string; value: string | number; sub: string }) {
  return (
    <div style={{
      background: 'rgba(13,27,48,0.6)',
      border: '1px solid var(--border-soft)',
      borderRadius: 'var(--radius-pill)',
      padding: '14px 20px',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      flex: 1,
      minWidth: 100,
    }}>
      <span style={{ color: 'var(--text-faint)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>{label}</span>
      <span style={{ color: 'var(--text-primary)', fontSize: 28, fontWeight: 300, fontFamily: "'Cormorant Garamond', Georgia, serif", lineHeight: 1 }}>{value}</span>
      {sub && <span style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>{sub}</span>}
    </div>
  );
}

export default function WeekClient() {
  const [now, setNow] = useState(new Date());
  const { latitude } = useLocation();

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const stats = computeDateStats(now, latitude);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIdx = stats.dayOfWeek === 0 ? 6 : stats.dayOfWeek - 1;
  const daysDone = todayIdx + 1;
  const daysLeft = 7 - daysDone;
  const weekPct = Math.round(stats.weekProgress);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, paddingTop: 32, paddingBottom: 64, paddingLeft: 16, paddingRight: 16 }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: 680, width: '100%' }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'Inter, system-ui, sans-serif' }}>
          Current week
        </p>
        <h1 className="hero-date">Week {stats.weekNumber}</h1>
        <p style={{ color: 'var(--text-faint)', marginTop: 8, fontSize: 14, fontFamily: 'Inter, sans-serif' }}>of {stats.yearString}</p>
      </div>

      {/* Stat pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', width: '100%', maxWidth: 700 }}>
        <StatPill label="Week" value={stats.weekNumber} sub="of 52" />
        <StatPill label="Today" value={days[todayIdx]} sub={`day ${daysDone} of 7`} />
        <StatPill label="Days done" value={daysDone} sub="this week" />
        <StatPill label="Days left" value={daysLeft} sub="remaining" />
      </div>

      {/* Week Flow card */}
      <div style={{ ...cardStyle, width: '100%', maxWidth: 700 }}>
        <p className="wt-label">Week Flow</p>
        <WeekFlowFull todayIdx={todayIdx} />
      </div>

      {/* Week Progress bar card */}
      <div style={{ ...cardStyle, width: '100%', maxWidth: 700 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p className="wt-label" style={{ margin: 0 }}>Week Progress</p>
          <span style={{ color: 'var(--text-secondary)', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>{weekPct}%</span>
        </div>
        {/* Progress bar */}
        <div style={{ width: '100%', height: 6, background: 'rgba(127,167,232,0.12)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${weekPct}%`,
            background: 'linear-gradient(90deg, #F6C66A, #9B8BE8)',
            borderRadius: 3,
            transition: 'width 600ms cubic-bezier(0.22,1,0.36,1)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--text-faint)', fontFamily: 'Inter, sans-serif' }}>
          <span>Mon</span>
          <span>Sun</span>
        </div>
      </div>
    </div>
  );
}
