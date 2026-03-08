import { NextRequest, NextResponse } from 'next/server';
import { validateCreateMeetingRequest } from '@/lib/validation';
import { verifyMeetingSignature, checkAntiGamingRules } from '@/lib/meeting';
import { storeMeeting, getCachedProfile, setCachedProfile, getMeetings } from '@/lib/cache';
import { calculateTrustScore } from '@/lib/scoring';
import { evaluateBadges } from '@/lib/badges';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const validation = validateCreateMeetingRequest(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { walletA, walletB, timestamp, signatureA, signatureB, nonceA, nonceB } = validation.data;

  if (!checkRateLimit(`meeting:${walletA}`, 5, 60000)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  // Anti-gaming checks
  const antiGaming = await checkAntiGamingRules(walletA, walletB, timestamp);
  if (!antiGaming.allowed) {
    return NextResponse.json(
      { error: `Anti-gaming violation: ${antiGaming.violation}`, violation: antiGaming.violation },
      { status: 403 },
    );
  }

  // Verify meeting signatures (skip in demo mode)
  const isDemoMode = process.env.DEMO_MODE === 'true';
  if (!isDemoMode) {
    const tsMs = new Date(timestamp).getTime();
    const validA = verifyMeetingSignature({ walletAddress: walletA, timestamp: tsMs, nonce: nonceA, signature: signatureA });
    if (!validA) {
      return NextResponse.json({ error: 'Invalid signature for walletA' }, { status: 403 });
    }
    const validB = verifyMeetingSignature({ walletAddress: walletB, timestamp: tsMs, nonce: nonceB, signature: signatureB });
    if (!validB) {
      return NextResponse.json({ error: 'Invalid signature for walletB' }, { status: 403 });
    }
  }

  // Require both wallets to have profiles (prevents score-0 display)
  const cachedA = await getCachedProfile(walletA);
  const cachedB = await getCachedProfile(walletB);
  if (!cachedA || !cachedB) {
    const missing = !cachedA ? 'walletA' : 'walletB';
    return NextResponse.json(
      { error: 'Both users must connect to TrustTap+ before meeting', missing },
      { status: 400 },
    );
  }

  // Store meeting
  const meetingId = crypto.randomUUID();
  await storeMeeting({
    id: meetingId,
    walletA,
    walletB,
    timestamp,
    signatureA,
    signatureB,
    verified: true,
  });

  // Recalculate scores for both wallets
  const newScores: { walletA: number; walletB: number } = { walletA: 0, walletB: 0 };

  for (const [wallet, cached] of [[walletA, cachedA], [walletB, cachedB]] as const) {
    const meetings = await getMeetings(wallet);
    cached.analysis.meetingCount = meetings.length;
    const { score, breakdown, label, color } = calculateTrustScore(cached.analysis);
    cached.profile.score = score;
    cached.profile.breakdown = breakdown;
    cached.profile.label = label;
    cached.profile.color = color;
    cached.profile.badges = evaluateBadges(cached.analysis);
    await setCachedProfile(cached);
    if (wallet === walletA) newScores.walletA = score;
    else newScores.walletB = score;
  }

  return NextResponse.json({ success: true, meetingId, newScores });
}
