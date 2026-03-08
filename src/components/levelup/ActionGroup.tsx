'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActionGroupProps {
  label: string;
  color: string;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function ActionGroup({ label, color, count, children, defaultOpen = true }: ActionGroupProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ borderTop: 'var(--rule-muted)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-3 py-3"
      >
        <span
          className="h-1.5 w-1.5 shrink-0"
          style={{ backgroundColor: color, borderRadius: '50%' }}
        />
        <span className="tt-ui-label">{label}</span>
        <div className="flex-1" />
        <span
          className="font-[family-name:var(--font-mono)] text-[var(--text-muted)]"
          style={{ fontSize: '0.7rem' }}
        >
          {count}
        </span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
