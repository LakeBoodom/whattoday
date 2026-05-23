import type { Metadata } from 'next';
import YearClient from './YearClient';

export const metadata: Metadata = {
  title: 'WhatToday — What Day of the Year Is It?',
  description: 'See what day of the year it is, how many days are remaining, the year arc, and your current season. A calm perspective on the year.',
  openGraph: {
    title: 'WhatToday — What Day of the Year Is It?',
    description: 'Year arc, days remaining, and season — all at a glance.',
    url: 'https://whattoday.org/year',
  },
};

export default function YearPage() {
  return <YearClient />;
}
