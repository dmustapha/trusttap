'use client';

import { motion } from 'framer-motion';

interface ResultsDashboardProps {
  total: number;
  sgtVerified: number;
  meetsThreshold: number;
  rejected: number;
  threshold: number;
}

export function ResultsDashboard({ total, sgtVerified, meetsThreshold, rejected, threshold }: ResultsDashboardProps) {
  const passRate = total > 0 ? ((meetsThreshold / total) * 100).toFixed(1) : '0';

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Wallets" value={total} color="var(--text-secondary)" />
        <StatCard label="SGT Verified" value={sgtVerified} color="var(--success)" />
        <StatCard label="Meets Threshold" value={meetsThreshold} color="var(--tt-primary)" />
        <StatCard label="Rejected" value={rejected} color="var(--danger)" />
      </div>

      <div className="border border-[var(--bg-elevated)] bg-[var(--bg-surface)] p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-muted)]">Pass Rate</span>
          <span className="text-lg font-bold text-[var(--tt-primary)]">{passRate}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
          <motion.div
            className="h-full rounded-full bg-[var(--tt-primary)]"
            initial={{ width: 0 }}
            animate={{ width: `${passRate}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      {/* How it works */}
      <details className="border border-[var(--bg-elevated)] bg-[var(--bg-surface)]">
        <summary className="cursor-pointer p-4 font-[family-name:var(--font-serif-display)] text-sm font-medium text-[var(--text-primary)]">
          How Sybil Shield Works
        </summary>
        <div className="border-t border-[var(--bg-elevated)] p-4 text-xs leading-relaxed text-[var(--text-muted)]">
          <ol className="list-inside list-decimal space-y-2">
            <li>Check if wallet holds a Seeker Genesis Token (SGT)</li>
            <li>Retrieve on-chain TrustScore from TrustTap+</li>
            <li>Filter wallets below the minimum trust threshold ({threshold})</li>
            <li>Only verified, trusted wallets pass through</li>
          </ol>
        </div>
      </details>
    </motion.div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="border border-[var(--bg-elevated)] bg-[var(--bg-surface)] p-3">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-bold" style={{ color }}>{value.toLocaleString()}</p>
    </div>
  );
}
