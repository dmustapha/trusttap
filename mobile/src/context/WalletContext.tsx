import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../lib/api';

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
  disconnect: () => Promise<void>;
  isDemoMode: boolean;
}

const WalletContext = createContext<WalletContextValue | null>(null);

const STORAGE_KEY = 'trusttap_wallet';

export function TrustTapWalletProvider({ children }: { children: ReactNode }) {
  const [walletMode, setWalletMode] = useState<{ mode: WalletMode; demoAddress: string | null }>({
    mode: 'disconnected',
    demoAddress: null,
  });
  const [hasSGT, setHasSGT] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCheckingSGT, setIsCheckingSGT] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore saved state on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.isDemoMode && parsed.publicKey) {
            setWalletMode({ mode: 'demo', demoAddress: parsed.publicKey });
            setHasSGT(parsed.hasSGT ?? true);
          }
        }
      } catch { /* ignore */ }
    })();
  }, []);

  const connect = useCallback(async (demoAddress?: string) => {
    setError(null);
    setIsConnecting(true);

    try {
      // Demo mode: connect with specific address or fetch first demo wallet
      if (demoAddress) {
        setWalletMode({ mode: 'demo', demoAddress });
        setHasSGT(true);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
          publicKey: demoAddress, connected: true, hasSGT: true, isDemoMode: true,
        }));
        return;
      }

      // No address provided: fetch first demo wallet
      try {
        const wallets = await api.getDemoWallets();
        const first = wallets[0]?.walletAddress;
        if (first) {
          setWalletMode({ mode: 'demo', demoAddress: first });
          setHasSGT(true);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
            publicKey: first, connected: true, hasSGT: true, isDemoMode: true,
          }));
          return;
        }
      } catch {
        // If API fails, use hardcoded first demo wallet
        const fallbackAddress = 'fRRwPwbb9wqTbf9ZDHjMRVKZoDBPsjsP7Rh7VZVMqxX3';
        setWalletMode({ mode: 'demo', demoAddress: fallbackAddress });
        setHasSGT(true);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
          publicKey: fallbackAddress, connected: true, hasSGT: true, isDemoMode: true,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setWalletMode({ mode: 'disconnected', demoAddress: null });
    setHasSGT(false);
    setError(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const publicKey = useMemo(() => walletMode.demoAddress, [walletMode]);
  const connected = useMemo(() => walletMode.mode === 'demo' || walletMode.mode === 'real', [walletMode.mode]);

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        connected,
        hasSGT,
        isConnecting,
        isCheckingSGT,
        error,
        connect,
        disconnect,
        isDemoMode: walletMode.mode === 'demo',
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
