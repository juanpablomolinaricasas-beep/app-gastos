export function toISODate(d: Date): string {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }).replace('.', '');
}

export function isSameMonth(iso: string, ref: Date): boolean {
  const d = new Date(iso + 'T00:00:00');
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

export function monthLabel(ref: Date): string {
  const label = ref.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function addMonths(ref: Date, delta: number): Date {
  return new Date(ref.getFullYear(), ref.getMonth() + delta, 1);
}

/** The user's income is defined per two-week period; this counts how many have elapsed within ref's month. */
export function biweeklyPeriodsElapsed(ref: Date): number {
  const now = new Date();
  const isCurrentMonth = ref.getFullYear() === now.getFullYear() && ref.getMonth() === now.getMonth();
  if (!isCurrentMonth) return 2; // past months are complete; future months have none yet (handled by caller)
  return now.getDate() <= 14 ? 1 : 2;
}
