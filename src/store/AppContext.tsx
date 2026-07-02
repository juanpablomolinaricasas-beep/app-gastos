import { createContext, Dispatch, ReactNode, useContext, useEffect, useReducer } from 'react';
import { AppState, Category, Expense, ExtraIncome, Settings } from '../types';
import { loadState, saveState } from './db';
import { computeCurrentStreak } from './streaks';
import { unlockEligibleBadges } from './badges';
import { todayISO } from '../utils/date';

type Action =
  | { type: 'ADD_EXPENSE'; payload: Omit<Expense, 'id'> }
  | { type: 'DELETE_EXPENSE'; payload: { id: string } }
  | { type: 'MARK_NO_SPEND_TODAY' }
  | { type: 'ADD_CATEGORY'; payload: Omit<Category, 'id'> }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: { id: string } }
  | { type: 'SET_BIWEEKLY_INCOME'; payload: number }
  | { type: 'ADD_EXTRA_INCOME'; payload: Omit<ExtraIncome, 'id'> }
  | { type: 'DELETE_EXTRA_INCOME'; payload: { id: string } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> };

function recomputeGamification(state: AppState): AppState {
  const today = new Date();
  const noSpendSet = new Set(state.noSpendDays);
  const constanciaDates = new Set([...state.expenses.map((e) => e.date), ...noSpendSet]);

  const constanciaCurrent = computeCurrentStreak(constanciaDates, today);
  const ahorroCurrent = computeCurrentStreak(noSpendSet, today);

  const streaks: AppState['streaks'] = {
    constancia: { current: constanciaCurrent, best: Math.max(state.streaks.constancia.best, constanciaCurrent) },
    ahorro: { current: ahorroCurrent, best: Math.max(state.streaks.ahorro.best, ahorroCurrent) },
  };

  const now = new Date().toISOString();
  let badges = unlockEligibleBadges(state.badges, 'constancia', streaks.constancia.current, now);
  badges = unlockEligibleBadges(badges, 'ahorro', streaks.ahorro.current, now);

  return { ...state, streaks, badges };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_EXPENSE': {
      const expense: Expense = { id: crypto.randomUUID(), ...action.payload };
      return recomputeGamification({ ...state, expenses: [expense, ...state.expenses] });
    }
    case 'DELETE_EXPENSE':
      return recomputeGamification({
        ...state,
        expenses: state.expenses.filter((e) => e.id !== action.payload.id),
      });
    case 'MARK_NO_SPEND_TODAY': {
      const today = todayISO();
      if (state.noSpendDays.includes(today)) return state;
      return recomputeGamification({ ...state, noSpendDays: [...state.noSpendDays, today] });
    }
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, { id: crypto.randomUUID(), ...action.payload }] };
    case 'UPDATE_CATEGORY':
      return { ...state, categories: state.categories.map((c) => (c.id === action.payload.id ? action.payload : c)) };
    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter((c) => c.id !== action.payload.id) };
    case 'SET_BIWEEKLY_INCOME':
      return { ...state, incomes: { ...state.incomes, biweeklyAmount: action.payload } };
    case 'ADD_EXTRA_INCOME':
      return {
        ...state,
        incomes: {
          ...state.incomes,
          extraIncomes: [...state.incomes.extraIncomes, { id: crypto.randomUUID(), ...action.payload }],
        },
      };
    case 'DELETE_EXTRA_INCOME':
      return {
        ...state,
        incomes: {
          ...state.incomes,
          extraIncomes: state.incomes.extraIncomes.filter((i) => i.id !== action.payload.id),
        },
      };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    default:
      return state;
  }
}

const AppStateContext = createContext<AppState | null>(null);
const AppDispatchContext = createContext<Dispatch<Action> | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => recomputeGamification(loadState()));

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}

export function useAppDispatch(): Dispatch<Action> {
  const ctx = useContext(AppDispatchContext);
  if (!ctx) throw new Error('useAppDispatch must be used within AppProvider');
  return ctx;
}
