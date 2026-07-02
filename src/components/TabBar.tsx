import { Award, Home, Settings as SettingsIcon, TrendingUp } from 'lucide-react';
import { Screen } from '../App';

interface Props {
  active: Screen;
  onChange: (screen: Screen) => void;
}

const TABS: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'resumen', label: 'Resumen', icon: TrendingUp },
  { id: 'insignias', label: 'Insignias', icon: Award },
  { id: 'ajustes', label: 'Ajustes', icon: SettingsIcon },
];

export function TabBar({ active, onChange }: Props) {
  return (
    <nav className="tab-bar">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            className={`tab-bar-item ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            <Icon size={21} strokeWidth={isActive ? 2.2 : 1.8} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
