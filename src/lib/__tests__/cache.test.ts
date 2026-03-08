import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import type { CacheEntry, Meeting } from '@/types';
import {
  getCachedProfile,
  setCachedProfile,
  isProfileStale,
  getMeetings,
  storeMeeting,
  countMeetingsToday,
  getMeetingBetween,
  getLastMeetingBetween,
} from '../cache';

const TEST_CACHE_DIR = path.join(process.cwd(), 'src/data/cache/profiles');
const TEST_MEETINGS_DIR = path.join(process.cwd(), 'src/data/meetings');

const WALLET_A = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
const WALLET_B = '5ZiE3vAkrdXBgyFL7KqG3RoEGBws4CjRcXVbABDLZTgx';

function makeCacheEntry(walletAddress: string, source: 'precomputed' | 'live' = 'live'): CacheEntry {
  const now = new Date().toISOString();
  return {
    walletAddress,
    analysis: {
      walletAddress, hasSGT: true, walletAge: 100, firstTransactionDate: '2025-01-01T00:00:00Z',
      transactionCount: 500, protocolsUsed: ['Jupiter'], hasStakedSOL: true,
      hasLPPositions: false, hasLendingPositions: false, nftCount: 5, blueChipNFTCount: 0,
      hasSolDomain: false, daoVoteCount: 0, meetingCount: 0,
      solBalance: 0, lstBalance: 0, totalPortfolioSOL: 0, stakingLevel: 0, lpLevel: 0, lendingLevel: 0,
      analyzedAt: now,
    },
    profile: {
      walletAddress, score: 50, label: 'Established', color: '#EAB308',
      breakdown: { device: 20, financial: 0, walletAge: 10, activity: 10, diversity: 3, defi: 5, identity: 0, physical: 2 },
      badges: [], aiSummary: '', sybilAssessment: '', meetingHistory: [],
      analysis: {} as CacheEntry['analysis'],
      cachedAt: now,
    },
    cachedAt: now,
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    source,
  };
}

function makeMeeting(walletA: string, walletB: string, daysAgo = 0): Meeting {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return {
    id: crypto.randomUUID(),
    walletA, walletB,
    timestamp: d.toISOString(),
    signatureA: 'sigA', signatureB: 'sigB',
    verified: true,
  };
}

// Clean up test data before/after each test
beforeEach(async () => {
  try { await fs.rm(TEST_CACHE_DIR, { recursive: true, force: true }); } catch {}
  try { await fs.rm(TEST_MEETINGS_DIR, { recursive: true, force: true }); } catch {}
});
afterEach(async () => {
  try { await fs.rm(TEST_CACHE_DIR, { recursive: true, force: true }); } catch {}
  try { await fs.rm(TEST_MEETINGS_DIR, { recursive: true, force: true }); } catch {}
});

describe('profile cache', () => {
  it('getCachedProfile returns null for non-existent wallet', async () => {
    expect(await getCachedProfile('nonexistent')).toBeNull();
  });

  it('setCachedProfile + getCachedProfile roundtrip works', async () => {
    const entry = makeCacheEntry(WALLET_A);
    await setCachedProfile(entry);
    const result = await getCachedProfile(WALLET_A);
    expect(result).not.toBeNull();
    expect(result!.walletAddress).toBe(WALLET_A);
  });

  it('isProfileStale returns false for entry cached < 24h ago', () => {
    const entry = makeCacheEntry(WALLET_A);
    expect(isProfileStale(entry)).toBe(false);
  });

  it('isProfileStale returns true for entry cached > 24h ago', () => {
    const entry = makeCacheEntry(WALLET_A);
    entry.cachedAt = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
    expect(isProfileStale(entry)).toBe(true);
  });
});

describe('meeting storage', () => {
  it('getMeetings returns empty array for new wallet', async () => {
    expect(await getMeetings(WALLET_A)).toEqual([]);
  });

  it('storeMeeting + getMeetings roundtrip works', async () => {
    const meeting = makeMeeting(WALLET_A, WALLET_B);
    await storeMeeting(meeting);
    const result = await getMeetings(WALLET_A);
    expect(result).toHaveLength(1);
    expect(result[0].walletA).toBe(WALLET_A);
  });

  it('getMeetings filters to correct wallet (A or B side)', async () => {
    await storeMeeting(makeMeeting(WALLET_A, WALLET_B));
    expect(await getMeetings(WALLET_A)).toHaveLength(1);
    expect(await getMeetings(WALLET_B)).toHaveLength(1);
    expect(await getMeetings('other')).toHaveLength(0);
  });

  it('countMeetingsToday counts only today\'s meetings', async () => {
    await storeMeeting(makeMeeting(WALLET_A, WALLET_B, 0)); // today
    await storeMeeting(makeMeeting(WALLET_A, WALLET_B, 2)); // 2 days ago
    expect(await countMeetingsToday(WALLET_A)).toBe(1);
  });

  it('getMeetingBetween returns null for no meeting', async () => {
    expect(await getMeetingBetween(WALLET_A, WALLET_B)).toBeNull();
  });

  it('getMeetingBetween returns meeting for existing pair', async () => {
    await storeMeeting(makeMeeting(WALLET_A, WALLET_B));
    const result = await getMeetingBetween(WALLET_A, WALLET_B);
    expect(result).not.toBeNull();
  });

  it('getLastMeetingBetween returns most recent meeting', async () => {
    await storeMeeting(makeMeeting(WALLET_A, WALLET_B, 5));
    await storeMeeting(makeMeeting(WALLET_A, WALLET_B, 1));
    const result = await getLastMeetingBetween(WALLET_A, WALLET_B);
    expect(result).not.toBeNull();
    // Most recent should be ~1 day ago, not 5
    const daysSince = (Date.now() - new Date(result!.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    expect(daysSince).toBeLessThan(2);
  });
});
