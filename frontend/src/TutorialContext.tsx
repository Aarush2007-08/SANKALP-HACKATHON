import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type SpotlightTarget = 
  | 'overview_welcome'
  | 'voice_record'
  | 'voice_upload'
  | 'pricing_fair'
  | 'logistics_book'
  | 'ledger_verify'
  | null;

interface TutorialContextType {
  spotlight: SpotlightTarget;
  setSpotlight: (target: SpotlightTarget) => void;
  registerTarget: (id: SpotlightTarget, element: HTMLElement | null) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [spotlight, setSpotlight] = useState<SpotlightTarget>(null);
  const targets = useRef<Record<string, HTMLElement>>({});
  const [rect, setRect] = useState<DOMRect | null>(null);

  const registerTarget = useCallback((id: SpotlightTarget, element: HTMLElement | null) => {
    if (!id) return;
    if (element) {
      targets.current[id] = element;
    } else {
      delete targets.current[id];
    }
  }, []);

  useEffect(() => {
    if (spotlight && targets.current[spotlight]) {
      const updateRect = () => {
        const el = targets.current[spotlight];
        if (el) setRect(el.getBoundingClientRect());
      };
      updateRect();
      window.addEventListener('resize', updateRect);
      window.addEventListener('scroll', updateRect, true);
      return () => {
        window.removeEventListener('resize', updateRect);
        window.removeEventListener('scroll', updateRect, true);
      };
    } else {
      setRect(null);
    }
  }, [spotlight]);

  return (
    <TutorialContext.Provider value={{ spotlight, setSpotlight, registerTarget }}>
      {children}
      
      <AnimatePresence>
        {spotlight && rect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none"
          >
            {/* Dimmed background overlay outside the spotlight */}
            <div className="absolute inset-0 bg-black/70 mix-blend-multiply" />
            
            {/* Spotlight Hole */}
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="absolute bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] rounded-2xl pointer-events-none border-2 border-white/20"
              style={{
                top: rect.top - 8,
                left: rect.left - 8,
                width: rect.width + 16,
                height: rect.height + 16,
              }}
            />

            {/* Tooltip Content */}
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute pointer-events-auto"
              style={{
                top: rect.bottom + 20,
                left: Math.max(10, Math.min(window.innerWidth - 320, rect.left)),
              }}
            >
              <div className="liquid-glass rounded-2xl p-5 w-80 flex flex-col gap-3 shadow-2xl">
                <div className="flex justify-between items-start">
                  <h4 className="font-['Instrument_Serif'] italic text-2xl text-white">AI Spotlight</h4>
                  <button 
                    onClick={() => setSpotlight(null)}
                    className="text-white/40 hover:text-white transition-colors text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  {getTooltipContent(spotlight)}
                </p>
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={() => setSpotlight(null)}
                    className="bg-white text-black px-4 py-2 rounded-full text-xs font-semibold hover:bg-white/90"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) throw new Error("useTutorial must be used within TutorialProvider");
  return context;
}

function getTooltipContent(spotlight: SpotlightTarget): string {
  switch (spotlight) {
    case 'overview_welcome':
      return "Welcome to the She Can Market Platform. From here, you can record voice listings, check fair AI pricing, or book peer-to-peer logistics.";
    case 'voice_record':
      return "Tap here to describe your product in your local language (e.g. Hindi, Kannada). Our AI will automatically translate it and generate a professional English listing!";
    case 'pricing_fair':
      return "This is the true, data-driven fair price for your craft. Don't let middlemen undercut you—use this as your negotiation baseline.";
    case 'logistics_book':
      return "Book shared transport with other artisans heading to the same market. This slashes your travel costs by splitting the vehicle fare.";
    case 'ledger_verify':
      return "Every step of your product's journey is secured here. Buyers can scan a QR code to verify authenticity and trace it back to you.";
    default:
      return "";
  }
}
