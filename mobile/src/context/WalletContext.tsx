import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { transact, Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { PublicKey } from '@solana/web3.js';
import { Base64 } from 'js-base64';
import { api } from '../lib/api';

type WalletMode = 'disconnected' | 'demo' | 'real';

const APP_IDENTITY = {
  name: 'TrustTap+',
  uri: 'https://trusttap.vercel.app',
  icon: '/favicon.ico',
};

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
  connectReal: () => Promise<void>;
  disconnect: () => Promise<void>;
  isDemoMode: boolean;
}

const WalletContext = createContext<WalletContextValue | null>(null);

const STORAGE_KEY = 'trusttap_wallet';
const AUTH_TOKEN_KEY = 'trusttap_mwa_auth';

export function TrustTapWalletProvider({ children }: { children: ReactNode }) {
  const [walletMode, setWalletMode] = useState<{ mode: WalletMode; address: string | null }>({
    mode: 'disconnected',
    address: null,
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
          if (parsed.publicKey) {
            setWalletMode({
              mode: parsed.isDemoMode ? 'demo' : 'real',
              address: parsed.publicKey,
            });
            setHasSGT(parsed.hasSGT ?? true);
          }
        }
      } catch { /* ignore */ }
    })();
  }, []);

  // Demo mode connect
  const connect = useCallback(async (demoAddress?: string) => {
    setError(null);
    setIsConnecting(true);

    try {
      if (demoAddress) {
        setWalletMode({ mode: 'demo', address: demoAddress });
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
          setWalletMode({ mode: 'demo', address: first });
          setHasSGT(true);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
            publicKey: first, connected: true, hasSGT: true, isDemoMode: true,
          }));
          return;
        }
      } catch {
        const fallbackAddress = 'fRRwPwbb9wqTbf9ZDHjMRVKZoDBPsjsP7Rh7VZVMqxX3';
        setWalletMode({ mode: 'demo', address: fallbackAddress });
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

  // Real wallet connect via MWA (Android only)
  const connectReal = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setError('Wallet connection requires an Android device with a Solana wallet app');
      return;
    }

    setError(null);
    setIsConnecting(true);

    try {
      const authResult = await transact(async (wallet: Web3MobileWallet) => {
        const cachedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        return await wallet.authorize({
          chain: 'solana:mainnet',
          identity: APP_IDENTITY,
          ...(cachedToken ? { auth_token: cachedToken } : {}),
        });
      });

      const pubkey = new PublicKey(Base64.toUint8Array(authResult.accounts[0].address)).toBase58();

      // Cache auth token for silent re-auth
      if (authResult.auth_token) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, authResult.auth_token);
      }

      setWalletMode({ mode: 'real', address: pubkey });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        publicKey: pubkey, connected: true, hasSGT: false, isDemoMode: false,
      }));

      // Check SGT in background
      setIsCheckingSGT(true);
      try {
        const { hasSGT: sgtResult } = await api.checkSGT(pubkey);
        setHasSGT(sgtResult);
      } catch {
        setHasSGT(false);
      } finally {
        setIsCheckingSGT(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wallet connection failed. Is a Solana wallet installed?');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    // Deauthorize MWA session if real mode
    if (walletMode.mode === 'real') {
      try {
        const cachedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        if (cachedToken) {
          await transact(async (wallet: Web3MobileWallet) => {
            await wallet.deauthorize({ auth_token: cachedToken });
          });
          await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
        }
      } catch { /* best effort */ }
    }

    setWalletMode({ mode: 'disconnected', address: null });
    setHasSGT(false);
    setError(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, [walletMode.mode]);

  const publicKey = useMemo(() => walletMode.address, [walletMode]);
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
        connectReal,
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
