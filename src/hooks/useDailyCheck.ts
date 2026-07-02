import { useMemo } from 'react';
import { useAppState } from '../store/AppContext';
import { todayISO } from '../utils/date';

/** True when today has no expense and no "no voy a gastar" mark yet, and the reminder setting is on. */
export function useDailyCheck(): boolean {
  const state = useAppState();
  return useMemo(() => {
    if (!state.settings.dailyReminder) return false;
    const today = todayISO();
    const hasExpenseToday = state.expenses.some((e) => e.date === today);
    const hasNoSpendToday = state.noSpendDays.includes(today);
    return !hasExpenseToday && !hasNoSpendToday;
  }, [state.expenses, state.noSpendDays, state.settings.dailyReminder]);
}
