'use client';

import { motion } from 'framer-motion';

export function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <motion.div
        className="h-10 w-10 rounded-full border-3 border-[rgba(16,185,129,0.3)] border-t-[var(--tt-primary)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="text-sm text-[var(--text-secondary)]">{text}</p>
    </div>
  );
}
