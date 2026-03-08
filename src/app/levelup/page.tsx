'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useTrustProfile } from '@/hooks/useTrustProfile';
import { PageShell } from '@/components/layout/PageShell';
import { BottomNav } from '@/components/layout/BottomNav';
import { AnalysisLoader } from '@/components/ui/AnalysisLoader';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ActionGroup } from '@/components/levelup/ActionGroup';
import { ActionToggle } from '@/components/levelup/ActionToggle';
import {
  ACTION_GROUPS,
  getAvailableActions,
} from '@/lib/levelup-actions';
import { calculateTrustScore } from '@/lib/scoring';

export default function LevelUpPage() {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const { profile, loading, error } = useTrustProfile(publicKey);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !connected) router.push('/');
  }, [mounted, connected, router]);

  const analysis = profile?.analysis ?? null;

  const availableActions = useMemo(
    () => analysis ? getAvailableActions(analysis) : [],
    [analysis],
  );

  const current = useMemo(() => {
    if (!analysis) return null;
    return calculateTrustScore(analysis);
  }, [analysis]);

  const actionDeltas = useMemo(() => {
    if (!analysis) return new Map<string, number>();
    const deltas = new Map<string, number>();
    const baseScore = current?.score ?? 0;
    for (const action of availableActions) {
      const modified = action.apply({ ...analysis, protocolsUsed: [...analysis.protocolsUsed] });
      const { score } = calculateTrustScore(modified);
      deltas.set(action.id, score - baseScore);
    }
    return deltas;
  }, [analysis, current, availableActions]);

  if (!mounted) return null;

  const totalPotential = Array.from(actionDeltas.values()).reduce((sum, d) => sum + d, 0);

  return (
    <>
      <PageShell>
        <div className="mb-6">
          <h1
            className="font-[family-name:var(--font-serif-display)] text-[var(--text-primary)]"
            style={{ fontSize: '1.7rem', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.02em' }}
          >
            Level Up
          </h1>
          <p
            className="mt-2 text-[var(--text-muted)]"
            style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.82rem', lineHeight: 1.5 }}
          >
            Actions you can take right now to raise your TrustScore.
          </p>
        </div>

        {loading && <AnalysisLoader />}
        {error && <ErrorMessage message={error} />}

        {profile && current && (
          <>
            <div className="mb-6 flex items-center gap-4">
              {/* Compact dial */}
              <div className="relative shrink-0" style={{ width: 72, height: 72 }}>
                <svg viewBox="0 0 100 100" className="h-full w-full" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r={42} fill="none" stroke="var(--bg-elevated)" strokeWidth="4" />
                  <circle
                    cx="50" cy="50" r={42}
                    fill="none" stroke="var(--tt-primary)" strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 - (current.score / 100) * 2 * Math.PI * 42}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="font-[family-name:var(--font-serif-display)] text-[var(--text-primary)]"
                    style={{ fontSize: '1.4rem', fontWeight: 300 }}
                  >
                    {current.score}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <span
                  className="block font-[family-name:var(--font-hand)] text-[var(--tt-primary)]"
                  style={{ fontSize: '1.1rem' }}
                >
                  {current.label}
                </span>
                {totalPotential > 0 && (
                  <span
                    className="mt-0.5 block text-[var(--text-muted)]"
                    style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.78rem' }}
                  >
                    Up to <span className="text-[var(--tt-primary)]">+{totalPotential}</span> points available
                  </span>
                )}
              </div>
            </div>
            <hr style={{ border: 'none', borderTop: 'var(--rule-muted)' }} />

            {availableActions.length === 0 ? (
              <div className="py-12 text-center">
                <p className="font-[family-name:var(--font-serif-display)] text-lg text-[var(--tt-primary)]">
                  Maximum TrustScore reached!
                </p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  You&apos;ve completed all available actions.
                </p>
              </div>
            ) : (
              <>
                {ACTION_GROUPS.map(group => {
                  const groupActions = availableActions.filter(a => a.group === group.key);
                  if (groupActions.length === 0) return null;
                  return (
                    <ActionGroup
                      key={group.key}
                      label={group.label}
                      color={group.color}
                      count={groupActions.length}
                    >
                      {groupActions.map(action => (
                        <ActionToggle
                          key={action.id}
                          label={action.label}
                          subtitle={action.subtitle}
                          delta={actionDeltas.get(action.id) ?? 0}
                          actionType={action.actionType}
                          href={action.href}
                          ctaLabel={action.ctaLabel}
                        />
                      ))}
                    </ActionGroup>
                  );
                })}
              </>
            )}

            <div className="mt-6 px-3 py-4" style={{ borderTop: 'var(--rule-muted)' }}>
              <span className="tt-ui-label">How verification works</span>
              <p className="mt-2 text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.78rem', lineHeight: 1.5 }}>
                TrustTap+ reads your wallet directly from the Solana blockchain. After completing an action,
                go to your Profile and pull to refresh — we&apos;ll re-scan your on-chain activity and update your score automatically.
                No manual verification needed.
              </p>
            </div>
          </>
        )}
      </PageShell>
      <BottomNav />
    </>
  );
}
