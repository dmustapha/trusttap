'use client';

import { useState, useCallback } from 'react';
import QRCode from 'react-qr-code';

interface ShareProfileProps {
  walletAddress: string;
  score: number;
  label: string;
}

export function ShareProfile({ walletAddress, score, label }: ShareProfileProps) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const getShareUrl = useCallback(() => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/search?wallet=${walletAddress}`;
    }
    return `/search?wallet=${walletAddress}`;
  }, [walletAddress]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        const input = document.createElement('input');
        input.value = getShareUrl();
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        setCopyFailed(true);
        setTimeout(() => setCopyFailed(false), 2000);
      }
    }
  }, [getShareUrl]);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `TrustTap+ Profile \u2014 Score ${score}/100`,
          text: `Check out my TrustTap+ TrustScore: ${score}/100 (${label}). Verified by device attestation, chain analysis, and physical meetings.`,
          url: getShareUrl(),
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  }, [getShareUrl, score, label, handleCopyLink]);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <p className="tt-label">Share Profile</p>
        <button
          onClick={() => setShowQR(!showQR)}
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.6rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--tt-primary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            borderBottom: '1px solid rgba(16,185,129,0.3)',
            paddingBottom: 1,
          }}
        >
          {showQR ? 'Hide QR' : 'Show QR'}
        </button>
      </div>

      {showQR && (
        <div className="mt-4 flex justify-center bg-white p-4">
          <QRCode value={getShareUrl()} size={180} level="M" />
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <button
          onClick={handleNativeShare}
          className="tt-btn-primary flex flex-1 min-h-[44px] items-center justify-center gap-2"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '10px 16px',
          }}
        >
          Share
        </button>
        <button
          onClick={handleCopyLink}
          className="flex flex-1 min-h-[44px] items-center justify-center gap-2 border border-[var(--bg-elevated)] transition-colors hover:border-[var(--text-muted)] hover:text-[var(--text-secondary)]"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            background: 'none',
            padding: '10px 16px',
          }}
        >
          {copied ? 'Copied!' : copyFailed ? 'Failed' : 'Copy Link'}
        </button>
      </div>

      <hr className="mt-5" style={{ border: 'none', borderTop: 'var(--rule-muted)' }} />
    </div>
  );
}
