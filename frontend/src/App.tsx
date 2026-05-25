import { useState } from 'react';
import { TutorialProvider, useTutorial } from './TutorialContext';
import { Mic, BarChart2, Truck, ShieldCheck, Home, Info } from 'lucide-react';

import Overview from './components/Overview';
import VoiceStorefront from './components/VoiceStorefront';
import PricingDemand from './components/PricingDemand';
import P2PLogistics from './components/P2PLogistics';
import TrustLedger from './components/TrustLedger';

function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const { setSpotlight } = useTutorial();
  
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'voice', label: 'Storefront', icon: Mic },
    { id: 'pricing', label: 'Pricing & Demand', icon: BarChart2 },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'ledger', label: 'Trust Ledger', icon: ShieldCheck },
  ];

  return (
    <div className="w-72 bg-white border-r border-gray-200 h-screen flex flex-col p-6 shadow-sm z-10 relative">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">S</div>
        <h1 className="text-2xl font-black text-secondary tracking-tight">Sankalp</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-semibold transition-all ${
                isActive 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-600 hover:bg-surface hover:text-secondary'
              }`}
            >
              <Icon size={24} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto">
         <button 
            onClick={() => setSpotlight('overview_welcome')}
            className="flex items-center gap-3 text-gray-500 hover:text-primary transition-colors font-medium text-lg p-2 w-full justify-center"
         >
           <Info size={24} />
           Restart Tutorial
         </button>
      </div>
    </div>
  );
}

function MainContent({ activeTab }: { activeTab: string }) {
  return (
    <div className="flex-1 bg-surface h-screen overflow-y-auto p-10 relative">
      <header className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 z-10 relative">
        <h2 className="text-3xl font-black text-secondary capitalize">{activeTab === 'voice' ? 'Voice & Storefront' : activeTab.replace('-', ' ')}</h2>
        <div className="flex items-center gap-3 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-200 font-medium">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          3/3 Villages Synced
        </div>
      </header>

      {/* Render tab content here */}
      <div className="z-10 relative pb-20">
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'voice' && <VoiceStorefront />}
        {activeTab === 'pricing' && <PricingDemand />}
        {activeTab === 'logistics' && <P2PLogistics />}
        {activeTab === 'ledger' && <TrustLedger />}
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <TutorialProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-surface font-sans text-gray-800">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <MainContent activeTab={activeTab} />
      </div>
    </TutorialProvider>
  );
}

export default App;
