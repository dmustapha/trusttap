'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

type WalletMode = 'disconnected' | 'demo' | 'real';

interface WalletState {
  publicKey: string | null;
  connected: boolean;
  hasSGT: boolean;
  isConnecting: boolean;
  isCheckingSGT: boolean;
  error: string | null;
}

interface WalletContextValue extends WalletState {
  connect: (demoAddress?: string) => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

function getInitialState(): { mode: WalletMode; demoAddress: string | null; hasSGT: boolean } {
  if (typeof window === 'undefined') return { mode: 'disconnected', demoAddress: null, hasSGT: false };
  try {
    const saved = localStorage.getItem('trusttap_wallet');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.isDemoMode && parsed.publicKey) {
        return { mode: 'demo', demoAddress: parsed.publicKey, hasSGT: parsed.hasSGT ?? true };
      }
      if (parsed.connected && parsed.publicKey) {
        return { mode: 'real', demoAddress: null, hasSGT: parsed.hasSGT ?? false };
      }
    }
  } catch { /* ignore */ }
  return { mode: 'disconnected', demoAddress: null, hasSGT: false };
}

export function TrustTapWalletProvider({ children }: { children: ReactNode }) {
  const solana = useSolanaWallet();
  const { setVisible } = useWalletModal();

  const [initialState] = useState(getInitialState);
  const [walletMode, setWalletMode] = useState<{ mode: WalletMode; demoAddress: string | null }>({ mode: initialState.mode, demoAddress: initialState.demoAddress });
  const [hasSGT, setHasSGT] = useState(initialState.hasSGT);
  const [isCheckingSGT, setIsCheckingSGT] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fix #4: Surface wallet adapter errors
  useEffect(() => {
    if (solana.wallet?.adapter) {
      const handleError = (err: Error) => {
        setError(err.message || 'Wallet connection failed. Is a Solana wallet app installed?');
      };
      solana.wallet.adapter.on('error', handleError);
      return () => { solana.wallet?.adapter.off('error', handleError); };
    }
  }, [solana.wallet]);

  // When real wallet connects → switch to real mode, check SGT
  useEffect(() => {
    if (solana.connected && solana.publicKey) {
      const address = solana.publicKey.toBase58();
      // Atomically switch to real mode
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWalletMode({ mode: 'real', demoAddress: null });
      setIsCheckingSGT(true);
      setError(null);

      fetch(`/api/profile/${address}`)
        .then(r => {
          if (!r.ok) throw new Error('Profile not cached');
          return r.json();
        })
        .then(data => {
          const sgtResult = data?.analysis?.hasSGT ?? false;
          setHasSGT(sgtResult);
          localStorage.setItem('trusttap_wallet', JSON.stringify({
            publicKey: address, connected: true, hasSGT: sgtResult,
          }));
        })
        .catch(() => {
          return fetch('/api/analyze-wallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress: address }),
          })
            .then(r => r.json())
            .then(data => {
              const sgtResult = data?.analysis?.hasSGT ?? false;
              setHasSGT(sgtResult);
              localStorage.setItem('trusttap_wallet', JSON.stringify({
                publicKey: address, connected: true, hasSGT: sgtResult,
              }));
            })
            .catch(() => {
              setError('Could not verify SGT ownership.');
              setHasSGT(false);
            });
        })
        .finally(() => setIsCheckingSGT(false));
    } else if (!solana.connected && walletMode.mode === 'real') {
      // Real wallet disconnected externally
      setWalletMode({ mode: 'disconnected', demoAddress: null });
      setHasSGT(false);
      localStorage.removeItem('trusttap_wallet');
    }
  }, [solana.connected, solana.publicKey, walletMode.mode]);

  const connect = useCallback(async (demoAddress?: string) => {
    setError(null);
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
      || (typeof window !== 'undefined' && window.location.hostname.includes('trusttap'));

    if (isDemoMode && demoAddress) {
      setWalletMode({ mode: 'demo', demoAddress });
      setHasSGT(true);
      localStorage.setItem('trusttap_wallet', JSON.stringify({
        publicKey: demoAddress, connected: true, hasSGT: true, isDemoMode: true,
      }));
      return;
    }

    if (isDemoMode && !demoAddress) {
      try {
        const res = await fetch('/api/demo-wallets');
        if (res.ok) {
          const wallets = await res.json();
          const first = wallets[0]?.walletAddress;
          if (first) {
            setWalletMode({ mode: 'demo', demoAddress: first });
            setHasSGT(true);
            localStorage.setItem('trusttap_wallet', JSON.stringify({
              publicKey: first, connected: true, hasSGT: true, isDemoMode: true,
            }));
            return;
          }
        }
      } catch { /* fall through */ }
    }

    // Real wallet: open modal
    setVisible(true);
  }, [setVisible]);

  const disconnect = useCallback(() => {
    if (walletMode.mode === 'real') {
      solana.disconnect();
    }
    setWalletMode({ mode: 'disconnected', demoAddress: null });
    setHasSGT(false);
    setError(null);
    localStorage.removeItem('trusttap_wallet');
  }, [walletMode.mode, solana]);

  // Memoized derived state
  const publicKey = useMemo(
    () => walletMode.mode === 'real' ? (solana.publicKey?.toBase58() ?? null) : walletMode.demoAddress,
    [walletMode, solana.publicKey],
  );
  const connected = useMemo(
    () => walletMode.mode === 'real' ? solana.connected : walletMode.mode === 'demo',
    [walletMode.mode, solana.connected],
  );

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        connected,
        hasSGT,
        isConnecting: solana.connecting,
        isCheckingSGT,
        error,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within TrustTapWalletProvider');
  return ctx;
}
