import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { WalletAnalysis } from '@/types';

// Mock server-only (no-op in tests)
vi.mock('server-only', () => ({}));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Set env so llmGenerate doesn't throw "not set"
vi.stubEnv('GROQ_API_KEY', 'test-key');

import { generateTrustSummary, generateSybilAssessment, buildTrustSummaryPrompt, buildSybilPrompt } from '../ai';

function makeAnalysis(overrides: Partial<WalletAnalysis> = {}): WalletAnalysis {
  return {
    walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    hasSGT: true, walletAge: 400, firstTransactionDate: '2025-01-01',
    transactionCount: 1500, protocolsUsed: ['Jupiter', 'Raydium'],
    hasStakedSOL: true, hasLPPositions: true, hasLendingPositions: false,
    nftCount: 10, blueChipNFTCount: 1, hasSolDomain: true, solDomain: 'dami.sol',
    daoVoteCount: 3, meetingCount: 5,
    solBalance: 0, lstBalance: 0, totalPortfolioSOL: 0, stakingLevel: 0, lpLevel: 0, lendingLevel: 0,
    analyzedAt: new Date().toISOString(),
    ...overrides,
  };
}

function groqResponse(text: string) {
  return {
    ok: true,
    json: () => Promise.resolve({
      choices: [{ message: { content: text } }],
    }),
  };
}

function groqError(status = 500) {
  return {
    ok: false,
    status,
    text: () => Promise.resolve('Internal error'),
  };
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe('buildTrustSummaryPrompt', () => {
  it('includes score, protocols, and transaction count', () => {
    const prompt = buildTrustSummaryPrompt(makeAnalysis(), 75);
    expect(prompt).toContain('75/100');
    expect(prompt).toContain('1500');
    expect(prompt).toContain('Jupiter, Raydium');
  });

  it('lists strengths for a well-established wallet', () => {
    const prompt = buildTrustSummaryPrompt(makeAnalysis(), 75);
    expect(prompt).toContain('Seeker phone verified');
    expect(prompt).toContain('1+ year old wallet');
    expect(prompt).toContain('Active staker');
    expect(prompt).toContain('Provides liquidity');
    expect(prompt).toContain('Has domain: dami.sol');
    expect(prompt).toContain('5 verified in-person meetings');
    expect(prompt).toContain('3 governance votes');
  });

  it('lists concerns when SGT is missing and wallet is new', () => {
    const prompt = buildTrustSummaryPrompt(makeAnalysis({
      hasSGT: false, walletAge: 30, transactionCount: 10,
      protocolsUsed: ['Jupiter'], meetingCount: 0,
    }), 20);
    expect(prompt).toContain('No device verification');
    expect(prompt).toContain('Wallet less than 3 months old');
    expect(prompt).toContain('Low transaction volume');
    expect(prompt).toContain('Limited protocol diversity');
    expect(prompt).toContain('No in-person verification');
  });

  it('includes output format instructions', () => {
    const prompt = buildTrustSummaryPrompt(makeAnalysis(), 75);
    expect(prompt).toContain('exactly 2 sentences');
    expect(prompt).toContain('Do NOT use generic phrases');
  });
});

describe('buildSybilPrompt', () => {
  it('builds correct prompt with all wallet data fields', () => {
    const prompt = buildSybilPrompt(makeAnalysis());
    expect(prompt).toContain('400 days');
    expect(prompt).toContain('2 unique');
    expect(prompt).toContain('Physical meetings: 5');
  });

  it('shows SGT: No in sybil prompt when hasSGT is false', () => {
    const prompt = buildSybilPrompt(makeAnalysis({ hasSGT: false }));
    expect(prompt).toContain('SGT: No');
    expect(prompt).not.toContain('SGT: Yes');
  });
});

describe('generateTrustSummary', () => {
  it('returns summary string from Groq response', async () => {
    mockFetch.mockResolvedValueOnce(groqResponse('Well-established wallet with diverse DeFi activity.'));
    const summary = await generateTrustSummary(makeAnalysis(), 75);
    expect(summary).toContain('Well-established');
  });

  it('handles API error gracefully (returns fallback string)', async () => {
    mockFetch.mockResolvedValueOnce(groqError());
    const summary = await generateTrustSummary(makeAnalysis(), 75);
    expect(summary).toContain('unavailable');
  });
});

describe('generateSybilAssessment', () => {
  it('parses "HUMAN" assessment from response', async () => {
    mockFetch.mockResolvedValueOnce(groqResponse('HUMAN. Diverse activity across 6 protocols over 14 months.'));
    const result = await generateSybilAssessment(makeAnalysis());
    expect(result.assessment).toBe('HUMAN');
    expect(result.explanation).toContain('Diverse');
  });

  it('parses "LIKELY BOT" assessment from response', async () => {
    mockFetch.mockResolvedValueOnce(groqResponse('LIKELY BOT. Very new wallet with no diversity.'));
    const result = await generateSybilAssessment(makeAnalysis());
    expect(result.assessment).toBe('LIKELY BOT');
  });

  it('returns "UNCERTAIN" as default on parse failure', async () => {
    mockFetch.mockResolvedValueOnce(groqResponse('I cannot determine the status of this wallet.'));
    const result = await generateSybilAssessment(makeAnalysis());
    expect(result.assessment).toBe('UNCERTAIN');
  });

  it('handles API error gracefully', async () => {
    mockFetch.mockResolvedValueOnce(groqError());
    const result = await generateSybilAssessment(makeAnalysis());
    expect(result.assessment).toBe('UNCERTAIN');
    expect(result.explanation).toContain('unavailable');
  });
});
