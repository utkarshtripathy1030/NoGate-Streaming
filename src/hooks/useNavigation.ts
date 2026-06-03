import { useContext, useCallback } from 'react';
import { NavigationContext, NavigationState } from '@/context/NavigationContext';

export const useNavigation = () => {
  const { history, currentState, push, pop, canGoBack } = useContext(NavigationContext);

  const goBack = useCallback(() => {
    const previousState = pop();
    if (previousState) {
      // Restore scroll position
      window.scrollTo(0, previousState.scrollPosition);
      return previousState;
    }
    return null;
  }, [pop]);

  const pushState = useCallback((
    screen: NavigationState['screen'],
    options?: {
      scrollPosition?: number;
      searchState?: NavigationState['searchState'];
      filters?: NavigationState['filters'];
    }
  ) => {
    push({
      screen,
      scrollPosition: options?.scrollPosition ?? window.scrollY,
      searchState: options?.searchState,
      filters: options?.filters,
      timestamp: Date.now(),
    });
  }, [push]);

  const saveCurrentScroll = useCallback(() => {
    if (currentState) {
      currentState.scrollPosition = window.scrollY;
    }
  }, [currentState]);

  return {
    history,
    currentState,
    goBack,
    pushState,
    canGoBack,
    saveCurrentScroll,
  };
};
