import React, { createContext, useState, ReactNode, useCallback } from 'react';

export interface NavigationState {
  screen: 'home' | 'tv' | 'movies' | 'profile' | 'modal';
  scrollPosition: number;
  searchState?: {
    query: string;
    isActive: boolean;
  };
  filters?: Record<string, any>;
  timestamp: number;
}

interface NavigationContextType {
  history: NavigationState[];
  currentState: NavigationState | null;
  push: (state: NavigationState) => void;
  pop: () => NavigationState | null;
  canGoBack: () => boolean;
}

export const NavigationContext = createContext<NavigationContextType>({
  history: [],
  currentState: null,
  push: () => {},
  pop: () => null,
  canGoBack: () => false,
});

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<NavigationState[]>([
    {
      screen: 'home',
      scrollPosition: 0,
      timestamp: Date.now(),
    },
  ]);

  const currentState = history[history.length - 1];

  const push = useCallback((state: NavigationState) => {
    setHistory(prev => [...prev, { ...state, timestamp: Date.now() }]);
  }, []);

  const pop = useCallback((): NavigationState | null => {
    if (history.length <= 1) return null;
    
    let poppedState: NavigationState | null = null;
    setHistory(prev => {
      if (prev.length > 1) {
        poppedState = prev[prev.length - 2];
        return prev.slice(0, -1);
      }
      return prev;
    });
    return poppedState;
  }, [history.length]);

  const canGoBack = useCallback(() => {
    return history.length > 1;
  }, [history.length]);

  return (
    <NavigationContext.Provider value={{ history, currentState, push, pop, canGoBack }}>
      {children}
    </NavigationContext.Provider>
  );
};
