'use client';

import { useState, useEffect } from 'react';
import { computeDateStats, SEASON_INFO } from '@/lib/dateUtils';
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

function YearArcLarge({ progress, year }: { progress: number; year: string }) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.37;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - progress / 100);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="yearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F6C66A" />
          <stop offset="100%" stopColor="#9B8BE8" />
        </linearGradient>
        <filter id="yearGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(127,167,232,0.10)" strokeWidth={16} />

      {/* Month markers */}
      {months.map((m, i) => {
        const angle = ((i / 12) * 360 - 90) * (Math.PI / 180);
        const markerR = r + 20;
        const mx = cx + markerR * Math.cos(angle);
        const my = cy + markerR * Math.sin(angle);
        const monthIdx = i; // 0-11
        const isPast = monthIdx < new Date().getMonth();
        const isCurrent = monthIdx === new Date().getMonth();
        return (
          <text
            key={m}
            x={mx} y={my}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="7.5"
            fill={isCurrent ? 'var(--accent-gold)' : isPast ? 'var(--text-muted)' : 'var(--text-faint)'}
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight={isCurrent ? '600' : '400'}
          >
            {m}
          </text>
        );
      })}

      {/* Progress arc */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="url(#yearGrad)"
        strokeWidth={16}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        filter="url(#yearGlow)"
        opacity={0.92}
      />

      {/* Center: percentage */}
      <text
        x={cx} y={cy - 14}
        textAnchor="middle" dominantBaseline="middle"
        fontSize="38" fill="var(--text-primary)" fontWeight="300"
        fontFamily="'Cormorant Garamond', Georgia, serif"
      >
        {Math.round(progress)}%
      </text>
      <text
        x={cx} y={cy + 16}
        textAnchor="middle" dominantBaseline="middle"
        fontSize="11" fill="var(--text-muted)"
        fontFamily="Inter, system-ui, sans-serif"
      >
        of {year} completed
      </text>
    </svg>
  );
}

function MonthStrip({ currentMonth }: { currentMonth: number }) {
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const fullNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {months.map((m, i) => {
        const isPast = i < currentMonth;
        const isCurrent = i === currentMonth;
        return (
          <div
            key={i}
            title={fullNames[i]}
            style={{
              flex: 1,
              height: 28,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontFamily: 'Inter, sans-serif',
              fontWeight: isCurrent ? 600 : 400,
              background: isCurrent
                ? 'rgba(246,198,106,0.18)'
                : isPast
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(255,255,255,0.03)',
              border: isCurrent ? '1px solid rgba(246,198,106,0.35)' : '1px solid transparent',
              color: isCurrent
                ? 'var(--accent-gold)'
                : isPast
                ? 'var(--text-muted)'
                : 'var(--text-faint)',
              transition: 'all 220ms',
            }}
          >
            {m}
          </div>
        );
      })}
    </div>
  );
}

export default function YearClient() {
  const [now, setNow] = useState(new Date());
  const { latitude } = useLocation();

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const stats = computeDateStats(now, latitude);
  const seasonInfo = SEASON_INFO[stats.season];

  const currentMonth = now.getMonth();
  const daysInMonth = new Date(now.getFullYear(), currentMonth + 1, 0).getDate();
  const monthProgress = Math.round((now.getDate() / daysInMonth) * 100);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, paddingTop: 32, paddingBottom: 64, paddingLeft: 16, paddingRight: 16 }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: 680, width: '100%' }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'Inter, system-ui, sans-serif' }}>
          Year in view
        </p>
        <h1 className="hero-date">{stats.yearString}</h1>
      </div>

      {/* Main layout: arc + right column */}
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 20, width: '100%', maxWidth: 900, justifyContent: 'center', alignItems: 'flex-start' }}>

        {/* Year Arc card */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 24px' }}>
          <p className="wt-label">Year Arc</p>
          <YearArcLarge progress={stats.yearProgress} year={stats.yearString} />
          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, fontSize: 13, alignSelf: 'stretch' }}>
            {[
              { color: '#F6C66A', label: `${stats.dayOfYear} days passed` },
              { color: '#7FA7E8', label: `${stats.daysRemaining} days remaining` },
              { color: '#9B8BE8', label: `${stats.weekendsRemaining} weekends left` },
            ].map(({ color, label }) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>{label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, minWidth: 240, maxWidth: 340 }}>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Day of year', value: stats.dayOfYear, sub: `of ${stats.daysInYear}` },
              { label: 'Week', value: stats.weekNumber, sub: 'of 52' },
              { label: 'Month', value: currentMonth + 1, sub: 'of 12' },
              { label: 'Weekends left', value: stats.weekendsRemaining, sub: 'this year' },
            ].map(({ label, value, sub }) => (
              <div key={label} style={{
                background: 'rgba(13,27,48,0.6)',
                border: '1px solid var(--border-soft)',
                borderRadius: 14,
                padding: '14px 16px',
                backdropFilter: 'blur(12px)',
              }}>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)', fontFamily: 'Inter, sans-serif', margin: '0 0 6px' }}>{label}</p>
                <p style={{ fontSize: 26, fontWeight: 300, color: 'var(--text-primary)', fontFamily: "'Cormorant Garamond', Georgia, serif", lineHeight: 1, margin: '0 0 4px' }}>{value}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif', margin: 0 }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Current month progress */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <p className="wt-label" style={{ margin: 0 }}>{monthNames[currentMonth]}</p>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>Day {now.getDate()} of {daysInMonth}</span>
            </div>
            <div style={{ width: '100%', height: 5, background: 'rgba(127,167,232,0.12)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${monthProgress}%`,
                background: 'linear-gradient(90deg, #F6C66A, #9B8BE8)',
                borderRadius: 3,
              }} />
            </div>
          </div>

          {/* Seasonal Context */}
          <div style={cardStyle}>
            <p className="wt-label">Seasonal Context</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(246,198,106,0.1)', border: '1px solid rgba(246,198,106,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                {seasonInfo.emoji}
              </div>
              <div>
                <p style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 15, fontFamily: 'Inter, sans-serif', margin: '0 0 2px' }}>{seasonInfo.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'Inter, sans-serif', margin: 0 }}>{seasonInfo.next} begins in {stats.daysToNextSeason} days</p>
              </div>
            </div>
          </div>

          {/* Year at a glance — month strip */}
          <div style={cardStyle}>
            <p className="wt-label">Year at a Glance</p>
            <MonthStrip currentMonth={currentMonth} />
          </div>
        </div>
      </div>
    </div>
  );
}
