'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { buildSKRTipTransaction } from '@/lib/skr';
import { useWallet } from '@/context/WalletContext';

interface TipButtonProps {
  recipientAddress: string;
}

const PRESET_AMOUNTS = [1, 5, 10];

export function TipButton({ recipientAddress }: TipButtonProps) {
  const { publicKey } = useWallet();
  const { sendTransaction } = useSolanaWallet();
  const { connection } = useConnection();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentAmount, setSentAmount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isDemoMode = (() => {
    try {
      return typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('trusttap_wallet') || '{}').isDemoMode;
    } catch { return false; }
  })();

  const sendTip = async (amount: number) => {
    if (!publicKey) return;
    setSending(true);
    setError(null);

    try {
      if (isDemoMode) {
        await new Promise(r => setTimeout(r, 1500));
      } else {
        const { tx, blockhash, lastValidBlockHeight } = await buildSKRTipTransaction(publicKey, recipientAddress, amount);
        const signature = await sendTransaction(tx, connection);
        await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');
      }
      setSent(true);
      setSentAmount(amount);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Tip failed';
      if (msg.includes('reject') || msg.includes('denied') || msg.includes('User rejected')) {
        setError('Transaction cancelled');
      } else {
        setError(msg);
      }
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <p className="py-2 text-center text-sm text-[var(--tt-primary)]">
        Tipped {sentAmount} SKR ✓
      </p>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-3">
        <span className="tt-ui-label">Tip SKR</span>
        <div className="flex-1" style={{ borderTop: 'var(--rule-muted)' }} />
      </div>
      <div className="flex gap-2">
        {PRESET_AMOUNTS.map(amount => (
          <motion.button
            key={amount}
            onClick={() => sendTip(amount)}
            disabled={sending}
            className="flex-1 py-2 font-[family-name:var(--font-mono)] text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--tt-primary)] disabled:opacity-50"
            style={{ border: '1px solid rgba(16, 185, 129, 0.15)', background: 'transparent' }}
            whileTap={{ scale: 0.97 }}
          >
            {sending ? '...' : `${amount} SKR`}
          </motion.button>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-center text-xs text-[var(--text-muted)]">{error}</p>
      )}
    </div>
  );
}
