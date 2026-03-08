'use client';

import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { BottomNav } from '@/components/layout/BottomNav';
import { BADGE_DEFINITIONS, SCORE_LABELS } from '@/lib/constants';

const SCORE_DIMENSIONS = [
  { label: 'Device', max: 25, description: 'Own a Seeker phone with SGT' },
  { label: 'Wallet Age', max: 10, description: 'Older wallets score higher (asymptotic curve)' },
  { label: 'Activity', max: 10, description: 'More transactions = higher score' },
  { label: 'Diversity', max: 10, description: 'Use more DeFi protocols' },
  { label: 'DeFi Depth', max: 13, description: 'Staking, LP, lending' },
  { label: 'Identity', max: 10, description: '.skr/.sol domain, blue-chip NFTs, DAO votes' },
  { label: 'Financial', max: 10, description: 'Portfolio value in SOL-equivalent' },
  { label: 'Physical', max: 12, description: 'In-person QR meetings' },
] as const;

const TIER_DESCRIPTIONS: Record<string, string> = {
  Unverified: 'New or unverified wallet',
  Basic: 'Some on-chain history',
  Established: 'Active ecosystem participant',
  Trusted: 'Proven track record',
  'Highly Trusted': 'Exemplary reputation',
};

export default function BadgesPage() {
  return (
    <>
      <PageShell>
        <BackLink />
        <PageHeader />
        <TrustScoreTiers />
        <ScoreDimensions />
        <AchievementBadges />
      </PageShell>
      <BottomNav />
    </>
  );
}

function BackLink() {
  return (
    <Link
      href="/profile"
      className="mb-6 inline-flex items-center gap-1.5 text-[var(--text-muted)] transition-colors hover:text-[var(--tt-primary)]"
      style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      Back to Profile
    </Link>
  );
}

function PageHeader() {
  return (
    <header style={{ marginBottom: 40 }}>
      <h1
        style={{
          fontFamily: 'var(--font-serif-display)',
          fontSize: '1.7rem',
          fontWeight: 400,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
        }}
      >
        Scoring & Badges
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-serif-body)',
          fontSize: '0.88rem',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
          marginTop: 8,
        }}
      >
        How your TrustScore is calculated and what each badge means.
      </p>
      <hr className="mt-4" style={{ border: 'none', borderTop: 'var(--rule)', opacity: 0.4 }} />
    </header>
  );
}

function TrustScoreTiers() {
  return (
    <section style={{ marginBottom: 40 }}>
      <span className="tt-label" style={{ color: 'var(--tt-primary)' }}>TrustScore Tiers</span>
      <div className="mt-4 flex flex-col">
        {SCORE_LABELS.map((tier, i) => (
          <div
            key={tier.label}
            className="flex items-center gap-3 px-3 py-3"
            style={{
              borderLeft: `2px solid ${tier.color}`,
              borderBottom: i < SCORE_LABELS.length - 1 ? 'var(--rule-muted)' : 'none',
            }}
          >
            <div className="flex min-w-0 flex-1 items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span
                  style={{
                    fontFamily: 'var(--font-serif-body)',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                  }}
                >
                  {tier.label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  {tier.max <= 20 ? '0' : SCORE_LABELS[SCORE_LABELS.indexOf(tier) - 1].max + 1}&ndash;{tier.max}
                </span>
              </div>
              <span
                className="shrink-0 text-right"
                style={{
                  fontFamily: 'var(--font-serif-body)',
                  fontSize: '0.72rem',
                  color: 'var(--text-secondary)',
                }}
              >
                {TIER_DESCRIPTIONS[tier.label]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ScoreDimensions() {
  const totalMax = SCORE_DIMENSIONS.reduce((sum, d) => sum + d.max, 0);
  const sorted = [...SCORE_DIMENSIONS].sort((a, b) => b.max - a.max);
  const rankMap = new Map(sorted.map((d, i) => [d.label, i]));

  return (
    <section style={{ marginBottom: 40 }}>
      <span className="tt-label" style={{ color: 'var(--tt-primary)' }}>
        Score Dimensions
      </span>
      <p
        style={{
          fontFamily: 'var(--font-serif-body)',
          fontSize: '0.78rem',
          lineHeight: 1.5,
          color: 'var(--text-muted)',
          marginTop: 4,
        }}
      >
        {totalMax} points across {SCORE_DIMENSIONS.length} categories
      </p>

      <div className="mt-4 flex flex-col gap-1">
        {SCORE_DIMENSIONS.map((dim) => {
          const rank = rankMap.get(dim.label) ?? 6;
          const isTop = rank === 0;
          const widthPercent = (dim.max / 25) * 100;
          const barOpacity = isTop ? 1 : rank <= 1 ? 0.7 : 0.45;

          return (
            <div
              key={dim.label}
              className="px-3 py-3"
              style={{
                borderLeft: isTop ? '2px solid var(--tt-primary)' : '2px solid transparent',
              }}
            >
              <div className="flex items-baseline justify-between">
                <span
                  style={{
                    fontFamily: 'var(--font-serif-body)',
                    fontSize: isTop ? '0.92rem' : '0.85rem',
                    fontWeight: isTop ? 600 : 400,
                    color: 'var(--text-primary)',
                  }}
                >
                  {dim.label}
                  {isTop && (
                    <span
                      className="ml-2 inline-block align-middle"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.55rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--tt-primary)',
                      }}
                    >
                      top
                    </span>
                  )}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: isTop ? 'var(--tt-primary)' : 'var(--text-muted)',
                  }}
                >
                  {dim.max} pts
                </span>
              </div>
              <div
                className="mt-1.5 w-full overflow-hidden"
                style={{ background: 'var(--bg-elevated)', height: isTop ? 4 : 3 }}
              >
                <div
                  className="h-full"
                  style={{ width: `${widthPercent}%`, background: 'var(--tt-primary)', opacity: barOpacity }}
                />
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-serif-body)',
                  fontSize: '0.72rem',
                  lineHeight: 1.4,
                  color: 'var(--text-secondary)',
                  marginTop: 4,
                }}
              >
                {dim.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AchievementBadges() {
  return (
    <section style={{ marginBottom: 24 }}>
      <span className="tt-label" style={{ color: 'var(--tt-primary)' }}>Achievement Badges</span>
      <p
        style={{
          fontFamily: 'var(--font-serif-body)',
          fontSize: '0.78rem',
          lineHeight: 1.5,
          color: 'var(--text-muted)',
          marginTop: 4,
        }}
      >
        Earned by on-chain activity — not manually assigned.
      </p>
      <div className="mt-4 flex flex-col gap-1">
        {BADGE_DEFINITIONS.map((badge) => (
          <details
            key={badge.id}
            className="group"
          >
            <summary
              className="flex items-baseline justify-between px-3 py-3 cursor-pointer list-none"
              style={{
                borderLeft: '2px solid rgba(16,185,129,0.2)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-serif-body)',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }}
              >
                {badge.name}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.55rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--tt-primary)',
                  opacity: 0.6,
                }}
              >
                details
              </span>
            </summary>
            <div
              className="px-3 pb-3"
              style={{ borderLeft: '2px solid var(--tt-primary)', marginTop: -2 }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-serif-body)',
                  fontSize: '0.78rem',
                  lineHeight: 1.5,
                  color: 'var(--text-secondary)',
                }}
              >
                {badge.description}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  lineHeight: 1.5,
                  color: 'var(--tt-primary)',
                  marginTop: 6,
                }}
              >
                {badge.criteria}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
