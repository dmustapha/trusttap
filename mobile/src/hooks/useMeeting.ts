import { useState, useCallback } from 'react';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TrustProfile } from '../types';
import { api } from '../lib/api';
import demoWallets from '../data/demo-wallets.json';

const MEETING_BONUS_PREFIX = 'trusttap_meeting_bonus_';
const QR_EXPIRY_MS = 180_000; // 3 minutes — tolerates mobile clock skew

type MeetingState = 'idle' | 'showing_qr' | 'scanning' | 'partner_preview' | 'submitting' | 'success' | 'error';

interface MeetingChallenge {
  walletAddress: string;
  timestamp: number;
  nonce: string;
}

interface UseMeetingResult {
  state: MeetingState;
  challenge: MeetingChallenge | null;
  partnerProfile: TrustProfile | null;
  partnerAddress: string | null;
  error: string | null;
  updatedScores: { myScore: number; partnerScore: number } | null;
  generateQR: (walletAddress: string) => void;
  startScanning: () => void;
  handleScan: (data: string) => Promise<void>;
  confirmMeeting: (myAddress: string) => Promise<void>;
  reset: () => void;
}

export function useMeeting(): UseMeetingResult {
  const [state, setState] = useState<MeetingState>('idle');
  const [challenge, setChallenge] = useState<MeetingChallenge | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<TrustProfile | null>(null);
  const [partnerAddress, setPartnerAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updatedScores, setUpdatedScores] = useState<{ myScore: number; partnerScore: number } | null>(null);

  const incrementMeetingBonus = async (walletAddress: string) => {
    try {
      const key = MEETING_BONUS_PREFIX + walletAddress;
      const raw = await AsyncStorage.getItem(key);
      const current = raw ? parseInt(raw, 10) : 0;
      await AsyncStorage.setItem(key, String(Math.min(current + 1, 5)));
    } catch {}
  };

  const generateQR = useCallback((walletAddress: string) => {
    const newChallenge: MeetingChallenge = {
      walletAddress,
      timestamp: Date.now(),
      nonce: Crypto.randomUUID(),
    };
    setChallenge(newChallenge);
    setState('showing_qr');
    setError(null);
  }, []);

  const startScanning = useCallback(() => {
    setState('scanning');
    setError(null);
  }, []);

  const handleScan = useCallback(async (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (!parsed.walletAddress || !parsed.timestamp || !parsed.nonce) {
        throw new Error('Invalid QR data');
      }

      if (Date.now() - parsed.timestamp > QR_EXPIRY_MS) {
        throw new Error('QR code expired. Ask partner to generate a new one.');
      }

      setPartnerAddress(parsed.walletAddress);
      setState('partner_preview');

      try {
        const profile = await api.getProfile(parsed.walletAddress);
        setPartnerProfile(profile);
      } catch {
        // Fall back to local demo data
        const demo = demoWallets.find(w => w.walletAddress === parsed.walletAddress);
        if (demo?.profile) {
          setPartnerProfile(demo.profile as TrustProfile);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid QR data');
      setState('error');
    }
  }, []);

  const confirmMeeting = useCallback(async (myAddress: string) => {
    if (!partnerAddress) return;
    setState('submitting');

    try {
      const data = await api.createMeeting({
        walletA: myAddress,
        walletB: partnerAddress,
        timestamp: new Date().toISOString(),
        signatureA: 'demo-signature-a',
        signatureB: 'demo-signature-b',
        nonceA: Crypto.randomUUID(),
        nonceB: Crypto.randomUUID(),
      });

      setUpdatedScores({
        myScore: data.newScores?.walletA ?? 0,
        partnerScore: data.newScores?.walletB ?? 0,
      });
      setState('success');
      incrementMeetingBonus(myAddress);
    } catch {
      // Offline fallback: simulate meeting success with demo scores
      // Don't increment bonus — meeting wasn't verified server-side
      const myDemo = demoWallets.find(w => w.walletAddress === myAddress);
      const partnerDemo = demoWallets.find(w => w.walletAddress === partnerAddress);
      setUpdatedScores({
        myScore: (myDemo?.profile?.score ?? 50) + 3,
        partnerScore: (partnerDemo?.profile?.score ?? 50) + 3,
      });
      setState('success');
    }
  }, [partnerAddress]);

  const reset = useCallback(() => {
    setState('idle');
    setChallenge(null);
    setPartnerProfile(null);
    setPartnerAddress(null);
    setError(null);
    setUpdatedScores(null);
  }, []);

  return {
    state, challenge, partnerProfile, partnerAddress,
    error, updatedScores, generateQR, startScanning,
    handleScan, confirmMeeting, reset,
  };
}
