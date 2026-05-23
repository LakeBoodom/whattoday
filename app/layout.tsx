import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import { LocationProvider } from '@/lib/locationContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'WhatToday — A Calm Perspective on Time',
    template: '%s | WhatToday',
  },
  description: "See today's date, day of the year, week number, year arc, and seasonal context. A calm, beautiful view of time.",
  keywords: ['what day is it', 'day of the year', 'week number', 'year progress', 'days remaining in year', 'what week is it'],
  metadataBase: new URL('https://whattoday.org'),
  openGraph: {
    type: 'website',
    siteName: 'WhatToday',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <LocationProvider>
          <div className="min-h-screen flex flex-col">
            <Nav />
            <main className="flex-1 max-w-5xl mx-auto w-full">
              {children}
            </main>
            <footer className="w-full flex justify-center py-6 border-t text-xs" style={{ borderColor: 'var(--divider)', color: 'var(--text-faint)' }}>
              WhatToday &mdash; a calm perspective on time
            </footer>
          </div>
        </LocationProvider>
      </body>
    </html>
  );
}
