import { BellRing } from 'lucide-react';
import { useAppDispatch } from '../store/AppContext';
import { useDailyCheck } from '../hooks/useDailyCheck';

interface Props {
  onFocusForm: () => void;
}

export function DailyReminderBanner({ onFocusForm }: Props) {
  const dispatch = useAppDispatch();
  const showBanner = useDailyCheck();

  if (!showBanner) return null;

  return (
    <div className="daily-banner">
      <BellRing size={20} strokeWidth={2} color="var(--accent-amber-strong)" />
      <div className="daily-banner-text">
        <div className="daily-banner-title">Todavía no cargaste nada hoy</div>
        <div className="daily-banner-sub">Registrá un gasto o marcá que no vas a gastar para mantener tu racha.</div>
      </div>
      <div className="daily-banner-actions">
        <button type="button" className="daily-banner-btn" onClick={onFocusForm}>
          Cargar
        </button>
        <button
          type="button"
          className="daily-banner-btn daily-banner-btn--ghost"
          onClick={() => dispatch({ type: 'MARK_NO_SPEND_TODAY' })}
        >
          No gasté
        </button>
      </div>
    </div>
  );
}
