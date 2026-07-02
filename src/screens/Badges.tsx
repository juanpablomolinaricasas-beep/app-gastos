import { useAppState } from '../store/AppContext';
import { StreakCard } from '../components/StreakCard';
import { BadgeGrid } from '../components/BadgeGrid';

export function Badges() {
  const state = useAppState();

  return (
    <div className="screen">
      <div className="screen-title">Logros</div>

      <div className="streak-row">
        <StreakCard
          type="constancia"
          days={state.streaks.constancia.current}
          best={state.streaks.constancia.best}
          label="Racha de constancia"
          size="lg"
        />
        <StreakCard
          type="ahorro"
          days={state.streaks.ahorro.current}
          best={state.streaks.ahorro.best}
          label="Racha de ahorro"
          size="lg"
        />
      </div>

      <div className="badge-section">
        <div className="card-heading">Constancia</div>
        <BadgeGrid type="constancia" badges={state.badges} />
      </div>

      <div className="badge-section">
        <div className="card-heading">Control de gastos</div>
        <BadgeGrid type="ahorro" badges={state.badges} />
      </div>
    </div>
  );
}
