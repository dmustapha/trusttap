import type { WalletAnalysis, Badge } from '../types';
import { BADGE_DEFINITIONS } from './constants';

export function evaluateBadges(analysis: WalletAnalysis): Badge[] {
  const now = new Date().toISOString();

  const checks: Record<string, boolean> = {
    'veteran':    analysis.walletAge > 365,
    'defi-degen': analysis.protocolsUsed.length >= 5 && (analysis.stakingLevel + analysis.lpLevel + analysis.lendingLevel) >= 5,
    'whale':      (analysis.totalPortfolioSOL || 0) >= 500,
    'governor':   analysis.daoVoteCount >= 3,
    'networker':  analysis.meetingCount >= 5,
    'og':         analysis.walletAge > 730,
    'builder':    false,
  };

  const progress: Record<string, string> = {
    'veteran': `${Math.min(analysis.walletAge, 365)}/365 days`,
    'defi-degen': `${analysis.protocolsUsed.length}/5 protocols, ${analysis.stakingLevel + analysis.lpLevel + analysis.lendingLevel}/5 DeFi depth`,
    'whale': `${Math.round(analysis.totalPortfolioSOL || 0)}/500 SOL`,
    'governor': `${analysis.daoVoteCount}/3 votes`,
    'networker': `${analysis.meetingCount}/5 meetings`,
    'og': `${Math.min(analysis.walletAge, 730)}/730 days`,
    'builder': 'Deploy a program on Solana',
  };

  return BADGE_DEFINITIONS.map(def => {
    const earned = checks[def.id] ?? false;
    return {
      id: def.id,
      name: def.name,
      description: def.description,
      earned,
      ...(earned ? { earnedAt: now } : { progress: progress[def.id] }),
    };
  });
}
