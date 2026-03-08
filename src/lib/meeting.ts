import nacl from 'tweetnacl';
import bs58 from 'bs58';
import type { MeetingChallenge, AntiGamingViolation } from '@/types';
import { CHALLENGE_EXPIRY_MS, MAX_MEETINGS_PER_DAY, PAIR_COOLDOWN_DAYS } from './constants';
import { countMeetingsToday, getLastMeetingBetween } from './cache';

export function createMeetingChallenge(walletAddress: string): Omit<MeetingChallenge, 'signature'> {
  return {
    walletAddress,
    timestamp: Date.now(),
    nonce: crypto.randomUUID(),
  };
}

export function buildChallengeMessage(walletAddress: string, timestamp: number, nonce: string): string {
  return `${walletAddress}:${timestamp}:${nonce}`;
}

export function verifyMeetingSignature(challenge: MeetingChallenge): boolean {
  try {
    const message = buildChallengeMessage(
      challenge.walletAddress,
      challenge.timestamp,
      challenge.nonce,
    );
    const messageBytes = new Uint8Array(new TextEncoder().encode(message));
    const signatureBytes = new Uint8Array(bs58.decode(challenge.signature));
    const publicKeyBytes = new Uint8Array(bs58.decode(challenge.walletAddress));

    return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
  } catch {
    return false;
  }
}

export function isChallengeExpired(timestamp: number): boolean {
  const now = Date.now();
  const age = now - timestamp;
  // Expired if older than 60s or more than 5min in the future
  return age > CHALLENGE_EXPIRY_MS || age < -300_000;
}

export async function checkAntiGamingRules(
  walletA: string,
  walletB: string,
  timestamp: string,
): Promise<{ allowed: boolean; violation?: AntiGamingViolation }> {
  // Rule 1: self-meeting
  if (walletA === walletB) {
    return { allowed: false, violation: 'self_meeting' };
  }

  // Rule 2: daily limit
  const [todayA, todayB] = await Promise.all([
    countMeetingsToday(walletA),
    countMeetingsToday(walletB),
  ]);
  if (todayA >= MAX_MEETINGS_PER_DAY || todayB >= MAX_MEETINGS_PER_DAY) {
    return { allowed: false, violation: 'daily_limit' };
  }

  // Rule 3: pair cooldown
  const lastMeeting = await getLastMeetingBetween(walletA, walletB);
  if (lastMeeting) {
    const daysSince = (Date.now() - new Date(lastMeeting.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < PAIR_COOLDOWN_DAYS) {
      return { allowed: false, violation: 'cooldown' };
    }
  }

  // Rule 4: challenge expiry
  const ts = new Date(timestamp).getTime();
  if (isNaN(ts) || isChallengeExpired(ts)) {
    return { allowed: false, violation: 'expired_challenge' };
  }

  return { allowed: true };
}
