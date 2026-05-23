'use client';

import { useState, useEffect, ReactNode } from 'react';
import DayProgressRing from '@/components/DayProgressRing';
import { computeDateStats, SEASON_INFO } from '@/lib/dateUtils';
import { getDailyQuote } from '@/lib/quotes';
import { useLocation } from '@/lib/locationContext';

function StatPill({ icon, value, label }: { icon: ReactNode; value: string | number; label: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'rgba(13,27,48,0.6)',
      border: '1px solid var(--border-soft)',
      borderRadius: 'var(--radius-pill)',
      padding: '6px 16px',
      backdropFilter: 'blur(12px)',
    }}>
      <span style={{ color: 'var(--text-faint)' }}>{icon}</span>
      <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 14 }}>{value}</span>
      <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{label}</span>
    </div>
  );
}

function CalIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function WeekIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function TimerIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 3h14M6 3v4l-2 2 2 2v4a6 6 0 0 0 12 0v-4l2-2-2-2V3"/></svg>;
}
function HeartIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}

// Mini year arc
function MiniArc({ progress }: { progress: number }) {
  const size = 88;
  const cx = size / 2, cy = size / 2, r = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="miniArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F6C66A" />
          <stop offset="100%" stopColor="#9B8BE8" />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(127,167,232,0.12)" strokeWidth={9} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#miniArcGrad)" strokeWidth={9}
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`} opacity={0.9} />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
        fontSize="13" fill="var(--text-primary)" fontWeight="300"
        fontFamily="'Cormorant Garamond', Georgia, serif">
        {Math.round(progress)}%
      </text>
    </svg>
  );
}

// Mini week flow
function WeekFlowMini({ dayOfWeek }: { dayOfWeek: number }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const yOffsets = [0, -4, 2, -3, -6, 2, 4];

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', position: 'relative', paddingBottom: 4 }}>
      {days.map((d, i) => {
        const isPast = i < todayIdx;
        const isToday = i === todayIdx;
        return (
          <div key={d} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transform: `translateY(${yOffsets[i]}px)` }}>
            <div style={{
              width: isToday ? 18 : 10,
              height: isToday ? 18 : 10,
              borderRadius: '50%',
              background: isToday
                ? 'radial-gradient(circle, #F6C66A 0%, #9B6A2E 100%)'
                : isPast
                ? 'rgba(246,198,106,0.4)'
                : 'rgba(127,167,232,0.2)',
              boxShadow: isToday ? '0 0 20px rgba(246,198,106,0.5)' : undefined,
              border: isToday ? '1.5px solid rgba(255,255,255,0.3)' : undefined,
              transition: 'all 220ms cubic-bezier(0.22,1,0.36,1)',
            }} />
            <span style={{
              fontSize: 10,
              color: isToday ? 'var(--text-secondary)' : 'var(--text-faint)',
              fontWeight: isToday ? 500 : 400,
            }}>{d}</span>
            {isToday && <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>here</span>}
          </div>
        );
      })}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(21,36,61,0.78), rgba(10,23,42,0.78))',
  border: '1px solid var(--border-card)',
  borderRadius: 'var(--radius-card)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.22)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  padding: '18px 20px',
};

export default function TodayClient({ onThisDay }: { onThisDay?: ReactNode }) {
  const [now, setNow] = useState(new Date());
  const { latitude } = useLocation();

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = computeDateStats(now, latitude);
  const quote = getDailyQuote(now);
  const seasonInfo = SEASON_INFO[stats.season];
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, paddingTop: 32, paddingBottom: 64, paddingLeft: 16, paddingRight: 16 }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', maxWidth: 680, width: '100%' }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'Inter, system-ui, sans-serif' }}>
          {dayName}
        </p>
        <h1 className="hero-date">{monthDay}</h1>
      </div>

      {/* Stat pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        <StatPill icon={<CalIcon />} value={`Day ${stats.dayOfYear}`} label="of the year" />
        <StatPill icon={<WeekIcon />} value={`Week ${stats.weekNumber}`} label="" />
        <StatPill icon={<TimerIcon />} value={stats.daysRemaining} label="days remaining" />
        <StatPill icon={<HeartIcon />} value={stats.weekendsRemaining} label="weekends left" />
      </div>

      {/* Main layout */}
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 20, width: '100%', maxWidth: 900, justifyContent: 'center', alignItems: 'flex-start' }}>

        {/* Day Progress */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 24px' }}>
          <p className="wt-label">Day Progress</p>
          <DayProgressRing progress={stats.dayProgress} timeString={stats.timeString} size={300} />
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, minWidth: 240, maxWidth: 340 }}>

          {/* Week Flow */}
          <div style={cardStyle}>
            <p className="wt-label">Week Flow</p>
            <WeekFlowMini dayOfWeek={stats.dayOfWeek} />
          </div>

          {/* Year Arc */}
          <div style={cardStyle}>
            <p className="wt-label">Year Arc</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <MiniArc progress={stats.yearProgress} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                {[
                  { color: '#F6C66A', label: `${stats.dayOfYear} days passed` },
                  { color: '#7FA7E8', label: `${stats.daysRemaining} days remaining` },
                  { color: '#9B8BE8', label: `${stats.weekendsRemaining} weekends left` },
                ].map(({ color, label }) => (
                  <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Seasonal Context */}
          <div style={cardStyle}>
            <p className="wt-label">Seasonal Context</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(246,198,106,0.1)', border: '1px solid rgba(246,198,106,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                {seasonInfo.emoji}
              </div>
              <div>
                <p style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: 15 }}>{seasonInfo.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>{seasonInfo.next} begins in {stats.daysToNextSeason} days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* On This Day */}
      {onThisDay && (
        <div style={{ width: '100%', maxWidth: 900 }}>
          {onThisDay}
        </div>
      )}

      {/* Quote */}
      <div style={{ textAlign: 'center', maxWidth: 480, paddingTop: 8 }}>
        <p className="wt-quote">&ldquo;{quote}&rdquo;</p>
      </div>
    </div>
  );
}
