'use client';

import { useState, useCallback } from 'react';
import type { TrustProfile } from '@/types';

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

  const generateQR = useCallback((walletAddress: string) => {
    const newChallenge: MeetingChallenge = {
      walletAddress,
      timestamp: Date.now(),
      nonce: crypto.randomUUID(),
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

      // Check expiry (60 seconds)
      if (Date.now() - parsed.timestamp > 60000) {
        throw new Error('QR code expired. Ask partner to generate a new one.');
      }

      setPartnerAddress(parsed.walletAddress);
      setState('partner_preview');

      // Fetch partner profile
      const res = await fetch(`/api/profile/${parsed.walletAddress}`);
      if (res.ok) {
        const profile = await res.json();
        setPartnerProfile(profile);
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
      const res = await fetch('/api/meeting/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // TODO: Production — wire real Ed25519 signatures via wallet adapter signMessage():
        // 1. QR generator: sign challenge (walletA:timestamp:nonceA) → include signature in QR payload
        // 2. Scanner: sign own challenge (walletB:timestamp:nonceB) at confirmation
        // 3. Server verifies both via nacl.sign.detached.verify (already implemented in meeting.ts)
        // Currently using demo stubs — server skips verification when DEMO_MODE=true
        body: JSON.stringify({
          walletA: myAddress,
          walletB: partnerAddress,
          timestamp: new Date().toISOString(),
          signatureA: 'demo-signature-a',
          signatureB: 'demo-signature-b',
          nonceA: crypto.randomUUID(),
          nonceB: crypto.randomUUID(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Meeting verification failed');
      }

      const data = await res.json();
      setUpdatedScores({
        myScore: data.newScores?.walletA ?? 0,
        partnerScore: data.newScores?.walletB ?? 0,
      });
      setState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Meeting failed');
      setState('error');
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
