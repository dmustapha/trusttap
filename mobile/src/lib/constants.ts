import type { TrustLabel } from '../types';

// SGT addresses (PRD Section 6, Feature 1)
export const SGT_COLLECTION_ADDRESS = 'GT22s89nU4iWFkNXj1Bw6uYhJJWDRPpShHt4Bk8f99Te';
export const SGT_MINT_AUTHORITY = 'GT2zuHVaZQYZSyQMgJPLzvkmyztfyXg2NJunqFp4p3A4';

// Token-2022 program ID (for SGT soulbound token detection)
export const TOKEN_2022_PROGRAM_ID = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';

// Known protocol program IDs (PRD Section 6, Feature 2)
export const PROTOCOL_PROGRAM_IDS: Record<string, string> = {
  'Jupiter':        'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
  'Raydium AMM':    '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
  'Raydium CLMM':   'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
  'Marinade':        'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD',
  'Orca Whirlpool': 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc',
  'Tensor':          'TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN',
  'Magic Eden':      'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K',
  'Solend':          'So1endDq2YkqhipRh3WViPa8hFSl6XYA9oMVFwLQbaw',
  'Marginfi':        'MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA',
  'SPL Governance':  'GovER5Lthms3bLBqWub97yVRMmNLaGKKOjL7SdN4QNpM',
  'Squads':          'SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu',
  'Pump Fun':        '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P',
  'Meteora':         'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo',
  'Phoenix':         'PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY',
  'Jito':            'Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P3kCynVa',
  'Drift':           'dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH',
  'Kamino':          'KLend2g3cP87ber41GXWsSZQz8QH65tCP9asMFj1ELR',
  'Marinade Native': 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
  'Sanctum':         'stkitrT1Uoy18Dk1fTrgPw8W6MVzoCfYoAFT4MLsmhq',
};

// Map Helius parse-transaction source strings to display names
export const HELIUS_SOURCE_MAP: Record<string, string> = {
  'JUPITER': 'Jupiter',
  'RAYDIUM': 'Raydium AMM',
  'ORCA': 'Orca Whirlpool',
  'MARINADE': 'Marinade',
  'MARINADE_FINANCE': 'Marinade',
  'TENSOR': 'Tensor',
  'MAGIC_EDEN': 'Magic Eden',
  'MAGIC_EDEN_V2': 'Magic Eden',
  'SOLEND': 'Solend',
  'MARGINFI': 'Marginfi',
  'PUMP_FUN': 'Pump Fun',
  'METEORA': 'Meteora',
  'PHOENIX': 'Phoenix',
  'JITO': 'Jito',
  'DRIFT': 'Drift',
  'KAMINO': 'Kamino',
  'SQUADS': 'Squads',
  'SANCTUM': 'Sanctum',
};

// Known Liquid Staking Token mints (for portfolio calculation)
export const LST_MINTS: Record<string, { name: string; symbol: string }> = {
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': { name: 'Marinade SOL', symbol: 'mSOL' },
  'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn': { name: 'Jito SOL', symbol: 'JitoSOL' },
  '7Q2afV64in6N6SeZsAAB81TJzwpeLmb4fX3z1sE1gCTi': { name: 'Jupiter SOL', symbol: 'jupSOL' },
  'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1': { name: 'BlazeStake SOL', symbol: 'bSOL' },
  '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj': { name: 'Lido SOL', symbol: 'stSOL' },
};

// Known stablecoin mints (for portfolio calculation)
export const STABLECOIN_MINTS: Record<string, { name: string; symbol: string }> = {
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': { name: 'USD Coin', symbol: 'USDC' },
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': { name: 'Tether USD', symbol: 'USDT' },
};

// Financial depth tiers (calibrated for Seeker phone owner demographics)
export const FINANCIAL_TIERS: { minSOL: number; points: number; label: string }[] = [
  { minSOL: 10000, points: 10, label: 'Mega Whale' },
  { minSOL: 2000,  points: 10, label: 'Whale' },
  { minSOL: 500,   points: 8,  label: 'High-Value' },
  { minSOL: 100,   points: 7,  label: 'Serious' },
  { minSOL: 20,    points: 5,  label: 'Committed' },
  { minSOL: 5,     points: 3,  label: 'Active' },
  { minSOL: 1,     points: 2,  label: 'Starter' },
  { minSOL: 0.1,   points: 1,  label: 'Dust' },
  { minSOL: 0,     points: 0,  label: 'Empty' },
];

// Advanced protocol classifications (for diversity bonus scoring)
export const CLMM_PROTOCOLS = ['Raydium CLMM', 'Orca Whirlpool', 'Meteora'];
export const DERIVATIVES_PROTOCOLS = ['Drift', 'Zeta', 'Phoenix'];
export const VAULT_PROTOCOLS = ['Kamino'];
export const STAKING_PROTOCOLS = ['Marinade', 'Marinade Native', 'Jito', 'Sanctum'];
export const LP_PROTOCOLS = ['Raydium AMM', 'Raydium CLMM', 'Orca Whirlpool', 'Meteora', 'Phoenix'];
export const LENDING_PROTOCOLS = ['Solend', 'Marginfi', 'Kamino', 'Drift'];

// Score thresholds (PRD Section 11)
export const SCORE_LABELS: { max: number; label: TrustLabel; color: string }[] = [
  { max: 20, label: 'Unverified', color: '#EF4444' },
  { max: 40, label: 'Basic',      color: '#F97316' },
  { max: 60, label: 'Established', color: '#EAB308' },
  { max: 80, label: 'Trusted',    color: '#22C55E' },
  { max: 100, label: 'Highly Trusted', color: '#10B981' },
];

// Badge definitions (PRD Section 11)
export const BADGE_DEFINITIONS: { id: string; name: string; description: string; criteria: string }[] = [
  { id: 'veteran',    name: 'Veteran',     description: 'Active Solana participant for over a year', criteria: 'Wallet age exceeds 365 days' },
  { id: 'defi-degen', name: 'DeFi Degen',  description: 'Deep DeFi engagement across protocols', criteria: 'Use 5+ protocols AND reach 5+ combined depth in staking, LP, and lending' },
  { id: 'whale',      name: 'Whale',       description: 'Significant economic stake in Solana', criteria: 'Hold 500+ SOL in total portfolio value' },
  { id: 'governor',   name: 'Governor',    description: 'Active in on-chain governance', criteria: 'Cast 3+ DAO governance votes' },
  { id: 'networker',  name: 'Networker',   description: 'Well-connected in the Seeker community', criteria: 'Complete 5+ verified in-person QR meetings' },
  { id: 'og',         name: 'OG',          description: 'Early Solana ecosystem participant', criteria: 'Wallet age exceeds 730 days (2 years)' },
  { id: 'builder',    name: 'Builder',     description: 'Contributor to the Solana ecosystem', criteria: 'Deploy a program on Solana (coming soon)' },
];

// Anti-gaming constants (PRD Section 13)
export const MAX_MEETINGS_PER_DAY = 5;
export const PAIR_COOLDOWN_DAYS = 7;
export const CHALLENGE_EXPIRY_MS = 60_000;
export const MAX_PHYSICAL_SCORE = 12;
export const POINTS_PER_MEETING = 3;

// SKR Token (Seeker Rewards)
export const SKR_MINT_ADDRESS = 'SKRbvo6Gf7GondiT3BbTfuRDPqLWei4j2Qy2NPGZhW3';
export const SKR_DECIMALS = 6;

// SPL Memo Program v2
export const MEMO_PROGRAM_ID = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';

// Cache configuration
export const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
