'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useMeeting } from '@/hooks/useMeeting';
import { PageShell } from '@/components/layout/PageShell';
import { BottomNav } from '@/components/layout/BottomNav';
import { QRGenerator } from '@/components/meeting/QRGenerator';
import { QRScanner } from '@/components/meeting/QRScanner';
import { MeetingConfirm } from '@/components/meeting/MeetingConfirm';
import { MeetingSuccess } from '@/components/meeting/MeetingSuccess';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { HelpIcon } from '@/components/ui/HelpIcon';

export default function ScanPage() {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const [tab, setTab] = useState<'show' | 'scan'>('show');
  const {
    state, challenge, partnerProfile, partnerAddress,
    error, updatedScores, generateQR, startScanning,
    handleScan, confirmMeeting, reset,
  } = useMeeting();

  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !connected) router.push('/');
  }, [connected, router, mounted]);

  if (!mounted || !connected || !publicKey) return null;

  const handleShowQR = () => {
    setTab('show');
    generateQR(publicKey);
  };

  const handleStartScan = () => {
    setTab('scan');
    startScanning();
  };

  return (
    <>
      <PageShell>
        <div className="mb-6 flex items-center gap-1">
          <h1 className="text-xl font-bold font-[family-name:var(--font-serif-display)] text-[var(--text-primary)]">Meeting Verification</h1>
          <HelpIcon tooltipKey="qr-verification" />
        </div>

        {state === 'success' && updatedScores && (
          <MeetingSuccess
            myScore={updatedScores.myScore}
            partnerScore={updatedScores.partnerScore}
            partnerAddress={partnerAddress ?? ''}
            onDone={reset}
          />
        )}

        {(state === 'partner_preview' || state === 'submitting') && partnerAddress && (
          <MeetingConfirm
            partnerAddress={partnerAddress}
            partnerProfile={partnerProfile}
            onConfirm={() => confirmMeeting(publicKey)}
            onCancel={reset}
            loading={state === 'submitting'}
          />
        )}

        {state === 'error' && error && (
          <ErrorMessage message={error} onRetry={reset} />
        )}

        {(state === 'idle' || state === 'showing_qr' || state === 'scanning') && (
          <>
            <div className="mb-6 flex" style={{ borderBottom: '1px solid var(--bg-elevated)' }}>
              {(['show', 'scan'] as const).map((t) => (
                <button
                  key={t}
                  onClick={t === 'show' ? handleShowQR : handleStartScan}
                  className="flex-1 pb-3 pt-1 transition-colors"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)',
                    borderBottom: tab === t ? '2px solid var(--tt-primary)' : '2px solid transparent',
                    marginBottom: '-1px',
                  }}
                >
                  {t === 'show' ? 'Show My QR' : 'Scan QR'}
                </button>
              ))}
            </div>

            <div>
              {tab === 'show' && (
                challenge ? (
                  <QRGenerator challenge={challenge} onExpired={handleShowQR} />
                ) : (
                  <div className="flex flex-col items-center gap-4 py-12">
                    <p className="text-sm font-[family-name:var(--font-serif-body)] text-[var(--text-secondary)]">Generate a QR code for your partner to scan</p>
                    <button
                      onClick={handleShowQR}
                      className="bg-[var(--tt-primary)] px-6 py-3 text-sm font-semibold font-[family-name:var(--font-ui)] text-[#1a1a1a] active:scale-[0.97] transition-transform"
                    >
                      Generate QR
                    </button>
                  </div>
                )
              )}
              {tab === 'scan' && <QRScanner onScan={handleScan} />}
            </div>
          </>
        )}

        <div className="mt-8" style={{ borderTop: '1px solid color-mix(in srgb, var(--tt-primary) 15%, transparent)', paddingTop: '1.25rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.62rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--tt-primary)',
              opacity: 0.8,
            }}
          >
            How it works
          </span>

          <div className="mt-3 flex flex-col gap-0">
            {[
              'Meet a Seeker owner in person',
              'One person shows their QR code',
              'The other scans or pastes it',
              'Both wallets confirm the meeting',
              'Each earns +2 physical trust points',
            ].map((step, i, arr) => (
              <div key={i} className="flex items-stretch gap-3">
                {/* Number + connector column */}
                <div className="flex flex-col items-center" style={{ width: '1.5rem', flexShrink: 0 }}>
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center"
                    style={{
                      background: 'color-mix(in srgb, var(--tt-primary) 15%, var(--bg-elevated))',
                      border: '1px solid color-mix(in srgb, var(--tt-primary) 35%, transparent)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      color: 'var(--tt-primary)',
                      lineHeight: 1,
                    }}
                  >
                    {i + 1}
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      style={{
                        width: '1px',
                        flexGrow: 1,
                        minHeight: '0.75rem',
                        marginTop: '2px',
                        marginBottom: '2px',
                        background: 'color-mix(in srgb, var(--tt-primary) 20%, transparent)',
                      }}
                    />
                  )}
                </div>

                {/* Step text */}
                <p
                  style={{
                    fontFamily: 'var(--font-serif-body)',
                    fontSize: '0.78rem',
                    lineHeight: 1.45,
                    color: 'var(--text-muted)',
                    paddingTop: '0.2rem',
                    paddingBottom: i < arr.length - 1 ? '0.5rem' : 0,
                  }}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </PageShell>
      <BottomNav />
    </>
  );
}
