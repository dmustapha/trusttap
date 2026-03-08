'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import type { TrustLabel } from '@/types';

interface ProjectedDialProps {
  currentScore: number;
  projectedScore: number;
  currentLabel: TrustLabel;
  projectedLabel: TrustLabel;
  projectedColor: string;
}

export function ProjectedDial({
  currentScore,
  projectedScore,
  currentLabel,
  projectedLabel,
  projectedColor,
}: ProjectedDialProps) {
  const r = 45;
  const circumference = 2 * Math.PI * r;
  const currentOffset = circumference - (currentScore / 100) * circumference;
  const projectedOffset = circumference - (projectedScore / 100) * circumference;

  const springScore = useSpring(projectedScore, { stiffness: 100, damping: 20 });
  const displayScore = useTransform(springScore, Math.round);

  useEffect(() => {
    springScore.set(projectedScore);
  }, [projectedScore, springScore]);

  const delta = projectedScore - currentScore;
  const hasChange = delta !== 0;

  return (
    <div className="mb-8 text-center">
      <div className="relative mx-auto" style={{ width: 180, height: 180 }}>
        <svg viewBox="0 0 100 100" className="h-full w-full" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--bg-elevated)" strokeWidth="2.5" />
          <circle
            cx="50" cy="50" r={r}
            fill="none" stroke="var(--text-muted)" strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={currentOffset}
            opacity={0.3}
          />
          <motion.circle
            cx="50" cy="50" r={r}
            fill="none" stroke="var(--tt-primary)" strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: projectedOffset }}
            transition={{ type: 'spring', stiffness: 60, damping: 15 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-[family-name:var(--font-serif-display)] leading-none text-[var(--text-primary)]"
            style={{ fontSize: '3.2rem', fontWeight: 300 }}
          >
            {displayScore}
          </motion.span>
          <span className="mt-0.5 text-[0.7rem] text-[var(--text-muted)]">/100</span>
        </div>
      </div>
      <div className="mt-3">
        <span className="font-[family-name:var(--font-hand)] text-[1.3rem]" style={{ color: projectedColor }}>
          {projectedLabel}
        </span>
      </div>
      {hasChange && (
        <motion.div
          key={delta}
          className="mx-auto mt-2 inline-flex items-center gap-1.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <span
            className="font-[family-name:var(--font-mono)] text-[var(--tt-primary)]"
            style={{ fontSize: '0.85rem', fontWeight: 600 }}
          >
            {delta > 0 ? '+' : ''}{delta} point{Math.abs(delta) !== 1 ? 's' : ''}
          </span>
          {currentLabel !== projectedLabel && (
            <span className="text-xs text-[var(--text-muted)]">
              {currentLabel} → {projectedLabel}
            </span>
          )}
        </motion.div>
      )}
      <hr className="mx-auto mt-6" style={{ border: 'none', borderTop: 'var(--rule-muted)', width: '100%' }} />
    </div>
  );
}
