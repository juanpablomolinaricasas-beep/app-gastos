import { Pencil, PiggyBank } from 'lucide-react';
import { Badge, BadgeType } from '../types';

interface Props {
  type: BadgeType;
  badges: Badge[];
}

export function BadgeGrid({ type, badges }: Props) {
  const Icon = type === 'constancia' ? Pencil : PiggyBank;
  const items = badges.filter((b) => b.type === type).sort((a, b) => a.tier - b.tier);

  return (
    <div className="badge-grid">
      {items.map((b) => {
        const unlocked = b.unlockedAt !== null;
        return (
          <div key={b.id} className="badge-item">
            <div className={`badge-circle badge-circle--${type} ${unlocked ? 'is-unlocked' : 'is-locked'}`}>
              <Icon size={22} strokeWidth={2} />
            </div>
            <div className={`badge-label ${unlocked ? 'is-unlocked' : 'is-locked'}`}>{b.tier} días</div>
          </div>
        );
      })}
    </div>
  );
}
