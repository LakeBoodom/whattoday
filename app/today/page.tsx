import type { Metadata } from 'next';
import TodayClient from './TodayClient';
import OnThisDay from '@/components/OnThisDay';

// Force server-side rendering so API calls happen at request time, not build time.
// Individual fetch calls below cache results via Next.js Data Cache (24h TTL).
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'WhatToday — What Day Is It Today?',
  description: "See today's date, day of the year, week number, days remaining, and how far through the day you are. A calm perspective on time.",
  openGraph: {
    title: 'WhatToday — What Day Is It Today?',
    description: 'Day progress, year arc, week flow. A calm view of time.',
    url: 'https://whattoday.org/today',
  },
};

export default function TodayPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const year = now.getFullYear();

  return (
    <TodayClient
      onThisDay={
        <OnThisDay
          month={month}
          day={day}
          year={year}
          // userCountryCode can be added later via middleware/geolocation header
        />
      }
    />
  );
}
