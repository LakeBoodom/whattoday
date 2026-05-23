import type { Metadata } from 'next';
import WeekClient from './WeekClient';

export const metadata: Metadata = {
  title: 'WhatToday — What Week Is It?',
  description: 'Current week number, week progress, and week flow visualization. See exactly where you are in the week.',
  openGraph: {
    title: 'WhatToday — What Week Is It?',
    description: 'Current week number and week progress at a glance.',
    url: 'https://whattoday.org/week',
  },
};

export default function WeekPage() {
  return <WeekClient />;
}
