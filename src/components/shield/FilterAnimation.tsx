'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FilterAnimationProps {
  total: number;
  sgtVerified: number;
  meetsThreshold: number;
  running: boolean;
}

function AnimatedNumber({ value, color }: { value: number; color: string }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, v => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 1.5, ease: 'easeOut' });
    const unsub = rounded.on('change', v => setDisplay(v));
    return () => { controls.stop(); unsub(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span style={{ color }} className="text-4xl font-bold tabular-nums">{display}</span>;
}

export function FilterAnimation({ total, sgtVerified, meetsThreshold, running }: FilterAnimationProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <div className="flex flex-col items-center gap-1">
        <AnimatedNumber value={running ? total : 0} color="var(--text-secondary)" />
        <span className="text-xs text-[var(--text-muted)]">Total</span>
      </div>
      <motion.div
        className="text-2xl text-[var(--text-muted)]"
        animate={{ opacity: running ? 1 : 0.3 }}
      >
        →
      </motion.div>
      <div className="flex flex-col items-center gap-1">
        <AnimatedNumber value={running ? sgtVerified : 0} color="var(--success)" />
        <span className="text-xs text-[var(--text-muted)]">SGT Verified</span>
      </div>
      <motion.div
        className="text-2xl text-[var(--text-muted)]"
        animate={{ opacity: running ? 1 : 0.3 }}
      >
        →
      </motion.div>
      <div className="flex flex-col items-center gap-1">
        <AnimatedNumber value={running ? meetsThreshold : 0} color="var(--tt-primary)" />
        <span className="text-xs text-[var(--text-muted)]">Passed</span>
      </div>
    </div>
  );
}
