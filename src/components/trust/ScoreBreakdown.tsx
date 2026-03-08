'use client';

import type { ScoreBreakdown as ScoreBreakdownType } from '@/types';

const dimensions = [
  { key: 'device', label: 'Device', max: 25, delay: 0.2 },
  { key: 'financial', label: 'Financial', max: 10, delay: 0.35 },
  { key: 'walletAge', label: 'Wallet Age', max: 10, delay: 0.5 },
  { key: 'activity', label: 'Activity', max: 12, delay: 0.65 },
  { key: 'diversity', label: 'Diversity', max: 10, delay: 0.8 },
  { key: 'defi', label: 'DeFi', max: 13, delay: 0.95 },
  { key: 'identity', label: 'Identity', max: 10, delay: 1.1 },
  { key: 'physical', label: 'Physical', max: 12, delay: 1.25 },
] as const;

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownType;
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  // Find the key with the highest percentage fill to highlight it
  const highestKey = dimensions.reduce<string>((best, dim) => {
    const bestDim = dimensions.find((d) => d.key === best)!;
    const bestPct = breakdown[best as keyof ScoreBreakdownType] / bestDim.max;
    const thisPct = breakdown[dim.key as keyof ScoreBreakdownType] / dim.max;
    return thisPct > bestPct ? dim.key : best;
  }, dimensions[0].key);

  return (
    <div className="mb-8">
      <p className="tt-label mb-4">Score Breakdown</p>
      <div className="flex flex-col" style={{ gap: 14 }}>
        {dimensions.map((dim) => {
          const value = breakdown[dim.key];
          const pct = Math.round((value / dim.max) * 100);
          const isTop = dim.key === highestKey;
          return (
            <div key={dim.key} className="flex items-center" style={{ gap: 12 }}>
              <span
                className="shrink-0 text-[var(--text-secondary)]"
                style={{ fontSize: '0.875rem', width: 76 }}
              >
                {dim.label}
              </span>
              <div className="tt-progress-track" style={{ position: 'relative' }}>
                <div
                  className="tt-progress-fill"
                  style={{
                    width: `${pct}%`,
                    animation: `barFill 1s cubic-bezier(0.22, 1, 0.36, 1) ${dim.delay}s forwards`,
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    ...(isTop && {
                      background: 'linear-gradient(90deg, var(--tt-primary) 0%, #34d399 100%)',
                      boxShadow: '0 0 8px rgba(16, 185, 129, 0.35)',
                    }),
                  }}
                />
              </div>
              <span
                className="shrink-0 text-right font-[family-name:var(--font-mono)]"
                style={{
                  fontSize: '0.8rem',
                  width: 52,
                  color: isTop ? 'var(--tt-primary)' : 'var(--text-primary)',
                }}
              >
                {value}/{dim.max}
              </span>
              <span
                className="shrink-0 font-[family-name:var(--font-mono)] text-[var(--text-muted)]"
                style={{ fontSize: '0.68rem', width: 32, textAlign: 'right' }}
              >
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
      <hr className="mt-5" style={{ border: 'none', borderTop: 'var(--rule-muted)' }} />
    </div>
  );
}
