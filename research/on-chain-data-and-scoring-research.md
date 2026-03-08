# On-Chain Data and Scoring Systems Research

**Research Date:** March 6, 2026
**Purpose:** Comprehensive analysis of Solana wallet holdings data, whale thresholds, reputation scoring methodologies, DeFi engagement patterns, governance participation, and transaction analysis for TrustTap+ trust scoring system.

---

## Table of Contents
1. [Solana Wallet Holdings Data via Helius API (Free Tier)](#1-solana-wallet-holdings-data-via-helius-api-free-tier)
2. [Whale Thresholds in Solana Ecosystem (2026)](#2-whale-thresholds-in-solana-ecosystem-2026)
3. [On-Chain Reputation Scoring Systems](#3-on-chain-reputation-scoring-systems)
4. [Solana DeFi Activity Depth](#4-solana-defi-activity-depth)
5. [Governance and Community Participation](#5-governance-and-community-participation)
6. [Transaction Pattern Analysis](#6-transaction-pattern-analysis)
7. [Recommendations for TrustTap+](#7-recommendations-for-trusttap)

---

## 1. Solana Wallet Holdings Data via Helius API (Free Tier)

### Available On-Chain Data

Helius provides comprehensive on-chain data for Solana wallets through multiple API endpoints:

#### 1.1 Native SOL Balance
- **Endpoint:** Standard `getBalance` RPC method
- **Returns:** Native SOL balance (liquid, non-staked)
- **Cost:** Standard RPC call (minimal credits)

#### 1.2 SPL Token Balances
- **Endpoint:** `getTokenAccountsByOwner` or Wallet Balances API
- **Returns:** All SPL tokens (fungible) and Token-2022 tokens
- **Features:**
  - Token metadata (name, symbol, logo)
  - USD pricing (hourly updates)
  - Up to 100 tokens per request
  - Sorted by USD value in descending order
- **Cost:** 100 credits per request

#### 1.3 NFT Collections
- **Endpoint:** `getAssetsByOwner` (DAS API)
- **Returns:**
  - All NFTs (both regular and compressed NFTs)
  - Collection metadata
  - Ownership information
  - Floor price data
- **Supports:** Plain SPL tokens (without metadata) and Token-2022
- **Features:** Pagination with `page` and `limit` parameters, sortable by creation date

#### 1.4 Liquid Staking Token Detection
Liquid staking derivatives (LSDs) appear as SPL tokens:
- **mSOL** (Marinade) - 17.5% of all Solana LSTs
- **JitoSOL** (Jito) - 36% of all Solana LSTs (most popular)
- **stSOL** (Lido) - No longer accepting new stakes (legacy positions only)
- **jupSOL** (Jupiter) - 11% of all Solana LSTs

**Key Insight:** Liquid staking tokens hold value that increases over time (each token worth more SOL), while native stake accounts receive small SOL deposits after each epoch. Total liquid staking represents 7.8% of staked SOL (~32 million SOL as of 2024).

#### 1.5 DeFi Positions (LP Tokens, Lending Deposits)
- **LP Tokens:** Appear as SPL tokens (e.g., RAY-SOL LP, ORCA Whirlpool positions)
- **Detection Method:** Token metadata and holder analytics
- **Concentrated Liquidity:** Meteora DLMM, Orca Whirlpools, Raydium CLMM show as position NFTs or LP tokens
- **Lending Deposits:** Protocol-specific tokens (e.g., Kamino kTokens, MarginFi deposits)

#### 1.6 USD Value Estimation
- **Source:** DAS (Digital Asset Standard)
- **Update Frequency:** Hourly
- **Coverage:** All major tokens with sufficient liquidity
- **Limitation:** Small-cap or illiquid tokens may lack pricing data

#### 1.7 Enhanced Transaction History
- **Endpoint:** `getTransactionsByAddress` (Enhanced Transactions API)
- **Returns:**
  - Human-readable parsed transaction data
  - Transaction types (swap, transfer, stake, vote, mint, NFT sale, etc.)
  - Filtering by type, source, time range
  - Complete historical activity with context
- **Use Case:** Analyze wallet behavior patterns, transaction diversity

### Free Tier Specifications

**Credits & Limits:**
- **Free Tier:** 1 million credits/month
- **No credit card required**
- **Credit Cost Examples:**
  - Wallet Balances API: 100 credits/request
  - Standard RPC calls: Minimal credits
  - DAS API calls: Variable (100+ credits depending on complexity)

**Rate Limits:**
- Free tier includes requests-per-second (RPS) limits (specific values in official docs)
- Suitable for prototyping and small-scale applications

**API Access:**
- All core features available on free tier
- DAS API: Full access to NFT and token metadata
- Enhanced Transactions: Human-readable decoded instructions
- Priority Fee API: Smart fee estimation
- Webhooks: Real-time event notifications (for monitored addresses)

### Key Limitations

1. **Native Staking Detection:** Native stake accounts (non-liquid staking) require separate RPC calls (`getStakeActivation`, `getProgramAccounts` with stake program filter) - more complex than LST detection.

2. **Portfolio Valuation:**
   - USD values provided, but accuracy depends on token liquidity
   - DeFi position values (LP tokens in AMMs) may not reflect true value if underlying pool token prices are outdated

3. **Historical Data:**
   - Enhanced Transactions API provides full history, but extensive historical queries may consume significant credits

---

## 2. Whale Thresholds in Solana Ecosystem (2026)

### SOL Price Context (2025-2026)

**Historical Trading Range:**
- **All-Time High (ATH):** $294.16 (January 19, 2025)
- **End of 2025:** ~$125-$138 (roughly half of January peak)
- **Early 2026 Range:** $86-$87 (February 2026), with brief surge to $146 in early January
- **2026 Projected Range:** Minimum $71.04, Average $94.64, Maximum $148.23

**Key Price Levels:**
- **$100-$105:** Important resistance where past rallies slowed
- **$120-$125:** Major resistance area where investors take profits

### Whale Activity in 2026

**Behavior Patterns:**
- Whales making repeated purchases of **10+ SOL** per transaction
- Concentrated in high-liquidity assets (not speculative low-cap tokens)
- Strategic accumulation rather than speculative trading
- Fragmented transactions into smaller transfers to avoid tracking
- Use of mixing services and complex wallet structures

**Distribution:**
- Top 10 wallets hold a small percentage of total supply (improved decentralization vs. prior years)
- Largest unknown wallet controls **less than 1.86%** of total SOL supply

### Whale Tier Definitions

**Industry-Standard Cryptocurrency Tiers (General):**

| Tier | Bitcoin Equivalent | Token Equivalent (Generic) | Description |
|------|-------------------|---------------------------|-------------|
| **Whale** | 1,000-5,000 BTC | >1M tokens | Massive holdings, market-moving capability |
| **Shark** | 500-1,000 BTC | 100K-1M tokens | Significant holdings, influential |
| **Dolphin** | 100-500 BTC | 1K-100K tokens | Substantial holdings, respected |
| **Fish** | 50-100 BTC | 500-1K tokens | Moderate holdings |
| **Octopus** | 10-50 BTC | 100-500 tokens | Smaller holdings |
| **Crab** | 1-10 BTC | 10-100 tokens | Casual investors |
| **Shrimp** | <1 BTC | <10 tokens | Minimal holdings |

### Proposed Solana-Specific Whale Tiers (2026)

**Based on $90 SOL price (mid-range 2026 estimate):**

| Tier | SOL Balance | USD Equivalent @ $90 | Market Impact | Criteria |
|------|-------------|----------------------|---------------|----------|
| **Mega Whale** | 100,000+ SOL | $9M+ | Institutional level | Exchange, fund, DAO treasury |
| **Whale** | 10,000-100,000 SOL | $900K-$9M | High influence | Major stakeholder, validator |
| **Shark** | 5,000-10,000 SOL | $450K-$900K | Notable influence | Serious investor, early adopter |
| **Dolphin** | 1,000-5,000 SOL | $90K-$450K | Moderate influence | Active participant, power user |
| **Fish** | 500-1,000 SOL | $45K-$90K | Engaged community member | Regular DeFi user |
| **Crab** | 100-500 SOL | $9K-$45K | Active user | NFT collector, casual DeFi |
| **Shrimp** | 10-100 SOL | $900-$9K | Casual user | Experimenting, small positions |
| **Plankton** | <10 SOL | <$900 | New/minimal user | Just getting started |

**Alternative Tier (Total Portfolio Value Including Tokens):**

Nansen's approach: **$1M+ in total assets** (SOL + tokens + NFTs) = Whale status

**Staked vs. Liquid SOL Considerations:**

1. **Liquid SOL:** Immediately available for transactions
2. **Native Staked SOL:** Locked in stake accounts (warmup/cooldown periods apply)
3. **Liquid Staking Tokens (LSTs):** Count as liquid assets (can be swapped/used in DeFi)

**Recommended Approach for TrustTap+:**
- **Total Liquid Assets:** SOL + (LSTs converted to SOL equivalent) + (major tokens converted to SOL)
- **Native Staked SOL:** Weighted at 0.8x (less liquid, but shows long-term commitment)
- **DeFi Positions:** Count LP tokens and lending deposits at estimated value

---

## 3. On-Chain Reputation Scoring Systems

### 3.1 Gitcoin Passport

**Methodology:**
- **Identity verification** through verifiable credentials (Stamps)
- **Stamp-based scoring:** Each Stamp adds points to the Unique Humanity Score
- **Threshold:** 20 (minimum for Sybil defense), Maximum: 100
- **Stamp Sources:** Web2 (Twitter, Google) + Web3 (BrightID, Proof of Humanity, ENS, NFT holdings, POAP attendance)

**On-Chain Integration:**
- Passports can be brought on-chain via **EAS (Ethereum Attestation Service)** and other attestation registries
- Users mint Stamp + score attestations on-chain
- Smart contracts can verify Passport scores directly (decentralized, permissionless)

**Dimensions Scored:**
- **Identity diversity:** Number of verified platforms
- **Social verification:** BrightID, Proof of Humanity
- **Web3 activity:** NFT holdings, POAP attendance, DAO membership
- **Longevity:** Age of accounts across platforms

**Strengths:**
- Multi-platform identity aggregation
- Sybil resistance focus
- On-chain verifiable

**Weaknesses:**
- Primarily Ethereum-focused (not Solana-native)
- Requires active Stamp collection (user effort)

---

### 3.2 Nomis Protocol

**Methodology:**
- **30+ parameters** analyzed for wallet reputation
- **Key metrics:** Wallet balance, transaction volume, wallet age, activity frequency

**Scoring Philosophy:**
- Multi-chain support (cross-chain reputation)
- Flexible parameter weighting based on chain and use case
- On-chain reputation protocol designed for DeFi and social applications

**Dimensions (Inferred):**
- **Financial:** Balance, transaction volume
- **Temporal:** Wallet age, activity consistency
- **Behavioral:** Transaction patterns, protocol interactions

**Use Cases:**
- DeFi credit scoring
- Airdrop eligibility
- Gated community access

**Strengths:**
- Comprehensive parameter set (30+)
- Multi-chain flexibility

**Weaknesses:**
- Less transparency on exact scoring formula
- Potential for gaming (if parameters are known)

---

### 3.3 Trusta Labs

**Methodology:**
- **Five-dimensional scoring system:**
  1. **Monetary:** Asset holdings, transaction values
  2. **Engagement:** Activity frequency, protocol interactions
  3. **Diversity:** Range of DeFi protocols used, token variety
  4. **Identity:** Verified credentials, social connections
  5. **Age:** Wallet longevity, historical consistency

**Scoring Philosophy:**
- Sophisticated reputation management for individuals
- Analytics dashboards for dApps (protocol-level insights)
- Behavioral analysis across multiple dimensions

**Use Cases:**
- Individual value score assessment
- dApp user segmentation
- Anti-Sybil for airdrops and governance

**Strengths:**
- Clear dimensional framework
- Balanced approach (financial + behavioral + identity)
- Actionable for both users and protocols

**Weaknesses:**
- Requires multi-protocol data aggregation (complex)

---

### 3.4 ARCx Credit Score

**Methodology:**
- **DeFi-specific credit scoring** for lending/borrowing
- **Three core components:**
  1. **Daily Score Reward:** Borrow usage over past 120 days
  2. **Survival Score Reward:** Ability to avoid liquidations
  3. **Liquidation Penalty:** Negative scoring for liquidation events

**Scoring Output:**
- **Dynamic max-LTV loans** based on score
- **Three-tiered vault design:** Different risk tiers based on credit score
- **Daily on-chain updates:** Scores published daily for transparency

**Dimensions:**
- **Borrow utilization:** Amount and consistency of borrowing
- **Liquidation history:** Penalty for liquidations, reward for survival
- **Historical performance:** 120-day rolling window

**Use Cases:**
- Under-collateralized lending (based on credit score)
- Dynamic LTV adjustments
- Risk modeling for lenders

**Strengths:**
- Transparent scoring rules (published daily on-chain)
- Directly tied to lending behavior (domain-specific)
- Incentivizes responsible borrowing

**Weaknesses:**
- Limited to borrowing activity (not holistic reputation)
- Requires extensive DeFi lending history

---

### 3.5 DegenScore (Inferred)

**Methodology:**
- Focused on **DeFi power users** and early adopters
- Scoring based on **protocol experimentation** and **yield farming sophistication**

**Dimensions (Inferred from similar systems):**
- **Protocol diversity:** Number of DeFi protocols used
- **Early adoption:** Interaction with new/experimental protocols
- **Yield optimization:** Complexity of farming strategies (multi-protocol, auto-compounding)

**Use Cases:**
- Airdrop targeting for DeFi protocols
- Identifying power users for beta testing

---

### Common Dimensions Across All Systems

| Dimension | Description | Metrics |
|-----------|-------------|---------|
| **Financial** | Asset holdings, portfolio value | SOL balance, token holdings, total portfolio USD value |
| **Temporal** | Wallet age, activity longevity | Account creation date, months active, consistency over time |
| **Engagement** | Activity frequency, protocol usage | Transactions/month, unique protocols interacted with |
| **Diversity** | Range of activities and assets | Token types held, transaction types, protocol variety |
| **Identity** | Verified credentials, social proof | Twitter/Discord verification, NFT badges, DAO membership |
| **Behavioral** | Patterns distinguishing humans from bots | Transaction timing variability, diverse activity types |
| **Credit** | Borrowing history, liquidation avoidance | Lending protocol usage, repayment history, LTV ratios |

---

## 4. Solana DeFi Activity Depth

### 4.1 Beginner vs. Advanced DeFi Usage

**Beginner DeFi (Basic):**
- **Token swaps** on DEXs (Jupiter, Orca, Raydium)
- **Single-sided staking** (native SOL staking or liquid staking)
- **NFT minting/trading** (basic marketplace usage)
- **Simple wallet transfers** (send/receive SOL and tokens)

**Intermediate DeFi:**
- **Liquidity provision** (standard AMM pools like Raydium, Orca)
- **Lending/borrowing** (Solend, MarginFi, Kamino) with over-collateralized loans
- **Yield farming** (single-protocol strategies)
- **Multiple DEX usage** (optimizing for best rates across platforms)

**Advanced DeFi:**
- **Concentrated liquidity** (Orca Whirlpools, Meteora DLMM, Raydium CLMM)
- **Leveraged trading** (Drift perpetual futures up to 10x, Mango Markets)
- **Multi-protocol yield strategies** (auto-rebalancing vaults like Kamino)
- **Derivatives** (perpetual futures, options - Zeta Markets, Drift)
- **Advanced risk management** (hedging with perps, delta-neutral strategies)
- **DAO participation** (governance voting, proposal creation)

---

### 4.2 Protocol Classification

#### **Beginner-Friendly Protocols**

| Protocol | Type | Key Features | User Profile |
|----------|------|--------------|--------------|
| **Orca** | DEX (AMM) | Intuitive design, low fees, user-friendly UI | Retail traders, beginners |
| **Jupiter** | DEX Aggregator | Best price routing, low slippage, multi-DEX | Smart retail traders |
| **Phantom Wallet** | Wallet | Simple staking interface, in-app swaps | Casual users, new to crypto |
| **Magic Eden** | NFT Marketplace | Easy NFT trading, creator launchpad | NFT collectors, artists |

#### **Intermediate Protocols**

| Protocol | Type | Key Features | User Profile |
|----------|------|--------------|--------------|
| **Raydium** | DEX (AMM + CLMM) | Deep liquidity, higher yields for LPs | Liquidity providers, yield farmers |
| **Solend** | Lending | Over-collateralized lending, simple UI | DeFi users with collateral |
| **MarginFi** | Lending | User-friendly lending, competitive rates | Intermediate DeFi users |
| **Marinade** | Liquid Staking | Native + liquid staking, MEV rewards | Stakers seeking flexibility |

#### **Advanced Protocols**

| Protocol | Type | Key Features | User Profile |
|----------|------|--------------|--------------|
| **Meteora** | Dynamic Liquidity (DLMM) | Discretized liquidity bins, dynamic fees, capital efficiency | Advanced LPs, market makers |
| **Orca Whirlpools** | Concentrated Liquidity | Narrow price range LPing, high capital efficiency | Sophisticated LPs |
| **Drift** | Derivatives | Perpetual futures (10x leverage), sub-400ms execution, integrated lending | Leveraged traders, pro traders |
| **Kamino Finance** | Lending + Vaults | Automated liquidity vaults, auto-rebalancing CLMM, advanced risk management | Yield optimizers, power users |
| **Zeta Markets** | Options + Perps | Options trading, under-collateralized perps | Options traders, hedgers |
| **Phoenix** | Order Book DEX | On-chain order book, pro trading interface | Professional traders |

---

### 4.3 Detecting DeFi Engagement Depth

**On-Chain Signals:**

| Activity Level | Detection Method | Indicators |
|----------------|------------------|------------|
| **No DeFi** | Transaction types | Only transfers, no swaps/stakes/borrows |
| **Basic DeFi** | Protocol count: 1-2 | Jupiter swaps OR native staking only |
| **Intermediate DeFi** | Protocol count: 3-5 | Swaps + LP provision OR Lending + staking |
| **Advanced DeFi** | Protocol count: 6+ | CLMM positions + Derivatives + Multi-protocol yield |
| **Power User** | Transaction diversity + value | 10+ protocols, high-value positions, frequent rebalancing |

**Transaction Type Diversity (Advanced Users):**
- **Swaps** (basic)
- **LP additions/removals** (intermediate)
- **CLMM range adjustments** (advanced)
- **Borrow/repay** (intermediate)
- **Perp trades** (advanced)
- **DAO votes** (governance-engaged)
- **Yield vault deposits** (optimizers)

**Protocol Usage Tiers:**

| User Type | Protocols Used | Typical Count | Examples |
|-----------|----------------|---------------|----------|
| **Casual** | 1-2 protocols | Swaps only | Jupiter, Phantom swap |
| **Regular** | 3-5 protocols | Swaps + staking + basic LP | Jupiter, Marinade, Raydium |
| **Power User** | 6-10 protocols | Multi-strategy DeFi | Jupiter, Drift, Kamino, Meteora, Orca, MarginFi |
| **Pro/Whale** | 10+ protocols | Ecosystem-wide engagement | All major DeFi + DAO participation |

---

### 4.4 Concentrated Liquidity as Advanced Signal

**Standard AMM LP:**
- Liquidity spread across full price curve (0 to ∞)
- Passive, set-and-forget
- Lower capital efficiency

**Concentrated Liquidity (CLMM/DLMM):**
- Liquidity concentrated in specific price ranges (bins)
- Requires active management (rebalancing as price moves)
- High capital efficiency (higher yields per $ invested)
- **Protocols:** Orca Whirlpools, Meteora DLMM, Raydium CLMM

**Detection:**
- Position NFTs (Orca Whirlpools = NFT representing position)
- Frequent range adjustments (transaction history shows CLMM rebalancing)
- Interaction with CLMM-specific contracts

---

### 4.5 Lending Depth Analysis

**Basic Lending:**
- Single-sided deposits (supply only, no borrowing)
- Over-collateralized borrowing (safe LTV ratios)
- Single protocol usage

**Advanced Lending:**
- Leveraged farming (borrow to LP with collateral)
- Multi-protocol optimization (Kamino auto-vaults)
- Flash loans (advanced arbitrage)
- Risk management (monitoring LTV, avoiding liquidations)

**Detection:**
- Borrowing history (kTokens, aTokens, debt tokens)
- Liquidation events (negative signal for basic users, neutral for advanced if rare)
- Loan-to-value ratios (aggressive LTV = advanced, conservative LTV = cautious)

---

### 4.6 Derivatives and Leverage

**Perpetual Futures:**
- **Drift Protocol:** Up to 10x leverage, sub-400ms execution
- **Mango Markets:** Multi-collateral margin trading (less active post-exploit)
- **Phoenix:** Order book perps

**Options Trading:**
- **Zeta Markets:** European-style options on SOL and other assets

**Detection:**
- PerpMarket interaction (Drift, Zeta contracts)
- Position size and leverage usage
- Funding rate payments (perps-specific)

**Risk Profile:**
- Beginners: No leverage, no derivatives
- Intermediate: Occasional perp trading (low leverage)
- Advanced: Regular perp/options usage, high leverage, hedging strategies

---

### 4.7 Typical Protocol Counts by User Type

**Data from 2026 Solana DeFi Ecosystem:**

| User Type | Average Protocols Used | Typical DeFi TVL Contribution |
|-----------|------------------------|-------------------------------|
| **New User** | 0-1 | $0-$100 |
| **Casual DeFi** | 1-2 | $100-$1K |
| **Regular User** | 3-5 | $1K-$10K |
| **Power User** | 6-10 | $10K-$100K |
| **Whale/Pro** | 10+ | $100K+ |

**Context (2026 Solana DeFi):**
- **Total DeFi TVL:** $11.5B (Q3 2025), with lending markets at $3.6B (December 2025)
- **Leading protocols:** Kamino Finance (lending), Raydium (DEX), Jupiter (aggregator), Drift (derivatives)

---

## 5. Governance and Community Participation

### 5.1 Solana Governance Infrastructure

**SPL Governance:**
- **Core program:** `spl-governance` (on-chain governance primitive)
- **Purpose:** Create DAOs, manage proposals, execute on-chain voting
- **Key feature:** Proposals contain blockchain instructions executed after successful vote

**Realms (DAO Platform):**
- **Website:** realms.today
- **Description:** Decentralized DAO platform built on SPL Governance
- **Features:**
  - Open proposal creation
  - On-chain voting (votes verifiable and immutable)
  - Treasury control (multi-sig + governance)
  - Council vs. Community mint voting (dual governance structures)

---

### 5.2 On-Chain Voting Detection

**How Voting Works:**
- Users deposit governance tokens into Realm to gain voting power
- Proposals are created on-chain (contain executable instructions)
- Votes are recorded on-chain (transparent, verifiable)
- After voting period, successful proposals auto-execute

**Tracking Participation:**

| Metric | Detection Method | Signal Strength |
|--------|------------------|-----------------|
| **Governance Token Holdings** | SPL token balance (e.g., MNGO, RAY, JUP) | Weak (holding ≠ voting) |
| **Deposited into Realm** | Token account delegated to governance program | Medium (ready to vote) |
| **Active Voting** | On-chain vote records (searchable via governance program) | Strong (actual participation) |
| **Proposal Creation** | Created proposals on Realms | Very Strong (leadership) |
| **Voting Frequency** | Number of proposals voted on | Strong (engagement level) |

**On-Chain Identifiers:**
- `VoteRecord` accounts (SPL Governance program data)
- `TokenOwnerRecord` accounts (shows deposited governance tokens)
- `Proposal` accounts (proposal metadata and vote tallies)

---

### 5.3 Key Solana DAOs

| DAO | Governance Token | Focus | Voting Activity Level |
|-----|-----------------|-------|----------------------|
| **Mango DAO** | MNGO | DeFi (lending/trading) | High (major protocol decisions) |
| **Raydium DAO** | RAY | DEX governance | Medium (fee splits, new pools) |
| **Jupiter DAO** | JUP | DEX aggregator | High (recent JUP airdrop governance) |
| **Marinade DAO** | MNDE | Liquid staking | Medium (validator set, treasury) |
| **Solana Foundation** | N/A (off-chain) | Ecosystem grants | Off-chain (less trackable) |

---

### 5.4 Governance Participation Tiers

| Tier | Activity | Indicators | Trust Signal |
|------|----------|------------|--------------|
| **No Participation** | Holds token only | No `VoteRecord` accounts | Neutral (investor, not engaged) |
| **Passive Holder** | Deposited in Realm, no votes | `TokenOwnerRecord` exists, no votes | Low (intended to vote but didn't) |
| **Casual Voter** | 1-5 votes | Occasional participation | Medium (community-minded) |
| **Active Voter** | 6-20 votes | Regular participation | Strong (engaged governance) |
| **Core Contributor** | 20+ votes + proposals | Leadership, proposal creation | Very Strong (DAO contributor) |

---

### 5.5 Community Participation (Off-Chain Proxies)

**Note:** These are harder to track on-chain but can be inferred:

| Activity | On-Chain Proxy | Detection Difficulty |
|----------|----------------|----------------------|
| **Discord Roles** | NFT-gated roles (Collab.Land, Guild.xyz) | Medium (requires NFT/token holding) |
| **Twitter Verification** | Gitcoin Passport Stamp (imported on-chain) | Medium (if on-chain attestation exists) |
| **POAP Attendance** | POAP NFT holdings (event attendance) | Easy (NFT holdings searchable) |
| **Contributor NFTs** | Special NFTs for contributors (e.g., GitPOAP) | Easy (NFT metadata) |
| **Multisig Signer** | Signer on DAO multisig wallet (Squads Protocol) | Easy (public multisig data) |

**POAPs and Event Attendance:**
- POAPs (Proof of Attendance Protocol) on Solana (less common than Ethereum)
- Event-specific NFTs (conferences, hackathons, AMAs)
- Detection: Check NFT collections for event-related metadata

**Meaningful Governance vs. Token Holding:**
- **Holding governance token:** Potential to participate (low signal)
- **Deposited in Realm:** Prepared to vote (medium signal)
- **Active voting record:** Proven engagement (high signal)
- **Proposal creation:** Leadership and initiative (very high signal)

---

## 6. Transaction Pattern Analysis

### 6.1 Bots vs. Humans

**Bot Characteristics (On-Chain):**

| Feature | Bot Behavior | Human Behavior |
|---------|--------------|----------------|
| **Timing Precision** | Exactly timed intervals (e.g., every 4 hours, 24 hours) | Irregular, human-like intervals |
| **Transaction Frequency** | Very high (hundreds/day) | Moderate (1-50/day for active users) |
| **Gas Price Consistency** | Identical gas price patterns | Variable gas prices |
| **Activity Patterns** | Continuous 24/7 activity | Irregular, with sleep/inactivity gaps |
| **Transaction Types** | Repetitive (same action repeatedly) | Diverse (swap, transfer, stake, etc.) |
| **Wallet Duplication** | Multiple wallets with identical behavior | Unique patterns per wallet |

**GapBasedSleepiness Feature:**
- Measures inactivity gaps between transactions
- Bots: Consistent gaps (e.g., 4-hour cycles)
- Humans: Irregular gaps (sleeps 8+ hours, variable daytime activity)

**Detection Methods:**
- **Time-series analysis:** Identify periodic patterns (FFT, autocorrelation)
- **Gas price variance:** Bots often use fixed gas prices; humans vary
- **Transaction diversity:** Bots repeat same action; humans vary activities

---

### 6.2 Active Traders vs. Passive Holders

**Passive Holder Profile:**

| Metric | Typical Range | Behavior |
|--------|---------------|----------|
| **Transactions/Month** | 0-5 | Rare activity, long holding periods |
| **Swap Frequency** | <1/month | Buy and hold, minimal trading |
| **Transfer Activity** | Inbound only (accumulating) | Receiving but not sending |
| **DeFi Interaction** | None or staking only | No active trading/LP |
| **Wallet Age** | Often old (multi-year) | Long-term holder |

**Active Trader Profile:**

| Metric | Typical Range | Behavior |
|--------|---------------|----------|
| **Transactions/Month** | 50-500+ | Frequent trading activity |
| **Swap Frequency** | 5-50+/month | Regular swaps across DEXs |
| **Transfer Activity** | Bidirectional (buying + selling) | Active capital rotation |
| **DeFi Interaction** | Multiple protocols | LP, lending, yield farming |
| **Wallet Age** | Variable | Can be new or old |

**Whale Trader Profile:**

| Metric | Typical Range | Behavior |
|--------|---------------|----------|
| **Transaction Size** | Large ($10K+ per swap) | Market-moving trades |
| **Timing** | Irregular, strategic | Buys dips, sells rallies |
| **Wallet Fragmentation** | Multiple wallets | Splitting positions to avoid tracking |
| **Mixing Services** | Uses tumblers/mixers | Privacy-conscious |

---

### 6.3 Transaction Frequency Benchmarks (2026)

**Solana Network Context:**
- High-speed blockchain (400ms block time)
- Low transaction fees (facilitates high-frequency activity)
- Active DeFi ecosystem (encourages diverse transactions)

**User Type Benchmarks:**

| User Type | Transactions/Day | Transactions/Month | Primary Activity |
|-----------|------------------|-------------------|------------------|
| **Inactive** | 0 | 0-5 | Long-term holder, no activity |
| **Casual** | 0.1-1 | 5-30 | Occasional swaps, NFT buys |
| **Regular** | 1-5 | 30-150 | Daily DeFi (swaps, staking, LP) |
| **Active Trader** | 5-20 | 150-600 | Frequent trading, yield farming |
| **Power User** | 20-50 | 600-1,500 | Multi-protocol strategies, rebalancing |
| **Bot/Pro Trader** | 50+ | 1,500+ | High-frequency trading, arbitrage |

---

### 6.4 Transaction Diversity (Types)

**Common Solana Transaction Types:**

| Type | Description | User Level |
|------|-------------|------------|
| **Transfer** | Send/receive SOL or tokens | All users |
| **Swap** | DEX token swaps | Casual+ |
| **Stake** | Native staking or liquid staking | Regular+ |
| **Unstake** | Withdraw staked SOL | Regular+ |
| **LP Add/Remove** | Liquidity provision | Intermediate+ |
| **Borrow/Repay** | Lending protocol interactions | Intermediate+ |
| **Vote** | DAO governance voting | Engaged users |
| **NFT Mint** | Mint new NFT | NFT users |
| **NFT Trade** | Buy/sell NFTs on marketplace | NFT traders |
| **Perp Trade** | Derivatives trading | Advanced+ |

**Diversity Score Calculation (Proposed):**
- Count unique transaction types over past 90 days
- Weight by complexity (e.g., Perp Trade > Swap > Transfer)

**Example Scoring:**

| Diversity Score | Transaction Types | User Profile |
|-----------------|-------------------|--------------|
| **1-2** | Transfer, Swap | Casual user |
| **3-4** | Transfer, Swap, Stake, LP | Regular DeFi user |
| **5-6** | Transfer, Swap, Stake, LP, Borrow, Vote | Power user |
| **7+** | All types including Perp, NFT, Vote | Advanced/Pro user |

---

### 6.5 Temporal Consistency

**Wallet Age:**
- **Account creation date:** First transaction timestamp
- **Longevity signal:** Older wallets (1+ year) = more trustworthy
- **Multi-cycle survival:** Wallets active through bear + bull markets = strong signal

**Activity Consistency:**

| Pattern | Description | Trust Signal |
|---------|-------------|--------------|
| **Burst Activity** | Intense activity for days, then dormant | Weak (airdrop farming, bot) |
| **Consistent Activity** | Regular transactions over months/years | Strong (genuine user) |
| **Seasonal Activity** | Active during bull markets only | Medium (fair-weather user) |
| **Multi-Cycle Activity** | Active through bull + bear (2+ years) | Very Strong (committed user) |

**Measurement:**
- **Active Months:** Count months with ≥5 transactions
- **Consistency Score:** Active months / Total months since creation
- **High Consistency:** >50% active months = engaged long-term user

---

### 6.6 Behavioral Red Flags (Sybil Detection)

**Sybil Attack Patterns:**

| Red Flag | Description | Detection |
|----------|-------------|-----------|
| **Dust Attacks** | Many small inbound transfers | Unusual inbound activity |
| **Clone Wallets** | Multiple wallets with identical behavior | Cluster analysis |
| **Airdrop Farming** | Minimal activity, then sudden burst near airdrop | Temporal analysis |
| **Wash Trading** | Self-transfers between own wallets | Graph analysis (same entity) |
| **Round-Number Transfers** | Always exact amounts (e.g., 100 SOL, 500 SOL) | Precision analysis |

**Sybil Resistance Signals:**

| Green Flag | Description | Trust Signal |
|------------|-------------|--------------|
| **Diverse Transaction Amounts** | Varied, non-round amounts | Human-like behavior |
| **Gradual Portfolio Growth** | Accumulation over time (not sudden) | Organic user |
| **Social Connections** | Interactions with known wallets (friends, DAOs) | Real relationships |
| **NFT Collections** | Curated NFT holdings (not just free mints) | Genuine interest |
| **Long-Term Staking** | Staked SOL for extended periods | Commitment to ecosystem |

---

## 7. Recommendations for TrustTap+

### 7.1 Proposed Trust Score Dimensions

Based on research, TrustTap+ should score wallets across these dimensions:

| Dimension | Weight | Key Metrics | Data Source |
|-----------|--------|-------------|-------------|
| **Financial Depth** | 20% | Total portfolio value (SOL + tokens + LSTs) | Helius Wallet Balances API, DAS API |
| **DeFi Engagement** | 25% | Protocol count, transaction diversity, CLMM usage | Helius Enhanced Transactions API |
| **Governance Participation** | 15% | DAO votes, proposals created, token deposits | SPL Governance on-chain data |
| **Longevity & Consistency** | 20% | Wallet age, active months, multi-cycle survival | Transaction history (Helius) |
| **Behavioral Trust** | 15% | Human-like patterns, Sybil resistance | Transaction pattern analysis |
| **Social Proof** | 5% | NFT holdings (POAPs, community badges) | DAS API (NFT collections) |

---

### 7.2 Whale Tier Implementation

**Recommended Tiers for TrustTap+ (Based on Total Liquid Assets @ $90 SOL):**

| Tier | SOL Equivalent | USD Range | Badge/Label |
|------|----------------|-----------|-------------|
| **Mega Whale** | 100,000+ SOL | $9M+ | 🐋 Mega Whale |
| **Whale** | 10,000-100,000 SOL | $900K-$9M | 🐋 Whale |
| **Shark** | 5,000-10,000 SOL | $450K-$900K | 🦈 Shark |
| **Dolphin** | 1,000-5,000 SOL | $90K-$450K | 🐬 Dolphin |
| **Fish** | 500-1,000 SOL | $45K-$90K | 🐟 Fish |
| **Crab** | 100-500 SOL | $9K-$45K | 🦀 Crab |
| **Shrimp** | 10-100 SOL | $900-$9K | 🦐 Shrimp |
| **Plankton** | <10 SOL | <$900 | 🌊 Plankton |

**Asset Valuation Formula:**
```
Total Liquid Assets =
  (SOL Balance) +
  (LSTs × SOL Conversion Rate) +
  (Major Tokens × USD Value / SOL Price) +
  (Native Staked SOL × 0.8)
```

---

### 7.3 DeFi Engagement Scoring

**Protocol Count Score:**

| Protocols Used | Score (0-100) | Label |
|----------------|---------------|-------|
| 0-1 | 0-20 | Minimal DeFi |
| 2-3 | 21-40 | Basic DeFi |
| 4-5 | 41-60 | Regular DeFi |
| 6-8 | 61-80 | Power User |
| 9+ | 81-100 | DeFi Expert |

**Transaction Diversity Score:**

| Unique Transaction Types | Score (0-100) | Label |
|---------------------------|---------------|-------|
| 1-2 (Transfer, Swap) | 0-25 | Basic Activity |
| 3-4 (+ Stake, LP) | 26-50 | Intermediate |
| 5-6 (+ Borrow, Vote) | 51-75 | Advanced |
| 7+ (+ Perp, CLMM) | 76-100 | Expert |

**Advanced DeFi Bonus:**
- **+10 points:** Concentrated liquidity positions (Meteora, Orca Whirlpools)
- **+10 points:** Derivatives trading (Drift, Zeta)
- **+5 points:** Multi-protocol yield vaults (Kamino)

---

### 7.4 Governance Scoring

**Voting Activity Score:**

| Votes Cast (Past Year) | Score (0-100) | Label |
|------------------------|---------------|-------|
| 0 | 0 | No Participation |
| 1-3 | 25 | Casual Voter |
| 4-10 | 50 | Active Voter |
| 11-20 | 75 | Core Voter |
| 21+ | 100 | DAO Leader |

**Proposal Creation Bonus:**
- **+20 points** per proposal created (capped at +50)

**Governance Token Holding (No Vote Penalty):**
- If wallet holds governance tokens but has never voted: **-10 points** from overall score (missed opportunity signal)

---

### 7.5 Longevity & Consistency Scoring

**Wallet Age Score:**

| Age | Score (0-100) | Label |
|-----|---------------|-------|
| <3 months | 0-10 | New Wallet |
| 3-6 months | 11-30 | Recent |
| 6-12 months | 31-50 | Established |
| 1-2 years | 51-75 | Veteran |
| 2+ years | 76-100 | OG |

**Activity Consistency Score:**

| Active Months / Total Months | Score (0-100) | Label |
|------------------------------|---------------|-------|
| <10% | 0-20 | Sporadic |
| 10-25% | 21-40 | Occasional |
| 25-50% | 41-70 | Regular |
| 50-75% | 71-90 | Consistent |
| 75%+ | 91-100 | Highly Active |

**Multi-Cycle Bonus:**
- **+15 points** if wallet was active in both 2024 and 2025 (survived bear → bull transition)

---

### 7.6 Behavioral Trust (Sybil Resistance)

**Human-Like Patterns (0-100 Score):**

| Indicator | Score Impact | Detection Method |
|-----------|--------------|------------------|
| **Irregular transaction timing** | +20 | Timestamp variance analysis |
| **Diverse transaction amounts** | +15 | Amount precision (avoid round numbers) |
| **Gradual portfolio growth** | +20 | Growth rate over time (not sudden spikes) |
| **Social interactions** | +15 | Transactions with unique wallets (not self) |
| **NFT curation** | +10 | Non-free-mint NFT holdings |
| **Long-term staking** | +20 | Native staked SOL >6 months |

**Red Flags (Score Penalties):**

| Red Flag | Penalty | Detection Method |
|----------|---------|------------------|
| **Bot-like timing** | -30 | Periodic transaction intervals |
| **Clone wallet behavior** | -50 | Cluster analysis (similar wallets) |
| **Airdrop farming pattern** | -20 | Burst activity near airdrop dates |
| **Dust attack victim** | -10 | Many tiny inbound transfers |
| **Liquidation history** | -15 | Lending protocol liquidations |

---

### 7.7 Helius API Implementation Strategy

**API Endpoints to Use:**

1. **Wallet Balances API:** Get SOL, tokens, LSTs with USD values (100 credits/call)
2. **DAS API (`getAssetsByOwner`):** Get NFT holdings (100+ credits/call)
3. **Enhanced Transactions API (`getTransactionsByAddress`):** Full transaction history with parsed data (variable credits)
4. **RPC (`getBalance`):** Native SOL balance (minimal credits)
5. **RPC (`getStakeActivation`):** Native staked SOL (for advanced scoring, not MVP)

**Pre-Computation Strategy (Demo Wallets):**
- Select 10 demo wallets (mix of whale, dolphin, shrimp, power user, casual)
- Pre-compute all scores and cache as JSON (reduce API calls during demo)
- Update cache daily (automated script)

**Free Tier Budget Management:**
- **1M credits/month** = ~10,000 Wallet Balances API calls or ~10,000 DAS calls
- **For live lookup:** Budget ~200 credits per full wallet analysis (Balances + DAS + Transactions sample)
- **Capacity:** ~5,000 full wallet lookups/month on free tier

---

### 7.8 Scoring Algorithm Pseudocode

```python
def calculate_trust_score(wallet_address):
    # 1. Financial Depth (20%)
    balances = helius.get_wallet_balances(wallet_address)
    total_usd = sum(balances.tokens.usd_value) + balances.sol.usd_value
    lst_sol_equivalent = sum([token.amount * token.sol_rate for token in balances.lst_tokens])
    native_staked_sol = get_native_staked_sol(wallet_address) * 0.8  # 80% weight
    total_liquid_assets_sol = (total_usd / SOL_PRICE_USD) + lst_sol_equivalent + native_staked_sol

    whale_tier = classify_whale_tier(total_liquid_assets_sol)
    financial_score = map_whale_tier_to_score(whale_tier)  # 0-100

    # 2. DeFi Engagement (25%)
    transactions = helius.get_enhanced_transactions(wallet_address, limit=1000)
    protocol_count = count_unique_protocols(transactions)
    tx_diversity = count_unique_tx_types(transactions)
    has_clmm = detect_concentrated_liquidity(transactions)
    has_derivatives = detect_derivatives(transactions)

    defi_score = (
        protocol_score(protocol_count) * 0.5 +
        diversity_score(tx_diversity) * 0.3 +
        (10 if has_clmm else 0) +
        (10 if has_derivatives else 0)
    )  # 0-100

    # 3. Governance Participation (15%)
    governance_votes = get_governance_votes(wallet_address)
    proposals_created = get_proposals_created(wallet_address)
    gov_score = min(100, (governance_votes / 20) * 75 + proposals_created * 20)

    # 4. Longevity & Consistency (20%)
    wallet_age_months = get_wallet_age_months(wallet_address)
    active_months = count_active_months(transactions)
    consistency = active_months / wallet_age_months

    longevity_score = (
        wallet_age_score(wallet_age_months) * 0.5 +
        consistency_score(consistency) * 0.5 +
        (15 if survived_multiple_cycles(transactions) else 0)
    )  # 0-100

    # 5. Behavioral Trust (15%)
    timing_variance = calculate_timing_variance(transactions)
    amount_diversity = calculate_amount_diversity(transactions)
    growth_pattern = analyze_portfolio_growth(transactions)

    behavioral_score = (
        (20 if timing_variance > THRESHOLD else -30) +
        (15 if amount_diversity > THRESHOLD else 0) +
        (20 if growth_pattern == "gradual" else -20) +
        # ... other behavioral signals
    )  # -50 to +100, clamp to 0-100

    # 6. Social Proof (5%)
    nfts = helius.get_assets_by_owner(wallet_address)
    poap_count = count_poap_nfts(nfts)
    community_badges = count_community_badges(nfts)
    social_score = min(100, poap_count * 10 + community_badges * 15)

    # Final Weighted Score
    total_score = (
        financial_score * 0.20 +
        defi_score * 0.25 +
        gov_score * 0.15 +
        longevity_score * 0.20 +
        behavioral_score * 0.15 +
        social_score * 0.05
    )  # 0-100

    return {
        "total_score": total_score,
        "whale_tier": whale_tier,
        "breakdown": {
            "financial": financial_score,
            "defi": defi_score,
            "governance": gov_score,
            "longevity": longevity_score,
            "behavioral": behavioral_score,
            "social": social_score
        }
    }
```

---

### 7.9 Pre-Computed Demo Wallets (Suggested Profiles)

To showcase TrustTap+ capabilities, pre-compute 10 diverse wallet profiles:

| # | Profile Type | Whale Tier | DeFi Level | Governance | Age | Expected Score |
|---|--------------|------------|------------|------------|-----|----------------|
| 1 | New Whale | Whale | Basic | None | 3 months | 55-65 |
| 2 | OG Power User | Dolphin | Expert | Active | 2+ years | 85-95 |
| 3 | Casual Holder | Shrimp | Minimal | None | 1 year | 30-40 |
| 4 | DeFi Degen | Fish | Advanced | Casual | 1 year | 65-75 |
| 5 | DAO Contributor | Crab | Regular | Core | 1.5 years | 70-80 |
| 6 | NFT Collector | Crab | Basic | None | 8 months | 45-55 |
| 7 | Bot/Sybil | Shrimp | Minimal | None | 2 months | 10-20 |
| 8 | Validator Whale | Mega Whale | Intermediate | Active | 2+ years | 90-100 |
| 9 | Yield Farmer | Fish | Advanced | None | 6 months | 60-70 |
| 10 | Multi-Cycle OG | Dolphin | Regular | Core | 3+ years | 85-95 |

**Pre-Computation Script:**
```bash
# Run nightly to update demo wallet cache
node scripts/pre-compute-demo-wallets.js
```

---

## Sources

### Topic 1: Helius API
- [Solana Token APIs - Holders, Metadata, and Balances](https://www.helius.dev/solana-token-apis)
- [How to Get Wallet Balances - Helius Docs](https://www.helius.dev/docs/wallet-api/balances)
- [Solana DAS API: Unified NFT and Token Data Access](https://www.helius.dev/docs/das-api)
- [All You Need to Know About Solana's New DAS API](https://www.helius.dev/blog/all-you-need-to-know-about-solanas-new-das-api)
- [Get Enhanced Transactions By Address - Helius Docs](https://docs.helius.dev/solana-apis/enhanced-transactions-api/parsed-transaction-history)
- [Helius Pricing - Solana RPCs and APIs](https://www.helius.dev/pricing)
- [Pricing & Rate limits](https://docs.helius.dev/welcome/pricing-and-rate-limits)

### Topic 2: Whale Thresholds
- [Solana Whale Accumulation Dominates Crypto Talk as 2026 Begins](https://www.the-blockchain.com/2026/01/01/solana-whale-accumulation-dominates-crypto-talk-as-2026-begins/)
- [Track Solana Wallets - Nansen](https://www.nansen.ai/solana-onchain-data)
- [Shrimps to Humpbacks: Understanding the Crypto Hierarchy](https://academy.synfutures.com/shrimps-to-humpbacks-understanding-the-crypto-hierarchy/)
- [Understanding Wallet Classifications from Crypto Whales to Krills - Bitquery](https://bitquery.io/blog/understanding-wallet-classifications)
- [Solana (SOL) Price Prediction 2026 2027 2028 - 2040](https://changelly.com/blog/solana-price-prediction/)
- [Solana Price Prediction: How Much Is SOL Now?](https://www.tradingkey.com/analysis/cryptocurrencies/sol/261505956-crypto-solana-sol-coin-history-price-usd-market-cap-prediction-tradingkey)

### Topic 3: On-Chain Reputation Scoring
- [Passport | Gitcoin support](https://support.gitcoin.co/gitcoin-knowledge-base/gitcoin-passport/common-questions/how-is-gitcoin-passports-score-calculated)
- [Major Concepts - Gitcoin Passport](https://docs.passport.gitcoin.co/building-with-passport/major-concepts)
- [What is Nomis — Nomis Docs](https://docs.nomis.cc/)
- [Scores @ Nomis Docs](https://docs.nomis.cc/core-primitives/scores)
- [ARCx Credit Introduction | ARCx](https://wiki.arcx.money/)
- [Introducing ARCx Credit and the DeFi Credit Score](https://arcx.substack.com/p/introducing-arcx-credit-and-the-defi)
- [DeFi Credit Score | ARCx](https://wiki.arcx.money/application/defi-credit-score)

### Topic 4: Solana DeFi Activity
- [Top 10 DeFi Apps on Solana in 2026: Complete Guide](https://eco.com/support/en/articles/13225733-top-10-defi-apps-on-solana-in-2026-complete-guide)
- [Meteora Protocol Guide: Solana DeFi Liquidity & Yield Strategies Explained](https://www.bitget.com/academy/meteora-protocol-gui)
- [What Is Meteora DLMM? A Beginner's Guide](https://bingx.com/en/learn/article/what-is-meteora-dlmm-solana-dexs-liquidity-powerhouse)
- [Jupiter vs Raydium: Which Is the Best Solana DEX?](https://academy.swissborg.com/en/learn/jupiter-vs-raydium)
- [Top Solana DEXs: Discover the Best Trading Platforms on Solana In 2026](https://coinbureau.com/analysis/top-solana-dex-platforms)

### Topic 5: Governance and Community
- [The Home of Solana DAOs | Realms](https://realms.today/)
- [spl-governance | Realms](https://docs.realms.today/developer-resources/spl-governance)
- [solana-program-library/governance/README.md](https://github.com/solana-labs/solana-program-library/blob/master/governance/README.md)
- [How to Participate in Solana Governance: A Step-by-Step Guide](https://crypto.com/en/university/how-to-participate-in-solana-governance)
- [Solana Governance Guide: Voting, Proposals & DAO Structure](https://www.okx.com/en-us/learn/solana-governance-guide)

### Topic 6: Transaction Patterns
- [Detecting Financial Bots on the Ethereum Blockchain](https://arxiv.org/html/2403.19530v2)
- [Detecting Bot Activity in the Ethereum Blockchain Network](https://arxiv.org/pdf/1810.01591)
- [Track Every Solana Wallet Movement with Precision](https://explore.st-aug.edu/exp/track-every-solana-wallet-movement-with-precision-using-solana-wallet-tracker)
- [How to Track Solana Wallets: Complete Guide for Smart Money Analysis](https://www.nansen.ai/post/how-to-track-solana-wallets-complete-guide-for-smart-money-analysis)
- [Nansen Wallet Labels: What Do They Mean? [2025 Updated]](https://www.nansen.ai/guides/wallet-labels-emojis-what-do-they-mean)

### Additional Topics
- [Solana Liquid Staking: The Ultimate Guide (2026)](https://phantom.com/learn/crypto-101/solana-liquid-staking)
- [Comparison of Solana ecosystem liquid staking projects](https://www.gate.com/post/status/12000166)
- [On-Chain Credit Scores: What They Are and How They Work](https://yellow.com/learn/on-chain-credit-scores-what-they-are-and-how-they-work)
- [Ways to Diversify Your Crypto Portfolio & Minimize Risk](https://www.britannica.com/money/cryptocurrency-portfolio-diversification)
- [How to Diversify Crypto Portfolio for Profit (2026 Guide)](https://www.hyrotrader.com/blog/diversify-crypto-portfolio/)

---

**End of Research Document**
*Compiled for TrustTap+ on-chain reputation scoring system*
*Data sources: Web research conducted March 6, 2026*
