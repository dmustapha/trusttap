'use client';

import { ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { SolanaMobileWalletAdapter, createDefaultAddressSelector, createDefaultAuthorizationResultCache, createDefaultWalletNotFoundHandler } from '@solana-mobile/wallet-adapter-mobile';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { TrustTapWalletProvider } from '@/context/WalletContext';

import '@solana/wallet-adapter-react-ui/styles.css';

const HELIUS_RPC = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com';

export function ClientProviders({ children }: { children: ReactNode }) {
  const network = WalletAdapterNetwork.Mainnet;

  const wallets = useMemo(() => {
    const isMobileAndroid =
      typeof window !== 'undefined' && /android/i.test(navigator.userAgent);

    if (isMobileAndroid) {
      return [
        new SolanaMobileWalletAdapter({
          addressSelector: createDefaultAddressSelector(),
          appIdentity: {
            name: 'TrustTap+',
            uri: typeof window !== 'undefined' ? window.location.origin : 'https://trusttap.app',
            icon: '/icons/icon-192.png',
          },
          authorizationResultCache: createDefaultAuthorizationResultCache(),
          cluster: network,
          onWalletNotFound: createDefaultWalletNotFoundHandler(),
        }),
      ];
    }

    return [new PhantomWalletAdapter(), new SolflareWalletAdapter()];
  }, [network]);

  return (
    <ConnectionProvider endpoint={HELIUS_RPC}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <TrustTapWalletProvider>
            {children}
          </TrustTapWalletProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
