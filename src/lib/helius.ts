import 'server-only';
import type { WalletAnalysis } from '@/types';
import { SGT_MINT_AUTHORITY, TOKEN_2022_PROGRAM_ID, PROTOCOL_PROGRAM_IDS, HELIUS_SOURCE_MAP, LST_MINTS, STABLECOIN_MINTS, STAKING_PROTOCOLS, LP_PROTOCOLS, LENDING_PROTOCOLS, CLMM_PROTOCOLS } from './constants';

const HELIUS_API_KEY = process.env.HELIUS_API_KEY || '';
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const HELIUS_API_URL = `https://api.helius.xyz/v0`;

interface HeliusAsset {
  id: string;
  grouping?: { group_key: string; group_value: string }[];
  content?: {
    metadata?: { name?: string; symbol?: string };
    json_uri?: string;
  };
}

async function fetchWithRetry<T>(fn: () => Promise<T>, maxRetries = 3, baseDelayMs = 1000): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise(r => setTimeout(r, baseDelayMs * Math.pow(2, i)));
    }
  }
  throw new Error('fetchWithRetry exhausted');
}

async function heliusRpc(method: string, params: unknown, id = 'req'): Promise<unknown> {
  const res = await fetch(HELIUS_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message || 'Helius RPC error');
  return json.result;
}

export async function checkSGTOwnership(walletAddress: string): Promise<boolean> {
  return fetchWithRetry(async () => {
    // SGTs are Token-2022 soulbound tokens — DAS API grouping is empty for these.
    // Instead: get all Token-2022 accounts, filter for NFT-like (decimals=0, amount=1),
    // then verify mint authority matches SGT_MINT_AUTHORITY.
    interface TokenAccountInfo {
      mint: string;
      tokenAmount: { uiAmount: number; decimals: number };
    }
    interface TokenAccountEntry {
      account: { data: { parsed: { info: TokenAccountInfo } } };
    }

    const result = await heliusRpc('getTokenAccountsByOwner', [
      walletAddress,
      { programId: TOKEN_2022_PROGRAM_ID },
      { encoding: 'jsonParsed' },
    ], 'sgt-check') as { value: TokenAccountEntry[] };

    // Filter for NFT-like token accounts (decimals=0, amount>=1)
    const candidates = result.value.filter((ta: TokenAccountEntry) => {
      const info = ta.account.data.parsed.info;
      return info.tokenAmount.decimals === 0 && info.tokenAmount.uiAmount >= 1;
    });

    // Check each candidate's mint to see if mintAuthority matches SGT
    for (const candidate of candidates) {
      const mintAddress = candidate.account.data.parsed.info.mint;
      try {
        interface MintAccountResult {
          value: { data: { parsed: { info: { mintAuthority: string | null } } } } | null;
        }
        const mintInfo = await heliusRpc('getAccountInfo', [
          mintAddress,
          { encoding: 'jsonParsed' },
        ], 'sgt-mint-check') as MintAccountResult;

        if (mintInfo?.value?.data?.parsed?.info?.mintAuthority === SGT_MINT_AUTHORITY) {
          return true;
        }
      } catch {
        // Skip mints we can't read
      }
    }

    return false;
  });
}

export async function getWalletAssets(walletAddress: string): Promise<HeliusAsset[]> {
  const result = await heliusRpc('getAssetsByOwner', {
    ownerAddress: walletAddress,
    page: 1,
    limit: 1000,
    displayOptions: { showFungible: false },
  }, 'assets') as { items: HeliusAsset[] };
  return result.items;
}

export async function getWalletAge(walletAddress: string): Promise<{ ageDays: number; firstTxDate: string }> {
  return fetchWithRetry(async () => {
    // Get oldest signatures by paginating backwards
    const result = await heliusRpc('getSignaturesForAddress', [
      walletAddress,
      { limit: 1, commitment: 'confirmed' },
    ], 'wallet-age') as { signature: string; blockTime: number }[];

    if (!result || result.length === 0) {
      return { ageDays: 0, firstTxDate: new Date().toISOString() };
    }

    // This gets the most recent — we need to paginate to find oldest
    // For hackathon simplicity, use this as approximation
    // and do a second call with `before` to find truly oldest
    let oldest = result[0];
    let before = oldest.signature;

    // Paginate backwards to find oldest tx (max 10 pages for performance)
    for (let page = 0; page < 10; page++) {
      const batch = await heliusRpc('getSignaturesForAddress', [
        walletAddress,
        { limit: 1000, before, commitment: 'confirmed' },
      ], `age-page-${page}`) as { signature: string; blockTime: number }[];

      if (!batch || batch.length === 0) break;
      oldest = batch[batch.length - 1];
      before = oldest.signature;
      if (batch.length < 1000) break;
    }

    const firstTxDate = new Date(oldest.blockTime * 1000).toISOString();
    const ageDays = Math.floor((Date.now() - oldest.blockTime * 1000) / (1000 * 60 * 60 * 24));
    return { ageDays, firstTxDate };
  });
}

export async function getTransactionCount(walletAddress: string): Promise<number> {
  return fetchWithRetry(async () => {
    let count = 0;
    let before: string | undefined;

    for (let page = 0; page < 10; page++) {
      const params: [string, Record<string, unknown>] = [
        walletAddress,
        { limit: 1000, commitment: 'confirmed', ...(before ? { before } : {}) },
      ];
      const result = await heliusRpc('getSignaturesForAddress', params, `tx-count-${page}`) as { signature: string }[];

      if (!result || result.length === 0) break;
      count += result.length;
      before = result[result.length - 1].signature;
      if (result.length < 1000) break;
    }

    return Math.min(count, 10000);
  });
}

export async function getProtocolsUsed(walletAddress: string): Promise<string[]> {
  return fetchWithRetry(async () => {
    // Fetch up to 300 recent signatures (3 pages) for broader protocol coverage
    const allSignatures: string[] = [];
    let before: string | undefined;

    for (let page = 0; page < 3; page++) {
      const params: [string, Record<string, unknown>] = [
        walletAddress,
        { limit: 100, commitment: 'confirmed', ...(before ? { before } : {}) },
      ];
      const sigs = await heliusRpc('getSignaturesForAddress', params, `proto-sigs-${page}`) as { signature: string }[];
      if (!sigs || sigs.length === 0) break;
      allSignatures.push(...sigs.map(s => s.signature));
      before = sigs[sigs.length - 1].signature;
      if (sigs.length < 100) break;
    }

    if (allSignatures.length === 0) return [];

    // Parse in batches of 100 (Helius limit)
    const foundProtocols = new Set<string>();
    const protocolNames = Object.keys(PROTOCOL_PROGRAM_IDS);

    for (let i = 0; i < allSignatures.length; i += 100) {
      const batch = allSignatures.slice(i, i + 100);
      const res = await fetch(`${HELIUS_API_URL}/transactions/?api-key=${HELIUS_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: batch }),
      });
      if (!res.ok) continue; // skip batch on rate limit / server error
      const parsed = await res.json() as { source?: string; type?: string }[];

      for (const tx of parsed) {
        if (!tx.source) continue;

        // 1. Direct source mapping (most reliable)
        const mapped = HELIUS_SOURCE_MAP[tx.source.toUpperCase()];
        if (mapped) {
          foundProtocols.add(mapped);
          continue;
        }

        // 2. Fuzzy match against known protocol names
        for (const name of protocolNames) {
          if (tx.source.toUpperCase().includes(name.split(' ')[0].toUpperCase())) {
            foundProtocols.add(name);
          }
        }

        // No fallback — unknown sources are ignored to prevent spam inflation
      }
    }

    return Array.from(foundProtocols);
  });
}

export async function getFinancialData(walletAddress: string): Promise<{
  solBalance: number;
  lstBalance: number;
  totalPortfolioSOL: number;
}> {
  return fetchWithRetry(async () => {
    // Get native SOL balance
    const balanceResult = await heliusRpc('getBalance', [walletAddress], 'sol-balance') as number;
    const solBalance = balanceResult / 1e9; // lamports to SOL

    // Get all SPL token accounts (standard Token program)
    interface SPLTokenInfo {
      mint: string;
      tokenAmount: { uiAmount: number; decimals: number };
    }
    interface SPLTokenEntry {
      account: { data: { parsed: { info: SPLTokenInfo } } };
    }

    const tokenResult = await heliusRpc('getTokenAccountsByOwner', [
      walletAddress,
      { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
      { encoding: 'jsonParsed' },
    ], 'spl-tokens') as { value: SPLTokenEntry[] };

    // Sum up LST balances (these are ~1:1 with SOL)
    let lstBalance = 0;
    for (const ta of tokenResult.value) {
      const info = ta.account.data.parsed.info;
      if (LST_MINTS[info.mint] && info.tokenAmount.uiAmount > 0) {
        lstBalance += info.tokenAmount.uiAmount;
      }
    }

    // Sum stablecoin balances (convert USD to SOL-equivalent using ~$150/SOL estimate)
    const SOL_PRICE_USD_ESTIMATE = 150;
    let stablecoinSOLEquivalent = 0;
    for (const ta of tokenResult.value) {
      const info = ta.account.data.parsed.info;
      if (STABLECOIN_MINTS[info.mint] && info.tokenAmount.uiAmount > 0) {
        stablecoinSOLEquivalent += info.tokenAmount.uiAmount / SOL_PRICE_USD_ESTIMATE;
      }
    }

    const totalPortfolioSOL = solBalance + lstBalance + stablecoinSOLEquivalent;

    return { solBalance, lstBalance, totalPortfolioSOL };
  });
}

function calculateDeFiLevels(protocols: string[]): {
  stakingLevel: number;
  lpLevel: number;
  lendingLevel: number;
} {
  // Staking (0-5): count matching staking protocols + bonus for diversity
  const stakingProtos = protocols.filter(p => STAKING_PROTOCOLS.includes(p));
  let stakingLevel = 0;
  if (stakingProtos.length >= 3) stakingLevel = 5;
  else if (stakingProtos.length >= 2) stakingLevel = 4;
  else if (stakingProtos.length >= 1) stakingLevel = 2;

  // LP (0-4): basic LP(1), multiple(2), CLMM(3), CLMM + multiple(4)
  const lpProtos = protocols.filter(p => LP_PROTOCOLS.includes(p));
  const hasCLMM = protocols.some(p => CLMM_PROTOCOLS.includes(p));
  let lpLevel = 0;
  if (hasCLMM && lpProtos.length >= 2) lpLevel = 4;
  else if (hasCLMM) lpLevel = 3;
  else if (lpProtos.length >= 2) lpLevel = 2;
  else if (lpProtos.length >= 1) lpLevel = 1;

  // Lending (0-4): single supply(1), borrow or multi(2-3), leveraged(4)
  const lendingProtos = protocols.filter(p => LENDING_PROTOCOLS.includes(p));
  let lendingLevel = 0;
  if (lendingProtos.length >= 3) lendingLevel = 4;
  else if (lendingProtos.length >= 2) lendingLevel = 3;
  else if (lendingProtos.length >= 1) lendingLevel = 1;

  return { stakingLevel, lpLevel, lendingLevel };
}

export async function getWalletAnalysis(walletAddress: string): Promise<WalletAnalysis> {
  // Critical calls — must succeed
  const [hasSGT, age] = await Promise.all([
    checkSGTOwnership(walletAddress),
    getWalletAge(walletAddress),
  ]);

  // Non-critical calls — degrade gracefully
  const [assetsResult, txCountResult, protocolsResult, financialResult] = await Promise.allSettled([
    getWalletAssets(walletAddress),
    getTransactionCount(walletAddress),
    getProtocolsUsed(walletAddress),
    getFinancialData(walletAddress),
  ]);

  const assets = assetsResult.status === 'fulfilled' ? assetsResult.value : [];
  const txCount = txCountResult.status === 'fulfilled' ? txCountResult.value : 0;
  const protocols = protocolsResult.status === 'fulfilled' ? protocolsResult.value : [];
  const financial = financialResult.status === 'fulfilled' ? financialResult.value : { solBalance: 0, lstBalance: 0, totalPortfolioSOL: 0 };

  // Graduated DeFi depth levels
  const { stakingLevel, lpLevel, lendingLevel } = calculateDeFiLevels(protocols);

  // Keep binary flags for backward compat
  const hasStakedSOL = stakingLevel > 0;
  const hasLPPositions = lpLevel > 0;
  const hasLendingPositions = lendingLevel > 0;

  // NFT analysis
  const nftCount = assets.length;
  const BLUE_CHIP_COLLECTIONS = [
    'J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w', // Mad Lads
    'BUjZjAS2vbbb65g7Z1WapdeMWoC3bLIgBgitEs8KbQDT', // Tensorians
  ];
  const blueChipNFTCount = assets.filter(a =>
    a.grouping?.some(g => BLUE_CHIP_COLLECTIONS.includes(g.group_value)),
  ).length;

  // .sol domain detection (from assets)
  const domainAsset = assets.find(a =>
    a.content?.metadata?.name?.endsWith('.sol'),
  );
  const hasSolDomain = !!domainAsset;
  const solDomain = domainAsset?.content?.metadata?.name;

  // Governance detection
  const daoVoteCount = protocols.includes('SPL Governance') ? 1 : 0;

  return {
    walletAddress,
    hasSGT,
    walletAge: age.ageDays,
    firstTransactionDate: age.firstTxDate,
    transactionCount: txCount,
    protocolsUsed: protocols,
    hasStakedSOL,
    hasLPPositions,
    hasLendingPositions,
    nftCount,
    blueChipNFTCount,
    hasSolDomain,
    solDomain,
    daoVoteCount,
    meetingCount: 0, // Will be filled from cache/meetings
    solBalance: financial.solBalance,
    lstBalance: financial.lstBalance,
    totalPortfolioSOL: financial.totalPortfolioSOL,
    stakingLevel,
    lpLevel,
    lendingLevel,
    analyzedAt: new Date().toISOString(),
  };
}
