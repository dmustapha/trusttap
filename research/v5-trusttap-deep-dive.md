# TrustTap Deep Dive: On-Chain Reputation for Solana Seeker
**Research Date:** February 28, 2026
**Hackathon:** MONOLITH Solana Mobile Hackathon (Deadline: March 9, 2026)
**Time Remaining:** ~9 days

---

## Table of Contents
1. [Existing On-Chain Reputation Systems](#1-existing-on-chain-reputation-systems)
2. [Trust Data Sources for Seeker Owners](#2-trust-data-sources-for-seeker-owners)
3. [NFC + Physical Presence as Trust Signal](#3-nfc--physical-presence-as-trust-signal)
4. [SGT as Trust Foundation](#4-sgt-seeker-genesis-token-as-trust-foundation)
5. [Feasibility for 9-Day Hackathon](#5-feasibility-for-9-day-hackathon)
6. [Use Cases for Crypto-Native Users](#6-use-cases-for-crypto-native-users)
7. [Competition Check](#7-competition-check)
8. [Recommended Architecture](#8-recommended-architecture)
9. [The Killer Insight](#9-the-killer-insight)

---

## 1. Existing On-Chain Reputation Systems

### On Solana

#### Solana Attestation Service (SAS)
- **What:** An open, permissionless protocol for verifiable credentials, live on Solana mainnet (launched May 2025).
- **How it works:** Trusted issuers create attestations about wallets using predefined schemas. Attestations include a wallet address, a claim (e.g., "is accredited"), metadata, and an issuer signature. Solana stores the proof on-chain, queryable with a single SDK call.
- **Architecture:** Three participants -- Issuers (create attestations), Holders (wallet owners), Verifiers (dApps that check attestations).
- **Uses:** KYC checks, geographic eligibility, membership, accreditation status, credit worthiness for DeFi lending.
- **Founding members:** Civic, Solana.ID, SOL.ID, Cogni, Trusta Labs, Wecan, Range, Polyflow, Bluprynt, Roam.
- **Relevance to TrustTap:** SAS is the NATIVE infrastructure for on-chain trust on Solana. TrustTap could issue trust score attestations via SAS, making them interoperable with the entire Solana ecosystem. This is a massive advantage -- we wouldn't be building in isolation.
- **Source:** [Solana Attestation Service](https://solana.com/news/solana-attestation-service), [Range Security Blog](https://www.range.org/blog/introducing-solana-attestation-service), [SAS Official](https://attest.solana.com/)

#### Civic (on Solana)
- **What:** Leading decentralized identity verification on Solana. Processes 2M+ verifications.
- **How it works:** Civic Pass is a non-transferable attestation token. Off-chain verification (KYC/AML) produces on-chain cryptographic attestation. Real-time processing, most verifications under 30 seconds.
- **Key feature:** Keeps sensitive data off-chain, stores only cryptographic proofs on-chain.
- **Scale:** Secures $500M+ in TVL across integrated protocols.
- **Relevance:** Civic solves identity verification but NOT reputation. TrustTap would sit on top of identity -- "We know you're a real person (Civic), but how TRUSTWORTHY are you?"
- **Source:** [Civic on Solana](https://solana.com/ecosystem/civic), [Civic joins SAS](https://www.biometricupdate.com/202505/civic-joins-solana-attestation-service-for-solid-foundation-for-verifiable-credentials)

#### Trusta Labs (on Solana via SAS)
- **What:** Largest Identity and On-Chain Reputation Protocol. Founding SAS member.
- **Products:**
  - **TrustScan:** Sybil detection engine using behavior fingerprinting and clustering algorithms. Used by Celestia, Starknet, Arbitrum.
  - **TrustGo / MEDIA Score:** Wallet intelligence and credit scoring. MEDIA = Monetary activity, Engagement, Diversity, Identity, Age.
  - **Trusta Agent:** Proof-of-Humanity and Proof-of-AI-Agent attestation.
- **Scale:** 3M+ attestations issued to 2.2M users across EVM chains and TON.
- **Relevance:** Trusta's MEDIA score framework is essentially what we'd be building for Solana mobile users. Their approach validates the concept. The key difference: TrustTap would add PHYSICAL PRESENCE (NFC/proximity) and DEVICE ATTESTATION (SGT) as trust layers that Trusta can't offer.
- **Source:** [Trusta on SAS](https://attest.solana.com/use-cases/trusta), [TrustScan Docs](https://trustalabs.gitbook.io/trustscan)

### On Other Chains

#### Gitcoin Passport
- **How it works:** Aggregates "stamps" from 27 identity providers (Twitter, Google, BrightID, Proof of Humanity, LinkedIn, CoinBase, etc.) with 60 unique tasks/credentials. Each stamp is a Verifiable Credential (VC). Stamps are weighted and aggregated into a score (max 100). Minimum 20 needed for Gitcoin Grants donation matching.
- **Strengths:** Multi-source verification makes it hard to fake. Well-established.
- **Weaknesses:** Heavily web2-dependent (Google, Twitter). Score can be gamed by creating accounts on multiple platforms. Not on-chain native.
- **Source:** [Gitcoin Passport Score Calculation](https://support.gitcoin.co/gitcoin-knowledge-base/gitcoin-passport/common-questions/how-is-gitcoin-passports-score-calculated), [Passport Docs](https://docs.passport.gitcoin.co/building-with-passport/major-concepts)

#### DegenScore
- **How it works:** Tracks Ethereum wallet activities -- trading, liquidity provision, NFT engagement. Auto-calculates score from past on-chain activity. Score 700+ earns a mintable "DegenScore Beacon" NFT unlocking exclusive opportunities.
- **Strengths:** Purely on-chain, no KYC, privacy-preserving. Rewards actual DeFi activity.
- **Weaknesses:** Ethereum-only. Measures "degen-ness" not trustworthiness. Can be gamed with wash trading.
- **Source:** [DegenScore Overview](https://getblock.io/marketplace/projects/degenscore/)

#### Karma3 Labs / OpenRank
- **What:** Decentralized reputation protocol using the EigenTrust algorithm (originally from Stanford, designed for P2P file-sharing network trust).
- **How EigenTrust works:**
  1. Each peer calculates local trust values for peers it has interacted with.
  2. Values are normalized to prevent manipulation.
  3. Trust scores are iteratively computed along transitive chains (if A trusts B and B trusts C, A has some trust in C).
  4. Converges to stable global trust scores weighted by assigner reputation.
- **Integrations:** Ranking and recommendation APIs for Farcaster and Lens Protocol. Used for profile rankings, "For You" feeds, channel rankings.
- **Funding:** $4.5M seed from Galaxy and IDEO CoLab.
- **Relevance:** The EigenTrust model is powerful for social trust networks. TrustTap could implement a simplified version where "taps" (physical meetings) create trust edges in a graph.
- **Source:** [OpenRank](https://openrank.com/), [EigenTrust Docs](https://docs.openrank.com/reputation-algorithms/eigentrust), [Karma3 Labs](https://karma3labs.com/)

#### Galxe
- **What:** Web3 growth and reputation platform.
- **How it works:** Galxe Score evaluates users based on on-chain activities, project participation, and web3 community engagement. Uses Zero-Knowledge Proofs for privacy. Humanity Score earned through token trading, social media linking, and optional facial recognition.
- **Source:** [Galxe Score](https://www.galxe.com/score)

#### Worldcoin (World ID)
- **What:** Proof-of-personhood via iris biometric scanning (the "Orb").
- **How it works:** Iris scan creates unique hash. Verified via Semaphore ZK protocol on Ethereum -- proves membership in "verified humans" set without revealing which human.
- **Relevance:** Extreme approach to Sybil resistance. TrustTap's SGT serves a similar function (proves real device owner) without requiring iris scans.
- **Source:** [Worldcoin Explained](https://www.datawallet.com/crypto/worldcoin-explained)

### Summary: What Works and What Doesn't

| System | Trust Source | Strength | Weakness |
|--------|------------|----------|----------|
| SAS | Issuer attestations | Native Solana, composable | No scoring algorithm built in |
| Civic | KYC verification | Strong identity, fast | Binary (verified/not), no reputation |
| Trusta MEDIA | On-chain behavior | Multi-dimensional scoring | No physical/device layer |
| Gitcoin Passport | Web2+Web3 stamps | Multi-source | Web2-dependent, gameable |
| DegenScore | On-chain activity | Pure on-chain | Ethereum-only, measures activity not trust |
| OpenRank/EigenTrust | Social graph + interactions | Transitive trust, elegant math | Requires existing social graph |
| Galxe | Activity + participation | Wide ecosystem | Generic, not Solana-specific |
| Worldcoin | Biometric (iris) | Strongest Sybil resistance | Hardware-dependent, privacy concerns |

**The Gap TrustTap Fills:** No existing system combines on-chain behavior analysis + device attestation (SGT) + physical presence verification on Solana Mobile. This is a unique three-layer trust model.

---

## 2. Trust Data Sources for Seeker Owners

### Layer 1: Wallet Identity & Age

| Signal | How to Query | Reliability as Trust Signal | Gameable? |
|--------|-------------|---------------------------|-----------|
| Wallet age (first tx date) | Helius `getTransactionsForAddress` with `sortOrder: "asc"`, limit: 1 | HIGH -- old wallets are hard to fake | LOW -- requires time, can buy old wallets but rare |
| Total transaction count | Helius `getTransactionsForAddress` with pagination | MEDIUM -- activity indicates real usage | MEDIUM -- can spam cheap txs |
| SOL balance / staked SOL | Solana RPC `getBalance` + `getStakeActivation` | MEDIUM -- shows economic commitment | MEDIUM -- can temporarily park SOL |
| .sol domain ownership | SNS SDK lookup | MEDIUM -- shows identity investment | LOW -- costs money |

### Layer 2: DeFi Activity

| Signal | How to Query | Reliability | Gameable? |
|--------|-------------|-------------|-----------|
| Jupiter swap history | Helius enhanced transactions, filter by Jupiter program IDs | HIGH -- real trading activity | MEDIUM -- wash trading possible |
| Marinade staking | Check mSOL token account | HIGH -- locked capital = commitment | LOW -- requires real SOL |
| Raydium LP positions | Check LP token accounts, Bitquery GraphQL API | HIGH -- liquidity provision = serious user | LOW -- requires capital |
| Number of unique protocols used | Parse transaction history for known program IDs | HIGH -- diversity hard to fake | MEDIUM -- can interact minimally |
| Lending/borrowing (Solend, Marginfi) | Check protocol-specific token accounts | HIGH -- shows financial sophistication | LOW -- requires collateral |

### Layer 3: NFT & Digital Identity

| Signal | How to Query | Reliability | Gameable? |
|--------|-------------|-------------|-----------|
| NFT collection holdings | Helius DAS API `getAssetsByOwner` | MEDIUM -- shows cultural engagement | MEDIUM -- can buy cheap NFTs |
| Blue-chip NFT holdings (Mad Lads, etc.) | DAS API with collection filter | HIGH -- expensive to fake | LOW -- costs real money |
| Creator history (minted NFTs) | DAS API checking creator field | HIGH -- shows builder activity | LOW -- requires effort |
| .sol domain | SNS SDK | MEDIUM | LOW |

### Layer 4: Governance & Community

| Signal | How to Query | Reliability | Gameable? |
|--------|-------------|-------------|-----------|
| Realms DAO votes cast | SPL Governance program account queries | HIGH -- shows active participation | MEDIUM -- can vote on anything |
| Proposals created | SPL Governance program | VERY HIGH -- creation requires deeper engagement | LOW |
| Multi-sig membership (Squads) | Check Squads program accounts | HIGH -- shows trusted by others | LOW |

### Layer 5: Seeker-Specific Signals

| Signal | How to Query | Reliability | Gameable? |
|--------|-------------|-------------|-----------|
| SGT ownership | Helius DAS API / `getTokenAccountsByOwner` for mint authority `GT2zuHVaZQYZSyQMgJPLzvkmyztfyXg2NJunqFp4p3A4` | VERY HIGH -- proves real Seeker device | VERY LOW -- soulbound, one per device |
| SKR token holdings | Standard SPL token check | MEDIUM -- shows ecosystem buy-in | MEDIUM -- can buy on market |
| dApp Store interaction history | Would need custom indexing | HIGH | LOW |
| Seed Vault usage (vs external wallet) | Cannot directly verify from outside | N/A | N/A |

### Layer 6: Social & Messaging

| Signal | How to Query | Reliability | Gameable? |
|--------|-------------|-------------|-----------|
| Dialect message history | Dialect SDK (if exposed) | LOW -- easy to spam | HIGH |
| Backpack profile | Would need Backpack API | MEDIUM | MEDIUM |
| On-chain social follows | Depends on protocol | LOW-MEDIUM | MEDIUM |

### API Access Summary

| API/Service | What It Provides | Free Tier? | Complexity |
|-------------|-----------------|------------|------------|
| **Helius RPC** | Transaction history, DAS API (NFTs, tokens), enhanced transactions | Yes (limited), Dev plan for gTFA | LOW -- excellent docs, SDK available |
| **Helius DAS API** | NFT ownership, collection data, token metadata | Yes | LOW |
| **Solana RPC** | Balances, stake accounts, program accounts | Yes (public nodes) | LOW |
| **Bitquery** | DeFi activity, DEX trades, LP positions | Free tier available | MEDIUM -- GraphQL queries |
| **Solscan Pro API** | Wallet swap history, DeFi activities by platform | Paid | MEDIUM |
| **SNS SDK** | .sol domain lookups | Free (on-chain) | LOW |
| **SPL Governance** | DAO votes, proposals | Free (on-chain) | MEDIUM -- need to understand program structure |

### Helius: The Primary Data Source

Helius is the clear winner for hackathon speed. Key endpoints:

1. **`getTransactionsForAddress`** (gTFA) -- Gets full wallet transaction history with filtering by time, slot, status. Supports sorting oldest/newest first. Up to 1,000 signatures or 100 full transactions per request. Requires Developer plan ($49/mo). 100 credits per request.

2. **DAS API `getAssetsByOwner`** -- Returns all NFTs and tokens owned by a wallet. Fastest way to check SGT ownership, NFT holdings, token balances.

3. **Enhanced Transactions API** -- Decodes raw transactions into human-readable format with token transfers, instruction types. Can identify what protocols a wallet has interacted with.

**Cost for hackathon:** Helius Developer plan at $49/month is sufficient. Free tier works for DAS API calls but gTFA requires paid plan.

---

## 3. NFC + Physical Presence as Trust Signal

### The State of Phone-to-Phone NFC

**Android Beam is dead.** Deprecated in Android 10, replaced by Nearby Share (now "Quick Share"). This means two Seeker phones CANNOT directly exchange data via the old NFC P2P protocol.

**However, there are working alternatives:**

#### Option A: Host Card Emulation (HCE) -- Phone-to-Phone NFC Still Works
- **How:** One phone acts as an NFC card (card emulation mode), the other acts as an NFC reader.
- **Technical:** Uses Application Protocol Data Units (APDUs) over ISO/IEC 7816-4. One app registers an Application ID (AID) via HCE service. The other app reads that AID.
- **Data capacity:** Small payloads (a few KB) -- enough for wallet addresses and signatures.
- **Proof it works:** GitHub repo [championswimmer/NFC-host-card-emulation-Android](https://github.com/championswimmer/NFC-host-card-emulation-Android) demonstrates bidirectional data transfer using NFC HCE on Android.
- **Complexity:** MEDIUM -- requires building both a card emulation service and a reader component. Both users need the TrustTap app installed.
- **UX:** User A opens app and taps "Share" (phone enters card emulation mode). User B opens app and taps "Receive" (phone enters reader mode). Phones touch. Data exchanges.
- **Caveat:** Google has been deprecating legacy HCE APIs in favor of Secure Element integration, but basic HCE still works on Android 14.

#### Option B: QR Code + Proximity (Simplest, Most Reliable)
- **How:** User A displays a QR code containing their wallet address + a signed challenge. User B scans it. Both apps confirm the exchange via on-chain or backend verification.
- **Complexity:** LOW -- camera + QR library, widely supported.
- **UX:** Less magical than NFC tap, but universally reliable.
- **Enhancement:** Could combine with Bluetooth Low Energy (BLE) proximity detection to verify the two devices are physically close (within ~10 meters).

#### Option C: NFC Tag as Personal Identity Card
- **How:** Each TrustTap user gets/creates a personal NFC tag (like an IYK card) that encodes their wallet address. Tapping someone's tag with your Seeker reads their identity.
- **Precedent:** IYK + POAP integration -- attendees tap IYK NFC discs/cards to mint POAPs at events. NFC chips have unique encryption keys and emit dynamic, expiring links.
- **Complexity:** LOW for reading tags, but requires physical NFC tags (cost/distribution problem for hackathon).
- **Source:** [IYK POAP Cards](https://iyk.app/shop/poap-card), [POAP Distribution Methods](https://blog.poap.xyz/distribution/)

### Proof of Physical Presence: How Others Do It

#### POAP (Proof of Attendance Protocol)
- Mints NFT badges as proof of event attendance.
- Distribution methods: QR codes, IYK NFC cards, secret word, delivery, website.
- Works on Ethereum (ERC-721). Would need Solana equivalent.
- **Relevance:** TrustTap "taps" are essentially mutual POAPs -- "I met this person."

#### Encointer (Proof of Personhood via Physical Meetings)
- Participants meet in small groups simultaneously at randomly-chosen locations to verify each other's physical presence.
- Uses the fact that humans can only be in one place at a time.
- **Relevance:** Validates the concept of physical meetings as trust signals.

#### Zupass (Zero-Knowledge Proof-Carrying Data)
- Software for storing cryptographically verifiable data.
- Uses zkSNARKs for private queries against user data.
- Built for Zuzalu community events.
- **Relevance:** Future TrustTap could use ZK proofs for privacy-preserving trust queries ("Does this person have a trust score above 70?" without revealing exact score).

### Recommended NFC Approach for Hackathon

**Primary: QR Code exchange** (guaranteed to work, fast to build).
**Stretch goal: HCE NFC tap** (more impressive for demo, higher complexity).
**Both create the same result:** A signed, mutual "proof of meeting" record.

### How a "Proof of Meeting" Would Work

```
1. User A opens TrustTap, taps "Meet Someone"
2. App generates a time-limited challenge signed with User A's private key
3. User B scans QR code (or NFC tap receives the challenge)
4. User B's app verifies the challenge, signs a counter-challenge
5. Both apps submit a "meeting attestation" to the backend/on-chain
6. Meeting record includes: wallet_A, wallet_B, timestamp, location_hash (optional), mutual signatures
7. Both users' trust scores get a "physical verification" boost
```

**Anti-gaming measures:**
- Rate limit: Max 5 meetings per day per wallet
- Cooldown: Can't re-meet the same wallet within 7 days
- Location diversity: Meetings from many unique locations score higher than same-spot farming
- Temporal: Each challenge expires in 60 seconds (prevents remote sharing)

---

## 4. SGT (Seeker Genesis Token) as Trust Foundation

### What SGT Is

- A **soulbound (non-transferable) NFT** that proves ownership of a genuine Solana Seeker device.
- Minted during Seeker setup as a "rite of passage."
- Each device gets exactly one SGT.
- Cannot be sold, transferred, or duplicated.

### Technical Details

- **Mint Authority:** `GT2zuHVaZQYZSyQMgJPLzvkmyztfyXg2NJunqFp4p3A4`
- **Metadata Address:** `GT22s89nU4iWFkNXj1Bw6uYhJJWDRPpShHt4Bk8f99Te`
- **Group Address:** `GT22s89nU4iWFkNXj1Bw6uYhJJWDRPpShHt4Bk8f99Te`
- **Token Extensions:** Metadata Pointer, Token Group Member, Pointer
- **Verification:** Use `getTokenAccountsByOwner` with the SGT mint authority, or Helius DAS API `getAssetsByOwner` filtering by the collection/group address.

### How to Check SGT Ownership (Code Pattern)

```typescript
// Using Helius DAS API
const response = await fetch('https://mainnet.helius-rpc.com/?api-key=YOUR_KEY', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 'sgt-check',
    method: 'getAssetsByOwner',
    params: {
      ownerAddress: walletAddress,
      page: 1,
      limit: 100
    }
  })
});

const assets = await response.json();
const hasSGT = assets.result.items.some(
  asset => asset.grouping?.some(
    g => g.group_value === 'GT22s89nU4iWFkNXj1Bw6uYhJJWDRPpShHt4Bk8f99Te'
  )
);
```

### Why SGT is the Perfect Trust Base Layer

1. **Sybil Resistance:** One SGT per physical device. Cannot be duplicated. Bots/emulators cannot get SGT.
2. **Cost of Attack:** Attacker would need to buy a $500 Seeker phone for each fake identity.
3. **Ecosystem Signal:** SGT proves the user invested $500+ in the Solana ecosystem.
4. **Device Attestation:** The Seeker's Trusted Execution Environment (TEE) keeps keys in a hardware-isolated Seed Vault. This means SGT-holding wallets have hardware-grade security, not just a MetaMask browser extension.

### SGT as TrustTap's Access Gate

**Proposition:** TrustTap requires SGT ownership to create a trust profile. This means:
- Every TrustTap user is a verified Seeker owner
- No bots, no emulators, no spoofed devices
- Minimum $500 skin-in-the-game
- The network starts with ~140,000+ genuine crypto-native users (estimated Seeker owners)

This alone differentiates TrustTap from every other reputation system: **hardware-backed identity as the foundation.**

### Bonus: SGT as Hackathon Judging Advantage

The MONOLITH hackathon specifically values Seeker-native features. Using SGT as a core mechanic demonstrates deep integration with the Solana Mobile stack, which is exactly what judges are looking for.

---

## 5. Feasibility for 9-Day Hackathon

### What's Realistically Buildable

| Component | Effort | Priority | Notes |
|-----------|--------|----------|-------|
| SGT verification gate | 2-3 hours | P0 (MUST) | Single API call to Helius DAS |
| Wallet analysis engine | 1-2 days | P0 (MUST) | Helius gTFA + DAS API. Parse tx history, count protocols, check NFTs |
| Trust score algorithm | 1 day | P0 (MUST) | Weighted formula from wallet data (see below) |
| Trust profile display | 1-2 days | P0 (MUST) | React Native UI showing score, badges, history |
| QR code meeting exchange | 1 day | P1 (SHOULD) | Camera + QR library + signature verification |
| Backend/API server | 1-2 days | P0 (MUST) | Store meeting records, cache trust scores |
| AI trust summary (Claude API) | 0.5 days | P1 (SHOULD) | Feed wallet data to Claude, get natural language summary |
| NFC HCE tap | 2-3 days | P2 (COULD) | Complex but impressive demo. Requires both HCE service + reader |
| SAS attestation integration | 1-2 days | P2 (COULD) | Issue trust scores as SAS attestations |
| On-chain trust records | 1-2 days | P2 (COULD) | Store meeting proofs on Solana |

### Minimum Viable Product (9-Day Sprint)

**Days 1-2: Foundation**
- Solana Mobile scaffold (React Native + Mobile Wallet Adapter)
- Helius API integration (DAS + gTFA)
- SGT verification gate
- Basic wallet data fetching

**Days 3-4: Trust Engine**
- Trust score algorithm (weighted formula)
- Parse wallet history for protocol diversity, age, volume
- Check NFT holdings, staking positions
- AI summary generation via Claude API

**Days 5-6: Meeting System + UI**
- QR code generation/scanning for "proof of meeting"
- Backend to store meeting records
- Trust profile screens (score, breakdown, history)
- Search/lookup other wallets

**Days 7-8: Polish + NFC Stretch Goal**
- UI refinement
- Attempt NFC HCE implementation
- Edge case handling
- Demo flow preparation

**Day 9: Demo Prep**
- Record demo video
- Write submission copy
- Bug fixes

### Simplest Trust Score Algorithm (V1)

```
BASE_SCORE = 0 (out of 100)

// Layer 1: Device Attestation (0-20 points)
+ 20 if SGT holder

// Layer 2: Wallet Age (0-15 points)
+ 0 if < 30 days
+ 5 if 30-90 days
+ 10 if 90-365 days
+ 15 if > 365 days

// Layer 3: Transaction Activity (0-15 points)
+ 5 if > 50 transactions
+ 10 if > 200 transactions
+ 15 if > 1000 transactions

// Layer 4: Protocol Diversity (0-15 points)
+ 3 per unique protocol used (max 15)
// Count: Jupiter, Raydium, Marinade, Orca, Tensor, Magic Eden, etc.

// Layer 5: DeFi Engagement (0-15 points)
+ 5 if has staked SOL
+ 5 if has LP positions
+ 5 if has lending/borrowing positions

// Layer 6: Digital Identity (0-10 points)
+ 5 if owns .sol domain
+ 3 if owns blue-chip NFTs
+ 2 if has DAO governance votes

// Layer 7: Physical Verification (0-10 points)
+ 2 per unique physical meeting (max 10)

TOTAL: 0-100
```

**Score Interpretation:**
- 0-20: Unverified (new or inactive wallet)
- 21-40: Basic (some on-chain history)
- 41-60: Established (active DeFi user)
- 61-80: Trusted (diverse activity + physical meetings)
- 81-100: Highly Trusted (deep ecosystem participant)

### AI Trust Summary (Claude API Integration)

Feed the wallet data into Claude API to generate a human-readable trust summary:

```typescript
const prompt = `Analyze this Solana wallet and generate a concise trust summary:

Wallet: ${address}
Age: ${walletAge} days
Transaction Count: ${txCount}
Protocols Used: ${protocols.join(', ')}
SOL Staked: ${stakedSol} SOL
NFT Holdings: ${nftCount} (including ${blueChipCount} blue-chip)
DAO Votes: ${daoVotes}
Physical Meetings: ${meetingCount}
SGT Holder: ${hasSGT}
Trust Score: ${trustScore}/100

Generate a 2-3 sentence summary of this wallet's trustworthiness
for a P2P crypto transaction. Mention red flags if any.`;
```

**Example output:** "This is a well-established Solana wallet active for 14 months with diverse DeFi activity across Jupiter, Marinade, and Raydium. The owner is a verified Seeker device holder who has physically met 12 other verified users. High confidence for P2P transactions."

**Feasibility:** Extremely high. Claude API call is simple, response is near-instant. Cost is negligible for a demo.

---

## 6. Use Cases for Crypto-Native Users

### Primary Use Cases (Day 1 Value)

#### 1. P2P OTC Trading Safety
- **The Problem:** In-person crypto trades (common in emerging markets and at events) have zero trust infrastructure. Scams are rampant -- fake payment proofs, chargeback fraud, triangle scams.
- **TrustTap Solution:** Before trading, scan the counterparty's QR code. See their trust score, wallet history, and meeting history. "This wallet has been active for 2 years, uses 7 DeFi protocols, has met 23 verified Seeker users, and has a trust score of 78/100."
- **Why it matters:** Transforms "anonymous stranger" into "verified ecosystem participant." Doesn't prevent all scams but dramatically reduces risk.

#### 2. Crypto Event Networking
- **The Problem:** At crypto conferences, hackathons, meetups -- you meet hundreds of people. Who is legit? Who's a scammer? Who's actually building?
- **TrustTap Solution:** Tap phones at events to create "proof of meeting" records. Build a verifiable social graph of real-world encounters. "Met at ETH Denver 2026" becomes a permanent, verifiable credential.
- **Why it matters:** Creates a new form of professional reputation specifically for the crypto world.

#### 3. NFT Trade Verification
- **The Problem:** NFT OTC trades (especially high-value) require trust. Discord DMs and Twitter interactions are easy to fake.
- **TrustTap Solution:** Verify the seller's on-chain history, NFT trading patterns, and physical meeting count. A seller with a high trust score and verified physical meetings is far more likely to be legitimate.

### Secondary Use Cases (Growth Phase)

#### 4. DAO/Group Membership Vetting
- Check potential members' trust scores before admitting them to DAOs, investment groups, or alpha groups.
- "This applicant has a trust score of 85 with 15 physical meetings and active governance participation."

#### 5. Lending Between Friends
- Informal crypto lending (common in crypto communities) currently has zero credit infrastructure.
- Trust scores could serve as informal credit signals.

#### 6. Project Founder Verification
- Before investing in a new project, check the founder's wallet history, DeFi activity, and meeting history.
- "Has this founder actually been in the ecosystem, or did they create a wallet last week?"

#### 7. Airdrop Farming Detection
- Protocols could use TrustTap scores to filter genuine users from airdrop farmers.
- SGT + physical meetings + long wallet history = real user.

---

## 7. Competition Check

### Direct Competitors on Solana

**There is NO direct competitor building a mobile-first, NFC-enabled trust/reputation system for Solana Seeker.**

The closest projects:

| Project | What They Do | How TrustTap Differs |
|---------|-------------|---------------------|
| **Civic** | Identity verification (KYC) | Civic proves identity, not reputation. Binary yes/no, not a score. |
| **Trusta Labs** | On-chain reputation scoring | EVM-focused. No mobile/NFC/physical layer. No device attestation. |
| **SAS** | Attestation infrastructure | SAS is infrastructure, not an app. TrustTap could BUILD ON SAS. |
| **Galxe** | Activity-based scoring | Generic web3, not Solana-mobile-specific. No physical meetings. |

### MONOLITH Hackathon Competition

Based on research, the MONOLITH hackathon has 266 participants with 11 submissions in the mobile category. From available data, no submission appears to focus on trust/reputation scoring. Most focus on DeFi tools, gaming, and social features.

**Our unique angle:** We're the only project that would combine:
1. SGT device attestation (proves real Seeker)
2. On-chain behavior analysis (proves crypto experience)
3. Physical meeting verification (proves real-world encounters)
4. AI-powered trust summaries (makes data actionable)

### How TrustTap Differs from Gitcoin Passport

| Dimension | Gitcoin Passport | TrustTap |
|-----------|-----------------|----------|
| Identity Source | Web2 accounts (Google, Twitter) | On-chain activity + hardware attestation |
| Trust Model | "Are you a unique human?" | "How trustworthy is this crypto user?" |
| Physical Layer | None | NFC/QR proof of meeting |
| Device Binding | None | SGT soulbound to Seeker |
| Target User | Grant donors | Crypto traders, event attendees, DeFi users |
| Chain | Ethereum-centric | Solana-native |

---

## 8. Recommended Architecture

### System Overview

```
+------------------+     +------------------+     +------------------+
|   Seeker Phone   |     |   Backend API    |     |   Solana Chain   |
|   (React Native) |     |   (Node.js)      |     |                  |
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
| - Mobile Wallet  |<--->| - Trust Score    |<--->| - SGT Ownership  |
|   Adapter        |     |   Calculator     |     | - Wallet History |
| - QR Scanner     |     | - Meeting Store  |     | - Token Accounts |
| - NFC HCE (opt.) |     | - Claude AI API  |     | - NFT Holdings   |
| - Trust Profile  |     | - Helius Client  |     | - DAO Votes      |
|   Display        |     | - User Cache     |     |                  |
+------------------+     +------------------+     +------------------+
         |                        |
         |    +------------------+|
         +--->|   Helius APIs    |+
              +------------------+
              | - DAS API        |
              | - gTFA           |
              | - Enhanced Tx    |
              +------------------+
```

### Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Mobile | React Native + Expo + Solana Mobile Stack | Official Solana Mobile scaffold, fastest path |
| Wallet | Mobile Wallet Adapter + Seed Vault | Native Seeker integration |
| Backend | Node.js + Express (or Hono) | Simple, fast, JS ecosystem for Solana libs |
| Database | SQLite or Supabase | Lightweight for hackathon, Supabase if needing auth |
| Trust Data | Helius API (DAS + gTFA + Enhanced Tx) | Best Solana data API, excellent docs |
| AI | Claude API (Anthropic) | Natural language trust summaries |
| QR | react-native-camera + QR library | Standard, well-supported |
| NFC (stretch) | Android HCE APIs via React Native bridge | Phone-to-phone via card emulation |

### Data Flow: Trust Score Generation

```
1. User connects wallet via Mobile Wallet Adapter
2. App checks SGT ownership (Helius DAS API) → Gate: must have SGT
3. App fetches wallet transaction history (Helius gTFA)
4. App fetches token holdings + NFTs (Helius DAS API)
5. Backend parses data:
   a. Calculate wallet age from earliest transaction
   b. Count total transactions
   c. Identify unique protocols from program IDs
   d. Check staking positions
   e. Check NFT holdings (blue-chip detection)
   f. Check DAO governance participation
   g. Count physical meetings from meeting records
6. Apply weighted scoring algorithm → Trust Score (0-100)
7. Feed data to Claude API → Generate trust summary
8. Cache result (refresh every 24 hours)
9. Display trust profile on phone
```

### Data Flow: Physical Meeting

```
1. User A taps "Meet Someone" → App generates:
   - Challenge: { wallet_A, timestamp, nonce }
   - Signature: sign(challenge, privateKey_A)
   - QR Code encoding: { challenge, signature }

2. User B scans QR code → App:
   - Verifies signature matches wallet_A
   - Checks timestamp is within 60 seconds
   - Generates counter-signature: sign(challenge, privateKey_B)

3. Both apps submit meeting record to backend:
   - { wallet_A, wallet_B, timestamp, sig_A, sig_B }

4. Backend verifies both signatures, stores meeting record

5. Both users' trust scores update (+2 points each, max 10)
```

---

## 9. The Killer Insight

### Why TrustTap Could Actually Win

The MONOLITH hackathon judges are looking for apps that:
1. Are **Seeker-native** (use SGT, Seed Vault, dApp Store)
2. Demonstrate **real utility** for crypto users
3. Show **thoughtful mobile design**
4. Could **actually grow** into a real product

TrustTap hits all four because it solves a **real, unsolved problem** that is **uniquely solvable on Seeker**:

**No other device in crypto gives you:**
- Hardware-backed identity (SGT soulbound NFT)
- Secure key storage (Seed Vault TEE)
- NFC capability for physical interactions
- A guaranteed crypto-native user base

This is not "another DeFi dashboard" or "another NFT marketplace." This is a **new primitive** -- trust as a composable layer that other apps can build on.

### The Network Effect Argument

Every TrustTap user makes every other user's trust more valuable:
- More physical meetings = denser trust graph
- More wallet analyses = better scoring calibration
- More users = more useful for P2P trading safety

The ideal viral loop:
1. User installs TrustTap at a crypto event
2. Taps 10 people, gets initial trust boost
3. Checks someone's score before an OTC trade
4. Tells their friend "I checked this guy's TrustTap before trading"
5. Friend installs TrustTap

### The Composability Argument

If built on SAS, other Solana apps could query TrustTap scores:
- DEXs could show trust scores on P2P order books
- NFT marketplaces could display seller trust
- DAOs could gate membership by trust threshold
- Lending protocols could use trust as informal credit scoring

This makes TrustTap not just an app, but **infrastructure for the Solana trust layer**.

### The One-Line Pitch

**"TrustTap turns your Seeker into a trust passport -- one tap to verify anyone in crypto."**

---

## Appendix A: Key Technical References

| Resource | URL |
|----------|-----|
| Solana Mobile Docs - SGT | https://docs.solanamobile.com/marketing/engaging-seeker-users |
| Helius DAS API Docs | https://www.helius.dev/docs/das-api |
| Helius gTFA Docs | https://www.helius.dev/docs/rpc/gettransactionsforaddress |
| Helius Token Gating Tutorial (Saga) | https://www.helius.dev/blog/token-gating-on-solana-mobile-tutorial |
| SAS Official Site | https://attest.solana.com/ |
| SAS Guide: Digital Credentials | https://attest.solana.com/docs/guides/ts/how-to-create-digital-credentials |
| Solana Mobile React Native Scaffold | https://docs.solanamobile.com/react-native/first_app_tutorial |
| Mobile Wallet Adapter | https://docs.solanamobile.com/react-native/using_mobile_wallet_adapter |
| Android HCE Bidirectional NFC | https://github.com/championswimmer/NFC-host-card-emulation-Android |
| EigenTrust Algorithm Paper | https://nlp.stanford.edu/pubs/eigentrust.pdf |
| OpenRank EigenTrust Docs | https://docs.openrank.com/reputation-algorithms/eigentrust |
| Civic on Solana | https://solana.com/ecosystem/civic |
| Trusta Labs on SAS | https://attest.solana.com/use-cases/trusta |
| MONOLITH Hackathon | https://solanamobile.radiant.nexus/ |
| Solana Realms (DAO Governance) | https://realms.today/ |
| SPL Governance Program | https://docs.realms.today/spl-governance |
| SNS (.sol domains) | https://sns.guide/ |

## Appendix B: Known Program IDs for Protocol Detection

For the trust score algorithm, detect which protocols a wallet has interacted with by checking transaction program IDs:

| Protocol | Program ID | Category |
|----------|-----------|----------|
| Jupiter (v6) | `JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4` | DEX Aggregator |
| Raydium AMM | `675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8` | DEX |
| Raydium CLMM | `CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK` | DEX |
| Marinade Finance | `MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD` | Liquid Staking |
| Orca Whirlpool | `whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc` | DEX |
| Tensor | `TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN` | NFT Marketplace |
| Magic Eden V2 | `M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K` | NFT Marketplace |
| Solend | `So1endDq2YkqhipRh3WViPa8hFSl6XYA9oMVFwLQbaw` | Lending |
| Marginfi | `MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA` | Lending |
| SPL Governance | `GovER5Lthms3bLBqWub97yVRMmNLaGKKOjL7SdN4QNpM` | DAO |
| Squads V3 | `SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu` | Multisig |

## Appendix C: Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Helius API rate limits | Can't analyze wallets fast enough | Cache aggressively, batch requests, use free DAS calls where possible |
| NFC HCE doesn't work reliably | Loses "tap" differentiator | QR code fallback is equally functional, just less magical |
| Trust score gaming | Users inflate scores artificially | Rate limits on meetings, penalize suspicious patterns, weight older activity higher |
| Privacy concerns | Users don't want wallet analysis exposed | All data is already public on-chain. Only show scores to connected users. Add granular privacy controls in V2 |
| Scope creep | Can't finish in 9 days | Strict MVP scope: SGT gate + wallet analysis + trust score + QR meetings + basic UI |
| SGT collection address changes | Can't verify Seeker ownership | Use Helius DAS with group filtering, stay updated with Solana Mobile docs |
