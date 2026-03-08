'use client';

import { useState } from 'react';
import type { Meeting } from '@/types';

function truncateAddress(addr: string) {
  return addr.slice(0, 4) + '\u2026' + addr.slice(-4);
}

export function MeetingHistory({ meetings, walletAddress }: { meetings: Meeting[]; walletAddress: string }) {
  const [expanded, setExpanded] = useState(false);

  if (meetings.length === 0) return null;

  return (
    <div className="mb-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <p className="tt-label">
          Meetings <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>({meetings.length})</span>
        </p>
        <svg
          className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="1.5"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {expanded && (
        <div className="mt-3 flex flex-col gap-1">
          {meetings.map(m => {
            const partner = m.walletA === walletAddress ? m.walletB : m.walletA;
            return (
              <div
                key={m.id}
                className="flex items-center justify-between px-3 py-2.5"
                style={{ borderLeft: '2px solid var(--bg-elevated)', background: 'var(--bg-surface)' }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-primary)', letterSpacing: '0.03em' }}>
                  {truncateAddress(partner)}
                </span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  {new Date(m.timestamp).toLocaleDateString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
