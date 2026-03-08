import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globally before imports
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Must import after mocking
import {
  checkSGTOwnership,
  getWalletAge,
  getTransactionCount,
  getProtocolsUsed,
  getWalletAnalysis,
} from '../helius';

function mockRpcResponse(result: unknown) {
  return { ok: true, json: () => Promise.resolve({ jsonrpc: '2.0', result }) };
}

beforeEach(() => {
  mockFetch.mockReset();
});

describe('checkSGTOwnership', () => {
  it('returns true when wallet has Token-2022 NFT with SGT mint authority', async () => {
    // 1st call: getTokenAccountsByOwner — returns a Token-2022 NFT-like account
    mockFetch.mockResolvedValueOnce(mockRpcResponse({
      value: [{
        account: { data: { parsed: { info: {
          mint: 'sgt-mint-123',
          tokenAmount: { uiAmount: 1, decimals: 0 },
        } } } },
      }],
    }));
    // 2nd call: getAccountInfo for mint — returns SGT_MINT_AUTHORITY
    mockFetch.mockResolvedValueOnce(mockRpcResponse({
      value: { data: { parsed: { info: {
        mintAuthority: 'GT2zuHVaZQYZSyQMgJPLzvkmyztfyXg2NJunqFp4p3A4',
      } } } },
    }));
    expect(await checkSGTOwnership('wallet1')).toBe(true);
  });

  it('returns false when mint authority does not match SGT', async () => {
    mockFetch.mockResolvedValueOnce(mockRpcResponse({
      value: [{
        account: { data: { parsed: { info: {
          mint: 'other-mint',
          tokenAmount: { uiAmount: 1, decimals: 0 },
        } } } },
      }],
    }));
    mockFetch.mockResolvedValueOnce(mockRpcResponse({
      value: { data: { parsed: { info: {
        mintAuthority: 'SomeOtherAuthority',
      } } } },
    }));
    expect(await checkSGTOwnership('wallet1')).toBe(false);
  });

  it('returns false on empty Token-2022 accounts', async () => {
    mockFetch.mockResolvedValueOnce(mockRpcResponse({ value: [] }));
    expect(await checkSGTOwnership('wallet1')).toBe(false);
  });
});

describe('getWalletAge', () => {
  it('calculates correct age in days from first tx timestamp', async () => {
    const daysAgo = 100;
    const blockTime = Math.floor((Date.now() - daysAgo * 86400000) / 1000);
    // First call gets recent sigs, second paginated call returns empty (so first is oldest)
    mockFetch
      .mockResolvedValueOnce(mockRpcResponse([{ signature: 'sig1', blockTime }]))
      .mockResolvedValueOnce(mockRpcResponse([]));

    const result = await getWalletAge('wallet1');
    expect(result.ageDays).toBeGreaterThanOrEqual(99);
    expect(result.ageDays).toBeLessThanOrEqual(101);
  });

  it('returns 0 days for brand new wallet', async () => {
    mockFetch.mockResolvedValueOnce(mockRpcResponse([]));
    const result = await getWalletAge('wallet1');
    expect(result.ageDays).toBe(0);
  });
});

describe('getTransactionCount', () => {
  it('returns count from paginated signatures', async () => {
    mockFetch
      .mockResolvedValueOnce(mockRpcResponse(
        Array.from({ length: 500 }, (_, i) => ({ signature: `sig${i}` })),
      ))
      .mockResolvedValueOnce(mockRpcResponse([]));

    expect(await getTransactionCount('wallet1')).toBe(500);
  });

  it('caps at 10000 for large wallets', async () => {
    // Simulate 10 full pages
    for (let i = 0; i < 10; i++) {
      mockFetch.mockResolvedValueOnce(mockRpcResponse(
        Array.from({ length: 1000 }, (_, j) => ({ signature: `sig${i}_${j}` })),
      ));
    }
    expect(await getTransactionCount('wallet1')).toBe(10000);
  });
});

describe('getProtocolsUsed', () => {
  it('returns Jupiter when parse-tx has source "JUPITER"', async () => {
    mockFetch
      .mockResolvedValueOnce(mockRpcResponse([{ signature: 'sig1' }])) // getSigs
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ source: 'JUPITER', type: 'SWAP' }]) }); // parse-tx

    const result = await getProtocolsUsed('wallet1');
    expect(result).toContain('Jupiter');
  });

  it('returns empty array for transfer-only wallet', async () => {
    mockFetch
      .mockResolvedValueOnce(mockRpcResponse([{ signature: 'sig1' }]))
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ source: 'SYSTEM_PROGRAM', type: 'TRANSFER' }]) });

    const result = await getProtocolsUsed('wallet1');
    expect(result).toHaveLength(0);
  });

  it('deduplicates protocol names', async () => {
    mockFetch
      .mockResolvedValueOnce(mockRpcResponse([{ signature: 'sig1' }, { signature: 'sig2' }]))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
          { source: 'JUPITER', type: 'SWAP' },
          { source: 'JUPITER', type: 'SWAP' },
        ]),
      });

    const result = await getProtocolsUsed('wallet1');
    expect(result.filter(p => p === 'Jupiter')).toHaveLength(1);
  });
});

describe('getWalletAnalysis', () => {
  it('assembles complete WalletAnalysis from sub-calls', async () => {
    const blockTime = Math.floor((Date.now() - 100 * 86400000) / 1000);

    // Route mock responses based on request body content
    mockFetch.mockImplementation(async (url: string, opts?: { body?: string }) => {
      const body = opts?.body ? JSON.parse(opts.body) : {};

      // Parse-transactions endpoint (different URL)
      if (typeof url === 'string' && url.includes('/v0/transactions')) {
        return { ok: true, json: () => Promise.resolve([{ source: 'JUPITER', type: 'SWAP' }]) };
      }

      const id = body.id || '';
      const method = body.method || '';

      // SGT check: getTokenAccountsByOwner (Token-2022)
      if (id === 'sgt-check' && method === 'getTokenAccountsByOwner') {
        return mockRpcResponse({
          value: [{
            account: { data: { parsed: { info: {
              mint: 'sgt-mint-123',
              tokenAmount: { uiAmount: 1, decimals: 0 },
            } } } },
          }],
        });
      }

      // SGT mint authority check
      if (id === 'sgt-mint-check' && method === 'getAccountInfo') {
        return mockRpcResponse({
          value: { data: { parsed: { info: {
            mintAuthority: 'GT2zuHVaZQYZSyQMgJPLzvkmyztfyXg2NJunqFp4p3A4',
          } } } },
        });
      }

      // Asset queries (NFTs)
      if (method === 'getAssetsByOwner') {
        return mockRpcResponse({ items: [] });
      }

      // SPL token accounts (for financial data)
      if (method === 'getTokenAccountsByOwner') {
        return mockRpcResponse({ value: [] });
      }

      // Balance
      if (method === 'getBalance') {
        return mockRpcResponse(5000000000); // 5 SOL
      }

      // Signatures — return different results based on id
      if (method === 'getSignaturesForAddress') {
        if (id === 'wallet-age') {
          return mockRpcResponse([{ signature: 'oldest', blockTime }]);
        }
        if (id.startsWith('age-page')) {
          return mockRpcResponse([]);
        }
        if (id === 'tx-count-0') {
          return mockRpcResponse(Array.from({ length: 200 }, (_, i) => ({ signature: `tx${i}` })));
        }
        if (id.startsWith('tx-count')) {
          return mockRpcResponse([]);
        }
        if (id.startsWith('proto-sigs')) {
          return mockRpcResponse([{ signature: 'sig1' }]);
        }
        return mockRpcResponse([]);
      }

      return mockRpcResponse({});
    });

    const analysis = await getWalletAnalysis('wallet1');
    expect(analysis.walletAddress).toBe('wallet1');
    expect(analysis.hasSGT).toBe(true);
    expect(analysis.transactionCount).toBe(200);
    expect(analysis.protocolsUsed).toContain('Jupiter');
  });
});
