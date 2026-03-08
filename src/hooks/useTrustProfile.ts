'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TrustProfile } from '@/types';

interface UseTrustProfileResult {
  profile: TrustProfile | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useTrustProfile(walletAddress: string | null): UseTrustProfileResult {
  const [profile, setProfile] = useState<TrustProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!walletAddress) return;
    setProfile(null);
    setLoading(true);
    setError(null);

    try {
      // Try cached profile first
      const res = await fetch(`/api/profile/${walletAddress}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setLoading(false);

        // Fire-and-forget AI summary enhancement
        fetchAISummary(data, walletAddress);
        return;
      }

      // No cached profile, analyze the wallet
      const analyzeRes = await fetch('/api/analyze-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });

      if (!analyzeRes.ok) {
        throw new Error('Failed to analyze wallet');
      }

      const analysisData = await analyzeRes.json();
      setProfile(analysisData);
      fetchAISummary(analysisData, walletAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  const fetchAISummary = async (currentProfile: TrustProfile, address: string) => {
    try {
      if (currentProfile.aiSummary && currentProfile.aiSummary !== 'Generating trust analysis...') {
        return; // Already has AI summary
      }

      const res = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletData: currentProfile.analysis }),
      });

      if (res.ok) {
        const { summary, sybilAssessment } = await res.json();
        setProfile(prev => prev && prev.walletAddress === address
          ? { ...prev, aiSummary: summary, sybilAssessment }
          : prev
        );
      }
    } catch { /* AI summary is non-critical */ }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refresh: fetchProfile };
}
