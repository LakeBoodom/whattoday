import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the WhatToday team.',
};

export default function ContactPage() {
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
        Contact
      </h1>
      <p style={{ color: 'var(--text-faint)', fontSize: '13px', marginBottom: '2.5rem' }}>
        We&apos;d love to hear from you.
      </p>

      <section style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-muted)' }}>
          WhatToday is a small, independent project. If you have questions, feedback, bug reports,
          or partnership enquiries, please reach out — we read every message.
        </p>
      </section>

      <section
        style={{
          border: '1px solid var(--border-card)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          background: 'var(--bg-card)',
        }}
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            General enquiries &amp; feedback
          </p>
          <span style={{ fontSize: '15px', color: 'var(--accent-gold)', fontWeight: 500 }}>
            heikki [at] stanssi.fi
          </span>
        </div>
        <div>
          <p style={{ fontSize: '11px', letterSpacing: '0.08em', color: 'var(--text-faint)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            Privacy &amp; data questions
          </p>
          <span style={{ fontSize: '15px', color: 'var(--accent-gold)', fontWeight: 500 }}>
            heikki [at] stanssi.fi
          </span>
        </div>
      </section>

      <section>
        <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-faint)' }}>
          WhatToday is built and maintained by a solo developer. Response times are typically within
          a few business days.
        </p>
      </section>
    </div>
  );
}
