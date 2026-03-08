'use client';

import type { TrustLabel } from '@/types';

interface ScoreDialProps {
  score: number;
  label: TrustLabel;
  color: string;
}

export function ScoreDial({ score, label }: ScoreDialProps) {
  const circumference = 2 * Math.PI * 45; // r=45 on viewBox 0 0 100 100
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="mb-10 text-center">
      <div className="relative mx-auto" style={{ width: 180, height: 180 }}>
        <svg viewBox="0 0 100 100" className="h-full w-full" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="50" cy="50" r={45}
            fill="none" stroke="var(--bg-elevated)" strokeWidth="2.5"
          />
          {/* Progress arc — CSS animation */}
          <circle
            cx="50" cy="50" r={45}
            fill="none" stroke="var(--tt-primary)" strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              animation: 'dialFill 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.5s forwards',
            }}
          />
        </svg>
        {/* Score number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-[family-name:var(--font-serif-display)] leading-none text-[var(--text-primary)]"
            style={{ fontSize: '3.2rem', fontWeight: 300 }}
          >
            {score}
          </span>
          <span className="mt-0.5 text-[0.7rem] text-[var(--text-muted)]">/100</span>
        </div>
      </div>

      <div className="mt-3">
        <span className="font-[family-name:var(--font-hand)] text-[1.3rem] text-[var(--tt-primary)]">
          {label}
        </span>
      </div>

      <hr className="mx-auto mt-6" style={{ border: 'none', borderTop: 'var(--rule-muted)', width: '100%' }} />
    </div>
  );
}
