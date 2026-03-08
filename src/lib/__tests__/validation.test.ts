import { describe, it, expect } from 'vitest';
import {
  isValidWalletAddress,
  validateAnalyzeWalletRequest,
  validateCreateMeetingRequest,
  validateSybilCheckRequest,
} from '../validation';

// Valid Solana address (Base58, 44 chars) for tests
const VALID_ADDR = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
const VALID_ADDR_B = '5ZiE3vAkrdXBgyFL7KqG3RoEGBws4CjRcXVbABDLZTgx';

describe('isValidWalletAddress', () => {
  it('returns true for valid Base58 Solana address', () => {
    expect(isValidWalletAddress(VALID_ADDR)).toBe(true);
  });

  it('returns false for empty string', () => {
    expect(isValidWalletAddress('')).toBe(false);
  });

  it('returns false for too-short string', () => {
    expect(isValidWalletAddress('7xKXtg2CW87d97TXJS')).toBe(false);
  });

  it('returns false for string with invalid Base58 characters (0, O, I, l)', () => {
    // Contains '0' which is not in Base58
    expect(isValidWalletAddress('0xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAs')).toBe(false);
    // Contains 'O'
    expect(isValidWalletAddress('OxKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAs')).toBe(false);
    // Contains 'I'
    expect(isValidWalletAddress('IxKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAs')).toBe(false);
    // Contains 'l'
    expect(isValidWalletAddress('lxKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAs')).toBe(false);
  });

  it('returns false for string over 44 chars', () => {
    expect(isValidWalletAddress('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsUUU')).toBe(false);
  });
});

describe('validateAnalyzeWalletRequest', () => {
  it('returns valid for correct request shape', () => {
    const result = validateAnalyzeWalletRequest({ walletAddress: VALID_ADDR });
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.data.walletAddress).toBe(VALID_ADDR);
  });

  it('returns error for missing walletAddress', () => {
    const result = validateAnalyzeWalletRequest({});
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error).toContain('walletAddress');
  });

  it('returns error for invalid walletAddress format', () => {
    const result = validateAnalyzeWalletRequest({ walletAddress: 'bad' });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error).toContain('Invalid');
  });
});

describe('validateCreateMeetingRequest', () => {
  const validMeeting = {
    walletA: VALID_ADDR,
    walletB: VALID_ADDR_B,
    timestamp: '2026-02-28T15:30:00.000Z',
    signatureA: 'abc123signatureA',
    signatureB: 'abc123signatureB',
    nonceA: 'nonce-a-uuid',
    nonceB: 'nonce-b-uuid',
  };

  it('returns valid for complete, correct request', () => {
    const result = validateCreateMeetingRequest(validMeeting);
    expect(result.valid).toBe(true);
  });

  it('returns error for missing walletA', () => {
    const result = validateCreateMeetingRequest({ ...validMeeting, walletA: undefined });
    expect(result.valid).toBe(false);
  });

  it('returns error for missing signatures', () => {
    const result = validateCreateMeetingRequest({ ...validMeeting, signatureA: undefined });
    expect(result.valid).toBe(false);
  });

  it('returns error for walletA === walletB (self-meeting)', () => {
    const result = validateCreateMeetingRequest({ ...validMeeting, walletB: VALID_ADDR });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error).toContain('yourself');
  });
});

describe('validateSybilCheckRequest', () => {
  it('returns valid for array of addresses + threshold', () => {
    const result = validateSybilCheckRequest({
      walletAddresses: [VALID_ADDR, VALID_ADDR_B],
      minTrustScore: 50,
    });
    expect(result.valid).toBe(true);
  });

  it('returns error for empty walletAddresses array', () => {
    const result = validateSybilCheckRequest({ walletAddresses: [], minTrustScore: 50 });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error).toContain('empty');
  });

  it('returns error for threshold out of range', () => {
    const result = validateSybilCheckRequest({
      walletAddresses: [VALID_ADDR],
      minTrustScore: 150,
    });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error).toContain('between');
  });

  it('returns error when walletAddresses contains non-string elements', () => {
    const result = validateSybilCheckRequest({
      walletAddresses: [VALID_ADDR, 123, null],
      minTrustScore: 50,
    });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error).toContain('strings');
  });

  it('returns error when walletAddresses exceeds max length', () => {
    const result = validateSybilCheckRequest({
      walletAddresses: Array(10001).fill(VALID_ADDR),
      minTrustScore: 50,
    });
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error).toContain('10,000');
  });
});
