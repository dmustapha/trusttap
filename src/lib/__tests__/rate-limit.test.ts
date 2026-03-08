import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkRateLimit, resetRateLimits } from '../rate-limit';

beforeEach(() => {
  resetRateLimits();
});

describe('checkRateLimit', () => {
  it('allows requests under limit', () => {
    expect(checkRateLimit('test', 3, 60000)).toBe(true);
    expect(checkRateLimit('test', 3, 60000)).toBe(true);
    expect(checkRateLimit('test', 3, 60000)).toBe(true);
  });

  it('blocks requests over limit', () => {
    checkRateLimit('test', 2, 60000);
    checkRateLimit('test', 2, 60000);
    expect(checkRateLimit('test', 2, 60000)).toBe(false);
  });

  it('resets after window expires', () => {
    checkRateLimit('test', 1, 100);
    expect(checkRateLimit('test', 1, 100)).toBe(false);

    // Advance time past window
    vi.useFakeTimers();
    vi.advanceTimersByTime(150);
    expect(checkRateLimit('test', 1, 100)).toBe(true);
    vi.useRealTimers();
  });
});
