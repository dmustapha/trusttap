'use client';

interface ThresholdSliderProps {
  value: number;
  onChange: (v: number) => void;
}

export function ThresholdSlider({ value, onChange }: ThresholdSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--text-secondary)]">Minimum TrustScore</span>
        <span className="text-lg font-bold text-[var(--tt-primary)]">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-[var(--text-muted)]">
        <span>0 (Allow all)</span>
        <span>100 (Max only)</span>
      </div>
    </div>
  );
}
