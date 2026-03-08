import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TrustProfile } from '../types';
import { api } from '../lib/api';
import { calculateTrustScore } from '../lib/scoring';
import demoWallets from '../data/demo-wallets.json';

const MEETING_BONUS_PREFIX = 'trusttap_meeting_bonus_';

interface UseTrustProfileResult {
  profile: TrustProfile | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

function findDemoProfile(walletAddress: string): TrustProfile | null {
  const demo = demoWallets.find(w => w.walletAddress === walletAddress);
  return demo?.profile as TrustProfile | null ?? null;
}

async function applyMeetingBonus(data: TrustProfile, walletAddress: string): Promise<TrustProfile> {
  try {
    const key = MEETING_BONUS_PREFIX + walletAddress;
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return data;
    const bonus = parseInt(raw, 10);
    if (isNaN(bonus)) {
      await AsyncStorage.removeItem(key);
      return data;
    }
    if (bonus > 0 && data.analysis) {
      const updatedAnalysis = {
        ...data.analysis,
        meetingCount: Math.min(data.analysis.meetingCount + bonus, 5),
      };
      const { score, breakdown, label, color } = calculateTrustScore(updatedAnalysis);
      return { ...data, analysis: updatedAnalysis, score, breakdown, label, color };
    }
  } catch {}
  return data;
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
      try {
        const data = await applyMeetingBonus(await api.getProfile(walletAddress), walletAddress);
        setProfile(data);
        fetchAISummary(data, walletAddress);
        return;
      } catch {
        // Not cached, try analyze
      }

      const analysisData = await applyMeetingBonus(await api.analyzeWallet(walletAddress), walletAddress);
      setProfile(analysisData);
      fetchAISummary(analysisData, walletAddress);
    } catch {
      // API failed — fall back to local demo data
      const demoProfile = findDemoProfile(walletAddress);
      if (demoProfile) {
        setProfile(await applyMeetingBonus(demoProfile, walletAddress));
      } else {
        setError('Could not load profile. Check your connection.');
      }
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  const fetchAISummary = async (currentProfile: TrustProfile, address: string) => {
    try {
      if (currentProfile.aiSummary && currentProfile.aiSummary !== 'Generating trust analysis...') {
        return;
      }
      const { summary, sybilAssessment } = await api.getAISummary(currentProfile.analysis);
      setProfile(prev => prev && prev.walletAddress === address
        ? { ...prev, aiSummary: summary, sybilAssessment }
        : prev
      );
    } catch { /* AI summary is non-critical */ }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refresh: fetchProfile };
}
