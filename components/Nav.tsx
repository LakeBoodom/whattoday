'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocation } from '@/lib/locationContext';

const tabs = [
  { label: 'Today', href: '/today' },
  { label: 'Week', href: '/week' },
  { label: 'Year', href: '/year' },
];

function WhatTodayLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left arc */}
      <path d="M13 6 C7 8.5 7 23.5 13 26" stroke="#9B8BE8" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      {/* Right arc */}
      <path d="M19 6 C25 8.5 25 23.5 19 26" stroke="#F6C66A" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      {/* Vertical center line */}
      <line x1="16" y1="5" x2="16" y2="11" stroke="#F6C66A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="16" y1="21" x2="16" y2="27" stroke="#F6C66A" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Top dot */}
      <circle cx="16" cy="4.5" r="1.5" fill="#F6C66A"/>
      {/* Bottom dot */}
      <circle cx="16" cy="27.5" r="1.5" fill="#F6C66A"/>
      {/* Center dot */}
      <circle cx="16" cy="16" r="2.2" fill="#F6C66A"/>
    </svg>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const { city } = useLocation();

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <nav style={{ borderBottom: '1px solid var(--divider)' }} className="w-full flex items-center justify-between px-6 md:px-10 py-4">
      {/* Logo */}
      <Link href="/today" className="flex items-center gap-2 transition-opacity hover:opacity-80">
        <WhatTodayLogo />
        <span style={{ fontSize: '15px', letterSpacing: '0.01em', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: 400 }}>What</span>
          <span style={{ color: 'var(--accent-gold)', fontWeight: 400 }}>Today</span>
        </span>
      </Link>

      {/* Tabs */}
      <div className="flex items-center gap-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (pathname === '/' && tab.href === '/today');
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                color: isActive ? 'var(--text-primary)' : 'var(--text-faint)',
                fontSize: '14px',
                fontWeight: isActive ? 500 : 400,
                padding: '6px 16px',
                borderBottom: isActive ? '2px solid var(--accent-gold)' : '2px solid transparent',
                transition: 'all 220ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              className="hover:opacity-80"
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Right — city + time */}
      <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-faint)' }}>
        {city && (
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {city}
          </span>
        )}
        <span>{timeStr}</span>
      </div>
    </nav>
  );
}
