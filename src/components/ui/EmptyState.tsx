'use client';

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <p className="font-[family-name:var(--font-serif-display)] text-lg font-normal text-[var(--text-primary)]">{title}</p>
      <p className="max-w-xs text-sm text-[var(--text-muted)]">{description}</p>
    </div>
  );
}
