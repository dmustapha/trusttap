'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { buildMeetingRegistrationTx } from '@/lib/meeting-tx';
import { useWallet } from '@/context/WalletContext';
import { TipButton } from '@/components/trust/TipButton';

interface MeetingSuccessProps {
  myScore: number;
  partnerScore: number;
  partnerAddress: string;
  onDone: () => void;
}

export function MeetingSuccess({ myScore, partnerScore, partnerAddress, onDone }: MeetingSuccessProps) {
  const { publicKey } = useWallet();
  const { sendTransaction } = useSolanaWallet();
  const { connection } = useConnection();
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [regError, setRegError] = useState<string | null>(null);

  const isDemoMode = (() => {
    try {
      return typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('trusttap_wallet') || '{}').isDemoMode;
    } catch { return false; }
  })();

  const registerOnChain = async () => {
    if (!publicKey) return;
    setRegistering(true);
    setRegError(null);

    try {
      if (isDemoMode) {
        // Demo mode: simulate transaction
        await new Promise(r => setTimeout(r, 2000));
        const fakeSig = 'DEMO' + btoa(partnerAddress.slice(0, 8) + Date.now()).slice(0, 40);
        setTxSignature(fakeSig);
        setRegistered(true);
      } else {
        // Real wallet: build tx and send via wallet adapter (Phantom/MWA)
        const { tx, blockhash, lastValidBlockHeight } = await buildMeetingRegistrationTx(publicKey, partnerAddress, Date.now());
        const signature = await sendTransaction(tx, connection);
        await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed');
        setTxSignature(signature);
        setRegistered(true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      if (msg.includes('reject') || msg.includes('denied') || msg.includes('User rejected')) {
        setRegError('No problem — meeting still verified locally');
      } else if (msg.includes('insufficient') || msg.includes('0x1')) {
        setRegError('Need ~0.000005 SOL for the transaction fee');
      } else {
        setRegError(msg);
      }
    } finally {
      setRegistering(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-6 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="flex h-24 w-24 items-center justify-center bg-[rgba(16,185,129,0.08)]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
      >
        <motion.svg
          width="48" height="48" viewBox="0 0 24 24" fill="none"
          stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        >
          <motion.path
            d="M20 6L9 17l-5-5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </motion.svg>
      </motion.div>

      <div className="text-center">
        <h3 className="text-2xl font-bold font-[family-name:var(--font-serif-display)] text-[var(--text-primary)]">Meeting Verified!</h3>
        <p className="mt-2 text-sm font-[family-name:var(--font-serif-body)] text-[var(--text-secondary)]">Meeting recorded — register on-chain for a permanent record</p>
      </div>

      <div className="flex gap-6">
        <div className="text-center">
          <p className="text-xs text-[var(--text-muted)]">Your New Score</p>
          <p className="text-2xl font-bold text-[var(--tt-primary)]">{myScore}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[var(--text-muted)]">Partner New Score</p>
          <p className="text-2xl font-bold text-[var(--tt-primary)]">{partnerScore}</p>
        </div>
      </div>

      {!registered && (
        <div className="w-full" style={{ borderTop: 'var(--rule-muted)', paddingTop: '1.25rem' }}>
          <div className="mb-3 flex items-center gap-3">
            <span className="tt-ui-label" style={{ color: 'var(--tt-primary)' }}>
              Register on-chain
            </span>
            <div className="flex-1" style={{ borderTop: 'var(--rule-muted)' }} />
          </div>
          <p className="mb-4 text-center text-sm text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-serif-body)' }}>
            Record this meeting on Solana to boost your TrustScore
          </p>
          <div className="flex w-full gap-3">
            <motion.button
              onClick={registerOnChain}
              disabled={registering}
              className="flex-1 bg-[var(--tt-primary)] py-3 text-sm font-semibold font-[family-name:var(--font-ui)] text-[#1a1a1a] disabled:opacity-60"
              whileTap={{ scale: 0.97 }}
            >
              {registering ? 'Registering...' : 'Register On-Chain'}
            </motion.button>
            <button
              onClick={onDone}
              className="px-4 py-3 text-sm text-[var(--text-muted)] font-[family-name:var(--font-ui)]"
            >
              Skip
            </button>
          </div>
          {regError && (
            <p className="mt-3 text-center text-xs text-[var(--text-muted)]">{regError}</p>
          )}
        </div>
      )}

      {registered && txSignature && (
        <div className="w-full text-center" style={{ borderTop: 'var(--rule-muted)', paddingTop: '1rem' }}>
          <p className="text-sm text-[var(--tt-primary)]">
            <svg className="mr-1 inline h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Registered on-chain
            {isDemoMode && <span className="ml-1 text-[var(--text-muted)]">(demo)</span>}
          </p>
          {!txSignature.startsWith('DEMO') && (
            <a
              href={`https://solscan.io/tx/${txSignature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-xs text-[var(--tt-primary)] underline"
            >
              View on Solscan ↗
            </a>
          )}
          <div className="mt-4">
            <TipButton recipientAddress={partnerAddress} />
          </div>
        </div>
      )}

      <motion.button
        onClick={onDone}
        className="mt-4 w-full bg-[var(--bg-elevated)] py-3 text-sm font-medium font-[family-name:var(--font-ui)] text-[var(--text-primary)]"
        whileTap={{ scale: 0.97 }}
      >
        Done
      </motion.button>
    </motion.div>
  );
}
