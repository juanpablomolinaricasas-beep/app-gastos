import { CircleSlash } from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';
import { useAppDispatch, useAppState } from '../store/AppContext';
import { CategoryChip } from '../components/CategoryChip';
import { StreakCard } from '../components/StreakCard';
import { DailyReminderBanner } from '../components/DailyReminderBanner';
import { formatMoney } from '../utils/money';
import { computeAvailable } from '../utils/finance';
import { todayISO } from '../utils/date';
import { Screen } from '../App';

interface Props {
  onNavigate: (screen: Screen) => void;
}

export function Home({ onNavigate }: Props) {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(state.categories[0]?.id ?? '');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(todayISO());
  const [avoidedMessage, setAvoidedMessage] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);

  const today = todayISO();
  const alreadyMarkedNoSpend = state.noSpendDays.includes(today);
  const available = computeAvailable(state, new Date());

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount.replace(',', '.'));
    if (!parsed || parsed <= 0 || !categoryId) return;
    dispatch({ type: 'ADD_EXPENSE', payload: { amount: parsed, categoryId, date, note: note.trim() } });
    setAmount('');
    setNote('');
  }

  function handleNoSpend() {
    if (alreadyMarkedNoSpend) return;
    dispatch({ type: 'MARK_NO_SPEND_TODAY' });
    setAvoidedMessage(true);
    setTimeout(() => setAvoidedMessage(false), 900);
    setTimeout(() => onNavigate('resumen'), 950);
  }

  return (
    <div className="screen">
      <DailyReminderBanner onFocusForm={() => amountRef.current?.focus()} />

      <div className="home-header">
        <div>
          <div className="text-secondary">Hola, {state.settings.userName || 'vos'}</div>
          <div className="screen-title">Nuevo gasto</div>
        </div>
        <div className="available-pill">
          <div className="available-pill-label">Disponible</div>
          <div className="available-pill-value">${formatMoney(available)} CAD</div>
        </div>
      </div>

      <form className="card quick-add-card" onSubmit={handleSubmit}>
        <div className="amount-input-row">
          <span className="amount-prefix">$</span>
          <input
            ref={amountRef}
            className="amount-input"
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <span className="amount-suffix">CAD</span>
        </div>

        <div>
          <div className="section-label">Categoría</div>
          <div className="category-row">
            {state.categories.map((cat) => (
              <CategoryChip
                key={cat.id}
                category={cat}
                selected={cat.id === categoryId}
                onClick={() => setCategoryId(cat.id)}
              />
            ))}
          </div>
        </div>

        <div className="field-row">
          <label className="field-box">
            <div className="field-label">Fecha</div>
            <input
              className="field-input"
              type="date"
              value={date}
              max={todayISO()}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="field-box field-box--wide">
            <div className="field-label">Nota (opcional)</div>
            <input
              className="field-input"
              type="text"
              placeholder="Café con amigos"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
        </div>

        <button type="submit" className="btn-primary">
          Agregar gasto
        </button>
      </form>

      <button
        type="button"
        className="no-spend-card"
        onClick={handleNoSpend}
        disabled={alreadyMarkedNoSpend}
      >
        <CircleSlash size={22} strokeWidth={2} color="var(--accent-amber-strong)" />
        <div>
          <div className="no-spend-title">
            {alreadyMarkedNoSpend ? 'Ya registraste hoy' : 'No voy a gastar hoy'}
          </div>
          <div className="no-spend-sub">Sumá un día a tu racha de control</div>
        </div>
      </button>

      {avoidedMessage && <div className="avoided-toast">Un día más de control.</div>}

      <div className="streak-row">
        <StreakCard type="constancia" days={state.streaks.constancia.current} label="Racha de constancia" />
        <StreakCard type="ahorro" days={state.streaks.ahorro.current} label="Racha de ahorro" />
      </div>
    </div>
  );
}
