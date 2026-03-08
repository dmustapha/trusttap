'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TrustProfile } from '@/types';
import { ScoreDial } from './ScoreDial';
import { ScoreBreakdown } from './ScoreBreakdown';
import { BadgeRow } from './BadgeRow';
import { AISummary } from './AISummary';
import { TipButton } from './TipButton';

function truncateAddress(addr: string) {
  return addr.slice(0, 6) + '\u2026' + addr.slice(-4);
}

export function TrustProfileCard({ profile }: { profile: TrustProfile }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="transition-colors"
      style={{
        background: 'var(--bg-surface)',
        borderLeft: `2px solid ${profile.color}`,
      }}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Collapsed header */}
      <div
        className="cursor-pointer px-4 py-4"
        onClick={() => setExpanded(prev => !prev)}
      >
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                color: 'var(--text-primary)',
                letterSpacing: '0.03em',
              }}
            >
              {truncateAddress(profile.walletAddress)}
            </p>
            {profile.analysis.hasSolDomain && profile.analysis.solDomain && (
              <p
                style={{
                  fontFamily: 'var(--font-serif-body)',
                  fontSize: '0.82rem',
                  color: 'var(--tt-primary)',
                  marginTop: 2,
                }}
              >
                {profile.analysis.solDomain}
              </p>
            )}
            <p
              className="mt-1 flex items-center gap-1.5"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.6rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: profile.analysis.hasSGT ? 'var(--tt-primary)' : 'var(--text-muted)',
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: profile.analysis.hasSGT ? 'var(--tt-primary)' : 'var(--text-muted)',
                  display: 'inline-block',
                  boxShadow: profile.analysis.hasSGT ? '0 0 6px rgba(16,185,129,0.5)' : 'none',
                }}
              />
              {profile.analysis.hasSGT ? 'SGT Verified' : 'Not Verified'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span
                style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '1.6rem',
                  fontWeight: 300,
                  color: profile.color,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                {profile.score}
              </span>
              <span
                className="block"
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.55rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: profile.color,
                  marginTop: 2,
                }}
              >
                {profile.label}
              </span>
            </div>
            <motion.svg
              className="shrink-0"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth={1.5}
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </motion.svg>
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pt-4 pb-4" style={{ borderTop: 'var(--rule)' }}>
              <ScoreDial score={profile.score} label={profile.label} color={profile.color} />
              <AISummary summary={profile.aiSummary} sybilAssessment={profile.sybilAssessment} />
              <ScoreBreakdown breakdown={profile.breakdown} />
              <BadgeRow badges={profile.badges} />

              {/* Tip SKR */}
              <div className="mt-2 mb-4">
                <TipButton recipientAddress={profile.walletAddress} />
              </div>

              {/* Share link */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const url = `${window.location.origin}/search?wallet=${profile.walletAddress}`;
                  navigator.clipboard.writeText(url).catch(() => {});
                }}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--tt-primary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  borderBottom: '1px solid rgba(16,185,129,0.3)',
                  paddingBottom: 1,
                }}
              >
                Copy share link
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
