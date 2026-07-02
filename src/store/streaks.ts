import { toISODate } from '../utils/date';

/**
 * Counts consecutive days with a record ending today. If today has no record yet,
 * the streak isn't cut until the day fully passes — so we start counting from
 * yesterday, giving today a grace window until midnight (recompute happens on next open).
 */
export function computeCurrentStreak(recordDates: Set<string>, today: Date): number {
  const cursor = new Date(today);
  if (!recordDates.has(toISODate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let count = 0;
  while (recordDates.has(toISODate(cursor))) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}
