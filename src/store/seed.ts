import { AppState, Category } from '../types';
import { initialBadges } from './badges';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'comida', name: 'Comida', color: 'oklch(80% 0.11 45)', icon: 'Utensils' },
  { id: 'auto', name: 'Auto', color: 'oklch(80% 0.09 250)', icon: 'Car' },
  { id: 'casa', name: 'Casa', color: 'oklch(80% 0.09 150)', icon: 'Home' },
  { id: 'salidas', name: 'Salidas', color: 'oklch(80% 0.12 330)', icon: 'Ticket' },
  { id: 'salud', name: 'Salud', color: 'oklch(80% 0.11 20)', icon: 'Cross' },
  { id: 'negocio', name: 'Negocio', color: 'oklch(80% 0.08 95)', icon: 'Briefcase' },
  { id: 'otros', name: 'Otros', color: 'oklch(87% 0.02 90)', icon: 'MoreHorizontal' },
];

export const CATEGORY_COLOR_PALETTE = [
  'oklch(80% 0.11 45)',
  'oklch(80% 0.09 250)',
  'oklch(80% 0.09 150)',
  'oklch(80% 0.12 330)',
  'oklch(80% 0.11 20)',
  'oklch(80% 0.08 95)',
  'oklch(87% 0.02 90)',
  'oklch(80% 0.1 300)',
  'oklch(80% 0.1 190)',
  'oklch(80% 0.12 10)',
];

export const CATEGORY_ICON_OPTIONS = [
  'Utensils', 'Car', 'Home', 'Ticket', 'Cross', 'Briefcase', 'MoreHorizontal',
  'ShoppingBag', 'Gift', 'Plane', 'Dumbbell', 'GraduationCap', 'PawPrint', 'Coffee',
];

export function defaultState(): AppState {
  return {
    categories: DEFAULT_CATEGORIES,
    expenses: [],
    incomes: { biweeklyAmount: 0, extraIncomes: [] },
    noSpendDays: [],
    streaks: {
      constancia: { current: 0, best: 0 },
      ahorro: { current: 0, best: 0 },
    },
    badges: initialBadges(),
    settings: { userName: 'Alex', dailyReminder: true },
  };
}
