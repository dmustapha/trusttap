import { NextRequest, NextResponse } from 'next/server';
import { generateTrustSummary, generateSybilAssessment } from '@/lib/ai';
import { calculateTrustScore } from '@/lib/scoring';
import { checkRateLimit } from '@/lib/rate-limit';
import type { WalletAnalysis } from '@/types';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(`ai:${ip}`, 10, 60000)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.walletData) {
    return NextResponse.json({ error: 'walletData is required' }, { status: 400 });
  }

  const wd = body.walletData;
  if (!wd.walletAddress || typeof wd.walletAddress !== 'string' || typeof wd.walletAge !== 'number') {
    return NextResponse.json({ error: 'walletData must include walletAddress (string) and walletAge (number)' }, { status: 400 });
  }

  const walletData = wd as WalletAnalysis;

  try {
    const { score } = calculateTrustScore(walletData);
    const [summary, sybilResult] = await Promise.all([
      generateTrustSummary(walletData, score),
      generateSybilAssessment(walletData),
    ]);

    return NextResponse.json({
      summary,
      sybilAssessment: sybilResult.assessment,
      confidence: sybilResult.confidence,
    });
  } catch {
    return NextResponse.json({ error: 'AI summary generation failed' }, { status: 500 });
  }
}
