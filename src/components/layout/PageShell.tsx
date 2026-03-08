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
    <main
      ref={mainRef}
      className={`mx-auto w-full max-w-md px-4 pb-28 pt-10 font-[family-name:var(--font-serif-body)] ${className}`}
    >
      {children}
    </main>
  );
}
