import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import type { Meeting } from '@/types';
import { checkAntiGamingRules } from '../meeting';
import { storeMeeting } from '../cache';

const MEETINGS_DIR = path.join(process.cwd(), 'src/data/meetings');
const CACHE_DIR = path.join(process.cwd(), 'src/data/cache/profiles');
const WALLET_A = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
const WALLET_B = '5ZiE3vAkrdXBgyFL7KqG3RoEGBws4CjRcXVbABDLZTgx';

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

beforeEach(async () => {
  try { await fs.rm(MEETINGS_DIR, { recursive: true, force: true }); } catch {}
  try { await fs.rm(CACHE_DIR, { recursive: true, force: true }); } catch {}
});
afterEach(async () => {
  try { await fs.rm(MEETINGS_DIR, { recursive: true, force: true }); } catch {}
  try { await fs.rm(CACHE_DIR, { recursive: true, force: true }); } catch {}
});

describe('checkAntiGamingRules', () => {
  it('allows valid meeting between two different wallets', async () => {
    const result = await checkAntiGamingRules(WALLET_A, WALLET_B, new Date().toISOString());
    expect(result.allowed).toBe(true);
  });

  it('rejects self-meeting (walletA === walletB)', async () => {
    const result = await checkAntiGamingRules(WALLET_A, WALLET_A, new Date().toISOString());
    expect(result.allowed).toBe(false);
    expect(result.violation).toBe('self_meeting');
  });

  it('rejects when walletA has 5 meetings today', async () => {
    for (let i = 0; i < 5; i++) {
      await storeMeeting(makeMeeting(WALLET_A, `different${i}wallet1234567890abcdefghij`));
    }
    const result = await checkAntiGamingRules(WALLET_A, WALLET_B, new Date().toISOString());
    expect(result.allowed).toBe(false);
    expect(result.violation).toBe('daily_limit');
  });

  it('rejects when walletB has 5 meetings today', async () => {
    for (let i = 0; i < 5; i++) {
      await storeMeeting(makeMeeting(`different${i}wallet1234567890abcdefghij`, WALLET_B));
    }
    const result = await checkAntiGamingRules(WALLET_A, WALLET_B, new Date().toISOString());
    expect(result.allowed).toBe(false);
    expect(result.violation).toBe('daily_limit');
  });

  it('allows walletA with 4 meetings today', async () => {
    for (let i = 0; i < 4; i++) {
      await storeMeeting(makeMeeting(WALLET_A, `different${i}wallet1234567890abcdefghij`));
    }
    const result = await checkAntiGamingRules(WALLET_A, WALLET_B, new Date().toISOString());
    expect(result.allowed).toBe(true);
  });

  it('rejects pair that met within 7 days', async () => {
    await storeMeeting(makeMeeting(WALLET_A, WALLET_B, 3)); // 3 days ago
    const result = await checkAntiGamingRules(WALLET_A, WALLET_B, new Date().toISOString());
    expect(result.allowed).toBe(false);
    expect(result.violation).toBe('cooldown');
  });

  it('allows pair that met 8 days ago', async () => {
    await storeMeeting(makeMeeting(WALLET_A, WALLET_B, 8)); // 8 days ago
    const result = await checkAntiGamingRules(WALLET_A, WALLET_B, new Date().toISOString());
    expect(result.allowed).toBe(true);
  });

  it('rejects expired challenge timestamp', async () => {
    const oldTimestamp = new Date(Date.now() - 120_000).toISOString(); // 2 min ago
    const result = await checkAntiGamingRules(WALLET_A, WALLET_B, oldTimestamp);
    expect(result.allowed).toBe(false);
    expect(result.violation).toBe('expired_challenge');
  });
});
