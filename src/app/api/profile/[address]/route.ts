import { NextRequest, NextResponse } from 'next/server';
import { isValidWalletAddress } from '@/lib/validation';
import { getCachedProfile, isProfileStale } from '@/lib/cache';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params;
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(`profile:${ip}`, 30, 60000)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  if (!isValidWalletAddress(address)) {
    return NextResponse.json({ error: 'Invalid wallet address format' }, { status: 400 });
  }

  const cached = await getCachedProfile(address);
  if (cached && !isProfileStale(cached)) {
    return NextResponse.json(cached.profile);
  }

  // For uncached wallets, client should call POST /api/analyze-wallet
  return NextResponse.json({ error: 'Profile not found. Use /api/analyze-wallet to analyze.' }, { status: 404 });
}
