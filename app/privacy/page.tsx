import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for WhatToday — how we handle your data.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12" style={{ color: 'var(--text-primary)' }}>
      <h1
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '2rem',
          fontWeight: 300,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
        }}
      >
        Privacy Policy
      </h1>
      <p style={{ color: 'var(--text-faint)', fontSize: '13px', marginBottom: '2.5rem' }}>
        Last updated: May 2025
      </p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.75rem' }}>Overview</h2>
        <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
          WhatToday (<strong>whattoday.org</strong>) is a free tool that shows you the date, week
          number, year progress, and seasonal context. We take your privacy seriously and collect as
          little data as possible.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.75rem' }}>
          Data We Collect
        </h2>
        <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
          <strong>Location (optional):</strong> If you allow it, we use your browser&apos;s
          geolocation API to determine your approximate city and latitude. This is used only to show
          you localised seasonal context and daylight data. Your location is never stored on our
          servers — it stays in your browser session only.
        </p>
        <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
          <strong>Analytics (anonymous):</strong> We use standard web analytics to understand how
          many visitors use the site and which pages are popular. This data is aggregated and does
          not identify individual users.
        </p>
        <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
          <strong>Advertising:</strong> We display ads via Google AdSense. Google may use cookies to
          show you relevant ads based on your browsing history. You can opt out at{' '}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-gold)', textDecoration: 'none' }}
          >
            adssettings.google.com
          </a>
          .
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.75rem' }}>Cookies</h2>
        <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
          WhatToday itself does not set any cookies. Google AdSense may set cookies for ad
          personalisation. You can manage cookie preferences in your browser settings.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.75rem' }}>
          Third-Party Services
        </h2>
        <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
          We use the following third-party services:
        </p>
        <ul style={{ fontSize: '14px', lineHeight: '1.9', color: 'var(--text-muted)', paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
          <li>
            <strong>Google AdSense</strong> — advertising (
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-gold)', textDecoration: 'none' }}
            >
              Privacy Policy
            </a>
            )
          </li>
          <li>
            <strong>Open-Meteo / public holiday APIs</strong> — to fetch weather and holiday data
            for your region. No personal data is sent.
          </li>
          <li>
            <strong>Vercel</strong> — hosting and edge delivery
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.75rem' }}>Your Rights</h2>
        <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
          Under GDPR and other applicable laws, you have the right to access, correct, or delete
          any personal data we hold about you. Because we do not store personal data on our servers,
          there is typically nothing to delete. For any questions, contact us at the address below.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.75rem' }}>Contact</h2>
        <p style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-muted)' }}>
          Privacy questions can be sent to{' '}
          <a
            href="mailto:hello@whattoday.org"
            style={{ color: 'var(--accent-gold)', textDecoration: 'none' }}
          >
            hello@whattoday.org
          </a>
          .
        </p>
      </section>
    </div>
  );
}
