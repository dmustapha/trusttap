'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TrustLabel } from '@/types';
import Link from 'next/link';

interface DirectConnection {
  wallet: string;
  score: number;
  label: TrustLabel;
  meetingDate: string;
}

interface ExtendedConnection {
  wallet: string;
  connectedTo: string;
}

interface NetworkData {
  direct: DirectConnection[];
  extended: ExtendedConnection[];
}

interface NetworkGraphProps {
  walletAddress: string;
}

const CX = 160;
const CY = 160;
const R1 = 80;
const R2 = 140;

function nodePos(ring: number, index: number, total: number, offset = 0) {
  const r = ring === 1 ? R1 : R2;
  const angle = (2 * Math.PI * index) / total - Math.PI / 2 + offset;
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
}

export function NetworkGraph({ walletAddress }: NetworkGraphProps) {
  const [data, setData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DirectConnection | null>(null);

  useEffect(() => {
    fetch(`/api/network/${walletAddress}`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => setData({ direct: [], extended: [] }))
      .finally(() => setLoading(false));
  }, [walletAddress]);

  if (loading || !data) return null;

  const { direct, extended } = data;
  const isEmpty = direct.length === 0;

  return (
    <div className="mb-8">
      <p className="tt-label mb-4">
        My Network
        {direct.length > 0 && (
          <span className="ml-2 font-[family-name:var(--font-mono)] text-[var(--text-muted)]" style={{ fontSize: '0.65rem' }}>
            {direct.length} connection{direct.length !== 1 ? 's' : ''}
          </span>
        )}
      </p>

      <div style={{ width: '100%', maxWidth: 320, margin: '0 auto', touchAction: 'manipulation' }}>
        <svg
          viewBox="0 0 320 320"
          width="100%"
          preserveAspectRatio="xMidYMid meet"
          style={{ display: 'block', WebkitTapHighlightColor: 'transparent' }}
          onClick={() => setSelected(null)}
        >
          <defs>
            <filter id="network-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {isEmpty && (
            <EmptyState />
          )}

          <ExtendedLines direct={direct} extended={extended} />
          <DirectLines direct={direct} />
          <ExtendedNodes extended={extended} />
          <DirectNodes direct={direct} selected={selected} onSelect={setSelected} />

          <motion.circle
            cx={CX} cy={CY} r={18}
            fill="#10b981" filter="url(#network-glow)"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          />
          <text x={CX} y={CY + 18 + 12} textAnchor="middle" fill="#10b981" fontFamily="monospace" fontSize="10" opacity="0.8">
            You
          </text>
        </svg>
      </div>

      <AnimatePresence>
        {selected && (
          <SelectedDetail connection={selected} />
        )}
      </AnimatePresence>

      <hr className="mt-5" style={{ border: 'none', borderTop: 'var(--rule-muted)' }} />
    </div>
  );
}

function EmptyState() {
  return (
    <>
      <circle cx={CX} cy={CY} r={R1} fill="none" stroke="#10b981" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="6 4" />
      <text x={CX} y={CY - 5} textAnchor="middle" fill="#10b981" fontSize="11" opacity="0.5">No connections yet</text>
      <text x={CX} y={CY + 12} textAnchor="middle" fill="#10b981" fontSize="9" opacity="0.3">Meet Seeker owners to grow your network</text>
    </>
  );
}

function ExtendedLines({ direct, extended }: { direct: DirectConnection[]; extended: ExtendedConnection[] }) {
  return (
    <>
      {extended.map((ext, j) => {
        const ring1Idx = direct.findIndex(d => d.wallet === ext.connectedTo);
        if (ring1Idx < 0) return null;
        const from = nodePos(1, ring1Idx, direct.length);
        const to = nodePos(2, j, extended.length, Math.PI / Math.max(extended.length, 1));
        return (
          <motion.line
            key={`ext-line-${j}`}
            x1={from.x} y1={from.y} x2={to.x} y2={to.y}
            stroke="#10b981" strokeOpacity="0.1" strokeWidth="0.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.6 + j * 0.03, duration: 0.3 }}
          />
        );
      })}
    </>
  );
}

function DirectLines({ direct }: { direct: DirectConnection[] }) {
  return (
    <>
      {direct.map((_, i) => {
        const pos = nodePos(1, i, direct.length);
        return (
          <motion.line
            key={`line-${i}`}
            x1={CX} y1={CY} x2={pos.x} y2={pos.y}
            stroke="#10b981" strokeOpacity="0.2" strokeWidth="0.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.2 + i * 0.06, duration: 0.3 }}
          />
        );
      })}
    </>
  );
}

function ExtendedNodes({ extended }: { extended: ExtendedConnection[] }) {
  return (
    <>
      {extended.map((_, j) => {
        const pos = nodePos(2, j, extended.length, Math.PI / Math.max(extended.length, 1));
        return (
          <motion.circle
            key={`ext-${j}`}
            cx={pos.x} cy={pos.y} r={8}
            fill="rgba(16, 185, 129, 0.12)" opacity={0.3}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.7 + j * 0.04, type: 'spring', stiffness: 200, damping: 15 }}
          />
        );
      })}
    </>
  );
}

function DirectNodes({
  direct,
  selected,
  onSelect,
}: {
  direct: DirectConnection[];
  selected: DirectConnection | null;
  onSelect: (conn: DirectConnection | null) => void;
}) {
  return (
    <>
      {direct.map((conn, i) => {
        const pos = nodePos(1, i, direct.length);
        const labelY = pos.y > CY ? pos.y - 12 - 4 : pos.y + 12 + 12;
        const isSelected = selected?.wallet === conn.wallet;
        return (
          <motion.g
            key={`node-${i}`}
            style={{ cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); onSelect(isSelected ? null : conn); }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 200, damping: 15 }}
          >
            <circle cx={pos.x} cy={pos.y} r={22} fill="transparent" pointerEvents="all" />
            <circle
              cx={pos.x} cy={pos.y} r={12}
              fill={isSelected ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.25)'}
              stroke="#10b981" strokeWidth={isSelected ? 2 : 1}
              pointerEvents="none"
            />
            <text
              x={pos.x} y={labelY} textAnchor="middle"
              fill="#10b981" fontFamily="monospace" fontSize="8" opacity="0.6"
              pointerEvents="none"
            >
              {conn.wallet.slice(0, 4)}
            </text>
          </motion.g>
        );
      })}
    </>
  );
}

function SelectedDetail({ connection }: { connection: DirectConnection }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="tt-card mt-3"
    >
      <div className="flex items-center justify-between">
        <span className="font-[family-name:var(--font-mono)] text-sm text-[var(--text-primary)]">
          {connection.wallet.slice(0, 8)}...{connection.wallet.slice(-4)}
        </span>
        <span
          className="px-2 py-0.5 text-xs font-semibold"
          style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--tt-primary)' }}
        >
          {connection.score}/100
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-xs text-[var(--text-muted)]">{connection.label}</span>
        <Link
          href={`/search?wallet=${connection.wallet}`}
          className="text-xs text-[var(--tt-primary)] transition-colors hover:text-[var(--tt-accent)]"
        >
          View Profile
        </Link>
      </div>
    </motion.div>
  );
}
