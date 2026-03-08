import { NextResponse } from 'next/server';
import { loadDemoWallets } from '@/lib/cache';

export async function GET() {
  const demoMap = loadDemoWallets();
  const wallets = Array.from(demoMap.values()).map(entry => ({
    walletAddress: entry.walletAddress,
    score: entry.profile.score,
    label: entry.profile.label,
    color: entry.profile.color,
    solDomain: entry.analysis.solDomain,
  }));
  return NextResponse.json(wallets);
}
