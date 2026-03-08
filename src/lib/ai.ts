import 'server-only';
import type { WalletAnalysis } from '@/types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function llmGenerate(prompt: string, maxTokens = 200): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not set');

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are a concise blockchain trust analyst. Follow instructions exactly. Never use filler words.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: maxTokens,
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => 'unknown');
    throw new Error(`Groq API ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

function buildTrustSummaryPrompt(analysis: WalletAnalysis, score: number): string {
  const strengths: string[] = [];
  const concerns: string[] = [];

  if (analysis.hasSGT) strengths.push('Seeker phone verified (SGT holder)');
  if (analysis.walletAge > 365) strengths.push(`${Math.floor(analysis.walletAge / 365)}+ year old wallet`);
  if (analysis.protocolsUsed.length >= 5) strengths.push(`Active across ${analysis.protocolsUsed.length} protocols including ${analysis.protocolsUsed.slice(0, 3).join(', ')}`);
  if (analysis.hasStakedSOL) strengths.push('Active staker');
  if (analysis.hasLPPositions) strengths.push('Provides liquidity');
  if (analysis.hasLendingPositions) strengths.push('Uses lending protocols');
  if (analysis.blueChipNFTCount > 0) strengths.push(`Holds ${analysis.blueChipNFTCount} blue-chip NFT(s)`);
  if (analysis.hasSolDomain) strengths.push(`Has domain: ${analysis.solDomain}`);
  if (analysis.daoVoteCount > 0) strengths.push(`${analysis.daoVoteCount} governance votes`);
  if (analysis.meetingCount > 0) strengths.push(`${analysis.meetingCount} verified in-person meetings`);

  if (!analysis.hasSGT) concerns.push('No device verification');
  if (analysis.walletAge < 90) concerns.push('Wallet less than 3 months old');
  if (analysis.transactionCount < 50) concerns.push('Low transaction volume');
  if (analysis.protocolsUsed.length < 3) concerns.push('Limited protocol diversity');
  if (analysis.meetingCount === 0) concerns.push('No in-person verification');

  return `You are a concise blockchain analyst. Write exactly 2 sentences about this Solana wallet's trustworthiness.
Sentence 1: State the most notable strength.
Sentence 2: State the biggest concern OR confirm reliability if score > 70.
Do NOT use generic phrases like "this wallet shows" or "overall". Be specific.

Score: ${score}/100
Strengths: ${strengths.join('; ') || 'None identified'}
Concerns: ${concerns.join('; ') || 'None identified'}
Protocols used: ${analysis.protocolsUsed.join(', ') || 'None'}
Transactions: ${analysis.transactionCount}`;
}

function buildSybilPrompt(analysis: WalletAnalysis): string {
  return `Analyze this wallet's activity pattern. Is it consistent with a single active human user, or does it show signs of bot/farm behavior?

Indicators of bot activity: repetitive transaction patterns, no protocol diversity, transactions at regular intervals, no NFT/governance/social activity, no physical meetings, very new wallet with sudden burst of activity.

Indicators of human activity: diverse protocol usage, irregular transaction timing, NFT collecting, governance participation, physical meetings, wallet aging over time.

Wallet data:
- Age: ${analysis.walletAge} days
- Transactions: ${analysis.transactionCount}
- Protocols: ${analysis.protocolsUsed.join(', ')} (${analysis.protocolsUsed.length} unique)
- Has staking: ${analysis.hasStakedSOL}
- Has LP: ${analysis.hasLPPositions}
- Has lending: ${analysis.hasLendingPositions}
- NFTs: ${analysis.nftCount} (${analysis.blueChipNFTCount} blue-chip)
- Domain: ${analysis.hasSolDomain}
- DAO votes: ${analysis.daoVoteCount}
- Physical meetings: ${analysis.meetingCount}
- SGT: ${analysis.hasSGT ? 'Yes' : 'No'}

Respond with exactly one of: HUMAN, LIKELY HUMAN, UNCERTAIN, LIKELY BOT, or BOT.
Then explain in 1-2 sentences.`;
}

export async function generateTrustSummary(analysis: WalletAnalysis, score: number): Promise<string> {
  try {
    const text = await llmGenerate(buildTrustSummaryPrompt(analysis, score));
    return text || 'Trust summary unavailable.';
  } catch {
    return 'AI summary unavailable.';
  }
}

export async function generateSybilAssessment(analysis: WalletAnalysis): Promise<{
  assessment: 'HUMAN' | 'LIKELY HUMAN' | 'UNCERTAIN' | 'LIKELY BOT' | 'BOT';
  confidence: string;
  explanation: string;
}> {
  try {
    const text = await llmGenerate(buildSybilPrompt(analysis));

    const validAssessments = ['HUMAN', 'LIKELY HUMAN', 'UNCERTAIN', 'LIKELY BOT', 'BOT'] as const;
    type Assessment = typeof validAssessments[number];

    let assessment: Assessment = 'UNCERTAIN';
    for (const v of validAssessments) {
      if (text.toUpperCase().startsWith(v)) {
        assessment = v;
        break;
      }
    }

    const explanation = text.replace(/^(HUMAN|LIKELY HUMAN|UNCERTAIN|LIKELY BOT|BOT)[.\s]*/i, '').trim()
      || 'Assessment based on on-chain activity analysis.';

    return { assessment, confidence: 'moderate', explanation };
  } catch {
    return { assessment: 'UNCERTAIN', confidence: 'low', explanation: 'AI assessment unavailable.' };
  }
}

// Export for testing
export { buildTrustSummaryPrompt, buildSybilPrompt, llmGenerate };
