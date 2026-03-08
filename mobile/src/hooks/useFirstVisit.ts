import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ScreenKey = 'guide' | 'profile' | 'scan' | 'search' | 'shield';

const STORAGE_KEY = 'trusttap_onboarding';

interface VisitedState {
  visited: Record<string, boolean>;
}

export function useFirstVisit() {
  const [state, setState] = useState<VisitedState>({ visited: {} });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setState(JSON.parse(raw));
      } catch {} finally {
        setReady(true);
      }
    })();
  }, []);

  const hasVisited = useCallback((key: ScreenKey) => {
    return !!state.visited[key];
  }, [state]);

  const markVisited = useCallback((key: ScreenKey) => {
    setState(prev => {
      const next = { visited: { ...prev.visited, [key]: true } };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    setState({ visited: {} });
  }, []);

  return { hasVisited, markVisited, resetAll, ready };
}
