export type CategoryId = string;

export interface Category {
  id: CategoryId;
  name: string;
  color: string; // oklch(...)
  icon: string; // lucide-react icon name
}

export interface Expense {
  id: string;
  amount: number;
  categoryId: CategoryId;
  date: string; // ISO yyyy-mm-dd
  note: string;
}

export interface ExtraIncome {
  id: string;
  name: string;
  amount: number;
  date: string; // ISO yyyy-mm-dd
}

export interface Incomes {
  biweeklyAmount: number;
  extraIncomes: ExtraIncome[];
}

export interface StreakState {
  current: number;
  best: number;
}

export interface Streaks {
  constancia: StreakState;
  ahorro: StreakState;
}

export type BadgeType = 'constancia' | 'ahorro';
export const BADGE_TIERS = [7, 30, 90, 365] as const;
export type BadgeTier = (typeof BADGE_TIERS)[number];

export interface Badge {
  id: string; // `${type}-${tier}`
  type: BadgeType;
  tier: BadgeTier;
  unlockedAt: string | null; // ISO datetime, null while locked
}

export interface Settings {
  userName: string;
  dailyReminder: boolean;
}

export interface AppState {
  categories: Category[];
  expenses: Expense[];
  incomes: Incomes;
  /** Calendar dates (ISO) where the user tapped "No voy a gastar hoy". */
  noSpendDays: string[];
  streaks: Streaks;
  badges: Badge[];
  settings: Settings;
}
