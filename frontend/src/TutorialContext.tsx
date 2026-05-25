import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type TutorialStep = {
  id: string;
  text: string;
  subtext?: string;
};

type TutorialContextType = {
  activeSpotlightId: string | null;
  setSpotlight: (id: string | null) => void;
  registerSpotlight: (step: TutorialStep) => void;
};

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider = ({ children }: { children: ReactNode }) => {
  const [activeSpotlightId, setActiveSpotlightId] = useState<string | null>(null);
  const [spotlights, setSpotlights] = useState<Record<string, TutorialStep>>({});

  const setSpotlight = (id: string | null) => setActiveSpotlightId(id);

  const registerSpotlight = (step: TutorialStep) => {
    setSpotlights((prev) => ({ ...prev, [step.id]: step }));
  };

  const activeStep = activeSpotlightId ? spotlights[activeSpotlightId] : null;

  return (
    <TutorialContext.Provider value={{ activeSpotlightId, setSpotlight, registerSpotlight }}>
      {children}

      {/* Spotlight Overlay */}
      {activeSpotlightId && activeStep && (
        <div
          className="fixed inset-0 z-50 pointer-events-none animate-fade-in"
          style={{ backgroundColor: 'rgba(15, 13, 40, 0.65)', backdropFilter: 'blur(3px)' }}
        >
          {/* Bottom floating tooltip */}
          <div
            className="absolute bottom-8 left-1/2 pointer-events-auto animate-slide-up"
            style={{ transform: 'translateX(-50%)', maxWidth: '420px', width: 'calc(100vw - 48px)' }}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
              {/* Orange top bar */}
              <div className="h-1 bg-primary" />
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-xl">💡</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-secondary font-semibold text-base leading-snug">{activeStep.text}</p>
                    {activeStep.subtext && (
                      <p className="text-secondary/50 text-sm mt-1">{activeStep.subtext}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSpotlight(null)}
                  className="btn-primary w-full mt-5 text-base py-3"
                >
                  Got it! ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) throw new Error('useTutorial must be used within a TutorialProvider');
  return context;
};

export const SpotlightElement = ({
  id,
  instructionText,
  subtext,
  children,
  className = '',
}: {
  id: string;
  instructionText: string;
  subtext?: string;
  children: ReactNode;
  className?: string;
}) => {
  const { activeSpotlightId, registerSpotlight } = useTutorial();

  useEffect(() => {
    registerSpotlight({ id, text: instructionText, subtext });
  }, [id, instructionText, subtext]);

  return (
    <div className={`${className} ${activeSpotlightId === id ? 'spotlight-active' : ''} transition-shadow duration-300`}>
      {children}
    </div>
  );
};
