'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = [
  'Checking device...',
  'Scanning history...',
  'Analyzing protocols...',
  'Computing score...',
  'Generating AI summary...',
];

const FACTS = [
  'SGT ownership adds 25 points to your TrustScore',
  'Your wallet age contributes up to 10 points',
  'Using more DeFi protocols increases your diversity score',
  'In-person QR meetings earn up to 12 physical points',
  'Blue-chip NFTs boost your identity score',
  'Staking SOL counts toward your DeFi depth',
  'DAO governance votes strengthen your identity',
  'TrustTap+ analyzes 7 dimensions of on-chain behavior',
  'Active wallets score higher than dormant ones',
  'Cross-protocol activity signals a seasoned user',
];

const STAGE_INTERVAL_MS = 2500;
const FACT_INTERVAL_MS = 3000;

const fadeVariants = {
  enter: { opacity: 0, y: 6 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

function useCyclingIndex(length: number, intervalMs: number): number {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [length, intervalMs]);

  return index;
}

export function AnalysisLoader() {
  const stageIndex = useCyclingIndex(STAGES.length, STAGE_INTERVAL_MS);
  const factIndex = useCyclingIndex(FACTS.length, FACT_INTERVAL_MS);

  return (
    <div className="flex flex-col items-center gap-8 px-6 py-16">
      {/* Stage indicator */}
      <div className="relative h-7 w-full max-w-xs">
        <AnimatePresence mode="wait">
          <motion.p
            key={stageIndex}
            variants={fadeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="absolute inset-0 text-center font-[family-name:var(--font-serif-display)] text-lg font-normal text-[var(--text-primary)]"
          >
            {STAGES[stageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Shimmer progress bar */}
      <div className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-[var(--bg-elevated)]">
        <motion.div
          className="h-full w-1/3 rounded-full bg-[var(--tt-primary)]"
          animate={{ x: ['0%', '200%', '0%'] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ opacity: 0.85 }}
        />
      </div>

      {/* Rotating fact */}
      <div className="relative h-12 w-full max-w-sm">
        <AnimatePresence mode="wait">
          <motion.p
            key={factIndex}
            variants={fadeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35 }}
            className="absolute inset-0 text-center font-[family-name:var(--font-serif-body)] text-sm leading-relaxed text-[var(--text-muted)]"
          >
            {FACTS[factIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
