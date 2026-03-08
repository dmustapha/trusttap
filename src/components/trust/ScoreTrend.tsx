'use client';

import type { ScoreSnapshot } from '@/types';

interface ScoreTrendProps {
  history: ScoreSnapshot[];
  currentScore: number;
}

export function ScoreTrend({ history, currentScore }: ScoreTrendProps) {
  if (history.length < 2) return null;

  const previous = history[history.length - 2].score;
  const diff = currentScore - previous;

  if (diff === 0) return null;

  const isUp = diff > 0;
  const color = isUp ? 'var(--tt-primary)' : 'var(--danger)';
  const arrow = isUp ? '\u2191' : '\u2193';

  return (
    <div className="mb-4 flex items-center gap-2" style={{ color }}>
      <span style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.1rem', fontWeight: 400 }}>{arrow}</span>
      <span style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.82rem' }}>
        {isUp ? '+' : ''}{diff} from last analysis
        <span style={{ color: 'var(--text-muted)' }}> (was {previous})</span>
      </span>
    </div>
  );
}
