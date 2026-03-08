import { NextResponse } from 'next/server';
import { getMeetings, getCachedProfile } from '@/lib/cache';
import type { TrustLabel } from '@/types';

interface DirectConnection {
  wallet: string;
  score: number;
  label: TrustLabel;
  meetingDate: string;
}

interface ExtendedConnection {
  wallet: string;
  connectedTo: string;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ wallet: string }> },
) {
  const { wallet } = await params;

  const meetings = await getMeetings(wallet);
  const directWallets = new Set<string>();
  const directConnections: DirectConnection[] = [];

  for (const m of meetings) {
    const partner = m.walletA === wallet ? m.walletB : m.walletA;
    if (directWallets.has(partner)) continue;
    directWallets.add(partner);

    const cached = await getCachedProfile(partner);
    directConnections.push({
      wallet: partner,
      score: cached?.profile?.score ?? 0,
      label: (cached?.profile?.label as TrustLabel) ?? 'Unverified',
      meetingDate: m.timestamp,
    });
  }

  const extended: ExtendedConnection[] = [];
  const extendedWallets = new Set<string>();

  for (const directWallet of directWallets) {
    const theirMeetings = await getMeetings(directWallet);
    for (const m of theirMeetings) {
      const fof = m.walletA === directWallet ? m.walletB : m.walletA;
      if (fof === wallet || directWallets.has(fof) || extendedWallets.has(fof)) continue;
      extendedWallets.add(fof);
      extended.push({ wallet: fof, connectedTo: directWallet });
      if (extended.length >= 20) break;
    }
    if (extended.length >= 20) break;
  }

  return NextResponse.json({
    direct: directConnections.slice(0, 10),
    extended: extended.slice(0, 20),
  });
}
