import { Category } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface Props {
  category: Category;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export function CategoryChip({ category, selected, onClick, size = 'md' }: Props) {
  const dim = size === 'md' ? 46 : 28;
  return (
    <button
      type="button"
      className="category-chip"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div
        className="category-chip-circle"
        style={{
          width: dim,
          height: dim,
          background: category.color,
          boxShadow: selected ? '0 0 0 2.5px var(--accent-blue)' : 'none',
          borderRadius: size === 'md' ? '50%' : '8px',
        }}
      >
        <CategoryIcon name={category.icon} size={size === 'md' ? 20 : 14} color="oklch(28% 0.02 250)" />
      </div>
      {size === 'md' && <div className="category-chip-label">{category.name}</div>}
    </button>
  );
}
