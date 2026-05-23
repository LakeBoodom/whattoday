// On This Day — data fetching for holidays and observances only
// Sources: Wikipedia "On This Day" API + Nager.Date public holidays API
// Historical events removed — WhatToday focuses on today, not the past.
// All fetches are cached server-side for 24h (revalidate: 86400)

export type ItemType = 'observance' | 'national-holiday';

export interface TodayItem {
  type: ItemType;
  text: string;
  year?: number | null;
  country?: string;
  countryCode?: string;
}

// Top countries by population, in priority order.
export const PRIORITY_COUNTRIES = [
  { code: 'IN', name: 'India',          pop: 1400 },
  { code: 'US', name: 'United States',  pop: 335  },
  { code: 'BR', name: 'Brazil',         pop: 215  },
  { code: 'RU', name: 'Russia',         pop: 145  },
  { code: 'MX', name: 'Mexico',         pop: 130  },
  { code: 'JP', name: 'Japan',          pop: 124  },
  { code: 'DE', name: 'Germany',        pop: 84   },
  { code: 'TR', name: 'Turkey',         pop: 85   },
  { code: 'GB', name: 'United Kingdom', pop: 68   },
  { code: 'FR', name: 'France',         pop: 68   },
  { code: 'IT', name: 'Italy',          pop: 60   },
  { code: 'ZA', name: 'South Africa',   pop: 60   },
  { code: 'KR', name: 'South Korea',    pop: 52   },
  { code: 'UA', name: 'Ukraine',        pop: 44   },
  { code: 'AR', name: 'Argentina',      pop: 46   },
  { code: 'ES', name: 'Spain',          pop: 47   },
  { code: 'CA', name: 'Canada',         pop: 38   },
  { code: 'PL', name: 'Poland',         pop: 38   },
  { code: 'AU', name: 'Australia',      pop: 26   },
  { code: 'SE', name: 'Sweden',         pop: 10   },
] as const;

// ─── Wikipedia ────────────────────────────────────────────────────────────────

interface WikiEvent { text: string; year?: number }
interface WikiResponse { holidays?: WikiEvent[] }

async function fetchWikipedia(month: number, day: number): Promise<WikiResponse> {
  try {
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/all/${mm}/${dd}`;
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      headers: { 'Api-User-Agent': 'WhatToday/1.0 (whattoday.org)' },
    });
    if (!res.ok) {
      console.error(`[OnThisDay] Wikipedia ${res.status} for ${month}/${day}`);
      return {};
    }
    return await res.json();
  } catch (err) {
    console.error('[OnThisDay] Wikipedia fetch failed:', err);
    return {};
  }
}

// ─── Nager.Date ───────────────────────────────────────────────────────────────

interface NagerHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  global: boolean;
  types: string[];
}

async function fetchNagerCountry(year: number, countryCode: string): Promise<NagerHoliday[]> {
  try {
    const res = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) {
      console.error(`[OnThisDay] Nager ${res.status} for ${countryCode}/${year}`);
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error(`[OnThisDay] Nager fetch failed for ${countryCode}:`, err);
    return [];
  }
}

// ─── Main fetch + prioritize ──────────────────────────────────────────────────

const MAX_OBSERVANCES = 3;
const MAX_NATIONAL = 8;

export async function getOnThisDayItems(
  month: number,
  day: number,
  year: number,
  userCountryCode?: string
): Promise<TodayItem[]> {
  const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const [wikiData, ...nagerResults] = await Promise.allSettled([
    fetchWikipedia(month, day),
    ...PRIORITY_COUNTRIES.map((c) => fetchNagerCountry(year, c.code)),
  ]);

  // ── 1. International observances (Wikipedia holidays) ──────────────────────
  const wikiPayload: WikiResponse = wikiData.status === 'fulfilled' ? wikiData.value : {};
  const observances: TodayItem[] = (wikiPayload.holidays ?? [])
    .slice(0, MAX_OBSERVANCES)
    .map((h) => ({ type: 'observance', text: h.text, year: null }));

  // ── 2. National public holidays (Nager.Date) ──────────────────────────────
  const countryHolidays = new Map<string, NagerHoliday[]>();
  nagerResults.forEach((result, idx) => {
    if (result.status === 'fulfilled') {
      const code = PRIORITY_COUNTRIES[idx].code;
      const todaysHolidays = result.value.filter((h) => h.date === todayStr);
      if (todaysHolidays.length > 0) countryHolidays.set(code, todaysHolidays);
    }
  });

  const sortedCodes = [...PRIORITY_COUNTRIES]
    .filter((c) => countryHolidays.has(c.code))
    .sort((a, b) => {
      if (userCountryCode) {
        if (a.code === userCountryCode) return -1;
        if (b.code === userCountryCode) return 1;
      }
      return b.pop - a.pop;
    });

  const nationalHolidays: TodayItem[] = [];
  for (const country of sortedCodes) {
    if (nationalHolidays.length >= MAX_NATIONAL) break;
    const holidays = countryHolidays.get(country.code) ?? [];
    for (const h of holidays) {
      if (nationalHolidays.length >= MAX_NATIONAL) break;
      nationalHolidays.push({
        type: 'national-holiday',
        text: h.name,
        country: country.name,
        countryCode: country.code,
      });
    }
  }

  return [...observances, ...nationalHolidays];
}
