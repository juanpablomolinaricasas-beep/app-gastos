interface Props {
  pct: number; // 0-100
  color?: string;
  height?: number;
}

export function ProgressBar({ pct, color = 'var(--accent-blue)', height = 8 }: Props) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="progress-track" style={{ height }}>
      <div className="progress-fill" style={{ width: `${clamped}%`, background: color }} />
    </div>
  );
}
