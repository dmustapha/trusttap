// Run with: npx tsx scripts/recalculate-demo-scores.ts
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import type { WalletAnalysis, CacheEntry } from '@/types';
import { calculateTrustScore } from '@/lib/scoring';
import { evaluateBadges } from '@/lib/badges';

const DEMO_PATH = path.join(process.cwd(), 'src/data/demo-wallets.json');

function backfillAnalysis(raw: Record<string, unknown>): WalletAnalysis {
  const a = { ...raw };

  // Derive graduated DeFi levels from boolean flags when missing
  if (a.stakingLevel === undefined) {
    a.stakingLevel = a.hasStakedSOL ? 3 : 0;
  }
  if (a.lpLevel === undefined) {
    a.lpLevel = a.hasLPPositions ? 3 : 0;
  }
  if (a.lendingLevel === undefined) {
    a.lendingLevel = a.hasLendingPositions ? 3 : 0;
  }

  // Derive portfolio from activity signals when missing
  if (a.totalPortfolioSOL === undefined) {
    const txCount = (a.transactionCount as number) ?? 0;
    const hasDefi = a.hasStakedSOL || a.hasLPPositions || a.hasLendingPositions;
    if (txCount >= 1000 && hasDefi) a.totalPortfolioSOL = 150;
    else if (txCount >= 200 && hasDefi) a.totalPortfolioSOL = 50;
    else if (txCount >= 50) a.totalPortfolioSOL = 10;
    else a.totalPortfolioSOL = 1;
  }

  if (a.solBalance === undefined) a.solBalance = 0;
  if (a.lstBalance === undefined) a.lstBalance = 0;

  return a as unknown as WalletAnalysis;
}

const rawEntries: CacheEntry[] = JSON.parse(readFileSync(DEMO_PATH, 'utf-8'));

const updatedEntries = rawEntries.map(entry => {
  const analysis = backfillAnalysis(entry.analysis as unknown as Record<string, unknown>);
  const { score, breakdown, label, color } = calculateTrustScore(analysis);
  const badges = evaluateBadges(analysis);

  const oldScore = entry.profile.score;
  const delta = score - oldScore;
  const sign = delta > 0 ? '+' : '';
  console.log(`${entry.walletAddress.slice(0, 8)}... ${oldScore} -> ${score} (${sign}${delta}) [${label}]`);

  return {
    ...entry,
    analysis,
    profile: {
      ...entry.profile,
      score,
      breakdown,
      label,
      color,
      badges,
      analysis,
    },
  };
});

writeFileSync(DEMO_PATH, JSON.stringify(updatedEntries, null, 2) + '\n');
console.log(`\nRecalculated ${updatedEntries.length} entries -> ${DEMO_PATH}`);
