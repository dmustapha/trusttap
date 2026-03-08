'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@/context/WalletContext';
import { useFirstVisit } from '@/hooks/useFirstVisit';

const steps = [
  {
    num: '01',
    label: 'Device',
    title: 'Prove You\u2019re Real',
    body: 'Your Seeker phone mints a soulbound NFT that can\u2019t be faked or transferred. This $500+ cost-of-attack is what makes TrustTap+ Sybil-resistant.',
    visual: 'device',
  },
  {
    num: '02',
    label: 'Profile',
    title: 'Your Trust Profile',
    body: 'Your score (0\u2013100) is computed across 7 dimensions: device ownership, wallet age, transaction activity, protocol diversity, DeFi participation, digital identity, and physical meetings.',
    visual: 'profile',
  },
  {
    num: '03',
    label: 'Scan',
    title: 'Meet & Verify',
    body: 'Meet another Seeker owner in person. One shows a QR, the other scans it. Each verified meeting earns +2 trust points for both. QR codes expire in 60 seconds.',
    visual: 'scan',
  },
  {
    num: '04',
    label: 'Search',
    title: 'Search Any Wallet',
    body: 'Look up any Seeker owner by wallet address or .skr domain name. See their score breakdown, badges, and sybil assessment.',
    visual: 'search',
  },
  {
    num: '05',
    label: 'Shield',
    title: 'Sybil Shield',
    body: 'Filter airdrop participants by device attestation and TrustScore. Set a threshold \u2014 only wallets that pass get through.',
    visual: 'shield',
  },
  {
    num: '06',
    label: 'Start',
    title: 'You\u2019re Ready',
    body: 'Your trust profile is waiting. Tap any \u00A0?\u00A0 icon inside the app to learn more about specific features.',
    visual: 'ready',
  },
];

// --- Step Visuals (editorial, no generic icon boxes) ---

function DeviceVisual() {
  return (
    <div className="relative flex items-center justify-center" style={{ height: 160 }}>
      {/* Pulsing ring */}
      <motion.div
        className="absolute rounded-full border border-[var(--tt-primary)]"
        style={{ width: 120, height: 120, opacity: 0.15 }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Central token */}
      <motion.div
        className="relative flex flex-col items-center justify-center"
        style={{
          width: 88,
          height: 88,
          borderRadius: 20,
          border: '1.5px solid rgba(16,185,129,0.3)',
          background: 'rgba(16,185,129,0.06)',
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span
          style={{
            fontFamily: 'var(--font-serif-display)',
            fontSize: '1.8rem',
            fontWeight: 300,
            color: 'var(--tt-primary)',
            lineHeight: 1,
          }}
        >
          SGT
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            marginTop: 4,
          }}
        >
          SOULBOUND
        </span>
      </motion.div>
    </div>
  );
}

function ProfileVisual() {
  const bars = [
    { label: 'Device', pct: 100, delay: 0.3 },
    { label: 'Wallet Age', pct: 73, delay: 0.42 },
    { label: 'Activity', pct: 58, delay: 0.54 },
    { label: 'Physical', pct: 40, delay: 0.66 },
  ];

  return (
    <div className="flex w-full max-w-[280px] flex-col items-center gap-5">
      {/* Score number */}
      <motion.div
        className="flex items-baseline gap-1"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <span
          style={{
            fontFamily: 'var(--font-serif-display)',
            fontSize: '3rem',
            fontWeight: 300,
            color: 'var(--tt-primary)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
          }}
        >
          72
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
          }}
        >
          / 100
        </span>
      </motion.div>

      {/* Dimension bars */}
      <div className="w-full space-y-2.5">
        {bars.map((d) => (
          <motion.div
            key={d.label}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: d.delay }}
          >
            <span
              className="shrink-0"
              style={{
                width: 64,
                fontFamily: 'var(--font-ui)',
                fontSize: '0.6rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}
            >
              {d.label}
            </span>
            <div className="h-1 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--bg-elevated)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--tt-primary)' }}
                initial={{ width: 0 }}
                animate={{ width: `${d.pct}%` }}
                transition={{ duration: 0.7, delay: d.delay + 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ScanVisual() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-end gap-8">
        {/* Phone A */}
        <motion.div
          style={{
            width: 52, height: 76, borderRadius: 10,
            border: '1.5px solid var(--bg-elevated)',
            background: 'var(--bg-surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          initial={{ x: -16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Mini QR pattern */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 8px)', gap: 2 }}>
            {[1,0,1,0,1,0,1,0,1].map((on, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: 1, background: on ? 'var(--tt-primary)' : 'var(--bg-elevated)', opacity: on ? 0.7 : 0.3 }} />
            ))}
          </div>
        </motion.div>

        {/* Connection line */}
        <motion.div
          className="flex flex-col items-center gap-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          <span style={{ fontFamily: 'var(--font-hand)', fontSize: '0.9rem', color: 'var(--tt-primary)' }}>+2 each</span>
          <div style={{ width: 32, height: 1, background: 'linear-gradient(90deg, transparent, var(--tt-primary), transparent)' }} />
        </motion.div>

        {/* Phone B */}
        <motion.div
          style={{
            width: 52, height: 76, borderRadius: 10,
            border: '1.5px solid var(--bg-elevated)',
            background: 'var(--bg-surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          initial={{ x: 16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--tt-primary)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M1 1h6v6H1zM17 1h6v6h-6zM1 17h6v6H1z" opacity="0.5" />
            <rect x="8" y="8" width="8" height="8" rx="1" opacity="0.3" />
          </svg>
        </motion.div>
      </div>

      <motion.span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        60s expiry &middot; in-person only
      </motion.span>
    </div>
  );
}

function SearchVisual() {
  return (
    <div className="flex w-full max-w-[260px] flex-col gap-3">
      {/* Search input mock */}
      <motion.div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-elevated)' }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          flyers4eva.skr
        </span>
      </motion.div>

      {/* Result card */}
      <motion.div
        className="px-3 py-3"
        style={{ background: 'var(--bg-surface)', borderLeft: '2px solid var(--tt-primary)' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-baseline justify-between">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>7xKp...3mFv</span>
          <span className="tt-label" style={{ color: 'var(--tt-primary)', fontSize: '0.55rem' }}>Trusted</span>
        </div>
        <div className="mt-1.5 flex items-baseline gap-1">
          <span style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--tt-primary)', lineHeight: 1 }}>68</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>pts</span>
        </div>
      </motion.div>
    </div>
  );
}

function ShieldVisual() {
  return (
    <div className="flex w-full max-w-[260px] flex-col gap-4">
      {/* Threshold bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-1.5 flex justify-between">
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Threshold
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--tt-primary)' }}>50</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-elevated)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--tt-primary)' }}
            initial={{ width: 0 }}
            animate={{ width: '50%' }}
            transition={{ duration: 0.7, delay: 0.4 }}
          />
        </div>
      </motion.div>

      {/* Funnel */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="text-center">
          <div style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.3rem', fontWeight: 300, color: 'var(--text-primary)', lineHeight: 1 }}>1,000</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>submitted</div>
        </div>
        <div style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent, var(--bg-elevated), transparent)' }} />
        <div className="text-center">
          <div style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.3rem', fontWeight: 300, color: 'var(--tt-primary)', lineHeight: 1 }}>312</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>passed</div>
        </div>
        <div style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent, var(--bg-elevated), transparent)' }} />
        <div className="text-center">
          <div style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.3rem', fontWeight: 300, color: 'var(--danger)', lineHeight: 1 }}>688</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>filtered</div>
        </div>
      </motion.div>
    </div>
  );
}

function ReadyVisual() {
  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="var(--tt-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="18" opacity="0.3" />
        <motion.polyline
          points="16,24 22,30 32,18"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
      </svg>
      <span style={{ fontFamily: 'var(--font-hand)', fontSize: '1rem', color: 'var(--text-secondary)' }}>
        let&apos;s go
      </span>
    </motion.div>
  );
}

const VISUALS: Record<string, React.ReactNode> = {
  device: <DeviceVisual />,
  profile: <ProfileVisual />,
  scan: <ScanVisual />,
  search: <SearchVisual />,
  shield: <ShieldVisual />,
  ready: <ReadyVisual />,
};

const swipeVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export default function GuidePage() {
  const router = useRouter();
  const { connected } = useWallet();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const { markVisited } = useFirstVisit();

  useEffect(() => {
    if (!connected) router.push('/');
  }, [connected, router]);

  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const go = useCallback((next: number) => {
    setDirection(next > current ? 1 : -1);
    setCurrent(next);
  }, [current]);

  const finish = useCallback(() => {
    markVisited('guide');
    router.push('/profile');
  }, [markVisited, router]);

  if (!mounted || !connected) return null;

  const step = steps[current];
  const isLast = current === steps.length - 1;

  return (
    <main className="relative flex min-h-[100dvh] flex-col" style={{ background: 'var(--bg-base)' }}>
      {/* Top bar: step counter + skip */}
      <div className="relative z-10 flex items-center justify-between px-5" style={{ paddingTop: 'env(safe-area-inset-top, 16px)', minHeight: 56 }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
          }}
        >
          {step.num} <span style={{ opacity: 0.4 }}>/</span> 06
        </span>
        <button
          onClick={finish}
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.65rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 0',
            lineHeight: '44px',
            minHeight: 44,
          }}
        >
          Skip
        </button>
      </div>

      {/* Step label tabs */}
      <div
        className="relative z-10 flex gap-1 overflow-x-auto px-5"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {steps.map((s, i) => (
          <button
            key={s.label}
            onClick={() => go(i)}
            className="shrink-0"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.58rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '6px 10px',
              borderRadius: 2,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              background: i === current ? 'rgba(16,185,129,0.1)' : 'transparent',
              color: i === current ? 'var(--tt-primary)' : 'var(--text-muted)',
              borderBottom: i === current ? '1.5px solid var(--tt-primary)' : '1.5px solid transparent',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <hr style={{ border: 'none', borderTop: 'var(--rule)', opacity: 0.3, margin: '0 20px' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={swipeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full max-w-sm flex-col items-center text-center"
          >
            {/* Visual */}
            <div className="mb-8 flex min-h-[180px] items-center justify-center">
              {VISUALS[step.visual]}
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: 'clamp(1.4rem, 5vw, 1.8rem)',
                fontWeight: 400,
                color: 'var(--text-primary)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              {step.title}
            </h2>

            {/* Body */}
            <p
              style={{
                fontFamily: 'var(--font-serif-body)',
                fontSize: '0.88rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                marginTop: 12,
                maxWidth: 320,
              }}
            >
              {step.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 px-6" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 24px), 24px)' }}>
        {/* Progress line */}
        <div className="mb-5 h-px w-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
          <motion.div
            className="h-full"
            style={{ background: 'var(--tt-primary)' }}
            animate={{ width: `${((current + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <button
          onClick={isLast ? finish : () => go(current + 1)}
          className="tt-btn-primary w-full"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '16px 0',
          }}
        >
          {isLast ? 'View My Profile' : 'Continue'}
        </button>
      </div>
    </main>
  );
}
