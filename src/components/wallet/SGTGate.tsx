'use client';

import { motion } from 'framer-motion';

interface SGTGateProps {
  onTryAgain: () => void;
}

export function SGTGate({ onTryAgain }: SGTGateProps) {
  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex h-20 w-20 items-center justify-center bg-[rgba(212,160,23,0.1)]">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 className="font-[family-name:var(--font-serif-display)] text-2xl font-normal text-[var(--text-primary)]">Seeker Required</h2>
      <p className="max-w-sm text-[var(--text-secondary)]">
        TrustTap+ requires a Solana Seeker device with a Seeker Genesis Token (SGT) to verify your identity.
      </p>
      <button
        onClick={onTryAgain}
        className="mt-4 border border-[var(--bg-elevated)] px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--text-muted)]"
      >
        Connect Different Wallet
      </button>
    </motion.div>
  );
}
