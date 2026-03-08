'use client';

export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      className="mx-4 px-4 py-4"
      style={{ borderLeft: '2px solid var(--danger)', background: 'rgba(192,57,43,0.06)' }}
    >
      <p
        style={{
          fontFamily: 'var(--font-serif-body)',
          fontSize: '0.88rem',
          lineHeight: 1.5,
          color: 'var(--danger)',
        }}
      >
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: 10,
            fontFamily: 'var(--font-ui)',
            fontSize: '0.6rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--danger)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            borderBottom: '1px solid rgba(192,57,43,0.3)',
            paddingBottom: 1,
            padding: 0,
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
}
