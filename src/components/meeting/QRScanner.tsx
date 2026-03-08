'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface QRScannerProps {
  onScan: (data: string) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
  const [pasteData, setPasteData] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrRef = useRef<unknown>(null);
  const hasScannedRef = useRef(false);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    let mounted = true;
    let scanner: unknown = null;

    async function startCamera() {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (!mounted || !scannerRef.current) return;

        const scannerId = 'qr-reader';
        scannerRef.current.id = scannerId;

        scanner = new Html5Qrcode(scannerId);
        html5QrRef.current = scanner;
        setScanning(true);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (scanner as any).start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText: string) => {
            if (!hasScannedRef.current) {
              hasScannedRef.current = true;
              onScanRef.current(decodedText);
            }
          },
          () => { /* ignore scan failures */ },
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Camera not available';
        setCameraError(msg);
        setScanning(false);
      }
    }

    startCamera();

    return () => {
      mounted = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (scanner && typeof (scanner as any).stop === 'function') {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const s = scanner as any;
          // Only stop if scanner is actually running (state 2) or paused (state 3)
          const state = typeof s.getState === 'function' ? s.getState() : -1;
          if (state === -1 || state === 2 || state === 3) {
            s.stop().then(() => { html5QrRef.current = null; }).catch(() => {});
          }
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const handlePaste = () => {
    if (pasteData.trim()) {
      onScan(pasteData.trim());
    }
  };

  const handleClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) onScan(text);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Camera viewport */}
      <div
        ref={scannerRef}
        className="overflow-hidden"
        style={{ width: 264, height: 264, background: 'var(--bg-surface)' }}
      />

      {scanning && !cameraError && (
        <p className="text-xs text-[var(--tt-primary)]" style={{ fontFamily: 'var(--font-ui)' }}>
          Point camera at partner&apos;s QR code
        </p>
      )}

      {cameraError && (
        <div className="flex flex-col items-center gap-2 text-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
          <p className="text-xs text-[var(--text-muted)]">
            Camera unavailable — use paste below
          </p>
        </div>
      )}

      {/* Paste fallback */}
      <div className="w-full space-y-3">
        <p className="text-center text-xs font-medium font-[family-name:var(--font-ui)] text-[var(--text-muted)]">
          {cameraError ? 'PASTE VERIFICATION DATA' : 'OR PASTE VERIFICATION DATA'}
        </p>
        <textarea
          value={pasteData}
          onChange={e => setPasteData(e.target.value)}
          placeholder='Paste QR data here...'
          className="h-24 w-full border border-[var(--bg-elevated)] bg-[var(--bg-surface)] px-4 py-3 font-mono text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--tt-primary)] focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={handleClipboard}
            className="flex-1 border border-[var(--bg-elevated)] py-3 text-sm font-medium font-[family-name:var(--font-ui)] text-[var(--text-primary)] transition-colors hover:border-[var(--text-muted)]"
          >
            Paste from Clipboard
          </button>
          <button
            onClick={handlePaste}
            disabled={!pasteData.trim()}
            className="flex-1 bg-[var(--tt-primary)] py-3 text-sm font-semibold font-[family-name:var(--font-ui)] text-[#1a1a1a] transition-colors hover:bg-[#0D9668] disabled:opacity-40"
          >
            Verify
          </button>
        </div>
      </div>
    </motion.div>
  );
}
