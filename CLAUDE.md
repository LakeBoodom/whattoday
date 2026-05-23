# WhatToday — CLAUDE.md

## What This Project Is
WhatToday (whattoday.org) is a global time-awareness utility website. It shows users the current date in context: day progress, week flow, year arc, and seasonal context. Monetized via Google AdSense. SEO-driven traffic. Sibling project to howlongday.

## Tech Stack
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS
- No backend / no database — pure frontend utility
- Hosting: Vercel
- Analytics: Vercel Analytics (add when traffic grows)
- Monetization: Google AdSense (add to layout.tsx when approved)

## Project Structure
```
app/
  layout.tsx          — root layout, Nav, LocationProvider
  page.tsx            — redirects to /today
  globals.css         — dark theme base styles
  today/
    page.tsx          — SEO metadata
    TodayClient.tsx   — live Today view (client component)
  week/
    page.tsx          — SEO metadata
    WeekClient.tsx    — live Week view (client component)
  year/
    page.tsx          — SEO metadata
    YearClient.tsx    — live Year view (client component)
  sitemap.ts          — auto-generates sitemap.xml
  robots.ts           — auto-generates robots.txt
components/
  Nav.tsx             — top navigation bar
  DayProgressRing.tsx — SVG circular progress ring (Today view)
lib/
  dateUtils.ts        — all date/time calculations (pure functions)
  quotes.ts           — daily philosophical quotes
  locationContext.tsx — geolocation provider (client)
```

## Key Conventions
- All views are Client Components (need live clock tick)
- Date calculations are pure functions in lib/dateUtils.ts — easy to test
- LocationProvider wraps the entire app in layout.tsx
- SVG components are inline (no external charting lib needed)
- Tailwind only for styling — no custom CSS except globals.css

## Adding Google AdSense
When AdSense is approved:
1. Add the AdSense script to app/layout.tsx `<head>`
2. Replace the footer comment placeholder with real ad unit code
3. Consider adding a leaderboard (728×90) below the Nav for best RPM

## Environment Variables
None required — all data is computed client-side from browser Date API.

## SEO Notes
Key search queries to own:
- "what day of the year is it"
- "what week number is it"
- "how many days left in the year"
- "day of the year calculator"
- "days remaining in 2025"

Consider adding dedicated landing pages for high-volume queries:
- /day-of-the-year
- /week-number
- /days-left-in-year

## Current State
- What works: Today, Week, Year views; geolocation; dark UI
- In progress: —
- Known issues: —
- Next priorities:
  1. Deploy to Vercel + connect whattoday.org domain
  2. Add Google AdSense
  3. Add more SEO-optimized static pages
  4. Add "World" tab (global time zones)

## Do Not Touch
- lib/dateUtils.ts core math without running tests
- app/layout.tsx LocationProvider wrapper structure
