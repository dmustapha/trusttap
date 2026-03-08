'use client';

import { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { TOOLTIP_CONTENT } from '@/data/tooltip-content';

interface HelpIconProps {
  tooltipKey: string;
  size?: 'sm' | 'md';
}

export function HelpIcon({ tooltipKey, size = 'sm' }: HelpIconProps) {
  const [open, setOpen] = useState(false);
  const content = TOOLTIP_CONTENT[tooltipKey];

  if (!content) return null;

  const sz = size === 'sm' ? 'w-5 h-5 text-[11px]' : 'w-6 h-6 text-xs';

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center"
        aria-label="Help"
      >
        <span className={`${sz} flex items-center justify-center rounded-full border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.1)] font-semibold text-[var(--tt-primary)]`}>
          ?
        </span>
      </button>
      <BottomSheet open={open} onClose={() => setOpen(false)} title={content.title}>
        {content.body}
      </BottomSheet>
    </>
  );
}
