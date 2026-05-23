'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocation } from '@/lib/locationContext';

const tabs = [
  { label: 'Today', href: '/today' },
  { label: 'Week', href: '/week' },
  { label: 'Year', href: '/year' },
];

export default function Nav() {
  const pathname = usePathname();
  const { city } = useLocation();

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <nav style={{ borderBottom: '1px solid var(--divider)' }} className="w-full flex items-center justify-between px-6 md:px-10 py-4">
      {/* Logo */}
      <Link href="/today" className="flex items-center gap-2 transition-opacity hover:opacity-80">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '14px', letterSpacing: '0.02em' }}>
          WhatToday
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
