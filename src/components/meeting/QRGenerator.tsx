'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';

interface QRGeneratorProps {
  challenge: { walletAddress: string; timestamp: number; nonce: string };
  onExpired: () => void;
}

function truncateAddress(addr: string) {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

export function QRGenerator({ challenge, onExpired }: QRGeneratorProps) {
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [copied, setCopied] = useState(false);
  const onExpiredRef = useRef(onExpired);
  useEffect(() => { onExpiredRef.current = onExpired; }, [onExpired]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - challenge.timestamp) / 1000);
      const remaining = Math.max(0, 60 - elapsed);
      setSecondsLeft(remaining);
      if (remaining === 0) onExpiredRef.current();
    }, 1000);
    return () => clearInterval(interval);
  }, [challenge.timestamp]);

  const qrData = JSON.stringify({
    walletAddress: challenge.walletAddress,
    timestamp: challenge.timestamp,
    nonce: challenge.nonce,
  });

  const copyData = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard not available on non-HTTPS */ }
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-5"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="bg-white p-4">
        <QRCode value={qrData} size={200} level="M" />
      </div>

      <div className="text-center">
        <p className="font-mono text-sm text-[var(--text-secondary)]">{truncateAddress(challenge.walletAddress)}</p>
        <p className={`mt-1 text-lg font-bold ${secondsLeft <= 10 ? 'text-red-400' : 'text-[var(--text-primary)]'}`}>
          {secondsLeft}s remaining
        </p>
      </div>

      <button
        onClick={copyData}
        className="text-xs text-[var(--text-muted)] underline hover:text-[var(--text-primary)]"
      >
        {copied ? 'Copied!' : 'Copy verification data (paste fallback)'}
      </button>
    </motion.div>
  );
}
