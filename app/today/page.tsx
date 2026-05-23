import type { Metadata } from 'next';
import TodayClient from './TodayClient';
import OnThisDay from '@/components/OnThisDay';

// Revalidate page once per day — Wikipedia data is fresh every midnight
export const revalidate = 86400;

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
