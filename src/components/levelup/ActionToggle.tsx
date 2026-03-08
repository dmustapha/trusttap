'use client';

import Link from 'next/link';
import type { ActionType } from '@/lib/levelup-actions';

interface ActionToggleProps {
  label: string;
  subtitle: string;
  delta: number;
  actionType: ActionType;
  href: string;
  ctaLabel: string;
}

export function ActionToggle({ label, subtitle, delta, actionType, href, ctaLabel }: ActionToggleProps) {
  const isExternal = actionType === 'external';

  const ctaButton = isExternal ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex shrink-0 items-center gap-1.5 border border-[rgba(16,185,129,0.25)] px-3 py-1.5 text-[var(--tt-primary)] transition-colors hover:border-[var(--tt-primary)] hover:bg-[rgba(16,185,129,0.06)]"
      style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em' }}
    >
      {ctaLabel}
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    </a>
  ) : (
    <Link
      href={href}
      className="flex shrink-0 items-center gap-1.5 bg-[var(--tt-primary)] px-3 py-1.5 text-[#1a1a1a] transition-opacity hover:opacity-90"
      style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em' }}
    >
      {ctaLabel}
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );

  return (
    <div
      className="flex w-full items-center gap-3 px-3 py-3"
      style={{ borderLeft: '2px solid rgba(16, 185, 129, 0.08)' }}
    >
      <div className="flex-1">
        <span
          className="block font-[family-name:var(--font-serif-body)] text-[var(--text-primary)]"
          style={{ fontSize: '0.88rem' }}
        >
          {label}
        </span>
        <span
          className="block text-[var(--text-muted)]"
          style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.72rem', marginTop: 1 }}
        >
          {subtitle}
        </span>
      </div>
      <span
        className="shrink-0 font-[family-name:var(--font-mono)]"
        style={{
          fontSize: '0.75rem',
          color: delta > 0 ? 'var(--tt-primary)' : 'var(--text-muted)',
          fontWeight: 600,
        }}
      >
        {delta > 0 ? `+${delta}` : '\u2014'}
      </span>
      {ctaButton}
    </div>
  );
}
