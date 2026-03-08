# TrustTap+ Product Requirements Document
**Version:** 1.0
**Date:** February 28, 2026
**Hackathon:** MONOLITH Solana Mobile Hackathon
**Deadline:** March 9, 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Solution Overview](#3-solution-overview)
4. [Target Users](#4-target-users)
5. [User Personas](#5-user-personas)
6. [Feature Specifications](#6-feature-specifications)
7. [User Flows](#7-user-flows)
8. [Screen Inventory](#8-screen-inventory)
9. [Data Models](#9-data-models)
10. [API Specifications](#10-api-specifications)
11. [Trust Score Algorithm](#11-trust-score-algorithm)
12. [AI Integration Spec](#12-ai-integration-spec)
13. [Anti-Gaming Rules](#13-anti-gaming-rules)
14. [Technical Architecture](#14-technical-architecture)
15. [Caching Strategy](#15-caching-strategy)
16. [Security Considerations](#16-security-considerations)
17. [Hackathon Constraints](#17-hackathon-constraints)
18. [Success Metrics](#18-success-metrics)
19. [9-Day Build Timeline](#19-9-day-build-timeline)
20. [Risk Register](#20-risk-register)
21. [Future Roadmap](#21-future-roadmap)
22. [Glossary](#22-glossary)

---

## 1. Executive Summary

### What
TrustTap+ is a mobile-first, SGT-gated on-chain reputation system for Solana Seeker phone owners. It builds a verifiable trust score (0-100) using three layers no other product combines: **device attestation** (SGT soulbound NFT), **chain analysis** (AI-powered wallet history), and **physical verification** (QR-based proof-of-meeting).

### Why
Crypto has a trust crisis. There is no tool to verify the **person** behind a wallet. Sybil wallets stole $600M+ from a single airdrop. P2P scams grew 40% year-over-year. 17,000 real users were incorrectly rejected from legitimate airdrops. TrustTap+ solves this by turning the Solana Seeker into a trust passport.

### For Whom
Solana Seeker phone owners (~100K+ devices sold) — 100% crypto-native: traders, DeFi users, NFT collectors, developers, event-goers, DAO members.

### One-Liner
**"In crypto, we say 'don't trust, verify.' TrustTap gives you the tools to verify the PERSON behind the wallet. One scan to know who you're dealing with."**

### Hackathon Context
- **Competition:** MONOLITH Solana Mobile Hackathon
- **Prizes:** $10K x 10 grand prizes, $5K x 5 honorable mention, $10K SKR bonus
- **Judging Criteria:** Stickiness 25%, UX 25%, Innovation 25%, Demo 25%
- **Judges:** Toly (Solana co-founder), Emmett (GM Solana Mobile), Mert (Helius CEO), Mike S, Chase, Akshay
- **Competitive Landscape:** ~266 participants, ~11 submissions. ZERO doing trust/reputation. Blue ocean.

---

## 2. Problem Statement

### The Trust Vacuum in Crypto

Crypto operates on the principle "don't trust, verify" — yet provides **zero infrastructure** to verify the person behind a wallet. This creates four cascading failures:

#### 2.1 Sybil Attacks Steal Billions

| Incident | Impact |
|----------|--------|
| Arbitrum $ARB airdrop | Sybil wallets captured **49% of distributed tokens** — $600M+ stolen from real users |
| Optimism airdrop | **17,000 real users** incorrectly rejected — $18.62M in lost tokens |
| zkSync airdrop | Millions of tokens flagged as potentially farmed |

Projects spend enormous resources on Sybil detection and still get it wrong — penalizing real users while sophisticated farms slip through.

#### 2.2 P2P Trade Scams Are Growing

- **Pig butchering scams grew 40% year-over-year** in 2025
- Common attack vectors: fake payment proofs, triangle scams, chargeback fraud
- No mobile solution exists for face-to-face counterparty verification
- Existing escrow platforms (Binance P2P, Paxful) work for online trades but provide zero mechanism for in-person exchanges

#### 2.3 Blind Signing Enables Phishing

- **$410.7M lost** to blind signing phishing in H1 2025 across 132 incidents
- Mobile wallet users approve transactions they cannot read
- Wallet compromises represented 69% of H1 2025 value lost ($1.71B across 34 incidents)

#### 2.4 No Reputation Layer Exists

- DAOs cannot distinguish 1 person with 100 wallets from 100 real humans
- NFT OTC trades rely on Discord DMs and Twitter reputation (easily faked)
- Lending between crypto-native users has zero credit infrastructure
- Project founders cannot be verified by on-chain history alone

### The Root Cause

Every problem above stems from the same gap: **no tool exists to verify the PERSON behind a wallet.** Existing solutions are insufficient:

| Existing Solution | What It Does | What It Lacks |
|------------------|-------------|---------------|
| Civic | Binary identity verification (yes/no) | No reputation scoring, no physical layer |
| Trusta Labs | On-chain scoring (MEDIA score) | No device attestation, no physical meetings, EVM-focused |
| Gitcoin Passport | Web2+Web3 stamps (27 providers) | Web2-dependent, not Solana-native, no hardware backing |
| DegenScore | Ethereum activity scoring | Ethereum-only, measures activity not trust |
| Worldcoin | Iris biometric scanning | Requires special hardware, not Solana-native |
| OpenRank/Karma3 | Social graph trust (EigenTrust) | No device attestation, no physical meetings |

**No project on any chain combines on-chain behavior analysis + hardware device attestation + physical meeting verification.**

---

## 3. Solution Overview

### Three-Layer Trust Model

TrustTap+ builds trust from three unique layers:

```
┌─────────────────────────────────────────────────┐
│               TRUST SCORE (0-100)                │
├─────────────────────────────────────────────────┤
│                                                  │
│  Layer 1: DEVICE (SGT)                          │
│  ├── Soulbound NFT proving Seeker ownership     │
│  ├── Cannot be faked, transferred, or duplicated │
│  └── Cost of attack: $500 per fake identity     │
│                                                  │
│  Layer 2: CHAIN (Wallet Analysis)               │
│  ├── Wallet age, transaction count              │
│  ├── Protocol diversity (11 known protocols)     │
│  ├── DeFi activity (staking, LP, lending)       │
│  ├── NFT holdings (blue-chip detection)         │
│  ├── Digital identity (.sol domains)            │
│  └── Governance participation (DAO votes)       │
│                                                  │
│  Layer 3: PHYSICAL (Proof of Meeting)           │
│  ├── QR code exchange between users             │
│  ├── Cryptographically signed mutual attestation │
│  ├── Anti-gaming: rate limits, cooldowns        │
│  └── Bots cannot fake physical presence         │
│                                                  │
├─────────────────────────────────────────────────┤
│  AI Layer: Groq-powered trust summaries          │
│  └── Natural-language analysis + Sybil detection │
├─────────────────────────────────────────────────┤
│  Sybil Shield: Built-in airdrop filter          │
│  └── Projects query scores to filter bots       │
└─────────────────────────────────────────────────┘
```

### Why This Combination Is Unique

1. **Device layer** creates a $500 cost-of-attack floor per fake identity. No other reputation system has hardware-backed device attestation.
2. **Chain layer** analyzes real, verifiable on-chain behavior that cannot be retroactively faked.
3. **Physical layer** introduces a dimension bots literally cannot replicate — real-world human encounters.
4. **AI layer** synthesizes raw data into actionable trust assessments and catches bot patterns.
5. **Sybil Shield** transforms individual trust scores into ecosystem infrastructure.

---

## 4. Target Users

### Primary Audience: Solana Seeker Phone Owners

- **Population:** ~100K+ devices sold
- **Profile:** 100% crypto-native — every Seeker buyer invested $500+ specifically for crypto functionality
- **Demographics:** Traders, DeFi power users, NFT collectors, developers, event-goers, DAO members, hackathon participants
- **Geographic distribution:** Global, with concentration in US, Europe, Southeast Asia, Nigeria, Turkey, India

### Why This Audience

1. **They exist TODAY** — not hypothetical future users
2. **They all have SGT** — the trust foundation is already deployed
3. **They face the trust problem daily** — every P2P trade, airdrop, and event
4. **They understand the value** — crypto-native users grasp "trust score" immediately
5. **The judges ARE this audience** — Toly, Emmett, Mert are Seeker owners

---

## 5. User Personas

### Persona 1: "DeFi Dami" — The Active Trader

- **Profile:** 27, Nigeria. Full-time crypto trader. Seeker is primary device.
- **Wallet:** 18 months old. 2,000+ transactions. Uses Jupiter, Raydium, Marinade, Orca.
- **Pain:** Does 3-5 OTC trades per week at local meetups. Has been scammed twice — once via fake bank transfer screenshot, once via triangle scam. Total loss: ~$1,200.
- **TrustTap+ Value:** Before any trade, scans counterparty's QR. Sees trust score of 72/100 — wallet is 2 years old, uses 6 protocols, has met 15 verified users. Proceeds with confidence. Avoids a low-score wallet (score 25) that turns out to be a 2-week-old burner.
- **Usage Pattern:** Opens before every P2P trade (3-5x/week). Scans people at local meetups (1-2x/week). Checks score improvement passively.

### Persona 2: "Conference Carlos" — The Event Networker

- **Profile:** 34, Brazil. Developer and DAO contributor. Attends 4-6 crypto events per year.
- **Wallet:** 3 years old. Active across governance (Realms), NFTs (Tensor), and DeFi.
- **Pain:** Meets 50+ people at each event. Exchanges Telegram handles, forgets who's who. Can't verify if someone he met is legit when they DM him later about a "deal."
- **TrustTap+ Value:** At events, exchanges QR scans with everyone he meets. Each scan creates a permanent "proof of meeting" on his profile. When someone DMs him weeks later, he checks their TrustTap profile — sees they met at ETH Denver, score is 81/100, and AI summary says "Long-term Solana ecosystem participant with active governance and diverse DeFi activity."
- **Usage Pattern:** Heavy at events (20-30 scans per event, 4-6 events/year). Looks up wallets before any collaboration (2-3x/month). Shares his profile as a credential.

### Persona 3: "Airdrop Alice" — The Legitimate Claimant

- **Profile:** 22, US. Crypto enthusiast. Uses Seeker for daily DeFi and has participated in 6 airdrops.
- **Wallet:** 14 months old. Moderate activity — staking, some swaps, NFT collecting.
- **Pain:** Received 60% less than expected from Arbitrum airdrop due to Sybil dilution. Was incorrectly flagged as a bot for Optimism's airdrop because her transaction pattern (low frequency, high value) triggered false positive detection.
- **TrustTap+ Value:** Her TrustTap score of 68/100 — including SGT verification, physical meetings, and diverse activity — proves she's a real human with a real device. Projects that use TrustTap's Sybil Shield filter bots without false-positive rejecting users like her. "1 SGT = 1 human = 1 fair claim."
- **Usage Pattern:** Checks eligibility whenever a new airdrop is announced (2-3x/month). Maintains score passively through normal crypto activity.

---

## 6. Feature Specifications

### Feature 1: SGT Gate

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must Have) |
| **Description** | App checks if connected wallet holds an SGT (Seeker Genesis Token). No SGT = no access. |
| **Technical Implementation** | Helius DAS API `getAssetsByOwner` call, filter by SGT collection/group address `GT22s89nU4iWFkNXj1Bw6uYhJJWDRPpShHt4Bk8f99Te`. 10 credits per call (free tier). |
| **Devnet Strategy** | Mint mock non-transferable token on devnet with matching metadata structure. Gate on that. Document that production uses real SGT collection address. |

**Acceptance Criteria:**
- [ ] Wallet connects via MWA (wallet chooser appears)
- [ ] App queries Helius DAS API for SGT ownership
- [ ] SGT found → user proceeds to trust profile
- [ ] No SGT → clear error screen with explanation of SGT and option to connect different wallet
- [ ] API failure → retry with exponential backoff (max 3 retries), show loading state
- [ ] Wallet disconnect → return to connect screen
- [ ] Connection state persists across app reloads (session management)

**Edge Cases:**
- User connects wallet without SGT → display "Seeker Required" screen with explanation
- API fails after all retries → show "Unable to verify device. Please try again later." with retry button
- User disconnects wallet mid-verification → cancel pending request, return to connect screen
- Multiple wallets on device → user selects which wallet via MWA chooser; each must be checked independently

---

### Feature 2: Wallet Analysis Engine

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must Have) |
| **Description** | Analyzes connected wallet's Solana history across 7 dimensions using Helius free tier APIs. |

**Data Sources:**

| Dimension | API Call | Credits | What We Extract |
|-----------|---------|---------|-----------------|
| Wallet age | `getSignaturesForAddress` (oldest first, limit 1) | 1 | Timestamp of first transaction |
| Transaction count | `getSignaturesForAddress` (paginate, count) | 1/page | Total confirmed transactions |
| Protocol diversity | Helius `parse-transactions` → `source` field | 100/batch | Unique protocols used |
| DeFi engagement | `parse-transactions` → filter by SWAP, STAKE, LP types | (included above) | Staking, LP, lending activity |
| NFT holdings | `getAssetsByOwner` DAS API | 10 | Total NFTs, blue-chip count |
| Digital identity | SNS SDK / DAS API | 10 | .sol domain ownership |
| Governance | `parse-transactions` → SPL Governance program filter | (included above) | DAO votes cast |

**Known Protocol Program IDs (for detection):**

| Protocol | Program ID | Category |
|----------|-----------|----------|
| Jupiter v6 | `JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4` | DEX Aggregator |
| Raydium AMM | `675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8` | DEX |
| Raydium CLMM | `CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK` | DEX |
| Marinade Finance | `MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD` | Liquid Staking |
| Orca Whirlpool | `whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc` | DEX |
| Tensor | `TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN` | NFT Marketplace |
| Magic Eden V2 | `M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K` | NFT Marketplace |
| Solend | `So1endDq2YkqhipRh3WViPa8hFSl6XYA9oMVFwLQbaw` | Lending |
| Marginfi | `MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA` | Lending |
| SPL Governance | `GovER5Lthms3bLBqWub97yVRMmNLaGKKOjL7SdN4QNpM` | DAO Governance |
| Squads V3 | `SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu` | Multisig |

**Acceptance Criteria:**
- [ ] Fetches wallet age (date of first transaction)
- [ ] Counts total confirmed transactions (paginated, handles wallets with 10K+ txs)
- [ ] Identifies all known protocols the wallet has interacted with
- [ ] Detects staked SOL (native + liquid staking: mSOL, JitoSOL)
- [ ] Detects LP positions
- [ ] Detects lending/borrowing positions
- [ ] Counts total NFTs and identifies blue-chip holdings (Mad Lads, Tensorians, etc.)
- [ ] Checks .sol domain ownership
- [ ] Counts DAO governance votes cast
- [ ] Analysis completes within 15 seconds for uncached wallets
- [ ] Results cached as JSON

**Edge Cases:**
- New wallet with zero transactions → score component is 0 for all chain dimensions; summary: "New wallet, no history yet"
- Wallet with 10,000+ transactions → paginate using `before` parameter, cap at last 1,000 for performance
- API rate limit hit → fall back to cached data if available; show "Analysis in progress" if not
- Wallet with no NFTs → NFT dimension scores 0, no blue-chip badges
- Wallet with only transfers (no DeFi) → DeFi and diversity dimensions score 0

---

### Feature 3: Trust Score Algorithm

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must Have) |
| **Description** | Weighted scoring algorithm producing a 0-100 trust score from 7 dimensions. |

**Full scoring formula is specified in [Section 11: Trust Score Algorithm](#11-trust-score-algorithm).**

**Acceptance Criteria:**
- [ ] Score calculated from all 7 dimensions
- [ ] Score is deterministic — same input always produces same output
- [ ] Score updates when new data is available (meeting added, cache refreshed)
- [ ] Score label assigned correctly (Unverified/Basic/Established/Trusted/Highly Trusted)
- [ ] Score color assigned correctly per label
- [ ] Badges awarded based on criteria (see badge table in Section 11)
- [ ] Score breakdown visible as 7 individual components

---

### Feature 4: AI Trust Summary

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 (Should Have) |
| **Description** | Groq (Llama 3.1 8B Instant) generates natural-language trust analysis and Sybil assessment from wallet data. |

**Full specification in [Section 12: AI Integration Spec](#12-ai-integration-spec).**

**Acceptance Criteria:**
- [ ] Trust summary generated (2-3 sentences) for each analyzed wallet
- [ ] Sybil assessment generated (HUMAN/LIKELY HUMAN/UNCERTAIN/LIKELY BOT/BOT + 1-2 sentence explanation)
- [ ] Summary mentions wallet strengths
- [ ] Summary flags red flags or concerns
- [ ] Summary cached alongside wallet analysis data
- [ ] Graceful fallback if Groq API is unavailable (show "AI summary unavailable" with score data intact)
- [ ] Response time < 5 seconds

---

### Feature 5: QR Meeting Exchange

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must Have) |
| **Description** | Two users scan each other's QR codes to create a cryptographically verified "proof of meeting." |

**QR Payload Structure:**
```typescript
interface MeetingChallenge {
  walletAddress: string;    // Base58 public key
  timestamp: number;        // Unix milliseconds
  nonce: string;            // crypto.randomUUID()
  signature: string;        // Base58-encoded Ed25519 signature of the message
}
```

**Signature message format:** `{walletAddress}:{timestamp}:{nonce}`

**Flow:**
1. User A taps "Meet Someone" → app generates challenge
2. App combines `walletAddress + timestamp + nonce` into message string
3. Message signed with wallet private key via MWA `signMessages()`
4. Full payload encoded as JSON string in QR code
5. User A's QR code displayed on screen with 60-second countdown
6. User B opens scanner → camera activates → scans QR
7. User B's app parses JSON, verifies Ed25519 signature using tweetnacl, checks timestamp within 60 seconds
8. If valid: User B generates counter-signature (signs same challenge + own wallet address)
9. Both apps submit meeting record to backend: `{ wallet_A, wallet_B, timestamp, sig_A, sig_B }`
10. Backend verifies both signatures, checks anti-gaming rules, stores meeting record
11. Both users see "Meeting Verified!" confirmation
12. Both trust scores update (+2 physical meeting points)

**Signature Verification (Client-Side):**
```typescript
import nacl from 'tweetnacl';
import bs58 from 'bs58';

function verifyMeetingChallenge(payload: MeetingChallenge): boolean {
  const message = `${payload.walletAddress}:${payload.timestamp}:${payload.nonce}`;
  const messageBytes = new TextEncoder().encode(message);
  const signatureBytes = bs58.decode(payload.signature);
  const publicKeyBytes = bs58.decode(payload.walletAddress);
  return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
}
```

**Paste Fallback (Secondary Input Method):**
- Small "Paste verification data" link below the camera scanner
- User copies JSON payload from partner's app → pastes into text field → same verification runs
- Exists for emulator demos and scenarios where camera scanning is impractical
- Same cryptographic verification — not a shortcut around security

**QR Scanning Library:**
- `html5-qrcode` — works with Web Camera API in any browser
- Handles permission flow, camera selection, barcode detection
- Alternative: `@zxing/library` for browser-based QR reading

**Acceptance Criteria:**
- [ ] QR code generated containing valid, signed challenge payload
- [ ] QR code auto-refreshes every 60 seconds with new nonce
- [ ] Camera-based QR scanning works in browser
- [ ] Paste fallback available and functional
- [ ] Signature verification correctly validates authentic challenges
- [ ] Signature verification correctly rejects expired challenges (>60s)
- [ ] Signature verification correctly rejects tampered payloads
- [ ] Meeting record stored with both signatures after backend verification
- [ ] Anti-gaming rules enforced server-side (see Section 13)
- [ ] Both users see confirmation with partner's mini trust profile
- [ ] Both users' scores update in real-time

**Edge Cases:**
- QR expires mid-scan → "Challenge expired. Ask them to generate a new QR."
- User scans their own QR → "You cannot verify a meeting with yourself."
- Camera permission denied → show explanation + "Paste verification data" as primary option
- Same pair tries to meet within 7-day cooldown → "You've already verified a meeting with this user recently."
- User hits daily meeting cap (5) → "Daily meeting limit reached. Try again tomorrow."
- Network failure during submission → queue locally, retry when connection restored

---

### Feature 6: Sybil Shield

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 (Should Have) |
| **Description** | Dashboard demonstrating how projects can filter airdrop recipients by SGT ownership + minimum trust score. |

**User-Facing Screen: "Verify Airdrop Eligibility"**
- Trust score threshold slider (0-100)
- Animated counter showing: total wallets → SGT verified → meets threshold
- Distribution visualization
- "How it works" explainer section

**Demo Flow:**
1. Display "1,000 wallets requested an airdrop"
2. Filter: 530 have no SGT → visually removed
3. Filter: 130 have trust score below threshold → visually removed
4. Result: 340 verified humans get fair distribution
5. "This is how you stop the next $600M Sybil attack"

**Acceptance Criteria:**
- [ ] Threshold slider functional (0-100)
- [ ] Animated counter shows filtering in real-time
- [ ] Results display: total checked, SGT verified, meets threshold, rejected
- [ ] Distribution visualization renders
- [ ] Demo data pre-loaded for reliable demonstration
- [ ] "How it works" explainer clearly communicates the three-layer model

---

### Feature 7: Wallet Search / Lookup

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 (Should Have) |
| **Description** | Search any wallet address to see their trust profile (if SGT-verified). |

**Acceptance Criteria:**
- [ ] Search bar accepts wallet address input (paste or type)
- [ ] SGT check performed on searched wallet
- [ ] If SGT found + cached → display trust profile instantly
- [ ] If SGT found + not cached → loading state while analysis runs (5-15s)
- [ ] If no SGT → "This wallet is not SGT-verified" message
- [ ] Invalid address format → "Invalid wallet address" error
- [ ] Recent searches list persisted locally
- [ ] Searched profile shows same components as own profile (score, badges, AI summary, meeting count)

---

## 7. User Flows

### Flow 1: First-Time User (Connect → Profile)

```
START
  │
  ▼
[Connect Wallet Screen]
  │ User taps "Connect Wallet"
  ▼
[MWA Wallet Chooser] ← System dialog
  │ User selects wallet
  ▼
[Loading: "Verifying Seeker ownership..."]
  │ App calls Helius DAS API for SGT check
  ├── SGT NOT found ──► [SGT Gate Screen: "Seeker Required"]
  │                       │ User taps "Connect Different Wallet"
  │                       └──► [MWA Wallet Chooser]
  │
  ▼ SGT found
[Loading: "Analyzing your wallet..."]
  │ App fetches wallet data from cache or Helius APIs
  │ App computes trust score
  │ App requests AI summary from Groq API
  ▼
[Trust Profile Screen]
  │ Score dial animates to final value
  │ Badges appear
  │ Breakdown chart populates
  │ AI summary fades in
  ▼
END (User is on main screen)
```

### Flow 2: Meet Someone (QR Exchange)

```
START (from Trust Profile)
  │ User taps "Meet Someone"
  ▼
[Meet Someone Screen - "Show My QR" tab active]
  │ App generates challenge: walletAddress + timestamp + nonce
  │ App signs challenge via MWA signMessages()
  │ QR code displayed with 60-second countdown timer
  │
  ├── Partner scans User's QR ──► (Partner's app handles verification)
  │
  │ User switches to "Scan QR" tab
  ▼
[Meet Someone Screen - "Scan QR" tab active]
  │ Camera activates with viewfinder overlay
  │
  ├── User scans partner's QR
  │   │ App parses JSON payload
  │   │ App verifies Ed25519 signature
  │   │ App checks timestamp freshness (<60s)
  │   │
  │   ├── Invalid/expired ──► [Error: "Invalid or expired QR. Ask for a fresh one."]
  │   │
  │   ▼ Valid
  │   [Partner Preview Card]
  │   │ Shows partner's trust score, badges, wallet address (truncated)
  │   │ "Confirm Meeting" button
  │   │ User taps "Confirm Meeting"
  │   ▼
  │   [Loading: "Verifying meeting..."]
  │   │ App generates counter-signature
  │   │ Both signatures submitted to backend
  │   │ Backend verifies, checks anti-gaming rules, stores record
  │   │
  │   ├── Anti-gaming violation ──► [Error: specific message]
  │   │
  │   ▼ Success
  │   [Meeting Verified! Animation]
  │   │ Score updates on both devices
  │   └──► [Trust Profile (updated)]
  │
  └── User taps "Paste verification data"
      │ Text input field appears
      │ User pastes JSON payload
      └──► (Same verification flow as QR scan)
```

### Flow 3: Search / Lookup

```
START (from Search tab)
  │
  ▼
[Search Screen]
  │ User enters/pastes wallet address
  │ User taps search
  ▼
[Loading: "Looking up wallet..."]
  │ App checks SGT ownership
  │
  ├── No SGT ──► [Result: "This wallet is not SGT-verified"]
  │
  ▼ SGT found
  │ App checks cache for existing analysis
  │
  ├── Cached ──► [Trust Profile Card] (instant)
  │
  ▼ Not cached
[Loading: "Analyzing wallet..."] (5-15 seconds)
  │ App fetches data, computes score, generates AI summary
  ▼
[Trust Profile Card]
  │ Shows score, badges, AI summary, meeting count
  │ Address added to recent searches
  ▼
END
```

### Flow 4: Sybil Shield Demo

```
START (from Sybil Shield tab)
  │
  ▼
[Sybil Shield Dashboard]
  │ User adjusts trust score threshold via slider (default: 50)
  │ User taps "Run Filter"
  ▼
[Animated Filtering Sequence]
  │ Counter: "1,000 wallets requested an airdrop"
  │ Animation: 530 red dots removed ("No SGT")
  │ Counter: "470 SGT-verified"
  │ Animation: 130 orange dots removed ("Below trust threshold")
  │ Counter: "340 verified humans"
  ▼
[Results Dashboard]
  │ Total: 1,000
  │ SGT Verified: 470
  │ Meets Threshold: 340
  │ Rejected: 660
  │ Distribution visualization
  │ "How It Works" expandable section
  ▼
END
```

---

## 8. Screen Inventory

> **Note:** Visual design (colors, typography, spacing, components) handled separately by design-forge. See Design System. This section describes **content, purpose, and interactions only.**

### Screen 1: Connect Wallet

| Element | Description |
|---------|-------------|
| **Purpose** | Entry point. Get user's wallet connected. |
| **App name + tagline** | "TrustTap+" / "Your trust passport for crypto" |
| **Description text** | 2-3 lines explaining what TrustTap does: "Build a verifiable trust score from your on-chain history, device attestation, and real-world encounters." |
| **Connect Wallet button** | Large, primary CTA. Triggers MWA wallet chooser. |
| **Loading state** | After wallet selected: "Verifying Seeker ownership..." with spinner |

### Screen 2: SGT Gate (No SGT)

| Element | Description |
|---------|-------------|
| **Purpose** | Block non-Seeker users with a clear explanation. |
| **Heading** | "Seeker Required" |
| **Explanation** | "TrustTap+ is exclusively for Solana Seeker owners. Your connected wallet does not hold a Seeker Genesis Token (SGT) — the soulbound NFT that proves genuine Seeker device ownership." |
| **What is SGT?** | Brief expandable section explaining SGT |
| **Action** | "Connect a Different Wallet" button |

### Screen 3: Trust Profile (Main Screen)

| Element | Description |
|---------|-------------|
| **Purpose** | The heart of the app. Shows user's complete trust identity. |
| **Score dial** | Circular progress indicator (0-100). Animated fill on load. Color-coded by trust level (see Section 11). Displays numeric score prominently in center. |
| **Score label** | Text below dial: "Unverified" / "Basic" / "Established" / "Trusted" / "Highly Trusted" |
| **Badge row** | Horizontal scrollable row of earned badge chips (Veteran, DeFi Degen, Whale, Governor, Networker, OG, Builder). Unearned badges not shown. |
| **Score breakdown** | 7 horizontal progress bars showing each dimension's contribution (Device, Wallet Age, Activity, Diversity, DeFi, Identity, Physical). Each labeled with points earned / points possible. |
| **AI trust summary** | Card containing 2-3 sentence natural-language trust analysis. |
| **Sybil assessment** | Small indicator: "HUMAN (confident)" with color coding |
| **Meeting history** | Collapsible list of verified meetings. Each shows: partner wallet (truncated), date, mutual verification badge. |
| **"Meet Someone" CTA** | Prominent button, always visible. Navigates to Meet Someone screen. |
| **"Share Profile"** | Secondary action. Generates shareable link or displays QR for others to look up this wallet. |
| **Wallet address** | Truncated display of connected wallet with copy button |
| **Last analyzed** | Timestamp of last data refresh |

### Screen 4: Meet Someone (QR Exchange)

| Element | Description |
|---------|-------------|
| **Purpose** | Exchange trust data with another person via QR scan. |
| **Tab toggle** | Two tabs: "Show My QR" and "Scan QR" |
| **Show My QR tab** | Large QR code encoding signed challenge. Wallet address displayed below QR (truncated). 60-second countdown timer. Auto-refresh on expiry. "Copy verification data" link for paste fallback. |
| **Scan QR tab** | Camera viewfinder with scan overlay frame. "Paste verification data" link below viewfinder. Camera permission request if not granted. |
| **Post-scan: Partner Preview** | Shows partner's mini trust profile (score, top badges, wallet). "Confirm Meeting" button. |
| **Post-confirmation** | "Meeting Verified!" with celebration animation. Updated score display. "Back to Profile" link. |

### Screen 5: Search / Lookup

| Element | Description |
|---------|-------------|
| **Purpose** | Look up any wallet's trust profile. |
| **Search bar** | Text input: "Enter wallet address". Paste-friendly (large tap target). Search button. |
| **Results area** | Trust profile card (mini version) OR "Not SGT-verified" message. |
| **Recent searches** | List of previously searched wallets with their scores. Persisted locally. |
| **Loading state** | "Analyzing wallet..." with progress indicator for uncached lookups. |

### Screen 6: Sybil Shield Dashboard

| Element | Description |
|---------|-------------|
| **Purpose** | Demonstrate airdrop filtering capability. |
| **Trust threshold slider** | Range 0-100 with current value displayed. |
| **"Run Filter" button** | Triggers animated filtering sequence. |
| **Animated counters** | Total → SGT verified → Meets threshold. Numbers count up/down with animation. |
| **Distribution visualization** | Visual representation of filtered vs rejected wallets. |
| **Results summary** | Table: Total checked, SGT verified, Meets threshold, Rejected. |
| **"How it works"** | Expandable section explaining three-layer trust model and how projects integrate. |

### Navigation

| Pattern | Description |
|---------|-------------|
| **Bottom tab bar** | 4 tabs: Home (Trust Profile), Scan (Meet Someone), Search, Shield (Sybil Shield) |
| **Tab icons** | Descriptive icons for each section (See Design System) |
| **Active state** | Current tab highlighted (See Design System) |
| **Responsive** | Bottom tabs on mobile, sidebar navigation on wider screens (PWA responsive) |

---

## 9. Data Models

### WalletAnalysis

```typescript
interface WalletAnalysis {
  walletAddress: string;          // Base58 public key
  hasSGT: boolean;                // SGT ownership verified
  walletAge: number;              // Days since first transaction
  firstTransactionDate: string;   // ISO 8601 date string
  transactionCount: number;       // Total confirmed transactions
  protocolsUsed: string[];        // ["Jupiter", "Raydium", "Marinade", ...]
  hasStakedSOL: boolean;          // Native or liquid staking detected
  hasLPPositions: boolean;        // LP token accounts detected
  hasLendingPositions: boolean;   // Lending/borrowing positions detected
  nftCount: number;               // Total NFTs held
  blueChipNFTCount: number;       // Blue-chip NFTs (Mad Lads, Tensorians, etc.)
  hasSolDomain: boolean;          // .sol domain ownership
  solDomain?: string;             // The .sol domain name if owned
  daoVoteCount: number;           // Governance votes cast
  meetingCount: number;           // Verified physical meetings
  analyzedAt: string;             // ISO 8601 timestamp of analysis
}
```

### TrustProfile

```typescript
interface TrustProfile {
  walletAddress: string;
  score: number;                  // 0-100
  label: 'Unverified' | 'Basic' | 'Established' | 'Trusted' | 'Highly Trusted';
  color: string;                  // Hex color for the score level
  breakdown: ScoreBreakdown;
  badges: Badge[];
  aiSummary: string;              // Natural-language trust summary
  sybilAssessment: string;        // "HUMAN (confident)" etc.
  meetingHistory: Meeting[];
  analysis: WalletAnalysis;       // Raw analysis data
  cachedAt: string;               // ISO 8601 timestamp
}
```

### ScoreBreakdown

```typescript
interface ScoreBreakdown {
  device: number;       // 0-20 — SGT ownership
  walletAge: number;    // 0-15 — Time since first transaction
  activity: number;     // 0-15 — Transaction count
  diversity: number;    // 0-15 — Unique protocols used
  defi: number;         // 0-15 — Staking, LP, lending
  identity: number;     // 0-10 — .sol domain, blue-chips, governance
  physical: number;     // 0-10 — Verified physical meetings
}
```

### Meeting

```typescript
interface Meeting {
  id: string;                     // Unique meeting ID (UUID)
  walletA: string;                // First participant's wallet address
  walletB: string;                // Second participant's wallet address
  timestamp: string;              // ISO 8601 timestamp of meeting
  signatureA: string;             // Base58-encoded Ed25519 signature from wallet A
  signatureB: string;             // Base58-encoded Ed25519 signature from wallet B
  verified: boolean;              // Backend verification passed
}
```

### Badge

```typescript
interface Badge {
  id: string;                     // Unique badge identifier
  name: string;                   // Display name
  description: string;            // What this badge means
  earned: boolean;                // Whether user has earned this badge
  earnedAt?: string;              // ISO 8601 timestamp when earned
}
```

### MeetingChallenge (QR Payload)

```typescript
interface MeetingChallenge {
  walletAddress: string;          // Base58 public key of QR generator
  timestamp: number;              // Unix milliseconds when generated
  nonce: string;                  // crypto.randomUUID() for uniqueness
  signature: string;              // Base58-encoded Ed25519 signature
}
```

### SybilCheckRequest

```typescript
interface SybilCheckRequest {
  walletAddresses: string[];      // Array of wallet addresses to check
  minTrustScore: number;          // Minimum trust score threshold (0-100)
}
```

### SybilCheckResult

```typescript
interface SybilCheckResult {
  total: number;                  // Total wallets submitted
  sgtVerified: number;            // Wallets with valid SGT
  meetsThreshold: number;         // Wallets meeting trust score minimum
  rejected: number;               // Wallets that failed either check
  results: WalletCheckResult[];   // Per-wallet results
}

interface WalletCheckResult {
  walletAddress: string;
  hasSGT: boolean;
  trustScore: number | null;      // null if no SGT (not analyzed)
  passed: boolean;                // Meets both SGT + threshold requirements
  reason?: string;                // "No SGT" | "Below threshold" | null
}
```

---

## 10. API Specifications

### POST /api/analyze-wallet

Analyzes a wallet's on-chain history and computes trust score.

**Request:**
```json
{
  "walletAddress": "Base58PublicKey"
}
```

**Process:**
1. Check cache for existing analysis
2. If cache miss or stale (>24 hours): fetch from Helius APIs
3. Compute trust score from analysis data
4. Cache results
5. Return complete trust profile

**Response (200):**
```json
{
  "score": 72,
  "label": "Trusted",
  "color": "#22C55E",
  "breakdown": {
    "device": 20,
    "walletAge": 15,
    "activity": 10,
    "diversity": 12,
    "defi": 10,
    "identity": 3,
    "physical": 2
  },
  "badges": [
    { "id": "veteran", "name": "Veteran", "description": "Wallet age > 1 year", "earned": true, "earnedAt": "2026-02-28T12:00:00Z" }
  ],
  "analysis": { /* WalletAnalysis object */ },
  "cachedAt": "2026-02-28T12:00:00Z"
}
```

**Error Responses:**
- `400`: Invalid wallet address format
- `404`: Wallet has no SGT (not eligible for analysis)
- `429`: Rate limit exceeded
- `500`: Internal server error / Helius API failure

---

### POST /api/ai-summary

Generates AI-powered trust summary and Sybil assessment.

**Request:**
```json
{
  "walletData": { /* WalletAnalysis object */ }
}
```

**Process:**
1. Format wallet data into Groq prompt (see Section 12)
2. Send to Groq API (Llama 3.1 8B Instant)
3. Parse response for summary and Sybil assessment
4. Return structured result

**Response (200):**
```json
{
  "summary": "This is a well-established Solana wallet active for 14 months with diverse DeFi activity across Jupiter, Marinade, and Raydium. The owner is a verified Seeker device holder who has physically met 12 other verified users. High confidence for P2P transactions.",
  "sybilAssessment": "HUMAN",
  "confidence": "confident"
}
```

**Error Responses:**
- `400`: Invalid or missing wallet data
- `503`: Groq API unavailable
- `500`: Internal server error

---

### POST /api/meeting/create

Creates a verified meeting record between two wallets.

**Request:**
```json
{
  "walletA": "Base58PublicKey",
  "walletB": "Base58PublicKey",
  "timestamp": "2026-02-28T15:30:00Z",
  "signatureA": "Base58EncodedSignature",
  "signatureB": "Base58EncodedSignature"
}
```

**Process:**
1. Verify both Ed25519 signatures against the challenge message
2. Check anti-gaming rules:
   - Neither wallet has exceeded 5 meetings today
   - This wallet pair has not met within the last 7 days
   - Timestamp is within acceptable range (not future, not >5 minutes old)
3. Store meeting record
4. Update meeting count for both wallets
5. Recalculate trust scores for both wallets

**Response (200):**
```json
{
  "success": true,
  "meetingId": "uuid-v4-meeting-id",
  "newScores": {
    "walletA": 74,
    "walletB": 68
  }
}
```

**Error Responses:**
- `400`: Invalid signatures, missing fields
- `403`: Anti-gaming rule violation (response includes specific rule: "daily_limit", "cooldown", "self_meeting")
- `409`: Duplicate meeting record
- `500`: Internal server error

---

### GET /api/profile/:walletAddress

Retrieves the complete trust profile for a wallet.

**Process:**
1. Check SGT ownership
2. If SGT: return cached profile or compute new one
3. If no SGT: return error

**Response (200):**
```json
{
  "walletAddress": "Base58PublicKey",
  "score": 72,
  "label": "Trusted",
  "color": "#22C55E",
  "breakdown": { /* ScoreBreakdown */ },
  "badges": [ /* Badge[] */ ],
  "aiSummary": "...",
  "sybilAssessment": "HUMAN (confident)",
  "meetingHistory": [ /* Meeting[] */ ],
  "analysis": { /* WalletAnalysis */ },
  "cachedAt": "2026-02-28T12:00:00Z"
}
```

**Error Responses:**
- `400`: Invalid wallet address format
- `404`: `{ "error": "Not SGT-verified" }`
- `500`: Internal server error

---

### GET /api/meetings/:walletAddress

Retrieves all verified meetings for a wallet.

**Response (200):**
```json
{
  "walletAddress": "Base58PublicKey",
  "meetings": [
    {
      "id": "uuid-v4",
      "partner": "Base58PublicKey",
      "timestamp": "2026-02-28T15:30:00Z",
      "verified": true
    }
  ],
  "total": 12
}
```

---

### POST /api/sybil-check

Batch checks multiple wallets against SGT + trust score threshold.

**Request:**
```json
{
  "walletAddresses": ["wallet1", "wallet2", "..."],
  "minTrustScore": 50
}
```

**Response (200):**
```json
{
  "total": 1000,
  "sgtVerified": 470,
  "meetsThreshold": 340,
  "rejected": 660,
  "results": [
    {
      "walletAddress": "wallet1",
      "hasSGT": true,
      "trustScore": 72,
      "passed": true,
      "reason": null
    },
    {
      "walletAddress": "wallet2",
      "hasSGT": false,
      "trustScore": null,
      "passed": false,
      "reason": "No SGT"
    }
  ]
}
```

---

## 11. Trust Score Algorithm

### Formula

```
TOTAL SCORE (0-100) = Device + Age + Activity + Diversity + DeFi + Identity + Physical
```

### Dimension Breakdown

#### Device (0-20 points)
| Condition | Points |
|-----------|--------|
| Wallet holds SGT | +20 |

*Note: All users will have 20 points here since the app is SGT-gated. This establishes the hardware trust floor.*

#### Wallet Age (0-15 points)
| Condition | Points |
|-----------|--------|
| < 30 days since first transaction | 0 |
| 30-90 days | 5 |
| 90-365 days | 10 |
| > 365 days | 15 |

#### Transaction Activity (0-15 points)
| Condition | Points |
|-----------|--------|
| > 50 confirmed transactions | 5 |
| > 200 confirmed transactions | 10 |
| > 1,000 confirmed transactions | 15 |

*Thresholds are cumulative — a wallet with 1,500 transactions scores 15, not 30.*

#### Protocol Diversity (0-15 points)
| Condition | Points |
|-----------|--------|
| Per unique protocol used | +3 |
| Maximum | 15 (5+ protocols = max) |

*Protocols detected: Jupiter, Raydium, Marinade, Orca, Tensor, Magic Eden, Solend, Marginfi, SPL Governance, Squads, Metaplex.*

#### DeFi Engagement (0-15 points)
| Condition | Points |
|-----------|--------|
| Has staked SOL (native or liquid staking) | +5 |
| Has LP positions | +5 |
| Has lending/borrowing positions | +5 |

#### Digital Identity (0-10 points)
| Condition | Points |
|-----------|--------|
| Owns .sol domain | +5 |
| Holds blue-chip NFTs (Mad Lads, Tensorians, etc.) | +3 |
| Has cast DAO governance votes | +2 |

#### Physical Meetings (0-10 points)
| Condition | Points |
|-----------|--------|
| Per unique verified meeting | +2 |
| Maximum | 10 (5+ unique meetings = max) |

### Score Examples

**Example 1: "DeFi Dami" (Active trader, 18-month wallet)**
```
Device:    20  (SGT holder)
Age:       15  (18 months > 365 days)
Activity:  15  (2,000 transactions > 1,000)
Diversity: 12  (4 protocols: Jupiter, Raydium, Marinade, Orca)
DeFi:      15  (staked + LP + lending)
Identity:   5  (owns .sol domain)
Physical:   6  (3 verified meetings)
──────────────
TOTAL:     88  → "Highly Trusted" (Emerald)
```

**Example 2: "Conference Carlos" (Developer, 3-year wallet)**
```
Device:    20  (SGT holder)
Age:       15  (3 years > 365 days)
Activity:  10  (500 transactions, 200-1000 range)
Diversity: 15  (6+ protocols)
DeFi:       5  (staked SOL only)
Identity:  10  (.sol domain + blue-chip NFTs + DAO votes)
Physical:  10  (15 verified meetings, capped at 10)
──────────────
TOTAL:     85  → "Highly Trusted" (Emerald)
```

**Example 3: "New User Nadia" (Just got Seeker, 2-week wallet)**
```
Device:    20  (SGT holder)
Age:        0  (14 days < 30 days)
Activity:   0  (12 transactions < 50)
Diversity:  3  (1 protocol: Jupiter)
DeFi:       0  (no staking/LP/lending)
Identity:   0  (no domain, no blue-chips, no governance)
Physical:   0  (no meetings yet)
──────────────
TOTAL:     23  → "Basic" (Orange)
```

**Example 4: "Sybil Farm Wallet" (Manufactured activity)**
```
Device:     0  (no SGT — cannot even access app)
```
*Note: Without SGT, the wallet cannot be analyzed. This is the first Sybil filter.*

### Score Interpretation

| Range | Label | Color | Hex |
|-------|-------|-------|-----|
| 0-20 | Unverified | Red | `#EF4444` |
| 21-40 | Basic | Orange | `#F97316` |
| 41-60 | Established | Yellow | `#EAB308` |
| 61-80 | Trusted | Green | `#22C55E` |
| 81-100 | Highly Trusted | Emerald | `#10B981` |

### Badge System

| Badge | ID | Criteria | Description |
|-------|-----|---------|-------------|
| Veteran | `veteran` | Wallet age > 1 year | "Active Solana participant for over a year" |
| DeFi Degen | `defi-degen` | 5+ unique protocols used | "Diverse DeFi activity across the ecosystem" |
| Whale | `whale` | Significant holdings (TBD threshold) | "Notable economic commitment to Solana" |
| Governor | `governor` | Has cast DAO governance votes | "Active participant in on-chain governance" |
| Networker | `networker` | 5+ verified physical meetings | "Well-connected in the Seeker community" |
| OG | `og` | Wallet age > 2 years | "Early Solana ecosystem participant" |
| Builder | `builder` | Has created NFTs or deployed programs | "Contributor to the Solana ecosystem" |

---

## 12. AI Integration Spec

### Trust Summary Prompt

**System context:** The AI generates a human-readable trust summary from raw wallet analysis data. The summary should be concise (2-3 sentences), mention strengths, flag any concerns, and be useful for someone deciding whether to transact with this wallet.

**Prompt template:**
```
Wallet: {walletAddress}
Age: {walletAge} days
Transactions: {transactionCount}
Protocols: {protocolsUsed.join(', ')}
Staked SOL: {hasStakedSOL}
LP Positions: {hasLPPositions}
Lending: {hasLendingPositions}
NFTs: {nftCount} total, {blueChipNFTCount} blue-chip
.sol Domain: {hasSolDomain ? solDomain : 'None'}
DAO Votes: {daoVoteCount}
Physical Meetings: {meetingCount}
SGT: Yes
Trust Score: {score}/100

Generate a 2-3 sentence trust summary for this wallet. Mention strengths and any red flags. Be specific about which protocols and activities stand out.
```

**Example output:**
> "This is a well-established Solana wallet active for 14 months with diverse DeFi activity across Jupiter, Marinade, and Raydium. The owner is a verified Seeker device holder who has physically met 12 other verified users. High confidence for P2P transactions."

### Sybil Detection Prompt

**Prompt template:**
```
Analyze this wallet's activity pattern. Is it consistent with a single active human user, or does it show signs of bot/farm behavior?

Indicators of bot activity: repetitive transaction patterns, no protocol diversity, transactions at regular intervals, no NFT/governance/social activity, no physical meetings, very new wallet with sudden burst of activity.

Indicators of human activity: diverse protocol usage, irregular transaction timing, NFT collecting, governance participation, physical meetings, wallet aging over time.

Wallet data:
- Age: {walletAge} days
- Transactions: {transactionCount}
- Protocols: {protocolsUsed.join(', ')} ({protocolsUsed.length} unique)
- Has staking: {hasStakedSOL}
- Has LP: {hasLPPositions}
- Has lending: {hasLendingPositions}
- NFTs: {nftCount} ({blueChipNFTCount} blue-chip)
- Domain: {hasSolDomain}
- DAO votes: {daoVoteCount}
- Physical meetings: {meetingCount}
- SGT: Yes

Respond with exactly one of: HUMAN, LIKELY HUMAN, UNCERTAIN, LIKELY BOT, or BOT.
Then explain in 1-2 sentences.
```

**Example output:**
> "HUMAN. Diverse activity across 6 protocols over 14 months with governance participation, NFT collecting, and 12 physical meetings indicates a genuine, active Solana user."

### Error Handling

| Scenario | Behavior |
|----------|----------|
| Groq API returns error | Show "AI summary unavailable" — score and profile remain functional without it |
| Groq API is slow (>10s) | Show score immediately, load AI summary asynchronously with "Generating trust analysis..." placeholder |
| Groq returns unexpected format | Parse what's possible, fall back to generic summary based on score range |
| API key invalid / quota exceeded | Log error, disable AI features, show all non-AI data normally |

### Cost Estimate

| Operation | Tokens (approx.) | Cost per call |
|-----------|------------------|---------------|
| Trust summary | ~200 input + ~100 output | ~$0.001 |
| Sybil detection | ~250 input + ~50 output | ~$0.001 |
| **Per wallet** | | **~$0.002** |
| **10 demo wallets** | | **~$0.02** |

*Effectively free for hackathon purposes.*

---

## 13. Anti-Gaming Rules

Physical meeting verification is the most gameable component. These rules prevent farming:

### Rule Set

| Rule | Constraint | Rationale |
|------|-----------|-----------|
| **Daily meeting cap** | Max 5 meetings per wallet per day | Prevents mass-farming at events |
| **Pair cooldown** | 7-day minimum between same wallet pair | Prevents two colluding wallets from repeatedly meeting |
| **Challenge expiry** | 60-second QR/challenge validity window | Prevents remote sharing of QR codes |
| **Self-meeting block** | Cannot verify a meeting with yourself | Prevents single-user farming |
| **Score cap** | Physical meetings contribute max 10 points (5 unique meetings) | Limits incentive to farm beyond reasonable networking |

### Enforcement

All anti-gaming rules are enforced **server-side** in the backend. Client-side checks exist for UX (show warnings before hitting limits) but are not the source of truth.

**Server checks on POST /api/meeting/create:**
1. Verify `walletA !== walletB` (self-meeting)
2. Query meeting records: count today's meetings for walletA and walletB
3. Query meeting records: check if walletA-walletB pair met within last 7 days
4. Verify timestamp is within acceptable range (not future, not >5 minutes stale)
5. Verify both cryptographic signatures

**Error responses include the specific rule violated** so the client can show an appropriate message.

### Future Anti-Gaming (Not in Hackathon Scope)

- Location diversity scoring (meetings from many unique locations score higher)
- Velocity detection (meeting 5 people in 2 minutes is suspicious)
- Social graph analysis (if A's meetings are all with B's referrals, flag as ring)
- Temporal pattern detection (meetings at regular intervals suggest automation)

---

## 14. Technical Architecture

### System Diagram

```
┌───────────────────────────────────────────────────────────────┐
│                       USER'S BROWSER                          │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                  NEXT.JS PWA (Frontend)                 │  │
│  │                                                         │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │  │
│  │  │  Trust   │ │   Meet   │ │  Search  │ │  Sybil   │  │  │
│  │  │ Profile  │ │ Someone  │ │  Lookup  │ │  Shield  │  │  │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │  │
│  │       │             │            │             │        │  │
│  │  ┌────┴─────────────┴────────────┴─────────────┴────┐  │  │
│  │  │              STATE MANAGEMENT                     │  │  │
│  │  │         (React Context / Local State)             │  │  │
│  │  └───────────────────┬───────────────────────────────┘  │  │
│  │                      │                                  │  │
│  │  ┌───────────────────┴───────────────────────────────┐  │  │
│  │  │             WALLET CONNECTION                     │  │  │
│  │  │    Mobile Wallet Adapter (MWA) via Chrome         │  │  │
│  │  │    signMessages() for meeting challenges          │  │  │
│  │  └───────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │  ┌───────────────┐  ┌───────────────┐                  │  │
│  │  │  QR Generator │  │  QR Scanner   │                  │  │
│  │  │ react-qr-code │  │ html5-qrcode  │                  │  │
│  │  └───────────────┘  └───────────────┘                  │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────┬───────────────────────────────────┘
                            │ HTTPS
                            ▼
┌───────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                 │
│                                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐  │
│  │   Wallet     │ │   Meeting    │ │    AI Summary        │  │
│  │   Analyzer   │ │   Manager    │ │    Generator         │  │
│  │              │ │              │ │                      │  │
│  │  - SGT Check │ │ - Signature  │ │  - Groq API call     │  │
│  │  - History   │ │   Verify     │ │  - Trust summary     │  │
│  │  - Scoring   │ │ - Anti-game  │ │  - Sybil detection   │  │
│  │  - Caching   │ │ - Storage    │ │  - Response parsing  │  │
│  └──────┬───────┘ └──────┬───────┘ └──────────┬───────────┘  │
│         │                │                     │              │
│  ┌──────┴────────────────┴─────────────────────┴───────────┐  │
│  │                   DATA LAYER                            │  │
│  │            SQLite / JSON File Cache                     │  │
│  │                                                         │  │
│  │  Tables/Collections:                                    │  │
│  │  - wallet_analyses (cached analysis data)               │  │
│  │  - trust_profiles (computed scores + summaries)         │  │
│  │  - meetings (verified meeting records)                  │  │
│  │  - meeting_rate_limits (anti-gaming tracking)           │  │
│  └─────────────────────────┬───────────────────────────────┘  │
└────────────────────────────┼──────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
┌──────────────────┐ ┌─────────────┐ ┌───────────────┐
│   HELIUS APIs    │ │ SOLANA RPC  │ │  CLAUDE API   │
│   (Free Tier)    │ │  (Mainnet)  │ │  (Anthropic)  │
│                  │ │             │ │               │
│  - DAS API       │ │ - Read-only │ │ - Trust       │
│    (SGT + NFTs)  │ │   queries   │ │   summaries   │
│  - parse-txs     │ │             │ │ - Sybil       │
│  - getSignatures │ │             │ │   detection   │
└──────────────────┘ └─────────────┘ └───────────────┘
```

### Tech Stack

| Layer | Technology | Cost | Justification |
|-------|-----------|------|---------------|
| **Framework** | Next.js (PWA) | $0 | Builder's strongest framework. Mobile-responsive. |
| **Styling** | Tailwind CSS | $0 | Builder knows this. Rapid UI development. |
| **Wallet Connection** | Mobile Wallet Adapter (MWA) via Chrome | $0 | Works on Seeker's Chrome browser. Open source. |
| **SGT Check** | Helius DAS API `getAssetsByOwner` | $0 | Free tier. 10 credits/call. 1M credits/month. |
| **Wallet History** | Solana RPC `getSignaturesForAddress` | $0 | 1 credit/call on Helius free tier. |
| **Transaction Parsing** | Helius `parse-transactions` | $0 | 100 credits/batch. Free tier. |
| **AI Summary** | Groq API (Llama 3.1 8B Instant) | $0 | Free tier. ~$0/wallet. |
| **QR Generation** | react-qr-code or qrcode.js | $0 | Lightweight. |
| **QR Scanning** | html5-qrcode (Web Camera API) | $0 | Real camera-based scanning. |
| **Backend** | Node.js + Express | $0 | Local during hackathon. |
| **Database** | SQLite or JSON file cache | $0 | Lightweight for hackathon. |
| **Animations** | Framer Motion | $0 | Builder knows this from Next.js. |
| **Charts** | Recharts or Chart.js | $0 | Score breakdown visualization. |
| **Signature Verification** | tweetnacl + bs58 | $0 | Ed25519 signature verification. Standard. |
| **APK Wrapping** | Bubblewrap CLI | $0 | Wraps PWA as Android APK for dApp Store submission. |
| **TOTAL** | | **$0** | |

### Data Flow: Trust Score Generation

```
1. User opens app in Seeker's Chrome browser
2. User connects wallet via MWA (wallet chooser dialog)
3. Frontend calls POST /api/analyze-wallet with wallet address
4. Backend checks SGT: Helius DAS API getAssetsByOwner → filter by SGT collection
5. If no SGT → return 404
6. Backend checks cache for existing analysis
7. If cache hit (< 24 hours old) → skip to step 12
8. Backend fetches wallet history:
   a. getSignaturesForAddress (oldest first, limit 1) → wallet age
   b. getSignaturesForAddress (paginate, count) → transaction count
   c. parse-transactions (batch signatures) → protocol diversity, DeFi, governance
   d. getAssetsByOwner (DAS API) → NFTs, blue-chip detection
   e. SNS SDK lookup → .sol domain
9. Backend counts meetings from meeting records table
10. Backend applies scoring algorithm → trust score (0-100)
11. Backend calls Groq API → AI summary + Sybil assessment
12. Backend caches complete TrustProfile
13. Backend returns TrustProfile to frontend
14. Frontend renders Trust Profile screen with animations
```

### Data Flow: Meeting Verification

```
1. User A taps "Meet Someone" on frontend
2. Frontend generates challenge: { walletAddress, timestamp, nonce }
3. Frontend calls MWA signMessages() → Seed Vault signs challenge
4. Frontend generates QR code from { walletAddress, timestamp, nonce, signature }
5. User B scans QR code on their device
6. User B's frontend:
   a. Parses JSON payload from QR
   b. Verifies Ed25519 signature (tweetnacl) against walletA's public key
   c. Checks timestamp is within 60 seconds of current time
7. If valid, User B's frontend generates counter-challenge and signs via MWA
8. User B's frontend calls POST /api/meeting/create with both signatures
9. Backend:
   a. Verifies both Ed25519 signatures
   b. Checks: walletA !== walletB
   c. Checks: neither wallet exceeded 5 meetings today
   d. Checks: this pair hasn't met within 7 days
   e. Stores meeting record
   f. Updates meeting counts
   g. Recalculates trust scores for both wallets
10. Backend returns success + new scores
11. Both frontends display "Meeting Verified!" + updated scores
```

---

## 15. Caching Strategy

### Pre-Computed Demo Wallets

During development (Days 2-5), pre-analyze 10 interesting mainnet wallets:

| Wallet Type | Purpose in Demo |
|-------------|----------------|
| Active DeFi trader (high score) | Show full trust profile with diverse activity |
| NFT collector (medium score) | Show NFT-heavy profile with badges |
| DAO governor (high score) | Show governance participation |
| New wallet (low score) | Show how new users look |
| Whale wallet (high score) | Show significant holdings profile |
| Multi-protocol user (max diversity) | Show protocol diversity scoring |
| Minimal activity (low score) | Contrast with active wallets |
| Long history (OG badge) | Show Veteran/OG badges |
| 2 demo wallets for QR exchange | Live meeting demo between two profiles |

**Storage:** JSON files in the project, loaded at app startup.

### Cache Architecture

```typescript
interface CacheEntry {
  walletAddress: string;
  analysis: WalletAnalysis;
  profile: TrustProfile;
  cachedAt: string;           // ISO 8601
  expiresAt: string;          // ISO 8601 (cachedAt + 24 hours)
  source: 'precomputed' | 'live';
}
```

### Cache Behavior

| Scenario | Behavior |
|----------|----------|
| Wallet is pre-computed | Return cached data instantly. Never expires during hackathon. |
| Wallet was live-analyzed <24h ago | Return cached data. |
| Wallet was live-analyzed >24h ago | Refresh analysis from Helius APIs. |
| Wallet never analyzed | Perform live analysis (5-15 seconds). Cache result. |
| Helius API unavailable | Return stale cache if available. Show "last updated X hours ago." |
| No cache and API unavailable | Show error: "Unable to analyze wallet. Please try again later." |

### Cache Invalidation

- **Meeting events:** When a meeting is verified, update the `meetingCount` field and recalculate scores for both wallets without re-fetching on-chain data.
- **Manual refresh:** User can tap "Refresh" to force re-analysis (rate-limited to 1 per hour per wallet).
- **For hackathon:** Pre-computed wallets never expire. Live-analyzed wallets cache indefinitely.

---

## 16. Security Considerations

### Signature Verification

**Meeting challenges use Ed25519 signatures** — the same scheme used by Solana for transaction signing.

| Aspect | Detail |
|--------|--------|
| Algorithm | Ed25519 (via tweetnacl) |
| Message format | `{walletAddress}:{timestamp}:{nonce}` |
| Verification | Public key derived from wallet address. Signature verified client-side AND server-side. |
| Replay prevention | 60-second timestamp window + unique nonce per challenge |

### Anti-Spoofing

| Threat | Mitigation |
|--------|------------|
| Fake QR codes (forged signatures) | Ed25519 signature verification rejects any payload not signed by the claimed wallet's private key |
| Replay attacks (reusing old QRs) | 60-second expiry + unique nonce per challenge |
| Remote meeting farming (sharing QR over internet) | 60-second expiry makes time-of-flight attacks impractical for remote sharing |
| Self-meeting farming | Server rejects `walletA === walletB` |
| Colluding pair farming | 7-day cooldown between same pair; max 10 physical meeting points caps incentive |
| Bot meeting farming | SGT gate means every participant must own a $500 Seeker device |
| Man-in-the-middle on QR exchange | Signatures are wallet-specific; intercepted QR is useless without the private key |

### Devnet vs Mainnet

| Component | Network | Rationale |
|-----------|---------|-----------|
| SGT check | Mainnet (production) / Devnet (hackathon mock) | Real SGT is on mainnet; devnet uses mock token |
| Wallet analysis | **Mainnet** (read-only) | Real wallet data requires mainnet queries |
| Meeting records | Backend database (off-chain) | No on-chain program needed for hackathon |
| App deployment | Devnet (if any on-chain components) | Standard hackathon practice |

**Important:** Wallet analysis queries mainnet Helius API **read-only**. The app never writes to mainnet. This is standard cross-network architecture and is explicitly allowed.

### Data Privacy

| Data | Storage | Access |
|------|---------|--------|
| Wallet addresses | Backend cache | Public (same as on-chain) |
| Transaction history | Cached analysis | Public (same as on-chain) |
| Trust scores | Backend cache | Public (queryable by any user) |
| Meeting records | Backend database | Public (wallet addresses visible) |
| AI summaries | Backend cache | Public (displayed on profiles) |
| Private keys | **NEVER touches the app** | Signing happens in Seed Vault/MWA |

*All analyzed data is already publicly available on-chain. TrustTap+ aggregates and presents it — it does not expose any private information.*

### API Security (Hackathon Scope)

| Measure | Implementation |
|---------|---------------|
| Rate limiting | Basic in-memory rate limiting on all endpoints |
| Input validation | Validate wallet address format (Base58, 32-44 chars) on all endpoints |
| Signature verification | Server-side Ed25519 verification on meeting creation |
| CORS | Restrict to app origin |
| HTTPS | Required for MWA to function |

*Production would add: API keys, JWT auth, DDoS protection, database encryption. Out of scope for hackathon.*

---

## 17. Hackathon Constraints

### What's Real vs. What's Mocked

| Component | Hackathon Reality | Production Reality |
|-----------|------------------|-------------------|
| **SGT verification** | Mock non-transferable token on devnet | Real SGT on mainnet (collection: `GT22s89nU4iWFkNXj1Bw6uYhJJWDRPpShHt4Bk8f99Te`) |
| **Wallet analysis** | Real mainnet data via Helius free tier (read-only) | Same, potentially with paid tier for higher throughput |
| **Trust score** | Real algorithm, real data | Same algorithm, potentially with ML refinements |
| **AI summary** | Real Groq API calls (Llama 3.1 8B Instant) | Same or upgraded model |
| **QR exchange** | Real cryptographic verification | Same, potentially with NFC as primary |
| **Meeting storage** | SQLite/JSON on local backend | Database with replication |
| **Sybil Shield** | Pre-generated demo data (1,000 wallets) | Live batch queries against real wallets |
| **Physical Seeker** | No physical device — browser/emulator only | Runs on actual Seeker hardware |

### What to Document in Submission

1. **SGT mock explanation:** "On devnet, we use a mock non-transferable token. Production uses the real SGT collection address `GT22s89nU4iWFkNXj1Bw6uYhJJWDRPpShHt4Bk8f99Te`."
2. **Cross-network architecture:** "Wallet analysis queries mainnet (read-only) for real data. App logic runs on devnet."
3. **Pre-computed wallets:** "10 mainnet wallets pre-analyzed for reliable demo. Live lookup supported for uncached wallets."
4. **PWA approach:** "Built as PWA (Next.js), wrappable as APK via Bubblewrap for dApp Store submission. Officially supported by Solana Mobile."

### Builder Constraints

| Constraint | Impact | Mitigation |
|-----------|--------|------------|
| No physical Seeker | Cannot test NFC, camera scanning on real hardware | PWA in browser. QR works in any browser. Paste fallback for demos. |
| $0 budget | No paid APIs, hosting, or tools | Helius free tier (1M credits/month). All tools are free. Local backend. |
| 9 days total | Tight timeline | Strict P0/P1/P2 prioritization. Feature freeze on Day 7. |
| Nigeria timezone | May not match judge availability | Pre-recorded demo videos. Async submission. |

---

## 18. Success Metrics

### Per-Feature "Done" Definition

| Feature | "Done" Means |
|---------|-------------|
| **SGT Gate** | Wallet connects, SGT checked, access granted/denied correctly. Error states handled. |
| **Wallet Analysis** | 7 dimensions extracted. Works for cached wallets instantly, live wallets within 15 seconds. Edge cases handled (empty wallet, large wallet). |
| **Trust Score** | Deterministic 0-100 score from analysis data. Correct label and color assignment. Score breakdown visible. |
| **AI Summary** | 2-3 sentence summary generated. Sybil assessment generated. Graceful fallback on API failure. |
| **QR Exchange** | QR generated with signed challenge. Camera scanning works. Signature verification works. Meeting stored. Scores update. Anti-gaming enforced. |
| **Sybil Shield** | Threshold slider works. Animated filtering demo runs. Results displayed correctly. |
| **Wallet Search** | Address input works. SGT check runs. Profile displayed for verified wallets. "Not verified" shown for others. |

### Demo Quality Metrics

| Criterion | Target |
|-----------|--------|
| Time from app open to trust profile visible | < 3 seconds (cached) |
| Time for QR meeting exchange (end-to-end) | < 30 seconds |
| Score dial animation smoothness | 60fps |
| AI summary generation | < 5 seconds |
| App responsiveness (no jank) | All interactions < 100ms response |
| Error states | Every error has a clear, actionable message |

### Hackathon Judging Alignment

| Judging Criterion (25% each) | How TrustTap+ Scores |
|------------------------------|---------------------|
| **Stickiness** | Multiple usage triggers: P2P trades (check counterparty), events (scan people), airdrops (verify eligibility), ego/status (score improvement). Not a one-time-use tool. |
| **UX** | Three-step core loop: Connect → See Score → Scan Others. Mobile-first PWA. Animated trust dial. Clear information hierarchy. |
| **Innovation** | Three-layer trust model (device + chain + physical) does not exist anywhere. Zero competition on Solana or any chain for this combination. |
| **Demo** | Four wow moments: (1) SGT verification + trust profile, (2) AI trust summary, (3) QR meeting exchange between two windows, (4) Sybil Shield filtering. |

---

## 19. 9-Day Build Timeline

### Day 1 (March 1): Foundation — CRITICAL

**Gate:** If wallet connection doesn't work by EOD → investigate morning of Day 2, PWA fallback confirmed by noon.

| Task | Time | Deliverable |
|------|------|------------|
| Scaffold Next.js PWA project | 1 hour | Project structure, package.json, Tailwind configured |
| Mobile Wallet Adapter integration | 2 hours | Wallet connects via MWA in Chrome |
| Helius API setup + DAS API test | 1 hour | Free tier key, successful SGT check call |
| SGT verification gate implementation | 2 hours | Connect → SGT check → gate screen |
| Basic navigation (4 tabs) | 2 hours | Tab bar with placeholder screens |
| **Deliverable** | | App runs in browser, wallet connects, SGT verified |

### Day 2 (March 2): Wallet Analysis Engine

| Task | Time | Deliverable |
|------|------|------------|
| `getSignaturesForAddress` implementation | 2 hours | Wallet age + transaction count |
| `parse-transactions` integration | 3 hours | Protocol diversity, DeFi engagement, governance |
| `getAssetsByOwner` for NFTs + blue-chip detection | 2 hours | NFT count, blue-chip identification |
| SNS SDK / domain lookup | 1 hour | .sol domain detection |
| Pre-compute analysis for 10 mainnet wallets | 2 hours | Cached JSON files for demo wallets |
| **Deliverable** | | Wallet data fetched, parsed, and cached for demo wallets |

### Day 3 (March 3): Trust Score + Backend

**Gate:** If wallet analysis isn't working → pivot to Sybil Shield standalone (simpler scope).

| Task | Time | Deliverable |
|------|------|------------|
| Express.js backend server setup | 1 hour | Server running, routes defined |
| Trust score algorithm implementation | 2 hours | 0-100 scoring from WalletAnalysis |
| Badge system implementation | 1 hour | Badge criteria evaluation |
| Score caching layer (SQLite/JSON) | 2 hours | Cache read/write working |
| API endpoints: /api/analyze-wallet, /api/profile | 2 hours | Endpoints returning data |
| **Deliverable** | | Trust scores computed, backend serves cached profiles |

### Day 4 (March 4): AI Summary + Trust Profile UI

| Task | Time | Deliverable |
|------|------|------------|
| Groq API integration (trust summary) | 2 hours | AI summaries generating |
| Groq API integration (Sybil detection) | 1 hour | Bot/human assessment working |
| Trust Profile screen UI | 4 hours | Score dial, breakdown chart, badges, AI text, meeting history |
| Loading states + empty states | 1 hour | Graceful UX for all states |
| Pre-generate AI summaries for demo wallets | 1 hour | Cached summaries for instant demo |
| **Deliverable** | | Beautiful trust profile with AI-generated summary |

### Day 5 (March 5): QR Meeting Exchange

| Task | Time | Deliverable |
|------|------|------------|
| QR code generation (signed challenge) | 2 hours | QR displayed with payload |
| QR scanner (html5-qrcode + camera) | 2 hours | Camera scanning works |
| Paste fallback implementation | 1 hour | JSON paste input functional |
| Signature verification (tweetnacl) | 1 hour | Ed25519 verification working |
| Backend: meeting creation + anti-gaming | 2 hours | Meeting stored, rules enforced |
| Meeting history on profile | 1 hour | Meetings displayed on profile |
| **Deliverable** | | Two browser windows can exchange trust data, create verified meetings |

### Day 6 (March 6): Sybil Shield + Search + Polish

| Task | Time | Deliverable |
|------|------|------------|
| Sybil Shield dashboard UI | 3 hours | Threshold slider, animated counters, results |
| Demo data for Sybil Shield (1,000 wallets) | 1 hour | Pre-generated dataset |
| Wallet search/lookup screen | 2 hours | Search bar, results display |
| Edge cases + error handling across app | 2 hours | All error states graceful |
| **Deliverable** | | Complete feature set, Sybil Shield working |

### Day 7 (March 7): Feature Freeze + Animations

**FEATURE FREEZE at end of day.** No new features after this.

| Task | Time | Deliverable |
|------|------|------------|
| Score dial animation (Framer Motion) | 2 hours | Smooth fill animation |
| Screen transitions | 1 hour | Polished navigation transitions |
| Meeting verified celebration animation | 1 hour | Confetti or success animation |
| Card/badge appearance animations | 1 hour | Staggered fade-in effects |
| Final bug fixes | 2 hours | All known bugs resolved |
| End-to-end demo flow practice | 1 hour | Full flow runs smoothly |
| **Deliverable** | | Polished, feature-complete app |

### Day 8 (March 8): Video Production

| Task | Time | Deliverable |
|------|------|------------|
| Record all demo flows (OBS / macOS screen record) | 2 hours | Raw footage of all features |
| Record voiceover narration (QuickTime) | 1 hour | Audio tracks for both videos |
| Edit pitch video (90 seconds) | 2 hours | Problem → Product → Trust Model → Sybil Shield → Close |
| Edit technical demo (90 seconds) | 2 hours | Architecture → SGT → Trust Engine → QR Exchange |
| Add device frame overlays (Mock.video) | 30 min | Phone frames around screen recordings |
| Write submission copy (name, description, problem statement) | 1 hour | Submission text ready |
| **Deliverable** | | Both videos complete, submission copy written |

### Day 9 (March 9): Submit

| Task | Time | Deliverable |
|------|------|------------|
| Final review of all materials | 1 hour | Everything checked |
| Submit to hackathon platform | 30 min | Submission live |
| Optional: Bubblewrap APK wrap for dApp Store | 2 hours | APK generated (bonus) |
| Optional: Share build thread on Twitter | 1 hour | Public visibility (bonus) |
| **Deliverable** | | **SUBMITTED** |

---

## 20. Risk Register

| # | Risk | Probability | Impact | Mitigation | Trigger |
|---|------|------------|--------|------------|---------|
| 1 | **Helius API rate limits during demo** | Medium | High | Pre-compute all demo wallets. Cache aggressively. Demo reads from cache = zero API calls. | API returns 429 during development |
| 2 | **MWA wallet connection fails in Chrome** | Low | Critical | MWA is officially supported in Chrome on Seeker. Test early Day 1. Fallback: hardcoded demo wallet for video recording. | Connection fails after 2 hours of debugging |
| 3 | **SGT not available on devnet** | Medium | High | Mint mock non-transferable token on devnet. Document that production uses real SGT. | Cannot find SGT on devnet |
| 4 | **Trust score gaming (fake meetings)** | Low (hackathon) | Medium | Rate limits, cooldowns, score caps implemented. Document anti-gaming design in submission. | Not applicable during hackathon |
| 5 | **Groq API latency or failure** | Low | Medium | Pre-generate summaries for all demo wallets. AI summary is P1, not P0 — app works without it. | API response > 10 seconds |
| 6 | **QR camera scanning fails in browser** | Medium | Medium | Paste fallback is the demo-safe path. Camera scanning is the "real" path. Both use identical verification. | Camera API permission issues |
| 7 | **Scope creep** | Medium | High | Strict P0/P1 prioritization. Feature freeze Day 7. If a P1 feature is at risk, cut it. | Behind schedule by end of Day 4 |
| 8 | **Video quality insufficient** | Medium | Medium | Screen recordings + voiceover. Clean, concise. No face cam needed. Practice flow before recording. Use Mock.video for device frames. | First recording attempt looks rough |
| 9 | **Last-minute competitor submits trust/reputation app** | Low | Medium | Three-layer model (device + chain + physical) is unique. Even if someone builds "reputation," they won't have SGT + physical meetings. | See similar submission on Day 8-9 |
| 10 | **Backend crashes during demo** | Low | High | Pre-computed data means app can work entirely from cache. Backend is stateless — restart takes 2 seconds. | Server error during video recording |
| 11 | **Helius free tier credits exhausted** | Low | High | Budget: ~5,110 credits for 10 wallets = 0.5% of 1M monthly credits. Even 100 wallets would use <5%. | Credit counter drops below 50% |
| 12 | **Next.js PWA doesn't work well on mobile** | Low | Medium | Next.js PWA is a well-established pattern. Test on mobile browser early. Responsive design from Day 1. | Layout breaks on mobile viewport |

### Fallback Plan

**If by end of Day 3 the wallet analysis engine isn't working:**

Pivot to **Sybil Shield Standalone** — a focused SGT-gated airdrop claim platform.
- Drop trust scoring, keep SGT gating
- "1 SGT = 1 human = 1 fair claim"
- Same shocking stat, simpler scope, still wins on innovation
- 6 remaining days is enough for a polished focused product

---

## 21. Future Roadmap

> **These features are NOT being built for the hackathon.** Listed for context and submission narrative only.

### Phase 2: Enhanced Trust Layers
- **NFC Tap-to-Meet:** Physical phone tap replaces QR scanning (uses HCE card emulation)
- **SAS Integration:** Publish trust scores as Solana Attestation Service attestations, making them composable across any Solana dApp
- **SKR Rewards:** Users earn SKR tokens for verified meetings. Projects stake SKR to list their airdrop on TrustTap's filtered distribution platform.
- **Biometric Enforcement:** Require Seed Vault fingerprint for each meeting attestation (ensures device owner, not just device, is present)

### Phase 3: Ecosystem Infrastructure
- **Trust API:** Public API for any project to query TrustTap scores (e.g., DEXs show trust scores on P2P order books)
- **DAO Integration:** Gate governance participation by trust threshold for Sybil-free voting
- **Lending Signals:** Trust scores as informal credit scoring for P2P lending protocols
- **Marketplace Badges:** NFT marketplaces display seller trust scores

### Phase 4: Privacy & Scale
- **ZK Trust Proofs:** Prove "my trust score is above X" without revealing the exact score (using zkSNARKs)
- **Cross-Chain Expansion:** Analyze wallets across Ethereum, Base, Arbitrum (via cross-chain indexing)
- **Social Graph:** EigenTrust-inspired transitive trust (if A trusts B and B trusts C, compute A's trust in C)
- **Decentralized Storage:** Move trust profiles on-chain with SAS attestations

### Phase 5: Network Effects
- **Trust-Gated Communities:** Telegram/Discord bots that verify TrustTap scores for group access
- **Event Integration:** Event organizers use TrustTap for token-gated access with hardware verification
- **Trust Marketplace:** Projects compete for verified user attention by offering higher rewards to high-trust users

---

## 22. Glossary

| Term | Definition |
|------|-----------|
| **SGT (Seeker Genesis Token)** | A soulbound (non-transferable) NFT minted during Solana Seeker setup. Proves ownership of a genuine Seeker device. Cannot be sold, transferred, or duplicated. One per device. |
| **MWA (Mobile Wallet Adapter)** | Solana Mobile's protocol for connecting mobile dApps to wallet apps. Works in both native apps and Chrome browser on Seeker. |
| **DAS (Digital Asset Standard) API** | Helius API for querying NFTs and digital assets on Solana. Used for SGT checks and NFT holdings analysis. |
| **Seed Vault** | Seeker's Trusted Execution Environment (TEE) that isolates private keys from Android. Biometric-gated. Keys never leave the hardware enclave. |
| **Soulbound** | A token that cannot be transferred from the wallet it was minted to. Coined by Vitalik Buterin. SGT is soulbound. |
| **Sybil Attack** | Creating many fake identities to gain disproportionate influence or rewards. Named after the book "Sybil" about dissociative identity disorder. |
| **Ed25519** | The digital signature algorithm used by Solana. Provides fast, secure signing and verification of messages. |
| **TEE (Trusted Execution Environment)** | Hardware-isolated area of a processor where sensitive computations run, protected from the main operating system. Seeker's Seed Vault runs inside a TEE. |
| **PWA (Progressive Web App)** | A web application that uses modern web capabilities to deliver app-like experiences. Can be installed on the home screen, work offline, and access device hardware. |
| **Bubblewrap** | Google's CLI tool for wrapping PWAs as Android APKs (TWA — Trusted Web Activity). Produces installable APK from a web URL. |
| **Helius** | The leading Solana RPC and data API provider. Powers TrustTap's wallet analysis via their free tier (1M credits/month). |
| **Base58** | The encoding format used for Solana wallet addresses and signatures. Alphanumeric characters excluding 0, O, I, l to avoid visual confusion. |
| **SKR** | Seeker Rewards token. Solana Mobile's governance token for the Seeker ecosystem. Separate $10K hackathon prize. |
| **SAS (Solana Attestation Service)** | Solana's native protocol for verifiable credentials/attestations. Launched May 2025. TrustTap could publish trust scores as SAS attestations (future roadmap). |
| **Nonce** | A random value used once in a cryptographic protocol. In TrustTap, each QR challenge includes a nonce (UUID) to prevent replay attacks. |
| **Anti-Gaming** | Rules designed to prevent users from artificially inflating their trust scores. Includes rate limits, cooldowns, and score caps. |
| **Blue-Chip NFT** | High-value, well-established NFT collections. On Solana: Mad Lads, Tensorians, etc. Holding blue-chips contributes to trust score. |
| **HCE (Host Card Emulation)** | Android feature where a phone emulates an NFC card. Enables phone-to-phone NFC communication. Stretch goal for TrustTap. |
| **EigenTrust** | A reputation algorithm from Stanford designed for P2P networks. Computes global trust scores from local trust relationships. Future roadmap for TrustTap's social graph. |
| **SNS (Solana Name Service)** | The .sol domain name system on Solana. Ownership of a .sol domain contributes to the Digital Identity dimension of the trust score. |
| **SPL Governance** | Solana's on-chain governance program used by Realms DAOs. DAO votes cast through this program contribute to the trust score. |

---

## Appendix A: Competition Analysis

| Competitor | Chain | What They Do | What TrustTap+ Has That They Don't |
|-----------|-------|-------------|-----------------------------------|
| **Civic** | Solana | Identity verification (binary yes/no) | Reputation scoring (0-100), physical meetings, mobile-first |
| **Trusta Labs** | EVM (expanding to Solana via SAS) | On-chain scoring (MEDIA score) | Device attestation (SGT), physical meeting layer, mobile app |
| **Gitcoin Passport** | Ethereum | Web2+Web3 stamps (27 providers) | Purely on-chain, hardware-backed, no web2 dependency |
| **DegenScore** | Ethereum | Activity scoring | Multi-chain (Solana), trust not just activity, physical layer |
| **Worldcoin** | Ethereum | Iris biometric scanning | No special hardware needed (just Seeker), Solana-native |
| **OpenRank/Karma3** | Multi | Social graph trust (EigenTrust) | Device attestation, physical meetings, mobile-first |
| **Galxe** | Multi | Activity-based scoring | Solana-mobile-specific, hardware-backed, physical meetings |

**In the MONOLITH hackathon:** ~11 submissions, ZERO doing trust/reputation. Blue ocean.

---

## Appendix B: Video Production Plan

### Video 1: Pitch (90 seconds)

| Timestamp | Content | Visual |
|-----------|---------|--------|
| 0:00-0:15 | **THE HOOK:** "Sybil wallets stole 49% of Arbitrum's airdrop — $600M+ from real users." / "17,000 real users lost $18.6M on Optimism." / "In crypto, we say 'don't trust, verify.' But we have no tools to verify the PERSON." | Dark background, white text fading in. Stats appear one by one. |
| 0:15-0:45 | **THE PRODUCT:** Show app opening. Wallet connects. SGT verified. Trust profile appears with score of 78/100. "Your trust score is built from real data: wallet age, DeFi activity, NFT holdings, governance..." Then: QR exchange between two devices. "Proof that you've physically met other verified Seeker owners." | Live app footage with device frame overlay. Two windows side-by-side for QR exchange. |
| 0:45-1:10 | **THE TRUST MODEL:** Three-layer diagram. "Layer 1: SGT — hardware-backed proof of personhood. Layer 2: On-chain behavior — analyzed by AI. Layer 3: Physical verification — real-world encounters bots can never fake." Then: AI summary generating in real-time. | Animated diagram. Live AI summary generation. |
| 1:10-1:25 | **SYBIL SHIELD:** "Projects use TrustTap to filter bots. One SGT, one human, one fair claim." Counter: 1,000 → 340 verified. | Animated filtering visualization. |
| 1:25-1:30 | **CLOSE:** "TrustTap. Your reputation. Hardware-verified. One scan at a time." | Logo. |

### Video 2: Technical Demo (90 seconds)

| Timestamp | Content | Visual |
|-----------|---------|--------|
| 0:00-0:15 | **ARCHITECTURE:** "Built as Next.js PWA with Solana Mobile Stack. Trust engine queries Helius DAS API and parses transactions in real-time." | Architecture diagram. |
| 0:15-0:35 | **SGT VERIFICATION:** "Wallet connects via MWA. We query Helius DAS API for SGT using the collection group address. One call. No SGT = gated." | Code snippet → live demo showing SGT check. |
| 0:35-0:55 | **TRUST ENGINE:** "Seven dimensions: device, age, activity, diversity (11 protocols by program ID), DeFi, identity, physical meetings." AI summary generation. | Score breakdown chart populating. AI text appearing. |
| 0:55-1:15 | **QR MEETING EXCHANGE:** "Time-limited, wallet-signed challenges. User A generates QR with address, timestamp, nonce, Ed25519 signature. User B scans, verifies, counter-signs. Backend stores mutual attestation." | Two browser windows. Full QR exchange flow. |
| 1:15-1:30 | **INTEGRATION:** "SGT verification, Helius wallet analysis, Ed25519 meeting attestations. Anti-gaming: 5/day cap, 7-day cooldown, 60s expiry. Built for Solana Attestation Service composability." | Integration diagram. |

---

## Appendix C: Key Technical References

| Resource | URL |
|----------|-----|
| Solana Mobile Docs — SGT | https://docs.solanamobile.com/marketing/engaging-seeker-users |
| Helius DAS API Docs | https://www.helius.dev/docs/das-api |
| Helius Token Gating Tutorial | https://www.helius.dev/blog/token-gating-on-solana-mobile-tutorial |
| SAS Official Site | https://attest.solana.com/ |
| Mobile Wallet Adapter Docs | https://docs.solanamobile.com/react-native/using_mobile_wallet_adapter |
| MONOLITH Hackathon | https://solanamobile.radiant.nexus/ |
| Solana Realms (DAO Governance) | https://realms.today/ |
| SNS (.sol domains) | https://sns.guide/ |
| tweetnacl (Ed25519) | https://www.npmjs.com/package/tweetnacl |
| html5-qrcode | https://www.npmjs.com/package/html5-qrcode |
| Bubblewrap CLI | https://github.com/nicbarker/nicbarker.github.io |

---

*This PRD is the single source of truth for TrustTap+ implementation. Visual design is handled separately — see Design System. All data in this document is from verified research. Items marked "TBD" require further investigation before implementation.*
