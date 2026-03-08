'use client';

import { HelpIcon } from '@/components/ui/HelpIcon';

interface AISummaryProps {
  summary: string;
  sybilAssessment: string;
}

const assessmentColors: Record<string, string> = {
  'HUMAN (confident)': '#10B981',
  'LIKELY HUMAN (moderate)': '#22C55E',
  'UNCERTAIN': '#EAB308',
  'LIKELY BOT': '#F97316',
  'BOT': '#EF4444',
};

export function AISummary({ summary, sybilAssessment }: AISummaryProps) {
  const isLoading = !summary || summary === 'Generating trust analysis...';
  const color = assessmentColors[sybilAssessment] || '#EAB308';

  return (
    <div className="mb-8">
      <div className="mb-3.5 flex items-center gap-1">
        <p className="tt-label">
          <span className="text-[var(--tt-primary)]">AI</span> Summary
        </p>
        <HelpIcon tooltipKey="sybil-assessment" />
      </div>

      <div className="tt-ai-card">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--tt-primary)]" />
            <p
              className="italic"
              style={{
                fontFamily: 'var(--font-serif-body)',
                fontSize: '0.88rem',
                color: 'var(--text-muted)',
              }}
            >
              Generating trust analysis...
            </p>
          </div>
        ) : (
          <>
            <p
              className="italic"
              style={{
                fontFamily: 'var(--font-serif-body)',
                fontSize: '0.9rem',
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
              }}
            >
              &ldquo;{summary}&rdquo;
            </p>
            <span
              className="block"
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                opacity: 0.7,
                marginTop: 10,
              }}
            >
              — AI analysis
            </span>
          </>
        )}
      </div>

      {/* Sybil assessment — editorial label, not generic pill */}
      {!isLoading && sybilAssessment && (
        <div className="mt-3 flex items-center gap-2">
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: color,
              display: 'inline-block',
              boxShadow: `0 0 8px ${color}40`,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color,
            }}
          >
            {sybilAssessment}
          </span>
        </div>
      )}
    </div>
  );
}
