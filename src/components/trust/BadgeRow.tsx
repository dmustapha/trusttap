'use client';

import type { Badge } from '@/types';

export function BadgeRow({ badges }: { badges: Badge[] }) {
  const earned = badges.filter(b => b.earned);
  const unearned = badges.filter(b => !b.earned);

  return (
    <div className="mb-8">
      <p className="tt-label mb-3.5">Badges</p>

      {/* Earned badges */}
      {earned.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {earned.map((badge) => (
            <span
              key={badge.id}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '5px 12px',
                borderLeft: '2px solid var(--tt-primary)',
                color: 'var(--tt-primary)',
                background: 'rgba(16,185,129,0.06)',
              }}
            >
              {badge.name}
            </span>
          ))}
        </div>
      )}

      {/* Unearned badges */}
      {unearned.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {unearned.map((badge) => (
            <span
              key={badge.id}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.65rem',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '5px 12px',
                borderLeft: '2px solid rgba(16,185,129,0.12)',
                color: 'var(--text-secondary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {badge.name}
              {badge.progress && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.55rem',
                    fontWeight: 400,
                    letterSpacing: '0.04em',
                    opacity: 0.6,
                    color: 'var(--text-muted)',
                  }}
                >
                  {badge.progress}
                </span>
              )}
            </span>
          ))}
        </div>
      )}

      <hr className="mt-6" style={{ border: 'none', borderTop: 'var(--rule-muted)' }} />
    </div>
  );
}
