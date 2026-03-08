'use client';

import { ReactNode, useEffect, useRef } from 'react';

export function PageShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    // Start hidden, then animate in
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    el.style.transition = 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)';
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center px-4 bg-[var(--bg-base)]" style={{ height: 48, paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <img src="/favicon.png" alt="" width={32} height={32} style={{ opacity: 0.85 }} />
        <span
          className="ml-2 font-[family-name:var(--font-serif-display)]"
          style={{ fontSize: '0.95rem', fontWeight: 300, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
        >
          Trust<span style={{ fontWeight: 600 }}>Tap</span><span style={{ color: 'var(--tt-primary)', fontWeight: 600 }}>+</span>
        </span>
      </header>
      <main
        ref={mainRef}
        className={`mx-auto w-full max-w-md px-4 pb-28 font-[family-name:var(--font-serif-body)] ${className}`}
        style={{ paddingTop: 'calc(48px + env(safe-area-inset-top, 0px) + 8px)' }}
      >
        {children}
      </main>
    </>
  );
}
