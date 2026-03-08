import type { CacheEntry, Meeting, ScoreSnapshot, WalletCheckResult } from '@/types';
import { CACHE_TTL_MS } from './constants';
import { promises as fs } from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), 'src/data/cache/profiles');
const HISTORY_DIR = path.join(process.cwd(), 'src/data/history');
const MEETINGS_FILE = path.join(process.cwd(), 'src/data/meetings/meetings.json');

// In-memory stores
let demoWallets: Map<string, CacheEntry> | null = null;
let sybilDemoData: WalletCheckResult[] | null = null;

export async function ensureCacheDirectories(): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.mkdir(path.dirname(MEETINGS_FILE), { recursive: true });
  } catch {
    // Vercel serverless: read-only filesystem, safe to ignore
  }
}

// ─── Profile Cache ───

export async function getCachedProfile(walletAddress: string): Promise<CacheEntry | null> {
  // Check demo wallets first
  const demos = loadDemoWallets();
  if (demos.has(walletAddress)) return demos.get(walletAddress)!;

  try {
    const filePath = path.join(CACHE_DIR, `${walletAddress}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as CacheEntry;
  } catch {
    return null;
  }
}

export async function setCachedProfile(entry: CacheEntry): Promise<void> {
  try {
    const dir = CACHE_DIR;
    await fs.mkdir(dir, { recursive: true });
    const filePath = path.join(dir, `${entry.walletAddress}.json`);
    await fs.writeFile(filePath, JSON.stringify(entry, null, 2));
  } catch {
    // Vercel serverless: read-only filesystem, score still returned to client
  }
}

export function isProfileStale(entry: CacheEntry): boolean {
  if (entry.source === 'precomputed') return false;
  return Date.now() - new Date(entry.cachedAt).getTime() > CACHE_TTL_MS;
}

// ─── Meeting Storage ───

async function loadMeetings(): Promise<Meeting[]> {
  try {
    const data = await fs.readFile(MEETINGS_FILE, 'utf-8');
    return JSON.parse(data) as Meeting[];
  } catch {
    return [];
  }
}

async function saveMeetings(meetings: Meeting[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(MEETINGS_FILE), { recursive: true });
    const tmpFile = MEETINGS_FILE + '.tmp';
    await fs.writeFile(tmpFile, JSON.stringify(meetings, null, 2));
    await fs.rename(tmpFile, MEETINGS_FILE);
  } catch {
    // Vercel serverless: read-only filesystem, meeting not persisted
  }
}

export async function getMeetings(walletAddress: string): Promise<Meeting[]> {
  const all = await loadMeetings();
  return all.filter(m => m.walletA === walletAddress || m.walletB === walletAddress);
}

export async function getMeetingBetween(walletA: string, walletB: string): Promise<Meeting | null> {
  const all = await loadMeetings();
  return all.find(
    m => (m.walletA === walletA && m.walletB === walletB) ||
         (m.walletA === walletB && m.walletB === walletA),
  ) ?? null;
}

export async function getLastMeetingBetween(walletA: string, walletB: string): Promise<Meeting | null> {
  const all = await loadMeetings();
  const pairMeetings = all.filter(
    m => (m.walletA === walletA && m.walletB === walletB) ||
         (m.walletA === walletB && m.walletB === walletA),
  );
  if (pairMeetings.length === 0) return null;
  return pairMeetings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
}

let meetingLock: Promise<void> = Promise.resolve();

export async function storeMeeting(meeting: Meeting): Promise<void> {
  const prev = meetingLock;
  let resolve: () => void;
  meetingLock = new Promise<void>(r => { resolve = r; });
  await prev;
  try {
    const all = await loadMeetings();
    all.push(meeting);
    await saveMeetings(all);
  } finally {
    resolve!();
  }
}

export async function countMeetingsToday(walletAddress: string): Promise<number> {
  const meetings = await getMeetings(walletAddress);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return meetings.filter(m => new Date(m.timestamp) >= todayStart).length;
}

// ─── Score History ───

export async function getScoreHistory(walletAddress: string): Promise<ScoreSnapshot[]> {
  try {
    const filePath = path.join(HISTORY_DIR, `${walletAddress}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as ScoreSnapshot[];
  } catch {
    return [];
  }
}

export async function addScoreSnapshot(walletAddress: string, score: number): Promise<void> {
  try {
    await fs.mkdir(HISTORY_DIR, { recursive: true });
    const filePath = path.join(HISTORY_DIR, `${walletAddress}.json`);
    const history = await getScoreHistory(walletAddress);

    const last = history[history.length - 1];
    const today = new Date().toISOString().split('T')[0];
    if (last && last.score === score && last.timestamp.startsWith(today)) {
      return;
    }

    history.push({ score, timestamp: new Date().toISOString() });
    const trimmed = history.slice(-50);
    await fs.writeFile(filePath, JSON.stringify(trimmed, null, 2));
  } catch {
    // Vercel serverless: read-only filesystem, history not persisted
  }
}

// ─── Demo Data ───

export function loadDemoWallets(): Map<string, CacheEntry> {
  if (demoWallets) return demoWallets;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const data = require('@/data/demo-wallets.json') as CacheEntry[];
    demoWallets = new Map(data.map(entry => [entry.walletAddress, entry]));
  } catch {
    demoWallets = new Map();
  }
  return demoWallets;
}

export function loadSybilDemoData(): WalletCheckResult[] {
  if (sybilDemoData) return sybilDemoData;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    sybilDemoData = require('@/data/sybil-demo.json') as WalletCheckResult[];
  } catch {
    sybilDemoData = [];
  }
  return sybilDemoData;
}
