'use client';

interface ConnectButtonProps {
  onConnect: () => void;
  loading?: boolean;
}

export function ConnectButton({ onConnect, loading }: ConnectButtonProps) {
  return (
    <button
      onClick={onConnect}
      disabled={loading}
      className="tt-btn-primary w-full disabled:opacity-60"
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: '16px 32px',
      }}
    >
      {loading ? 'Connecting\u2026' : 'Connect Wallet'}
    </button>
  );
}
