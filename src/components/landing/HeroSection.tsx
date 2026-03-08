'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useWallet } from '@/context/WalletContext';
import { useFirstVisit } from '@/hooks/useFirstVisit';
import { ConnectButton } from '@/components/wallet/ConnectButton';

// Animated concentric trust rings — purely decorative, reduced-motion safe
function TrustRings() {
  const rings = [
    { r: 72,  delay: 0,      opacity: 0.30, strokeWidth: 0.75 },
    { r: 108, delay: 0.6,    opacity: 0.20, strokeWidth: 0.5  },
    { r: 148, delay: 1.2,    opacity: 0.13, strokeWidth: 0.5  },
    { r: 192, delay: 1.8,    opacity: 0.08, strokeWidth: 0.35 },
  ];

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2"
      aria-hidden="true"
    >
      <svg width="420" height="420" viewBox="0 0 420 420" fill="none" style={{ overflow: 'visible' }}>
        {rings.map(({ r, delay, opacity, strokeWidth }, i) => (
          <motion.circle
            key={i}
            cx={210}
            cy={210}
            r={r}
            stroke="var(--tt-primary)"
            strokeWidth={strokeWidth}
            fill="none"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity, scale: 1 }}
            transition={{
              opacity: { duration: 1.6, delay, ease: 'easeOut' },
              scale:   { duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] },
            }}
          />
        ))}
        {/* Slow rotating dashed outer ring */}
        <motion.circle
          cx={210}
          cy={210}
          r={220}
          stroke="var(--tt-primary)"
          strokeWidth={0.4}
          strokeDasharray="4 14"
          fill="none"
          style={{ opacity: 0.07 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 80, ease: 'linear', repeat: Infinity }}
        />
        {/* Central emerald dot */}
        <motion.circle
          cx={210}
          cy={210}
          r={3.5}
          fill="var(--tt-primary)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.9, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </svg>

      {/* Radial glow bloom behind the rings */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, rgba(20,184,166,0.03) 45%, transparent 70%)',
        }}
      />
    </div>
  );
}

const BADGES = [
  { label: 'Seeker Device', dot: true },
  { label: 'Solana Mobile', dot: false },
  { label: 'SGT Gated',     dot: false },
] as const;

export function HeroSection() {
  const router = useRouter();
  const { connected, isConnecting, connect } = useWallet();
  const { hasVisited } = useFirstVisit();

  useEffect(() => {
    if (!connected) return;
    router.push(hasVisited('guide') ? '/profile' : '/guide');
  }, [connected, router, hasVisited]);

  return (
    <section
      className="relative z-10 flex h-[100dvh] flex-col items-center overflow-hidden"
      style={{ padding: '0 24px' }}
    >
      {/* Animated rings — absolute, behind everything */}
      <TrustRings />

      {/* Top rule */}
      <motion.hr
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 0.8, delay: 0 }}
        style={{
          border: 'none',
          borderTop: 'var(--rule)',
          width: '100%',
          marginTop: 'env(safe-area-inset-top, 20px)',
        }}
      />

      {/* Top spacer */}
      <div className="w-full flex-1" />

      {/* Badge strip — elevated above the rings visually */}
      <motion.div
        className="mb-7 flex flex-wrap items-center justify-center gap-2"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        {BADGES.map(({ label, dot }) => (
          <span
            key={label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontFamily: 'var(--font-ui)',
              fontSize: '0.62rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--tt-primary)',
              padding: '4px 10px',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 2,
              background: 'rgba(16,185,129,0.05)',
            }}
          >
            {dot && (
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: 'var(--tt-primary)',
                  display: 'inline-block',
                  boxShadow: '0 0 6px rgba(16,185,129,0.7)',
                }}
              />
            )}
            {label}
          </span>
        ))}
      </motion.div>

      {/* Wordmark */}
      <div className="relative z-10 text-center">
        <motion.h1
          className="tt-display"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(3.8rem, 14vw, 6rem)',
            fontWeight: 300,
            marginBottom: 6,
          }}
        >
          Trust<wbr />Tap
          <span style={{ color: 'var(--tt-primary)', fontWeight: 600 }}>+</span>
        </motion.h1>

        {/* Handwritten tagline */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-hand)',
            fontSize: '1.35rem',
            color: 'var(--text-secondary)',
            marginTop: 4,
            lineHeight: 1.3,
          }}
        >
          Your on-chain trust passport
        </motion.p>
      </div>

      {/* Spacer */}
      <div className="w-full flex-1" />

      {/* CTA area */}
      <motion.div
        className="relative z-10 w-full text-center"
        style={{ paddingBottom: 48 }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mx-auto" style={{ maxWidth: 320 }}>
          <ConnectButton onConnect={() => connect()} loading={isConnecting} />
        </div>

        {/* Single secondary link */}
        <a
          href="/badges"
          style={{
            display: 'inline-block',
            marginTop: 18,
            fontFamily: 'var(--font-serif-body)',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(107,95,80,0.25)',
            paddingBottom: 1,
            lineHeight: '44px',
            minHeight: 44,
            transition: 'color 200ms ease, border-color 200ms ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)';
            (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'rgba(107,95,80,0.55)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)';
            (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'rgba(107,95,80,0.25)';
          }}
        >
          What is TrustTap+?
        </a>

        <hr
          style={{
            border: 'none',
            borderTop: 'var(--rule-muted)',
            marginTop: 28,
          }}
        />
        <p
          style={{
            marginTop: 14,
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-ui)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          MONOLITH · Solana Mobile Hackathon
        </p>
      </motion.div>
    </section>
  );
}
