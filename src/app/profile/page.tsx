'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useTrustProfile } from '@/hooks/useTrustProfile';
import { PageShell } from '@/components/layout/PageShell';
import { BottomNav } from '@/components/layout/BottomNav';
import { AnalysisLoader } from '@/components/ui/AnalysisLoader';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { HelpIcon } from '@/components/ui/HelpIcon';
import { ScoreDial } from '@/components/trust/ScoreDial';
import { ScoreTrend } from '@/components/trust/ScoreTrend';
import { ScoreBreakdown } from '@/components/trust/ScoreBreakdown';
import { BadgeRow } from '@/components/trust/BadgeRow';
import { AISummary } from '@/components/trust/AISummary';
import { MeetingHistory } from '@/components/trust/MeetingHistory';

import { ShareProfile } from '@/components/trust/ShareProfile';

export default function ProfilePage() {
  const router = useRouter();
  const { connected, publicKey, hasSGT, disconnect } = useWallet();
  const { profile, loading, error, refresh } = useTrustProfile(publicKey);
  const [skrBalance, setSKRBalance] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !connected) {
      router.push('/');
    }
  }, [mounted, connected, router]);

  useEffect(() => {
    if (publicKey) {
      fetch(`/api/skr-balance/${publicKey}`)
        .then(r => r.json())
        .then(d => setSKRBalance(d.balance ?? null))
        .catch(() => setSKRBalance(null));
    }
  }, [publicKey]);

  if (!mounted) return null;

  return (
    <>
      <PageShell>
        {/* Header */}
        <header style={{ marginBottom: 32 }}>
          <div className="flex items-baseline justify-between">
            <div className="flex items-center gap-1">
              <h2
                className="font-[family-name:var(--font-serif-display)] text-[var(--text-primary)]"
                style={{ fontSize: '1.7rem', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.02em' }}
              >
                My Trust Profile
              </h2>
              <HelpIcon tooltipKey="trust-score" />
            </div>
            <button
              onClick={() => { disconnect(); router.push('/'); }}
              className="
                cursor-pointer border bg-transparent
                text-[var(--text-muted)] border-[var(--bg-elevated)]
                transition-colors duration-200 ease-out
                hover:text-[var(--danger)] hover:border-[var(--danger)]
              "
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.65rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                padding: '8px 14px',
                minHeight: 36,
              }}
            >
              Disconnect
            </button>
          </div>

          {/* Wallet + SGT */}
          {publicKey && (
            <div className="mt-2 flex items-center" style={{ gap: 10 }}>
              <span
                className="font-[family-name:var(--font-mono)] text-[var(--text-muted)]"
                style={{ fontSize: '0.82rem', letterSpacing: '0.03em' }}
              >
                {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
              </span>
              <span className={`tt-sgt-pill ${!hasSGT ? '!border-[var(--bg-elevated)] !bg-[var(--bg-elevated)] !text-[var(--text-muted)]' : ''}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {hasSGT ? 'SGT Verified' : 'Not Device Verified'}
              </span>
              {skrBalance !== null && skrBalance > 0 && (
                <span
                  className="border border-[var(--bg-elevated)] px-2 py-0.5 text-[var(--text-secondary)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}
                >
                  {skrBalance} SKR
                </span>
              )}
            </div>
          )}

          <hr className="mt-4" style={{ border: 'none', borderTop: 'var(--rule)', opacity: 0.4 }} />
        </header>

        {loading && <AnalysisLoader />}
        {error && <ErrorMessage message={error} onRetry={refresh} />}

        {profile && (
          <>
            <ScoreDial score={profile.score} label={profile.label} color={profile.color} />
            {profile.scoreHistory && (
              <ScoreTrend history={profile.scoreHistory} currentScore={profile.score} />
            )}
            <AISummary summary={profile.aiSummary} sybilAssessment={profile.sybilAssessment} />
            <ScoreBreakdown breakdown={profile.breakdown} />
            <BadgeRow badges={profile.badges} />
            <Link
              href="/badges"
              className="mb-6 -mt-4 inline-flex items-center gap-1 text-xs text-[var(--tt-primary)] transition-colors hover:text-[var(--tt-accent)]"
            >
              How are scores &amp; badges calculated?
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <ShareProfile
              walletAddress={profile.walletAddress}
              score={profile.score}
              label={profile.label}
            />
            <MeetingHistory meetings={profile.meetingHistory} walletAddress={profile.walletAddress} />
          </>
        )}
      </PageShell>
      <BottomNav />
    </>
  );
}
