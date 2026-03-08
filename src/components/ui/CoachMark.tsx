'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface CoachMarkStep {
  targetSelector: string;
  message: string;
  position?: 'top' | 'bottom';
}

interface CoachMarkProps {
  steps: CoachMarkStep[];
  onComplete: () => void;
}

interface Rect { top: number; left: number; width: number; height: number; }

export function CoachMark({ steps, onComplete }: CoachMarkProps) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [rect, setRect] = useState<Rect | null>(null);

  const measure = useCallback((selector: string) => {
    const el = document.querySelector(selector);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top, left: r.left, width: r.width, height: r.height };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setCurrentStep(0), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentStep < 0 || currentStep >= steps.length) return;

    const updateRect = () => {
      const r = measure(steps[currentStep].targetSelector);
      if (r) setRect(r);
      else {
        if (currentStep < steps.length - 1) setCurrentStep(s => s + 1);
        else onComplete();
      }
    };

    updateRect();

    const observer = new ResizeObserver(updateRect);
    const el = document.querySelector(steps[currentStep].targetSelector);
    if (el) observer.observe(el);

    const handleScroll = () => updateRect();
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [currentStep, steps, measure, onComplete]);

  useEffect(() => {
    if (currentStep < 0) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [currentStep]);

  const advance = () => {
    if (currentStep < steps.length - 1) setCurrentStep(s => s + 1);
    else onComplete();
  };

  if (typeof window === 'undefined' || currentStep < 0 || !rect) return null;

  const step = steps[currentStep];
  const pos = step.position ?? (rect.top > window.innerHeight / 2 ? 'top' : 'bottom');
  const pad = 8;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[70]" onClick={advance}>
        <div
          className="absolute border-2 border-[var(--tt-primary)]"
          style={{
            top: rect.top - pad,
            left: rect.left - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.75)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: pos === 'bottom' ? -8 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute left-4 right-4 max-w-sm border border-[var(--bg-elevated)] bg-[var(--bg-surface)] p-4"
          style={{
            ...(pos === 'bottom'
              ? { top: rect.top + rect.height + pad + 12 }
              : { bottom: window.innerHeight - rect.top + pad + 12 }),
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          onClick={e => e.stopPropagation()}
        >
          <p className="text-sm leading-relaxed text-[var(--text-primary)]">{step.message}</p>
          <div className="mt-3 flex items-center justify-between">
            {steps.length > 1 && (
              <span className="text-xs text-[var(--text-muted)]">
                {currentStep + 1} of {steps.length}
              </span>
            )}
            <button
              onClick={advance}
              className="ml-auto min-h-[44px] bg-[var(--tt-primary)] px-4 py-2 text-sm font-semibold text-[var(--bg-base)]"
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Got it'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
