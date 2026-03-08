import { NextRequest, NextResponse } from 'next/server';
import { isValidWalletAddress } from '@/lib/validation';
import { getMeetings } from '@/lib/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params;

  if (!isValidWalletAddress(address)) {
    return NextResponse.json({ error: 'Invalid wallet address format' }, { status: 400 });
  }

  const meetings = await getMeetings(address);
  return NextResponse.json({
    walletAddress: address,
    meetings,
    total: meetings.length,
  });
}
