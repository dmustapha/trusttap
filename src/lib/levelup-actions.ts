import type { WalletAnalysis, ScoreBreakdown, TrustLabel } from '@/types';
import { calculateTrustScore } from './scoring';

export type ActionGroup = 'quick' | 'transaction' | 'social' | 'long';
export type ActionType = 'internal' | 'external';

export interface LevelUpAction {
  id: string;
  label: string;
  subtitle: string;
  group: ActionGroup;
  actionType: ActionType;
  href: string;
  ctaLabel: string;
  isAvailable: (a: WalletAnalysis) => boolean;
  apply: (a: WalletAnalysis) => WalletAnalysis;
}

export const ACTION_GROUPS: { key: ActionGroup; label: string; color: string }[] = [
  { key: 'quick', label: 'Quick Wins', color: 'var(--tt-primary)' },
  { key: 'transaction', label: 'One Transaction', color: 'var(--info)' },
  { key: 'social', label: 'Social', color: 'var(--warning)' },
  { key: 'long', label: 'Long Game', color: 'var(--text-secondary)' },
];

export const LEVEL_UP_ACTIONS: LevelUpAction[] = [
  // Quick Wins
  {
    id: 'get-sgt',
    label: 'Get SGT Verified',
    subtitle: 'Own a Solana Seeker phone',
    group: 'quick',
    actionType: 'external',
    href: 'https://solanamobile.com/seeker',
    ctaLabel: 'Get Seeker',
    isAvailable: (a) => !a.hasSGT,
    apply: (a) => ({ ...a, hasSGT: true }),
  },
  {
    id: 'register-skr',
    label: 'Register .skr domain',
    subtitle: 'Claim your on-chain identity',
    group: 'quick',
    actionType: 'external',
    href: 'https://sns.id',
    ctaLabel: 'Register .skr',
    isAvailable: (a) => !a.solDomain?.endsWith('.skr'),
    apply: (a) => ({ ...a, solDomain: 'you.skr', hasSolDomain: true }),
  },
  {
    id: 'register-sol',
    label: 'Register .sol domain',
    subtitle: 'Get a Solana name service domain',
    group: 'quick',
    actionType: 'external',
    href: 'https://sns.id',
    ctaLabel: 'Get .sol',
    isAvailable: (a) => !a.hasSolDomain && !a.solDomain?.endsWith('.skr'),
    apply: (a) => ({ ...a, hasSolDomain: true }),
  },
  // One Transaction
  {
    id: 'stake-sol',
    label: 'Stake SOL',
    subtitle: 'Stake on Marinade, Jito, or Sanctum',
    group: 'transaction',
    actionType: 'external',
    href: 'https://app.marinade.finance/native',
    ctaLabel: 'Stake now',
    isAvailable: (a) => a.stakingLevel < 5,
    apply: (a) => ({ ...a, stakingLevel: 5, hasStakedSOL: true }),
  },
  {
    id: 'provide-lp',
    label: 'Provide Liquidity',
    subtitle: 'LP on Orca, Raydium, or Meteora',
    group: 'transaction',
    actionType: 'external',
    href: 'https://app.meteora.ag/pools',
    ctaLabel: 'Add LP',
    isAvailable: (a) => a.lpLevel < 4,
    apply: (a) => ({ ...a, lpLevel: 4, hasLPPositions: true }),
  },
  {
    id: 'lend-supply',
    label: 'Lend / Supply',
    subtitle: 'Supply on MarginFi or Kamino',
    group: 'transaction',
    actionType: 'external',
    href: 'https://app.kamino.finance',
    ctaLabel: 'Supply now',
    isAvailable: (a) => a.lendingLevel < 4,
    apply: (a) => ({ ...a, lendingLevel: 4, hasLendingPositions: true }),
  },
  {
    id: 'use-protocol',
    label: 'Use a new protocol',
    subtitle: 'Trade on Jupiter, swap on Orca, etc.',
    group: 'transaction',
    actionType: 'external',
    href: 'https://jup.ag',
    ctaLabel: 'Trade on Jup',
    isAvailable: (a) => a.protocolsUsed.length < 11,
    apply: (a) => {
      const current = a.protocolsUsed.length;
      const needed = current < 2 ? 2 : current < 4 ? 4 : current < 7 ? 7 : 11;
      const filler = ['Jupiter', 'Raydium AMM', 'Orca Whirlpool', 'Marinade', 'Meteora', 'Jito', 'Kamino', 'Drift', 'Marginfi', 'Phoenix', 'Pump Fun'];
      const newProtocols = [...a.protocolsUsed];
      for (const p of filler) {
        if (newProtocols.length >= needed) break;
        if (!newProtocols.includes(p)) newProtocols.push(p);
      }
      return { ...a, protocolsUsed: newProtocols };
    },
  },
  // Social
  {
    id: 'meet-seeker',
    label: 'Meet a Seeker owner',
    subtitle: 'Verify a meeting via QR scan',
    group: 'social',
    actionType: 'internal',
    href: '/scan',
    ctaLabel: 'Open Scanner',
    isAvailable: (a) => a.meetingCount < 5,
    apply: (a) => ({ ...a, meetingCount: Math.min(a.meetingCount + 1, 5) }),
  },
  {
    id: 'dao-vote',
    label: 'Vote in a DAO',
    subtitle: 'Participate in on-chain governance',
    group: 'social',
    actionType: 'external',
    href: 'https://realms.today',
    ctaLabel: 'Go to Realms',
    isAvailable: (a) => a.daoVoteCount < 20,
    apply: (a) => {
      const next = a.daoVoteCount < 1 ? 1 : a.daoVoteCount < 6 ? 6 : 20;
      return { ...a, daoVoteCount: next };
    },
  },
  {
    id: 'bluechip-nft',
    label: 'Collect a blue-chip NFT',
    subtitle: 'Mad Lads, Tensorians, etc.',
    group: 'social',
    actionType: 'external',
    href: 'https://www.tensor.trade',
    ctaLabel: 'Browse NFTs',
    isAvailable: (a) => a.blueChipNFTCount < 2,
    apply: (a) => ({ ...a, blueChipNFTCount: a.blueChipNFTCount + 1, nftCount: Math.max(a.nftCount, a.blueChipNFTCount + 1) }),
  },
  // Long Game
  {
    id: 'wallet-age',
    label: 'Keep wallet active 1 year',
    subtitle: 'Time builds trust — no shortcuts',
    group: 'long',
    actionType: 'internal',
    href: '/profile',
    ctaLabel: 'View Profile',
    isAvailable: (a) => a.walletAge < 730,
    apply: (a) => ({ ...a, walletAge: a.walletAge + 365 }),
  },
  {
    id: 'more-transactions',
    label: 'Reach 200+ transactions',
    subtitle: 'Stay active on-chain',
    group: 'long',
    actionType: 'external',
    href: 'https://jup.ag',
    ctaLabel: 'Start trading',
    isAvailable: (a) => a.transactionCount < 200,
    apply: (a) => ({ ...a, transactionCount: Math.max(200, a.transactionCount) }),
  },
];

export function computeProjectedScore(
  baseAnalysis: WalletAnalysis,
  activeToggles: Set<string>,
): { score: number; breakdown: ScoreBreakdown; label: TrustLabel; color: string } {
  let modified = { ...baseAnalysis, protocolsUsed: [...baseAnalysis.protocolsUsed] };
  for (const action of LEVEL_UP_ACTIONS) {
    if (activeToggles.has(action.id)) {
      modified = action.apply(modified);
    }
  }
  return calculateTrustScore(modified);
}

export function getAvailableActions(analysis: WalletAnalysis): LevelUpAction[] {
  return LEVEL_UP_ACTIONS.filter(a => a.isAvailable(analysis));
}
