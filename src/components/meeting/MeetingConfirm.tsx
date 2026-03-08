'use client';

import { motion } from 'framer-motion';
import type { TrustProfile } from '@/types';

function truncateAddress(addr: string) {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

interface MeetingConfirmProps {
  partnerAddress: string;
  partnerProfile: TrustProfile | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function MeetingConfirm({ partnerAddress, partnerProfile, onConfirm, onCancel, loading }: MeetingConfirmProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex h-16 w-16 items-center justify-center bg-[rgba(16,185,129,0.08)]">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round">
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold font-[family-name:var(--font-serif-display)] text-[var(--text-primary)]">Verify Meeting</h3>
        <p className="mt-1 font-mono text-sm text-[var(--text-secondary)]">{truncateAddress(partnerAddress)}</p>
      </div>

      {partnerProfile && (
        <div className="w-full border border-[var(--bg-elevated)] bg-[var(--bg-surface)] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-[family-name:var(--font-serif-body)] text-[var(--text-secondary)]">TrustScore</span>
            <span className="text-xl font-bold" style={{ color: partnerProfile.color }}>
              {partnerProfile.score}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-sm font-[family-name:var(--font-serif-body)] text-[var(--text-secondary)]">Label</span>
            <span
              className="px-2 py-0.5 text-xs font-semibold"
              style={{ backgroundColor: partnerProfile.color + '20', color: partnerProfile.color }}
            >
              {partnerProfile.label}
            </span>
          </div>
        </div>
      )}

      <div className="flex w-full gap-3">
        <button
          onClick={onCancel}
          className="flex-1 border border-[var(--bg-elevated)] py-3 text-sm font-medium font-[family-name:var(--font-ui)] text-[var(--text-primary)]"
        >
          Cancel
        </button>
        <motion.button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 bg-[var(--tt-primary)] py-3 text-sm font-semibold font-[family-name:var(--font-ui)] text-[#1a1a1a] disabled:opacity-60"
          whileTap={{ scale: 0.97 }}
        >
          {loading ? 'Verifying...' : 'Confirm Meeting'}
        </motion.button>
      </div>
    </motion.div>
  );
}
