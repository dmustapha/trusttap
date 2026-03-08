import { NextRequest, NextResponse } from 'next/server';
import { validateSybilCheckRequest } from '@/lib/validation';
import { loadSybilDemoData } from '@/lib/cache';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(`sybil:${ip}`, 5, 60000)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const validation = validateSybilCheckRequest(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { walletAddresses, minTrustScore, requireSGT = true } = validation.data;

  // Use demo data for the Sybil Shield
  const allResults = loadSybilDemoData();
  const filtered = walletAddresses.length <= 100
    ? allResults.filter(r => walletAddresses.includes(r.walletAddress))
    : allResults;
  const source = filtered.length > 0 ? filtered : allResults;
  const results = source.map(r => ({
    ...r,
    passed: requireSGT
      ? r.hasSGT && (r.trustScore ?? 0) >= minTrustScore
      : (r.trustScore ?? 0) >= minTrustScore,
    reason: requireSGT && !r.hasSGT
      ? 'No SGT'
      : (r.trustScore ?? 0) < minTrustScore ? 'Below threshold' : undefined,
  }));

  const sgtVerified = results.filter(r => r.hasSGT).length;
  const meetsThreshold = results.filter(r => r.passed).length;

  return NextResponse.json({
    total: results.length,
    sgtVerified,
    meetsThreshold,
    rejected: results.length - meetsThreshold,
    results,
  });
}
