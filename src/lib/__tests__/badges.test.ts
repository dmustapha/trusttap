import { describe, it, expect } from 'vitest';
import type { WalletAnalysis } from '@/types';
import { evaluateBadges } from '../badges';

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
    solBalance: 0, lstBalance: 0, totalPortfolioSOL: 0, stakingLevel: 0, lpLevel: 0, lendingLevel: 0,
    analyzedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('evaluateBadges', () => {
  it('returns veteran for walletAge > 365', () => {
    const badges = evaluateBadges(makeAnalysis({ walletAge: 400 }));
    expect(badges.find(b => b.id === 'veteran')?.earned).toBe(true);
  });

  it('does not return veteran for walletAge <= 365', () => {
    const badges = evaluateBadges(makeAnalysis({ walletAge: 365 }));
    expect(badges.find(b => b.id === 'veteran')?.earned).toBe(false);
  });

  it('returns defi-degen for 5+ protocols and DeFi depth >= 5', () => {
    const badges = evaluateBadges(makeAnalysis({
      protocolsUsed: ['A', 'B', 'C', 'D', 'E'],
      stakingLevel: 3, lpLevel: 2,
    }));
    expect(badges.find(b => b.id === 'defi-degen')?.earned).toBe(true);
  });

  it('returns governor for daoVoteCount >= 3', () => {
    const badges = evaluateBadges(makeAnalysis({ daoVoteCount: 3 }));
    expect(badges.find(b => b.id === 'governor')?.earned).toBe(true);
  });

  it('returns networker for meetingCount >= 5', () => {
    const badges = evaluateBadges(makeAnalysis({ meetingCount: 5 }));
    expect(badges.find(b => b.id === 'networker')?.earned).toBe(true);
  });

  it('returns og for walletAge > 730', () => {
    const badges = evaluateBadges(makeAnalysis({ walletAge: 731 }));
    expect(badges.find(b => b.id === 'og')?.earned).toBe(true);
  });

  it('returns multiple badges when criteria overlap', () => {
    const badges = evaluateBadges(makeAnalysis({
      walletAge: 800,
      protocolsUsed: ['A', 'B', 'C', 'D', 'E'],
      stakingLevel: 3, lpLevel: 2,
      daoVoteCount: 3,
      meetingCount: 10,
    }));
    const earned = badges.filter(b => b.earned).map(b => b.id);
    expect(earned).toContain('veteran');
    expect(earned).toContain('og');
    expect(earned).toContain('defi-degen');
    expect(earned).toContain('governor');
    expect(earned).toContain('networker');
  });

  it('returns empty earned set for minimal wallet', () => {
    const badges = evaluateBadges(makeAnalysis());
    expect(badges.filter(b => b.earned)).toHaveLength(0);
  });
});
