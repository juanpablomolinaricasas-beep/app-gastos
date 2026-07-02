import { AppState } from '../types';
import { biweeklyPeriodsElapsed, isSameMonth } from './date';

/** Disponible = (ingreso quincenal x periodos transcurridos) + ingresos extra del mes - gastado del mes. */
export function computeAvailable(state: AppState, ref: Date): number {
  const periods = biweeklyPeriodsElapsed(ref);
  const income = state.incomes.biweeklyAmount * periods;
  const extra = state.incomes.extraIncomes
    .filter((i) => isSameMonth(i.date, ref))
    .reduce((sum, i) => sum + i.amount, 0);
  const spent = state.expenses
    .filter((e) => isSameMonth(e.date, ref))
    .reduce((sum, e) => sum + e.amount, 0);
  return income + extra - spent;
}

export function computeTotalIncome(state: AppState, ref: Date): number {
  const periods = biweeklyPeriodsElapsed(ref);
  const income = state.incomes.biweeklyAmount * periods;
  const extra = state.incomes.extraIncomes
    .filter((i) => isSameMonth(i.date, ref))
    .reduce((sum, i) => sum + i.amount, 0);
  return income + extra;
}
