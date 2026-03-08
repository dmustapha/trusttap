'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@/context/WalletContext';
import { PageShell } from '@/components/layout/PageShell';
import { BottomNav } from '@/components/layout/BottomNav';
import { ThresholdSlider } from '@/components/shield/ThresholdSlider';
import { FilterAnimation } from '@/components/shield/FilterAnimation';
import { ResultsDashboard } from '@/components/shield/ResultsDashboard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { HelpIcon } from '@/components/ui/HelpIcon';

interface SybilResult {
  total: number;
  sgtVerified: number;
  meetsThreshold: number;
  rejected: number;
}

export default function ShieldPage() {
  const router = useRouter();
  const { connected } = useWallet();
  const [threshold, setThreshold] = useState(50);
  const [requireSGT, setRequireSGT] = useState(true);
  const [result, setResult] = useState<SybilResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [animationRunning, setAnimationRunning] = useState(false);

  useEffect(() => {
    if (!connected) router.push('/');
  }, [connected, router]);

  const runFilter = async () => {
    setLoading(true);
    setResult(null);
    setFilterError(null);
    setAnimationRunning(false);

    try {
      const res = await fetch('/api/sybil-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddresses: ['demo-batch'], minTrustScore: threshold, requireSGT }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
        setTimeout(() => setAnimationRunning(true), 100);
      } else {
        const errData = await res.json().catch(() => null);
        setFilterError(errData?.error || `Sybil filter failed (${res.status})`);
      }
    } catch (err) {
      setFilterError(err instanceof Error ? err.message : 'Sybil filter failed');
    } finally {
      setLoading(false);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !connected) return null;

  return (
    <>
      <PageShell>
        <div className="mb-6">
          <div className="flex items-center gap-1">
            <h1 className="font-[family-name:var(--font-serif-display)] text-2xl font-bold text-[var(--text-primary)]">Sybil Shield</h1>
            <HelpIcon tooltipKey="sybil-shield" />
          </div>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Filter airdrop participants by device verification and TrustScore
          </p>
        </div>

        {/* Combined filter controls panel */}
        <div className="mb-6 border border-[var(--bg-elevated)] bg-[var(--bg-surface)]">
          {/* Trust Threshold */}
          <div className="p-5">
            <div className="mb-3 flex items-center gap-1">
              <span className="font-[family-name:var(--font-ui)] text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Trust Threshold</span>
              <HelpIcon tooltipKey="trust-threshold" />
            </div>
            <ThresholdSlider value={threshold} onChange={setThreshold} />
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--bg-elevated)' }} />

          {/* SGT filter toggle */}
          <div className="p-5">
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <div>
                <span className="font-[family-name:var(--font-ui)] text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Require SGT</span>
                <p className="mt-1 text-sm text-[var(--text-primary)]">
                  {requireSGT ? 'Only SGT-verified wallets can pass' : 'Any wallet above threshold passes'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={requireSGT}
                onClick={() => setRequireSGT(!requireSGT)}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
                  requireSGT ? 'bg-[var(--tt-primary)]' : 'bg-[var(--bg-subtle)]'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    requireSGT ? 'translate-x-5' : 'translate-x-0.5'
                  } mt-0.5`}
                />
              </button>
            </label>
          </div>
        </div>

        {/* Run button */}
        <motion.button
          onClick={runFilter}
          disabled={loading}
          className="mb-6 w-full py-4 text-lg font-semibold text-[var(--bg-base)] shadow-lg disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #10B981, #0D9668)' }}
          whileTap={{ scale: 0.97 }}
        >
          {loading ? 'Running...' : 'Run Sybil Filter'}
        </motion.button>

        {loading && <LoadingSpinner text="Checking 1,000 wallets..." />}
        {filterError && <ErrorMessage message={filterError} />}

        {/* Results */}
        {result ? (
          <>
            <FilterAnimation
              total={result.total}
              sgtVerified={result.sgtVerified}
              meetsThreshold={result.meetsThreshold}
              running={animationRunning}
            />
            <ResultsDashboard
              total={result.total}
              sgtVerified={result.sgtVerified}
              meetsThreshold={result.meetsThreshold}
              rejected={result.rejected}
              threshold={threshold}
            />
          </>
        ) : !loading && !filterError && (
          /* Sample preview so judges see what to expect */
          <div className="relative">
            <div className="pointer-events-none" style={{ opacity: 0.45 }}>
              <ResultsDashboard
                total={1000}
                sgtVerified={342}
                meetsThreshold={187}
                rejected={813}
                threshold={threshold}
              />
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(14,12,10,0.6) 50%, transparent 100%)' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--bg-elevated)',
                  padding: '6px 14px',
                  background: 'var(--bg-base)',
                }}
              >
                Sample Output
              </span>
            </div>
          </div>
        )}
      </PageShell>
      <BottomNav />
    </>
  );
}
