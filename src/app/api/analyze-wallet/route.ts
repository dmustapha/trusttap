import { NextRequest, NextResponse } from 'next/server';
import { validateAnalyzeWalletRequest } from '@/lib/validation';
import { getCachedProfile, setCachedProfile, isProfileStale, getMeetings, addScoreSnapshot, getScoreHistory } from '@/lib/cache';
import { getWalletAnalysis } from '@/lib/helius';
import { calculateTrustScore } from '@/lib/scoring';
import { evaluateBadges } from '@/lib/badges';
import { checkRateLimit } from '@/lib/rate-limit';
import type { CacheEntry, TrustProfile } from '@/types';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(`analyze:${ip}`, 10, 60000)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const validation = validateAnalyzeWalletRequest(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { walletAddress } = validation.data;

  // Check cache
  const cached = await getCachedProfile(walletAddress);
  if (cached && !isProfileStale(cached)) {
    return NextResponse.json(cached.profile);
  }

  // Full analysis
  try {
    const analysis = await getWalletAnalysis(walletAddress);

    // Populate meeting data from storage
    const meetings = await getMeetings(walletAddress);
    analysis.meetingCount = meetings.length;

    const { score, breakdown, label, color } = calculateTrustScore(analysis);
    const badges = evaluateBadges(analysis);

    const profile: TrustProfile = {
      walletAddress,
      score,
      label,
      color,
      breakdown,
      badges,
      aiSummary: '',
      sybilAssessment: '',
      meetingHistory: meetings,
      analysis,
      cachedAt: new Date().toISOString(),
    };

    const cacheEntry: CacheEntry = {
      walletAddress,
      analysis,
      profile,
      cachedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      source: 'live',
    };
    await setCachedProfile(cacheEntry);

    // Record score history
    await addScoreSnapshot(walletAddress, score);
    const scoreHistory = await getScoreHistory(walletAddress);
    profile.scoreHistory = scoreHistory;

    return NextResponse.json(profile);
  } catch (err) {
    console.error('Wallet analysis failed for', walletAddress, err);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
