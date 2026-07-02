import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAppDispatch, useAppState } from '../store/AppContext';
import { ProgressBar } from '../components/ProgressBar';
import { CategoryIcon } from '../components/CategoryIcon';
import { formatMoney } from '../utils/money';
import { computeTotalIncome } from '../utils/finance';
import { addMonths, formatShortDate, isSameMonth, monthLabel } from '../utils/date';

export function Summary() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [ref, setRef] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const byId = useMemo(() => Object.fromEntries(state.categories.map((c) => [c.id, c])), [state.categories]);

  const monthExpenses = useMemo(
    () =>
      state.expenses
        .filter((e) => isSameMonth(e.date, ref))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [state.expenses, ref]
  );

  const spent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = computeTotalIncome(state, ref);

  const categoryTotals = useMemo(() => {
    const sums = new Map<string, number>();
    monthExpenses.forEach((e) => sums.set(e.categoryId, (sums.get(e.categoryId) ?? 0) + e.amount));
    const max = Math.max(1, ...sums.values());
    return [...sums.entries()]
      .map(([categoryId, amount]) => ({ category: byId[categoryId], amount, pct: (amount / max) * 100 }))
      .filter((c) => c.category)
      .sort((a, b) => b.amount - a.amount);
  }, [monthExpenses, byId]);

  function handleDelete(id: string) {
    if (confirm('¿Borrar este gasto?')) {
      dispatch({ type: 'DELETE_EXPENSE', payload: { id } });
    }
  }

  return (
    <div className="screen">
      <div className="month-nav">
        <button type="button" className="icon-btn" onClick={() => setRef((r) => addMonths(r, -1))}>
          <ChevronLeft size={20} />
        </button>
        <div className="screen-title">{monthLabel(ref)}</div>
        <button type="button" className="icon-btn" onClick={() => setRef((r) => addMonths(r, 1))}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="card totals-card">
        <div className="totals-row">
          <div>
            <div className="text-secondary text-xs">Gastado</div>
            <div className="totals-amount">${formatMoney(spent)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="text-secondary text-xs">Disponible</div>
            <div className="totals-sub">
              ${formatMoney(Math.max(0, totalIncome - spent))} / ${formatMoney(totalIncome)}
            </div>
          </div>
        </div>
        <ProgressBar pct={totalIncome > 0 ? (spent / totalIncome) * 100 : 0} />
      </div>

      {categoryTotals.length > 0 && (
        <div className="card category-breakdown-card">
          <div className="card-heading">Por categoría</div>
          <div className="category-breakdown-list">
            {categoryTotals.map(({ category, amount, pct }) => (
              <div key={category.id} className="category-breakdown-row">
                <div className="category-avatar" style={{ background: category.color }}>
                  <CategoryIcon name={category.icon} size={14} color="oklch(28% 0.02 250)" />
                </div>
                <div className="category-breakdown-info">
                  <div className="category-breakdown-top">
                    <span>{category.name}</span>
                    <span className="text-strong">${formatMoney(amount)}</span>
                  </div>
                  <ProgressBar pct={pct} color={category.color} height={6} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="expense-list-section">
        <div className="card-heading">Gastos del mes</div>
        <div className="card expense-list">
          {monthExpenses.length === 0 && <div className="empty-state">Sin gastos este mes.</div>}
          {monthExpenses.map((e) => {
            const category = byId[e.categoryId];
            return (
              <div key={e.id} className="expense-row">
                <div className="category-avatar category-avatar--md" style={{ background: category?.color ?? '#eee' }}>
                  <CategoryIcon name={category?.icon ?? 'CircleDot'} size={16} color="oklch(28% 0.02 250)" />
                </div>
                <div className="expense-info">
                  <div className="expense-note">{e.note || category?.name || 'Gasto'}</div>
                  <div className="expense-meta">
                    {category?.name} · {formatShortDate(e.date)}
                  </div>
                </div>
                <div className="expense-amount">${formatMoney(e.amount, 2)}</div>
                <button type="button" className="icon-btn icon-btn--danger" onClick={() => handleDelete(e.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
