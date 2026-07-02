import { Pencil, PiggyBank } from 'lucide-react';

interface Props {
  type: 'constancia' | 'ahorro';
  days: number;
  label: string;
  size?: 'sm' | 'lg';
  best?: number;
}

export function StreakCard({ type, days, label, size = 'sm', best }: Props) {
  const isConstancia = type === 'constancia';
  const Icon = isConstancia ? Pencil : PiggyBank;
  return (
    <div className={`streak-card streak-card--${type} streak-card--${size}`}>
      <Icon size={size === 'lg' ? 20 : 18} color={isConstancia ? 'var(--accent-blue)' : 'var(--accent-amber-strong)'} strokeWidth={2} />
      <div className="streak-card-value">{days} días</div>
      <div className="streak-card-label">{label}</div>
      {best !== undefined && <div className="streak-card-best">Mejor racha: {best} días</div>}
    </div>
  );
}
