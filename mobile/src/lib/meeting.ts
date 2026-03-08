import nacl from 'tweetnacl';
import bs58 from 'bs58';
import * as Crypto from 'expo-crypto';
import type { MeetingChallenge } from '../types';
import { CHALLENGE_EXPIRY_MS } from './constants';

export function createMeetingChallenge(walletAddress: string): Omit<MeetingChallenge, 'signature'> {
  return {
    walletAddress,
    timestamp: Date.now(),
    nonce: Crypto.randomUUID(),
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
  return age > CHALLENGE_EXPIRY_MS || age < -300_000;
}
