// Core date/time utilities for WhatToday

export interface DateStats {
  dayOfYear: number;
  totalDaysInYear: boolean; // 365 or 366
  daysInYear: number;
  weekNumber: number;
  daysRemaining: number;
  weekendsRemaining: number;
  dayProgress: number; // 0–100
  yearProgress: number; // 0–100
  weekProgress: number; // 0–100 (Mon=0, Sun=100)
  dayOfWeek: number; // 0=Sun, 1=Mon ... 6=Sat
  timeString: string; // "11:24 AM"
  dateString: string; // "Friday, May 23"
  yearString: string; // "2025"
  hemisphere: 'north' | 'south';
  season: Season;
  nextSeasonName: string;
  daysToNextSeason: number;
}

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SeasonInfo {
  name: string;
  emoji: string;
  next: string;
}

const SEASON_INFO: Record<Season, SeasonInfo> = {
  spring: { name: 'Spring', emoji: '🌱', next: 'Summer' },
  summer: { name: 'Summer', emoji: '☀️', next: 'Autumn' },
  autumn: { name: 'Autumn', emoji: '🍂', next: 'Winter' },
  winter: { name: 'Winter', emoji: '❄️', next: 'Spring' },
};

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getRemainingWeekends(date: Date): number {
  const year = date.getFullYear();
  const endOfYear = new Date(year, 11, 31);
  let count = 0;
  const current = new Date(date);
  current.setHours(0, 0, 0, 0);

  // Count remaining Saturdays
  const nextSat = new Date(current);
  const dayOfWeek = current.getDay();
  const daysUntilSat = (6 - dayOfWeek + 7) % 7;
  nextSat.setDate(nextSat.getDate() + daysUntilSat);

  while (nextSat <= endOfYear) {
    count++;
    nextSat.setDate(nextSat.getDate() + 7);
  }
  return count;
}

function getSeasonNorth(month: number): Season {
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

function getSeasonSouth(month: number): Season {
  if (month >= 3 && month <= 5) return 'autumn';
  if (month >= 6 && month <= 8) return 'winter';
  if (month >= 9 && month <= 11) return 'spring';
  return 'summer';
}

// Season start dates (approximate meteorological)
const SEASON_STARTS_NORTH: Record<Season, { month: number; day: number }> = {
  spring: { month: 3, day: 1 },
  summer: { month: 6, day: 1 },
  autumn: { month: 9, day: 1 },
  winter: { month: 12, day: 1 },
};

const SEASON_STARTS_SOUTH: Record<Season, { month: number; day: number }> = {
  autumn: { month: 3, day: 1 },
  winter: { month: 6, day: 1 },
  spring: { month: 9, day: 1 },
  summer: { month: 12, day: 1 },
};

function getDaysToNextSeason(date: Date, currentSeason: Season, hemisphere: 'north' | 'south'): number {
  const starts = hemisphere === 'north' ? SEASON_STARTS_NORTH : SEASON_STARTS_SOUTH;
  const nextSeasonKey = SEASON_INFO[currentSeason].next.toLowerCase() as Season;
  const nextStart = starts[nextSeasonKey];

  let nextSeasonDate = new Date(date.getFullYear(), nextStart.month - 1, nextStart.day);
  if (nextSeasonDate <= date) {
    nextSeasonDate = new Date(date.getFullYear() + 1, nextStart.month - 1, nextStart.day);
  }

  const diff = nextSeasonDate.getTime() - date.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function computeDateStats(date: Date, latitude: number = 60): DateStats {
  const hemisphere: 'north' | 'south' = latitude >= 0 ? 'north' : 'south';
  const month = date.getMonth() + 1; // 1-based
  const season = hemisphere === 'north' ? getSeasonNorth(month) : getSeasonSouth(month);
  const daysInYear = isLeapYear(date.getFullYear()) ? 366 : 365;
  const dayOfYear = getDayOfYear(date);
  const daysRemaining = daysInYear - dayOfYear;
  const weekendsRemaining = getRemainingWeekends(date);

  // Day progress: fraction of 24h day elapsed
  const secondsInDay = 24 * 60 * 60;
  const secondsElapsed = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  const dayProgress = (secondsElapsed / secondsInDay) * 100;

  // Week progress: Mon=0%, Sun=100%
  const dow = date.getDay(); // 0=Sun
  const monBasedDow = dow === 0 ? 7 : dow; // 1=Mon, 7=Sun
  const weekProgress = ((monBasedDow - 1) / 6) * 100;

  return {
    dayOfYear,
    totalDaysInYear: isLeapYear(date.getFullYear()),
    daysInYear,
    weekNumber: getWeekNumber(date),
    daysRemaining,
    weekendsRemaining,
    dayProgress: Math.round(dayProgress * 10) / 10,
    yearProgress: Math.round((dayOfYear / daysInYear) * 100 * 10) / 10,
    weekProgress: Math.round(weekProgress * 10) / 10,
    dayOfWeek: date.getDay(),
    timeString: formatTime(date),
    dateString: formatDate(date),
    yearString: String(date.getFullYear()),
    hemisphere,
    season,
    nextSeasonName: SEASON_INFO[season].next,
    daysToNextSeason: getDaysToNextSeason(date, season, hemisphere),
  };
}

export { SEASON_INFO };

// ─── Solar / Solstice helpers ─────────────────────────────────────────────────

export interface SolsticeData {
  longestDayCity: string;
  longestDayCountry: string;
  longestDayLat: string;
  longestDayDuration: string;
  shortestDayCity: string;
  shortestDayCountry: string;
  shortestDayLat: string;
  shortestDayDuration: string;
  solsticeCountdown: number;
  nextSolsticeName: string;
}

// Approximate solstice dates
function getNextSolstice(date: Date): { date: Date; name: string } {
  const y = date.getFullYear();
  const juneSolstice = new Date(y, 5, 21);
  const decSolstice = new Date(y, 11, 21);
  if (date <= juneSolstice) return { date: juneSolstice, name: 'June Solstice' };
  if (date <= decSolstice) return { date: decSolstice, name: 'December Solstice' };
  return { date: new Date(y + 1, 5, 21), name: 'June Solstice' };
}

// Approximate daylight at a given latitude and day of year using simple formula
function daylightHours(lat: number, dayOfYear: number): number {
  const decl = -23.45 * Math.cos((2 * Math.PI / 365) * (dayOfYear + 10));
  const latRad = (lat * Math.PI) / 180;
  const declRad = (decl * Math.PI) / 180;
  const cosH = -Math.tan(latRad) * Math.tan(declRad);
  if (cosH <= -1) return 24; // midnight sun
  if (cosH >= 1) return 0;   // polar night
  const H = (Math.acos(cosH) * 180) / Math.PI;
  return (2 * H) / 15;
}

function formatDaylight(hours: number): string {
  if (hours >= 23.5) return '24 hours of daylight';
  if (hours <= 0.5) return '0 hours of daylight';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m === 0 ? `${h}h of daylight` : `${h}h ${m}m of daylight`;
}

export function getSolsticeData(date: Date): SolsticeData {
  const doy = getDayOfYear(date);
  const { date: nextSolsticeDate, name: nextSolsticeName } = getNextSolstice(date);
  const countdown = Math.ceil((nextSolsticeDate.getTime() - date.getTime()) / 86400000);

  // Cities for longest/shortest day
  // Northern summer: Tromsø (69°N) longest, Ushuaia (54°S) shortest
  // Northern winter: Ushuaia longest, Tromsø shortest
  const isNorthernSummer = nextSolsticeName === 'June Solstice';

  const tromsøHours = daylightHours(69.6, doy);
  const ushuaiaHours = daylightHours(-54.8, doy);

  let longestCity: string, longestCountry: string, longestLat: string, longestDur: string;
  let shortestCity: string, shortestCountry: string, shortestLat: string, shortestDur: string;

  if (isNorthernSummer) {
    longestCity = 'Tromsø'; longestCountry = 'Norway'; longestLat = '69° N';
    longestDur = formatDaylight(tromsøHours);
    shortestCity = 'Ushuaia'; shortestCountry = 'Argentina'; shortestLat = '54° S';
    shortestDur = formatDaylight(ushuaiaHours);
  } else {
    longestCity = 'Ushuaia'; longestCountry = 'Argentina'; longestLat = '54° S';
    longestDur = formatDaylight(ushuaiaHours);
    shortestCity = 'Tromsø'; shortestCountry = 'Norway'; shortestLat = '69° N';
    shortestDur = formatDaylight(tromsøHours);
  }

  return {
    longestDayCity: longestCity,
    longestDayCountry: longestCountry,
    longestDayLat: longestLat,
    longestDayDuration: longestDur,
    shortestDayCity: shortestCity,
    shortestDayCountry: shortestCountry,
    shortestDayLat: shortestLat,
    shortestDayDuration: shortestDur,
    solsticeCountdown: countdown,
    nextSolsticeName,
  };
}

// Month label like "Late May", "Early June", "Mid October"
export function getMonthLabel(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  if (day <= 10) return `Early ${month}`;
  if (day <= 20) return `Mid ${month}`;
  return `Late ${month}`;
}
