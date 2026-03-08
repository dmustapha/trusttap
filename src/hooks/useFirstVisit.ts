'use client';

import { useState, useCallback } from 'react';

export type ScreenKey = 'guide' | 'profile' | 'scan' | 'search' | 'shield';

const STORAGE_KEY = 'trusttap_onboarding';

interface VisitedState {
  visited: Record<string, boolean>;
}

function readStorage(): VisitedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { visited: {} };
}

export function useFirstVisit() {
  const [state, setState] = useState<VisitedState>(readStorage);

  const hasVisited = useCallback((key: ScreenKey) => {
    return !!state.visited[key];
  }, [state]);

  const markVisited = useCallback((key: ScreenKey) => {
    setState(prev => {
      const next = { visited: { ...prev.visited, [key]: true } };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setState({ visited: {} });
  }, []);

  return { hasVisited, markVisited, resetAll };
}
