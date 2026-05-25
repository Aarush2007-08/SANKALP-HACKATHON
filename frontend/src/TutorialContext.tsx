import React, { createContext, useContext, useState, ReactNode } from 'react';

type TutorialContextType = {
  activeSpotlightId: string | null;
  setSpotlight: (id: string | null) => void;
  registerSpotlight: (id: string, text: string) => void;
  spotlights: Record<string, string>;
};

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider = ({ children }: { children: ReactNode }) => {
  const [activeSpotlightId, setActiveSpotlightId] = useState<string | null>(null);
  const [spotlights, setSpotlights] = useState<Record<string, string>>({});

  const setSpotlight = (id: string | null) => {
    setActiveSpotlightId(id);
  };

  const registerSpotlight = (id: string, text: string) => {
    setSpotlights((prev) => ({ ...prev, [id]: text }));
  };

  return (
    <TutorialContext.Provider value={{ activeSpotlightId, setSpotlight, registerSpotlight, spotlights }}>
      {children}
      {activeSpotlightId && (
        <div 
          className="fixed inset-0 z-50 pointer-events-none transition-all duration-300"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
        >
          {/* A tooltip box that tells the user what to do */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white px-6 py-4 rounded-xl shadow-2xl pointer-events-auto text-center border-2 border-primary max-w-md">
             <p className="text-secondary text-lg font-medium mb-3">{spotlights[activeSpotlightId]}</p>
             <button 
                onClick={() => setSpotlight(null)}
                className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-lg hover:bg-orange-700 transition-colors"
             >
               Got it!
             </button>
          </div>
        </div>
      )}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

// A wrapper component that applies the spotlight styling when active
export const SpotlightElement = ({ 
  id, 
  instructionText, 
  children, 
  className = "" 
}: { 
  id: string, 
  instructionText: string, 
  children: ReactNode,
  className?: string
}) => {
  const { activeSpotlightId, registerSpotlight } = useTutorial();
  
  React.useEffect(() => {
    registerSpotlight(id, instructionText);
  }, [id, instructionText]);

  const isActive = activeSpotlightId === id;

  return (
    <div className={`${className} ${isActive ? 'spotlight-active' : ''}`}>
      {children}
    </div>
  );
};
