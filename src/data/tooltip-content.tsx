import React from 'react';

interface TooltipEntry {
  title: string;
  body: React.ReactNode;
}

export const TOOLTIP_CONTENT: Record<string, TooltipEntry> = {
  'trust-score': {
    title: 'Your TrustScore',
    body: (
      <>
        <p>Your TrustScore ranges from <strong>0 to 100</strong>, computed across seven dimensions that each measure a different aspect of your credibility.</p>
        <p className="mt-3">It&apos;s built on three layers of proof:</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li><strong>Device</strong> — SGT soulbound NFT proving Solana Seeker ownership</li>
          <li><strong>Chain</strong> — AI analysis of your wallet&apos;s on-chain history</li>
          <li><strong>Physical</strong> — Cryptographic proof-of-meeting with real humans</li>
        </ul>
        <p className="mt-3 text-[var(--text-secondary)]">Higher scores unlock access to trusted airdrops, communities, and peer-to-peer interactions.</p>
      </>
    ),
  },

  'device-sgt': {
    title: 'Device Verification (SGT)',
    body: (
      <>
        <p>The <strong>Saga Genesis Token</strong> is a soulbound NFT minted only to Solana Seeker phone owners. It cannot be faked, transferred, or duplicated.</p>
        <p className="mt-3">This creates a <strong>$500+ cost of attack</strong> per fake identity — you&apos;d need to buy a real Seeker phone to get one. That&apos;s what makes it the foundation of your TrustScore.</p>
        <p className="mt-3 text-[var(--text-secondary)]">Worth 25 points — the single largest dimension. If you own a Seeker, you get all 25.</p>
      </>
    ),
  },

  'wallet-age': {
    title: 'Wallet Age',
    body: (
      <>
        <p>How long your wallet has existed on Solana. A longer track record is harder to fake — Sybil attackers typically use freshly created wallets.</p>
        <p className="mt-3 text-[var(--text-secondary)]">Worth up to 10 points. Scales from first transaction to 365+ days.</p>
      </>
    ),
  },

  'physical-meetings': {
    title: 'Physical Meetings',
    body: (
      <>
        <p>When you meet another Seeker owner in person, you exchange QR codes. Each code contains an <strong>Ed25519 cryptographic signature</strong> that proves the meeting happened.</p>
        <p className="mt-3">Each verified meeting earns <strong>+3 trust points</strong> for both parties. Bots literally cannot replicate physical presence — that&apos;s the point.</p>
        <p className="mt-3 text-[var(--text-secondary)]">Worth up to 12 points (5 meetings). QR codes expire in 60 seconds for security.</p>
      </>
    ),
  },

  'sybil-assessment': {
    title: 'Sybil Assessment',
    body: (
      <>
        <p>A <strong>Sybil attack</strong> is when one person creates many fake identities to game a system. In the Arbitrum airdrop alone, Sybil wallets stole <strong>$600M+</strong> from legitimate users.</p>
        <p className="mt-3">TrustTap&apos;s AI analyzes your wallet and classifies it into one of five tiers:</p>
        <ul className="mt-2 space-y-1 pl-4">
          <li><span className="text-emerald-400">HUMAN (confident)</span> — Strong multi-layer verification</li>
          <li><span className="text-green-400">LIKELY HUMAN</span> — Good signals, moderate confidence</li>
          <li><span className="text-yellow-400">UNCERTAIN</span> — Insufficient data to classify</li>
          <li><span className="text-orange-400">LIKELY BOT</span> — Suspicious patterns detected</li>
          <li><span className="text-red-400">BOT</span> — High-confidence Sybil indicator</li>
        </ul>
      </>
    ),
  },

  'badges': {
    title: 'Achievement Badges',
    body: (
      <>
        <p>Badges are visual milestones that highlight specific achievements on your profile:</p>
        <ul className="mt-2 space-y-1 pl-4">
          <li><strong>Seeker Verified</strong> — Own the SGT soulbound NFT</li>
          <li><strong>OG Wallet</strong> — Wallet older than 1 year</li>
          <li><strong>DeFi Active</strong> — Participated in staking, LPs, or lending</li>
          <li><strong>Social Connector</strong> — 3+ verified physical meetings</li>
          <li><strong>Protocol Explorer</strong> — Used 5+ different protocols</li>
          <li><strong>Identity Verified</strong> — Owns .sol domain or DAO participation</li>
          <li><strong>Trusted Member</strong> — Score above 70</li>
        </ul>
      </>
    ),
  },

  'qr-verification': {
    title: 'QR Verification',
    body: (
      <>
        <p>Meeting verification works in four steps:</p>
        <ol className="mt-2 list-decimal space-y-1 pl-4">
          <li>Meet another Seeker owner in person</li>
          <li>One person generates a QR code (expires in 60 seconds)</li>
          <li>The other scans it with their camera</li>
          <li>Both confirm — each wallet earns +3 physical trust points</li>
        </ol>
        <p className="mt-3 text-[var(--text-secondary)]">The QR contains a cryptographic challenge signed by your wallet. It can&apos;t be reused or forged.</p>
      </>
    ),
  },

  'trust-labels': {
    title: 'Trust Labels',
    body: (
      <>
        <p>Every wallet gets a label based on its TrustScore:</p>
        <ul className="mt-2 space-y-1.5 pl-4">
          <li><span className="text-emerald-400 font-semibold">81-100: Highly Trusted</span> — Active ecosystem participant with strong verification</li>
          <li><span className="text-green-400 font-semibold">61-80: Trusted</span> — Established user with multiple proof points</li>
          <li><span className="text-yellow-400 font-semibold">41-60: Established</span> — Moderate on-chain history</li>
          <li><span className="text-orange-400 font-semibold">21-40: Basic</span> — Limited verification</li>
          <li><span className="text-red-400 font-semibold">0-20: Unverified</span> — New or unverified wallet</li>
        </ul>
      </>
    ),
  },

  'sybil-shield': {
    title: 'Sybil Shield',
    body: (
      <>
        <p>Sybil Shield is an anti-bot defense for airdrops and communities. It filters wallet lists by device attestation (SGT) and TrustScore.</p>
        <p className="mt-3">In testing, <strong>53% of suspicious wallets</strong> fail device attestation alone — they don&apos;t own a Seeker phone. Combined with trust scoring, this catches the vast majority of Sybil accounts.</p>
        <p className="mt-3 text-[var(--text-secondary)]">Projects can integrate this filter via API to protect their airdrops from bot farms.</p>
      </>
    ),
  },

  'trust-threshold': {
    title: 'Trust Threshold',
    body: (
      <>
        <p>The threshold slider controls how strict your bot filter is. Only wallets with a TrustScore <strong>at or above</strong> this value will pass.</p>
        <p className="mt-3"><strong>Recommended: 40-60.</strong> This range catches most Sybil accounts while keeping legitimate newer users.</p>
        <ul className="mt-2 space-y-1 pl-4">
          <li><strong>Lower (20-40)</strong> — More inclusive, some bots may slip through</li>
          <li><strong>Higher (60-80)</strong> — Stricter, may exclude newer legitimate users</li>
        </ul>
      </>
    ),
  },
};
