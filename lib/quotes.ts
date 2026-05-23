export const timeQuotes = [
  "Time moves quietly.",
  "Every moment is a fresh beginning.",
  "The present is the only time that matters.",
  "Each day is a small life.",
  "Time is the canvas of all things.",
  "What we do with our days is what we do with our lives.",
  "The clock is running. Make the most of today.",
  "Tomorrow belongs to those who prepare for it today.",
  "We are the sum of our moments.",
  "A year from now, you'll wish you started today.",
  "The days are long but the years are short.",
  "Time you enjoy wasting is not wasted time.",
  "The secret of your future is hidden in your daily routine.",
  "Seasons pass. Moments linger.",
  "This too shall pass.",
  "Be present. It's the only moment you truly have.",
  "Every sunset is also a sunrise.",
  "Time flies over us but leaves its shadow behind.",
  "The year is a long river with many bends.",
  "There is always enough time for what matters.",
  "Live each day as if it were your first.",
  "The present moment always will have been.",
  "In the middle of every difficulty lies opportunity.",
  "One day or day one — you decide.",
  "The week is a gift, unwrapped one day at a time.",
];

export function getDailyQuote(date: Date): string {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return timeQuotes[dayOfYear % timeQuotes.length];
}
