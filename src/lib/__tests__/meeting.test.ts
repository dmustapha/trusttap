import { describe, it, expect } from 'vitest';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import {
  createMeetingChallenge,
  buildChallengeMessage,
  verifyMeetingSignature,
  isChallengeExpired,
} from '../meeting';

// Generate a real Ed25519 keypair for testing
function makeTestKeypair() {
  const keypair = nacl.sign.keyPair();
  return {
    publicKey: bs58.encode(keypair.publicKey),
    secretKey: keypair.secretKey,
  };
}

function signChallenge(message: string, secretKey: Uint8Array): string {
  const encoded = new TextEncoder().encode(message);
  const messageBytes = new Uint8Array(encoded);
  const signature = nacl.sign.detached(messageBytes, new Uint8Array(secretKey));
  return bs58.encode(signature);
}

describe('createMeetingChallenge', () => {
  it('returns object with walletAddress, timestamp, nonce', () => {
    const challenge = createMeetingChallenge('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU');
    expect(challenge).toHaveProperty('walletAddress');
    expect(challenge).toHaveProperty('timestamp');
    expect(challenge).toHaveProperty('nonce');
  });

  it('nonce is a valid UUID format', () => {
    const challenge = createMeetingChallenge('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU');
    expect(challenge.nonce).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it('timestamp is within 1 second of Date.now()', () => {
    const before = Date.now();
    const challenge = createMeetingChallenge('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU');
    const after = Date.now();
    expect(challenge.timestamp).toBeGreaterThanOrEqual(before);
    expect(challenge.timestamp).toBeLessThanOrEqual(after);
  });
});

describe('buildChallengeMessage', () => {
  it('format is "address:timestamp:nonce"', () => {
    const msg = buildChallengeMessage('ABC', 12345, 'nonce-1');
    expect(msg).toBe('ABC:12345:nonce-1');
  });

  it('is deterministic for same inputs', () => {
    const a = buildChallengeMessage('X', 1, 'N');
    const b = buildChallengeMessage('X', 1, 'N');
    expect(a).toBe(b);
  });
});

describe('verifyMeetingSignature', () => {
  it('returns true for valid keypair signature', () => {
    const { publicKey, secretKey } = makeTestKeypair();
    const timestamp = Date.now();
    const nonce = crypto.randomUUID();
    const message = buildChallengeMessage(publicKey, timestamp, nonce);
    const signature = signChallenge(message, secretKey);

    expect(verifyMeetingSignature({
      walletAddress: publicKey,
      timestamp,
      nonce,
      signature,
    })).toBe(true);
  });

  it('returns false for tampered message (changed timestamp)', () => {
    const { publicKey, secretKey } = makeTestKeypair();
    const timestamp = Date.now();
    const nonce = crypto.randomUUID();
    const message = buildChallengeMessage(publicKey, timestamp, nonce);
    const signature = signChallenge(message, secretKey);

    expect(verifyMeetingSignature({
      walletAddress: publicKey,
      timestamp: timestamp + 1000, // tampered
      nonce,
      signature,
    })).toBe(false);
  });

  it('returns false for wrong public key', () => {
    const { secretKey } = makeTestKeypair();
    const { publicKey: otherKey } = makeTestKeypair();
    const timestamp = Date.now();
    const nonce = crypto.randomUUID();
    const message = buildChallengeMessage(otherKey, timestamp, nonce);
    const signature = signChallenge(message, secretKey);

    expect(verifyMeetingSignature({
      walletAddress: otherKey,
      timestamp,
      nonce,
      signature,
    })).toBe(false);
  });

  it('returns false for garbage signature', () => {
    const { publicKey } = makeTestKeypair();
    expect(verifyMeetingSignature({
      walletAddress: publicKey,
      timestamp: Date.now(),
      nonce: 'test',
      signature: 'notarealsignature',
    })).toBe(false);
  });
});

describe('isChallengeExpired', () => {
  it('returns false for timestamp within 60 seconds', () => {
    expect(isChallengeExpired(Date.now() - 30_000)).toBe(false);
  });

  it('returns true for timestamp older than 60 seconds', () => {
    expect(isChallengeExpired(Date.now() - 61_000)).toBe(true);
  });

  it('returns true for future timestamp (>5 min ahead)', () => {
    expect(isChallengeExpired(Date.now() + 6 * 60 * 1000)).toBe(true);
  });
});
