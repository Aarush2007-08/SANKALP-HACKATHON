import { useState } from 'react';
import { TutorialProvider, useTutorial } from './TutorialContext';
import { Mic, BarChart2, Truck, ShieldCheck, Home, HelpCircle } from 'lucide-react';

import Overview from './components/Overview';
import VoiceStorefront from './components/VoiceStorefront';
import PricingDemand from './components/PricingDemand';
import P2PLogistics from './components/P2PLogistics';
import TrustLedger from './components/TrustLedger';

type Tab = 'overview' | 'voice' | 'pricing' | 'logistics' | 'ledger';

const NAV_ITEMS = [
  { id: 'overview' as Tab, label: 'Overview', icon: Home, emoji: '🏠' },
  { id: 'voice' as Tab, label: 'Storefront', icon: Mic, emoji: '🎙️' },
  { id: 'pricing' as Tab, label: 'Pricing', icon: BarChart2, emoji: '💰' },
  { id: 'logistics' as Tab, label: 'Logistics', icon: Truck, emoji: '🚚' },
  { id: 'ledger' as Tab, label: 'Trust Ledger', icon: ShieldCheck, emoji: '⛓️' },
];

const TAB_LABELS: Record<Tab, string> = {
  overview: 'Good Morning!',
  voice: 'Create a Listing',
  pricing: 'Fair Pricing',
  logistics: 'Plan Delivery',
  ledger: 'Trust Ledger',
};

function Sidebar({ activeTab, setActiveTab }: { activeTab: Tab; setActiveTab: (t: Tab) => void }) {
  const { setSpotlight } = useTutorial();

  return (
    <aside className="w-64 bg-white border-r border-border flex flex-col h-screen flex-shrink-0">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
          <span className="text-white font-black text-base">S</span>
        </div>
        <div>
          <h1 className="font-black text-secondary text-lg leading-none">Sankalp</h1>
          <p className="text-secondary/35 text-[11px] font-medium mt-0.5">Artisan Market</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
        <p className="section-label px-2 mb-3 mt-1">Menu</p>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition-all text-left ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-secondary/60 hover:bg-muted hover:text-secondary'
              }`}
            >
              <span className="text-base w-5 text-center">{item.emoji}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Help button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => setSpotlight('overview_welcome')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-secondary/50 hover:bg-muted hover:text-secondary transition-all text-sm font-semibold"
        >
          <HelpCircle size={17} />
          Restart Tutorial
        </button>
        <div className="mt-3 px-3 py-3 bg-muted rounded-xl">
          <p className="text-secondary/50 text-xs font-medium">Logged in as</p>
          <p className="text-secondary font-bold text-sm mt-0.5">Devika Shetty</p>
          <span className="badge-success mt-1 text-xs">✓ Verified Artisan</span>
        </div>
      </div>
    </aside>
  );
}

function Header({ activeTab }: { activeTab: Tab }) {
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8 flex-shrink-0">
      <div>
        <h2 className="font-black text-secondary text-lg leading-none">{TAB_LABELS[activeTab]}</h2>
        <p className="text-secondary/35 text-xs mt-0.5">Sunday, May 25, 2026</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-success bg-success-light px-3 py-1.5 rounded-full border border-success/20">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          3/3 Online
        </div>
        <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center text-primary font-black text-base">
          D
        </div>
      </div>
    </header>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <TutorialProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-surface text-secondary">

        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header activeTab={activeTab} />

          <main className="flex-1 overflow-y-auto p-8">
            {activeTab === 'overview'  && <Overview />}
            {activeTab === 'voice'     && <VoiceStorefront />}
            {activeTab === 'pricing'   && <PricingDemand />}
            {activeTab === 'logistics' && <P2PLogistics />}
            {activeTab === 'ledger'    && <TrustLedger />}
          </main>
        </div>

      </div>
    </TutorialProvider>
  );
}

export default App;
