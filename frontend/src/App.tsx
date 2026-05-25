import { useState, useEffect, useRef } from 'react';
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

function TopNav({ activeTab, setActiveTab }: { activeTab: Tab; setActiveTab: (t: Tab) => void }) {
  const { setSpotlight } = useTutorial();

  return (
    <div className="relative z-20 px-6 py-6 w-full">
      <nav className="liquid-glass rounded-full max-w-6xl mx-auto px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white font-black text-sm">S</span>
          </div>
          <h1 className="text-white font-semibold text-lg tracking-wide">She Can Market</h1>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === item.id
                  ? 'bg-white/20 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{item.emoji}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (activeTab === 'overview') setSpotlight('overview_welcome');
              if (activeTab === 'voice') setSpotlight('voice_record');
              if (activeTab === 'pricing') setSpotlight('pricing_fair');
              if (activeTab === 'logistics') setSpotlight('logistics_book');
              if (activeTab === 'ledger') setSpotlight('ledger_verify');
            }}
            className="text-white/60 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
          >
            <HelpCircle size={16} /> Tutorial
          </button>
          <div className="flex items-center gap-2 text-sm font-medium text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="hidden md:inline">Online</span>
          </div>
        </div>
      </nav>

      {/* Mobile nav */}
      <div className="md:hidden flex overflow-x-auto gap-2 px-2 py-4 hide-scrollbar">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === item.id
                ? 'bg-white/20 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            <span>{item.emoji}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let fadeOutRaf: number;
    let fadeInRaf: number;

    const fadeTo = (targetOpacity: number, duration: number) => {
      const startOpacity = parseFloat(video.style.opacity || '0');
      const startTime = performance.now();

      const animate = (time: number) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
        video.style.opacity = currentOpacity.toString();

        if (progress < 1) {
          if (targetOpacity === 1) {
            fadeInRaf = requestAnimationFrame(animate);
          } else {
            fadeOutRaf = requestAnimationFrame(animate);
          }
        }
      };

      if (targetOpacity === 1) {
        cancelAnimationFrame(fadeOutRaf);
        fadeInRaf = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(fadeInRaf);
        fadeOutRaf = requestAnimationFrame(animate);
      }
    };

    const handleCanPlay = () => {
      video.play();
      fadeTo(0.6, 500); // Lower opacity for dashboard background
    };

    const handleTimeUpdate = () => {
      const remainingTime = video.duration - video.currentTime;
      if (remainingTime <= 0.55 && parseFloat(video.style.opacity) > 0.3) {
        fadeTo(0, 500);
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        video.play();
        fadeTo(0.6, 500);
      }, 100);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      cancelAnimationFrame(fadeInRaf);
      cancelAnimationFrame(fadeOutRaf);
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover mix-blend-screen pointer-events-none"
        muted
        autoPlay
        playsInline
        preload="auto"
        style={{ opacity: 0 }}
        // Using a similar beautiful cinematic video for empowerment
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
      />

      {/* Dimmer overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      <TopNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="relative z-10 flex-1 overflow-y-auto px-4 md:px-8 pb-12 w-full max-w-6xl mx-auto custom-scrollbar">
        {activeTab === 'overview'  && <Overview />}
        {activeTab === 'voice'     && <VoiceStorefront />}
        {activeTab === 'pricing'   && <PricingDemand />}
        {activeTab === 'logistics' && <P2PLogistics />}
        {activeTab === 'ledger'    && <TrustLedger />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <TutorialProvider>
      <AppContent />
    </TutorialProvider>
  );
}
