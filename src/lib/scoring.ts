import type { WalletAnalysis, ScoreBreakdown, TrustLabel } from '@/types';
import { SCORE_LABELS, FINANCIAL_TIERS, CLMM_PROTOCOLS, DERIVATIVES_PROTOCOLS, VAULT_PROTOCOLS } from './constants';

function clamp(value: number, max: number): number {
  return Math.round(Math.min(Math.max(0, value), max));
}

// --- Device (25 pts) --- Binary: SGT or nothing
export function calculateDeviceScore(hasSGT: boolean): number {
  return hasSGT ? 25 : 0;
}

// --- Financial Depth (10 pts) --- Tiered by total portfolio in SOL-equivalent
export function calculateFinancialScore(totalPortfolioSOL: number): number {
  for (const tier of FINANCIAL_TIERS) {
    if (totalPortfolioSOL >= tier.minSOL) return tier.points;
  }
  return 0;
}

// --- Wallet Age (10 pts) --- Asymptotic curve with steeper ramp
// score = 10 × (1 - e^(-days/240))
export function calculateAgeScore(ageDays: number): number {
  const max = 10;
  const tau = 240;
  return clamp(max * (1 - Math.exp(-ageDays / tau)), max);
}

// --- Activity Volume (10 pts) --- Tiered tx count
export function calculateActivityScore(txCount: number): number {
  if (txCount >= 5000) return 10;
  if (txCount >= 1000) return 8;
  if (txCount >= 200) return 6;
  if (txCount >= 50) return 4;
  if (txCount >= 10) return 2;
  return txCount > 0 ? 1 : 0;
}

// --- Protocol Diversity (10 pts) --- Count + advanced protocol bonuses
export function calculateDiversityScore(protocols: string[]): number {
  const count = protocols.length;
  let base: number;
  if (count >= 11) base = 10;
  else if (count >= 7) base = 8;
  else if (count >= 4) base = 6;
  else if (count >= 2) base = 3;
  else if (count >= 1) base = 1;
  else base = 0;

  // Advanced protocol bonuses (max +3, but capped at 10 total)
  let bonus = 0;
  if (protocols.some(p => CLMM_PROTOCOLS.includes(p))) bonus += 1;
  if (protocols.some(p => DERIVATIVES_PROTOCOLS.includes(p))) bonus += 1;
  if (protocols.some(p => VAULT_PROTOCOLS.includes(p))) bonus += 1;

  return Math.min(base + bonus, 10);
}

// --- DeFi Depth (13 pts) --- Graduated: staking(0-5) + LP(0-4) + lending(0-4)
export function calculateDefiScore(analysis: WalletAnalysis): number {
  return clamp(analysis.stakingLevel + analysis.lpLevel + analysis.lendingLevel, 13);
}

// --- Identity & Social (10 pts) --- Domain(0-4) + NFT(0-3) + Governance(0-3)
export function calculateIdentityScore(analysis: WalletAnalysis): number {
  let score = 0;

  // Domain: .skr(4) > .sol(2) > none(0)
  const hasSkrDomain = analysis.solDomain?.endsWith('.skr');
  if (hasSkrDomain) score += 4;
  else if (analysis.hasSolDomain) score += 2;

  // NFT signal: multiple blue-chip(3) > 1 blue-chip(2) > any NFTs(1) > none(0)
  if (analysis.blueChipNFTCount >= 2) score += 3;
  else if (analysis.blueChipNFTCount >= 1) score += 2;
  else if (analysis.nftCount > 0) score += 1;

  // Governance: 20+ votes(3) > 6-20(2) > 1-5(1) > 0(0)
  if (analysis.daoVoteCount >= 20) score += 3;
  else if (analysis.daoVoteCount >= 6) score += 2;
  else if (analysis.daoVoteCount >= 1) score += 1;

  return Math.min(score, 10);
}

// --- Physical Meetings (12 pts) --- Graduated tiers
export function calculatePhysicalScore(meetingCount: number): number {
  if (meetingCount >= 5) return 12;
  if (meetingCount === 4) return 10;
  if (meetingCount === 3) return 7;
  if (meetingCount === 2) return 5;
  if (meetingCount === 1) return 3;
  return 0;
}

// --- Labels & Colors ---
export function getScoreLabel(score: number): TrustLabel {
  for (const tier of SCORE_LABELS) {
    if (score <= tier.max) return tier.label;
  }
  return 'Highly Trusted';
}

export function getScoreColor(score: number): string {
  for (const tier of SCORE_LABELS) {
    if (score <= tier.max) return tier.color;
  }
  return '#10B981';
}

// --- Main Calculator ---
export function calculateTrustScore(analysis: WalletAnalysis): {
  score: number;
  breakdown: ScoreBreakdown;
  label: TrustLabel;
  color: string;
} {
  const breakdown: ScoreBreakdown = {
    device: calculateDeviceScore(analysis.hasSGT),
    financial: calculateFinancialScore(analysis.totalPortfolioSOL),
    walletAge: calculateAgeScore(analysis.walletAge),
    activity: calculateActivityScore(analysis.transactionCount),
    diversity: calculateDiversityScore(analysis.protocolsUsed),
    defi: calculateDefiScore(analysis),
    identity: calculateIdentityScore(analysis),
    physical: calculatePhysicalScore(analysis.meetingCount),
  };

  const score = Object.values(breakdown).reduce((sum, v) => sum + v, 0);

  return {
    score,
    breakdown,
    label: getScoreLabel(score),
    color: getScoreColor(score),
  };
}
