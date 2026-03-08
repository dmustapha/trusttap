import { describe, it, expect } from 'vitest';
import type { WalletAnalysis } from '@/types';
import {
  calculateDeviceScore,
  calculateAgeScore,
  calculateActivityScore,
  calculateDiversityScore,
  calculateDefiScore,
  calculateIdentityScore,
  calculatePhysicalScore,
  calculateFinancialScore,
  calculateTrustScore,
  getScoreLabel,
  getScoreColor,
} from '../scoring';

function makeAnalysis(overrides: Partial<WalletAnalysis> = {}): WalletAnalysis {
  return {
    walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    hasSGT: true,
    walletAge: 0,
    firstTransactionDate: '2026-01-01T00:00:00Z',
    transactionCount: 0,
    protocolsUsed: [],
    hasStakedSOL: false,
    hasLPPositions: false,
    hasLendingPositions: false,
    nftCount: 0,
    blueChipNFTCount: 0,
    hasSolDomain: false,
    daoVoteCount: 0,
    meetingCount: 0,
    solBalance: 0,
    lstBalance: 0,
    totalPortfolioSOL: 0,
    stakingLevel: 0,
    lpLevel: 0,
    lendingLevel: 0,
    analyzedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('calculateDeviceScore', () => {
  it('returns 25 for SGT holder', () => {
    expect(calculateDeviceScore(true)).toBe(25);
  });
  it('returns 0 for non-SGT holder', () => {
    expect(calculateDeviceScore(false)).toBe(0);
  });
});

describe('calculateFinancialScore', () => {
  it('returns 0 for empty wallet', () => {
    expect(calculateFinancialScore(0)).toBe(0);
  });
  it('returns 1 for dust (0.1-1 SOL)', () => {
    expect(calculateFinancialScore(0.5)).toBe(1);
  });
  it('returns 3 for active user (5-20 SOL)', () => {
    expect(calculateFinancialScore(10)).toBe(3);
  });
  it('returns 7 for serious holder (100-500 SOL)', () => {
    expect(calculateFinancialScore(100)).toBe(7);
  });
  it('returns 10 for whale (2000-10000 SOL)', () => {
    expect(calculateFinancialScore(5000)).toBe(10);
  });
  it('returns 10 for mega whale (10000+ SOL)', () => {
    expect(calculateFinancialScore(50000)).toBe(10);
  });
});

describe('calculateAgeScore', () => {
  it('returns 0 for brand new wallet', () => {
    expect(calculateAgeScore(0)).toBe(0);
  });
  it('returns low score for young wallet', () => {
    const score = calculateAgeScore(30);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(2);
  });
  it('approaches max for old wallet', () => {
    const score = calculateAgeScore(730);
    expect(score).toBeGreaterThanOrEqual(9);
  });
  it('caps at 10', () => {
    expect(calculateAgeScore(5000)).toBeLessThanOrEqual(10);
  });
});

describe('calculateActivityScore', () => {
  it('returns 0 for no transactions', () => {
    expect(calculateActivityScore(0)).toBe(0);
  });
  it('returns 2 for 10-50 tx', () => {
    expect(calculateActivityScore(25)).toBe(2);
  });
  it('returns 6 for 200-1000 tx', () => {
    expect(calculateActivityScore(500)).toBe(6);
  });
  it('returns 10 for 5000+ tx', () => {
    expect(calculateActivityScore(5000)).toBe(10);
  });
});

describe('calculateDiversityScore', () => {
  it('returns 0 for empty protocols', () => {
    expect(calculateDiversityScore([])).toBe(0);
  });
  it('returns 1 for 1 protocol', () => {
    expect(calculateDiversityScore(['Jupiter'])).toBe(1);
  });
  it('returns 3 for 2 basic protocols', () => {
    expect(calculateDiversityScore(['Jupiter', 'Raydium AMM'])).toBe(3);
  });
  it('gives bonus for CLMM protocols', () => {
    const withCLMM = calculateDiversityScore(['Jupiter', 'Raydium AMM', 'Raydium CLMM', 'Orca Whirlpool']);
    const withoutCLMM = calculateDiversityScore(['Jupiter', 'Raydium AMM', 'Tensor', 'Magic Eden']);
    expect(withCLMM).toBeGreaterThan(withoutCLMM);
  });
  it('caps at 10', () => {
    const score = calculateDiversityScore(Array.from({ length: 15 }, (_, i) => `Proto${i}`));
    expect(score).toBeLessThanOrEqual(10);
  });
});

describe('calculateDefiScore', () => {
  it('returns 0 for no DeFi activity', () => {
    expect(calculateDefiScore(makeAnalysis())).toBe(0);
  });
  it('uses graduated staking + LP + lending levels', () => {
    expect(calculateDefiScore(makeAnalysis({ stakingLevel: 2 }))).toBe(2);
    expect(calculateDefiScore(makeAnalysis({ stakingLevel: 2, lpLevel: 3 }))).toBe(5);
    expect(calculateDefiScore(makeAnalysis({ stakingLevel: 5, lpLevel: 4, lendingLevel: 4 }))).toBe(13);
  });
  it('caps at 13', () => {
    expect(calculateDefiScore(makeAnalysis({ stakingLevel: 5, lpLevel: 4, lendingLevel: 4 }))).toBe(13);
  });
});

describe('calculateIdentityScore', () => {
  it('returns 0 for no identity signals', () => {
    expect(calculateIdentityScore(makeAnalysis())).toBe(0);
  });
  it('returns 2 for .sol domain', () => {
    expect(calculateIdentityScore(makeAnalysis({ hasSolDomain: true }))).toBe(2);
  });
  it('returns 4 for .skr domain', () => {
    expect(calculateIdentityScore(makeAnalysis({ hasSolDomain: true, solDomain: 'test.skr' }))).toBe(4);
  });
  it('adds NFT points', () => {
    expect(calculateIdentityScore(makeAnalysis({ nftCount: 5 }))).toBe(1);
    expect(calculateIdentityScore(makeAnalysis({ blueChipNFTCount: 1 }))).toBe(2);
    expect(calculateIdentityScore(makeAnalysis({ blueChipNFTCount: 2 }))).toBe(3);
  });
  it('adds graduated governance points', () => {
    expect(calculateIdentityScore(makeAnalysis({ daoVoteCount: 1 }))).toBe(1);
    expect(calculateIdentityScore(makeAnalysis({ daoVoteCount: 6 }))).toBe(2);
    expect(calculateIdentityScore(makeAnalysis({ daoVoteCount: 20 }))).toBe(3);
  });
  it('caps at 10', () => {
    expect(calculateIdentityScore(makeAnalysis({
      hasSolDomain: true, solDomain: 'test.skr', blueChipNFTCount: 3, daoVoteCount: 25,
    }))).toBe(10);
  });
});

describe('calculatePhysicalScore', () => {
  it('returns 0 for 0 meetings', () => {
    expect(calculatePhysicalScore(0)).toBe(0);
  });
  it('returns 3 for 1 meeting', () => {
    expect(calculatePhysicalScore(1)).toBe(3);
  });
  it('returns 5 for 2 meetings', () => {
    expect(calculatePhysicalScore(2)).toBe(5);
  });
  it('returns 12 for 5+ meetings', () => {
    expect(calculatePhysicalScore(5)).toBe(12);
    expect(calculatePhysicalScore(10)).toBe(12);
  });
});

describe('calculateTrustScore', () => {
  it('SGT-only wallet with no history = 25 (Basic)', () => {
    const result = calculateTrustScore(makeAnalysis({ hasSGT: true }));
    expect(result.score).toBe(25);
    expect(result.label).toBe('Basic');
  });

  it('total score is sum of all breakdown values', () => {
    const result = calculateTrustScore(makeAnalysis({
      hasSGT: true,
      totalPortfolioSOL: 10,
      walletAge: 400,
      transactionCount: 500,
      protocolsUsed: ['Jupiter', 'Raydium AMM'],
      stakingLevel: 2,
      lpLevel: 1,
      meetingCount: 1,
    }));
    const sum = Object.values(result.breakdown).reduce((a, b) => a + b, 0);
    expect(result.score).toBe(sum);
  });

  it('breakdown has all 8 dimensions', () => {
    const result = calculateTrustScore(makeAnalysis());
    expect(Object.keys(result.breakdown)).toHaveLength(8);
    expect(result.breakdown).toHaveProperty('financial');
  });
});

describe('getScoreLabel', () => {
  it('0-20 = Unverified', () => {
    expect(getScoreLabel(0)).toBe('Unverified');
    expect(getScoreLabel(20)).toBe('Unverified');
  });
  it('21-40 = Basic', () => {
    expect(getScoreLabel(21)).toBe('Basic');
    expect(getScoreLabel(40)).toBe('Basic');
  });
  it('81-100 = Highly Trusted', () => {
    expect(getScoreLabel(81)).toBe('Highly Trusted');
    expect(getScoreLabel(100)).toBe('Highly Trusted');
  });
});

describe('getScoreColor', () => {
  it('returns #EF4444 for Unverified range', () => {
    expect(getScoreColor(10)).toBe('#EF4444');
  });
  it('returns #10B981 for Highly Trusted range', () => {
    expect(getScoreColor(90)).toBe('#10B981');
  });
});
