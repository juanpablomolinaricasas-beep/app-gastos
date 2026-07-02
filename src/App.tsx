import { useState } from 'react';
import { AppProvider } from './store/AppContext';
import { TabBar } from './components/TabBar';
import { Home } from './screens/Home';
import { Summary } from './screens/Summary';
import { Badges } from './screens/Badges';
import { Settings } from './screens/Settings';

export type Screen = 'inicio' | 'resumen' | 'insignias' | 'ajustes';

function AppShell() {
  const [screen, setScreen] = useState<Screen>('inicio');

  return (
    <div className="app-shell">
      <div className="app-content">
        {screen === 'inicio' && <Home onNavigate={setScreen} />}
        {screen === 'resumen' && <Summary />}
        {screen === 'insignias' && <Badges />}
        {screen === 'ajustes' && <Settings />}
      </div>
      <TabBar active={screen} onChange={setScreen} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
