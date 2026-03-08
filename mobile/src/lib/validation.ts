import type { AnalyzeWalletRequest, CreateMeetingRequest, SybilCheckRequest } from '../types';

const BASE58_CHARS = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;

export function isValidWalletAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  if (address.length < 32 || address.length > 44) return false;
  return BASE58_CHARS.test(address);
}

type ValidationResult<T> = { valid: true; data: T } | { valid: false; error: string };

export function validateAnalyzeWalletRequest(body: unknown): ValidationResult<AnalyzeWalletRequest> {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be an object' };
  }
  const { walletAddress } = body as Record<string, unknown>;
  if (!walletAddress || typeof walletAddress !== 'string') {
    return { valid: false, error: 'walletAddress is required' };
  }
  if (!isValidWalletAddress(walletAddress)) {
    return { valid: false, error: 'Invalid wallet address format' };
  }
  return { valid: true, data: { walletAddress } };
}

export function validateCreateMeetingRequest(body: unknown): ValidationResult<CreateMeetingRequest> {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be an object' };
  }
  const { walletA, walletB, timestamp, signatureA, signatureB, nonceA, nonceB } = body as Record<string, unknown>;
  if (!walletA || typeof walletA !== 'string') return { valid: false, error: 'walletA is required' };
  if (!walletB || typeof walletB !== 'string') return { valid: false, error: 'walletB is required' };
  if (!isValidWalletAddress(walletA)) return { valid: false, error: 'Invalid walletA address format' };
  if (!isValidWalletAddress(walletB)) return { valid: false, error: 'Invalid walletB address format' };
  if (walletA === walletB) return { valid: false, error: 'Cannot create a meeting with yourself' };
  if (!timestamp || typeof timestamp !== 'string') return { valid: false, error: 'timestamp is required' };
  if (!signatureA || typeof signatureA !== 'string') return { valid: false, error: 'signatureA is required' };
  if (!signatureB || typeof signatureB !== 'string') return { valid: false, error: 'signatureB is required' };
  if (!nonceA || typeof nonceA !== 'string') return { valid: false, error: 'nonceA is required' };
  if (!nonceB || typeof nonceB !== 'string') return { valid: false, error: 'nonceB is required' };
  return { valid: true, data: { walletA, walletB, timestamp, signatureA, signatureB, nonceA, nonceB } };
}

export function validateSybilCheckRequest(body: unknown): ValidationResult<SybilCheckRequest> {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be an object' };
  }
  const { walletAddresses, minTrustScore, requireSGT } = body as Record<string, unknown>;
  if (!Array.isArray(walletAddresses)) return { valid: false, error: 'walletAddresses must be an array' };
  if (walletAddresses.length === 0) return { valid: false, error: 'walletAddresses cannot be empty' };
  if (walletAddresses.length > 10000) return { valid: false, error: 'walletAddresses exceeds maximum length of 10,000' };
  if (!walletAddresses.every((addr: unknown) => typeof addr === 'string')) return { valid: false, error: 'All walletAddresses must be strings' };
  if (typeof minTrustScore !== 'number') return { valid: false, error: 'minTrustScore must be a number' };
  if (minTrustScore < 0 || minTrustScore > 100) return { valid: false, error: 'minTrustScore must be between 0 and 100' };
  if (requireSGT !== undefined && typeof requireSGT !== 'boolean') return { valid: false, error: 'requireSGT must be a boolean' };
  return { valid: true, data: { walletAddresses, minTrustScore, requireSGT: requireSGT !== false } };
}
