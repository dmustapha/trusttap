// Run with: npx tsx scripts/generate-demo-data.ts
import { writeFileSync } from 'fs';
import path from 'path';

// Generate a pseudo-random Base58 address
const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function makeAddr(seed: number): string {
  let addr = '';
  let s = seed;
  for (let i = 0; i < 44; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    addr += BASE58[s % 58];
  }
  return addr;
}

// ─── Demo Wallets ───
interface DemoWallet {
  walletAddress: string;
  walletAge: number;
  transactionCount: number;
  protocolsUsed: string[];
  hasStakedSOL: boolean;
  hasLPPositions: boolean;
  hasLendingPositions: boolean;
  nftCount: number;
  blueChipNFTCount: number;
  hasSolDomain: boolean;
  solDomain?: string;
  daoVoteCount: number;
  meetingCount: number;
  expectedScore: number;
  aiSummary: string;
  sybilAssessment: string;
}

const wallets: DemoWallet[] = [
  {
    walletAddress: makeAddr(1001),
    walletAge: 548, transactionCount: 2000,
    protocolsUsed: ['Jupiter', 'Raydium AMM', 'Marinade', 'Orca Whirlpool'],
    hasStakedSOL: true, hasLPPositions: true, hasLendingPositions: true,
    nftCount: 15, blueChipNFTCount: 0, hasSolDomain: true, solDomain: 'dami.sol',
    daoVoteCount: 0, meetingCount: 3, expectedScore: 88,
    aiSummary: 'Highly active DeFi trader with 18 months of diverse protocol usage across Jupiter, Raydium, Marinade, and Orca. Full spectrum DeFi engagement including staking, liquidity provision, and lending demonstrates deep ecosystem knowledge. Verified Seeker device holder with 3 physical meeting verifications.',
    sybilAssessment: 'HUMAN (confident)',
  },
  {
    walletAddress: makeAddr(1002),
    walletAge: 200, transactionCount: 300,
    protocolsUsed: ['Tensor', 'Magic Eden'],
    hasStakedSOL: false, hasLPPositions: false, hasLendingPositions: false,
    nftCount: 45, blueChipNFTCount: 2, hasSolDomain: true, solDomain: 'nftking.sol',
    daoVoteCount: 0, meetingCount: 1, expectedScore: 56,
    aiSummary: 'NFT-focused wallet active for 7 months with collections across Tensor and Magic Eden marketplaces. Holds 2 blue-chip NFTs and owns a .sol domain. Limited DeFi engagement suggests a collector profile rather than a trader.',
    sybilAssessment: 'LIKELY HUMAN (moderate)',
  },
  {
    walletAddress: makeAddr(1003),
    walletAge: 500, transactionCount: 800,
    protocolsUsed: ['Jupiter', 'Raydium AMM', 'Marinade', 'SPL Governance', 'Squads'],
    hasStakedSOL: true, hasLPPositions: false, hasLendingPositions: false,
    nftCount: 10, blueChipNFTCount: 0, hasSolDomain: false,
    daoVoteCount: 15, meetingCount: 4, expectedScore: 75,
    aiSummary: 'Active governance participant with 15 DAO votes and involvement across 5 protocols. Strong staking commitment via Marinade with regular Jupiter trading activity. Well-connected with 4 verified physical meetings in the Seeker community.',
    sybilAssessment: 'HUMAN (confident)',
  },
  {
    walletAddress: makeAddr(1004),
    walletAge: 14, transactionCount: 12,
    protocolsUsed: ['Jupiter'],
    hasStakedSOL: false, hasLPPositions: false, hasLendingPositions: false,
    nftCount: 0, blueChipNFTCount: 0, hasSolDomain: false,
    daoVoteCount: 0, meetingCount: 0, expectedScore: 23,
    aiSummary: 'Very new wallet with only 2 weeks of history and minimal activity. Has used Jupiter for basic swaps. No DeFi positions, NFTs, or community engagement yet. Score will improve with continued authentic usage.',
    sybilAssessment: 'UNCERTAIN',
  },
  {
    walletAddress: makeAddr(1005),
    walletAge: 400, transactionCount: 1500,
    protocolsUsed: ['Jupiter', 'Raydium AMM', 'Marinade'],
    hasStakedSOL: true, hasLPPositions: true, hasLendingPositions: false,
    nftCount: 80, blueChipNFTCount: 3, hasSolDomain: true, solDomain: 'whale.sol',
    daoVoteCount: 5, meetingCount: 5, expectedScore: 89,
    aiSummary: 'Significant ecosystem participant with large NFT collection (80 items, 3 blue-chip) and active DeFi usage. Over a year of consistent activity across Jupiter, Raydium, and Marinade with staking and LP positions. Verified governance participation and 5 physical meetings.',
    sybilAssessment: 'HUMAN (confident)',
  },
  {
    walletAddress: makeAddr(1006),
    walletAge: 250, transactionCount: 600,
    protocolsUsed: ['Jupiter', 'Raydium AMM', 'Marinade', 'Orca Whirlpool', 'Tensor', 'Solend'],
    hasStakedSOL: true, hasLPPositions: true, hasLendingPositions: false,
    nftCount: 5, blueChipNFTCount: 0, hasSolDomain: true, solDomain: 'multiuser.sol',
    daoVoteCount: 0, meetingCount: 2, expectedScore: 74,
    aiSummary: 'Impressively diverse protocol usage across 6 platforms including DEXes, liquid staking, and NFT marketplaces. Active staking and LP participation demonstrates genuine DeFi engagement. Owns a .sol domain and has 2 verified meetings.',
    sybilAssessment: 'HUMAN (confident)',
  },
  {
    walletAddress: makeAddr(1007),
    walletAge: 45, transactionCount: 30,
    protocolsUsed: ['Jupiter'],
    hasStakedSOL: false, hasLPPositions: false, hasLendingPositions: false,
    nftCount: 1, blueChipNFTCount: 0, hasSolDomain: false,
    daoVoteCount: 0, meetingCount: 0, expectedScore: 28,
    aiSummary: 'Relatively new wallet with light activity over 6 weeks. Basic Jupiter usage for swaps. No DeFi positions or community engagement. Building history but needs more time and activity to establish trust.',
    sybilAssessment: 'UNCERTAIN',
  },
  {
    walletAddress: makeAddr(1008),
    walletAge: 800, transactionCount: 1200,
    protocolsUsed: ['Jupiter', 'Raydium AMM', 'Marinade', 'Orca Whirlpool', 'Solend'],
    hasStakedSOL: true, hasLPPositions: true, hasLendingPositions: true,
    nftCount: 25, blueChipNFTCount: 3, hasSolDomain: true, solDomain: 'og.sol',
    daoVoteCount: 20, meetingCount: 6, expectedScore: 100,
    aiSummary: 'Original Solana ecosystem participant with over 2 years of continuous activity. Maximum trust across all dimensions: diverse DeFi engagement, governance participation, blue-chip NFT holder, and extensively verified through 6 physical meetings. Exemplary on-chain reputation.',
    sybilAssessment: 'HUMAN (confident)',
  },
  {
    walletAddress: makeAddr(1009),
    walletAge: 180, transactionCount: 400,
    protocolsUsed: ['Jupiter', 'Raydium AMM', 'Marinade'],
    hasStakedSOL: true, hasLPPositions: false, hasLendingPositions: false,
    nftCount: 3, blueChipNFTCount: 0, hasSolDomain: true, solDomain: 'alice.sol',
    daoVoteCount: 0, meetingCount: 2, expectedScore: 63,
    aiSummary: 'Established wallet with 6 months of activity across Jupiter, Raydium, and Marinade. Active staker with a .sol domain. Moderate trading volume and 2 verified physical meetings. Solid foundation for growing trust.',
    sybilAssessment: 'LIKELY HUMAN (moderate)',
  },
  {
    walletAddress: makeAddr(1010),
    walletAge: 60, transactionCount: 80,
    protocolsUsed: ['Jupiter', 'Raydium AMM'],
    hasStakedSOL: false, hasLPPositions: false, hasLendingPositions: false,
    nftCount: 2, blueChipNFTCount: 0, hasSolDomain: false,
    daoVoteCount: 0, meetingCount: 0, expectedScore: 36,
    aiSummary: 'Two-month-old wallet with basic trading activity on Jupiter and Raydium. No DeFi positions, domains, or community engagement yet. Shows early signs of genuine usage but needs more history to build trust.',
    sybilAssessment: 'UNCERTAIN',
  },
];

// Verify scores
function calcScore(w: DemoWallet): number {
  const device = 20; // always SGT
  const age = w.walletAge > 365 ? 15 : w.walletAge >= 90 ? 10 : w.walletAge >= 30 ? 5 : 0;
  const activity = w.transactionCount > 1000 ? 15 : w.transactionCount > 200 ? 10 : w.transactionCount > 50 ? 5 : 0;
  const diversity = Math.min(w.protocolsUsed.length * 3, 15);
  const defi = (w.hasStakedSOL ? 5 : 0) + (w.hasLPPositions ? 5 : 0) + (w.hasLendingPositions ? 5 : 0);
  const identity = (w.hasSolDomain ? 5 : 0) + (w.blueChipNFTCount > 0 ? 3 : 0) + (w.daoVoteCount > 0 ? 2 : 0);
  const physical = Math.min(w.meetingCount * 2, 10);
  return device + age + activity + diversity + defi + identity + physical;
}

for (const w of wallets) {
  const actual = calcScore(w);
  if (actual !== w.expectedScore) {
    console.error(`Score mismatch for ${w.walletAddress}: expected ${w.expectedScore}, got ${actual}`);
    process.exit(1);
  }
}

function getLabel(score: number): string {
  if (score <= 20) return 'Unverified';
  if (score <= 40) return 'Basic';
  if (score <= 60) return 'Established';
  if (score <= 80) return 'Trusted';
  return 'Highly Trusted';
}

function getColor(score: number): string {
  if (score <= 20) return '#EF4444';
  if (score <= 40) return '#F97316';
  if (score <= 60) return '#EAB308';
  if (score <= 80) return '#22C55E';
  return '#10B981';
}

const BADGE_DEFS = [
  { id: 'veteran', name: 'Veteran', description: 'Active Solana participant for over a year' },
  { id: 'defi-degen', name: 'DeFi Degen', description: 'Diverse DeFi activity across the ecosystem' },
  { id: 'whale', name: 'Whale', description: 'Notable economic commitment to Solana' },
  { id: 'governor', name: 'Governor', description: 'Active participant in on-chain governance' },
  { id: 'networker', name: 'Networker', description: 'Well-connected in the Seeker community' },
  { id: 'og', name: 'OG', description: 'Early Solana ecosystem participant' },
  { id: 'builder', name: 'Builder', description: 'Contributor to the Solana ecosystem' },
];

function getBadges(w: DemoWallet) {
  const now = new Date().toISOString();
  const checks: Record<string, boolean> = {
    veteran: w.walletAge > 365,
    'defi-degen': w.protocolsUsed.length >= 5,
    whale: w.nftCount >= 50,
    governor: w.daoVoteCount > 0,
    networker: w.meetingCount >= 5,
    og: w.walletAge > 730,
    builder: false,
  };
  return BADGE_DEFS.map(d => ({
    id: d.id, name: d.name, description: d.description,
    earned: checks[d.id] ?? false,
    ...(checks[d.id] ? { earnedAt: now } : {}),
  }));
}

const now = new Date().toISOString();
const farFuture = new Date(Date.now() + 365 * 86400000).toISOString();

const cacheEntries = wallets.map(w => {
  const score = calcScore(w);
  const firstTxDate = new Date(Date.now() - w.walletAge * 86400000).toISOString();
  const analysis = {
    walletAddress: w.walletAddress,
    hasSGT: true,
    walletAge: w.walletAge,
    firstTransactionDate: firstTxDate,
    transactionCount: w.transactionCount,
    protocolsUsed: w.protocolsUsed,
    hasStakedSOL: w.hasStakedSOL,
    hasLPPositions: w.hasLPPositions,
    hasLendingPositions: w.hasLendingPositions,
    nftCount: w.nftCount,
    blueChipNFTCount: w.blueChipNFTCount,
    hasSolDomain: w.hasSolDomain,
    ...(w.solDomain ? { solDomain: w.solDomain } : {}),
    daoVoteCount: w.daoVoteCount,
    meetingCount: w.meetingCount,
    analyzedAt: now,
  };

  const age = w.walletAge > 365 ? 15 : w.walletAge >= 90 ? 10 : w.walletAge >= 30 ? 5 : 0;
  const activity = w.transactionCount > 1000 ? 15 : w.transactionCount > 200 ? 10 : w.transactionCount > 50 ? 5 : 0;
  const diversity = Math.min(w.protocolsUsed.length * 3, 15);
  const defi = (w.hasStakedSOL ? 5 : 0) + (w.hasLPPositions ? 5 : 0) + (w.hasLendingPositions ? 5 : 0);
  const identity = (w.hasSolDomain ? 5 : 0) + (w.blueChipNFTCount > 0 ? 3 : 0) + (w.daoVoteCount > 0 ? 2 : 0);
  const physical = Math.min(w.meetingCount * 2, 10);

  const profile = {
    walletAddress: w.walletAddress,
    score,
    label: getLabel(score),
    color: getColor(score),
    breakdown: { device: 20, walletAge: age, activity, diversity, defi, identity, physical },
    badges: getBadges(w),
    aiSummary: w.aiSummary,
    sybilAssessment: w.sybilAssessment,
    meetingHistory: [],
    analysis,
    cachedAt: now,
  };

  return {
    walletAddress: w.walletAddress,
    analysis,
    profile,
    cachedAt: now,
    expiresAt: farFuture,
    source: 'precomputed',
  };
});

writeFileSync(
  path.join(process.cwd(), 'src/data/demo-wallets.json'),
  JSON.stringify(cacheEntries, null, 2),
);
console.log('✓ demo-wallets.json written (10 entries)');

// ─── Sybil Demo Data ───
interface SybilEntry {
  walletAddress: string;
  hasSGT: boolean;
  trustScore: number | null;
  passed: boolean;
  reason?: string;
}

const sybilEntries: SybilEntry[] = [];
for (let i = 0; i < 1000; i++) {
  const addr = makeAddr(2000 + i);
  if (i < 530) {
    sybilEntries.push({ walletAddress: addr, hasSGT: false, trustScore: null, passed: false, reason: 'No SGT' });
  } else {
    const score = 15 + Math.floor((i - 530) * (77 / 469)); // 15 to 92 range
    sybilEntries.push({ walletAddress: addr, hasSGT: true, trustScore: score, passed: true });
  }
}

writeFileSync(
  path.join(process.cwd(), 'src/data/sybil-demo.json'),
  JSON.stringify(sybilEntries, null, 2),
);
console.log('✓ sybil-demo.json written (1000 entries)');
console.log('All scores verified ✓');
