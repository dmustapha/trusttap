# TrustTap+ Content Inventory
**Purpose:** Complete content reference for Design Forge Phase 5 variation agents.
Every piece of text, stat, CTA, and data structure that must appear in the redesign.

---

## App Identity
- **Name:** TrustTap+
- **Tagline:** On-chain reputation for the Solana Seeker community
- **Description:** Verify trust through wallet history and physical meetings.
- **Logo:** Shield with checkmark (SVG, currently inline)

## Pages (5 total)

### 1. Home / Connect (`/`)
**Purpose:** Onboarding — connect wallet or try demo

**Content:**
- App logo (shield + checkmark SVG)
- Title: "TrustTap+"
- Subtitle: "On-chain reputation for the Solana Seeker community"
- 3 feature bullets:
  - "Trust scores from on-chain activity" (icon: chart/analytics)
  - "Verify trust through physical meetings" (icon: handshake/people)
  - "Sybil-resistant identity for airdrops" (icon: shield/security)
- CTA: "Connect Wallet" (primary, gradient)
- Secondary CTA: "Try with demo wallet"
- Demo wallet picker (expandable list):
  - Each wallet shows: truncated address, .sol domain (optional), score number, trust label + color
  - Trust labels: Unverified, Basic, Established, Trusted, Highly Trusted
  - Colors: red-ish for low, yellow for mid, green for high, emerald for very high

**States:** Default, Demo expanded, Connecting, Error

### 2. Profile Dashboard (`/profile`)
**Purpose:** Display user's trust score and breakdown

**Content:**
- Header: "My Trust Profile"
- Wallet address (truncated mono)
- Disconnect button
- **Score Dial:** Large circular progress showing score/100 with trust label
- **Score Breakdown** (7 dimensions):
  | Dimension | Label | Max | Icon Concept |
  |-----------|-------|-----|-------------|
  | device | Device (SGT) | 20 | smartphone/chip |
  | walletAge | Wallet Age | 15 | clock/hourglass |
  | activity | Activity | 15 | chart/pulse |
  | diversity | Diversity | 15 | network/nodes |
  | defi | DeFi | 15 | coins/swap |
  | identity | Identity | 10 | id-card/fingerprint |
  | physical | Physical | 10 | handshake/people |
- **Badges** section:
  - veteran (medal), defi-degen (ape), whale (whale), governor (building), networker (globe), og (crown), builder (hammer)
  - Empty state: "No badges earned yet"
- **AI Analysis** section:
  - Sybil assessment label: HUMAN (confident), LIKELY HUMAN (moderate), UNCERTAIN, LIKELY BOT, BOT
  - Assessment colors: green -> yellow -> orange -> red
  - Summary paragraph (AI-generated text)
- **Meeting History** (collapsible):
  - Count indicator
  - Each entry: partner address (truncated), date

**States:** Loading, Error (with retry), Loaded

### 3. Meeting Verification (`/scan`)
**Purpose:** QR-based physical meeting verification

**Content:**
- Title: "Meeting Verification"
- Tab switcher: "Show My QR" / "Scan QR"
- Show QR tab:
  - Prompt: "Generate a QR code for your partner to scan"
  - CTA: "Generate QR"
  - QR code display (when generated, with expiry timer)
- Scan QR tab:
  - Camera/paste input for scanning
- Meeting Confirm modal:
  - Partner's profile preview
  - Confirm / Cancel buttons
- Meeting Success state:
  - Score updates for both wallets
  - "Done" button
- **How it works** (info card):
  1. Meet another Seeker owner in person
  2. One person shows their QR code
  3. The other scans it (or pastes the data)
  4. Both confirm the meeting
  5. Both wallets get +2 physical trust points

**States:** Idle (show/scan tabs), QR displayed, Scanning, Partner preview, Submitting, Success, Error

### 4. Search Wallet (`/search`)
**Purpose:** Look up any wallet's trust profile

**Content:**
- Title: "Search Wallet"
- Search input: "Paste wallet address..."
- Search button
- Results: Full TrustProfileCard (same data as profile dashboard)
- Recent searches (up to 5, stored in localStorage)
  - Each shows truncated address, clickable

**States:** Empty, Loading, Error, Result, Recent searches

### 5. Sybil Shield (`/shield`)
**Purpose:** Batch filter wallets by device verification + trust score

**Content:**
- Title: "Sybil Shield"
- Subtitle: "Filter airdrop participants by device verification and trust score"
- **Threshold Slider:**
  - Label: "Minimum Trust Score"
  - Range: 0-100
  - Markers: "0 (Allow all)" / "100 (Max only)"
- CTA: "Run Sybil Filter" (gradient, full-width)
- **Filter Animation:** Animated number cascade: Total → SGT Verified → Passed
- **Results Dashboard:**
  - 4 stat cards (2x2 grid): Total Wallets, SGT Verified, Meets Threshold, Rejected
  - Pass Rate bar with percentage
  - "How Sybil Shield Works" (expandable):
    1. Check if wallet holds a Seeker Genesis Token (SGT)
    2. Retrieve on-chain trust score from TrustTap+
    3. Filter wallets below the minimum trust threshold
    4. Only verified, trusted wallets pass through

**States:** Default, Loading ("Checking 1,000 wallets..."), Error, Results

---

## Navigation
- Bottom nav (fixed, 4 tabs): Profile, Scan, Search, Shield
- Each tab has custom SVG icon + label
- Active state: emerald-400 color + bolder stroke

## Trust Labels & Colors
| Label | Score Range | Color |
|-------|------------|-------|
| Unverified | 0 | #71717a (zinc-500) |
| Basic | 1-40 | #f97316 (orange) |
| Established | 41-60 | #eab308 (yellow) |
| Trusted | 61-80 | #22c55e (green) |
| Highly Trusted | 81-100 | #10b981 (emerald) |

## Sybil Assessment Labels & Colors
| Assessment | Color |
|-----------|-------|
| HUMAN (confident) | #10B981 |
| LIKELY HUMAN (moderate) | #22C55E |
| UNCERTAIN | #EAB308 |
| LIKELY BOT | #F97316 |
| BOT | #EF4444 |

## Badge Definitions
| ID | Name | Icon Concept |
|----|------|-------------|
| veteran | Veteran | medal/star |
| defi-degen | DeFi Degen | ape/rocket |
| whale | Whale | whale |
| governor | Governor | pillars/gavel |
| networker | Networker | globe/web |
| og | OG | crown |
| builder | Builder | hammer/wrench |

---

## Technical Constraints
- **Framework:** Next.js 16.1.6 + React 19.2.3
- **Styling:** Tailwind CSS v4 (CSS-first: `@theme` in globals.css, NOT tailwind.config.js)
- **Animation:** Framer Motion 12.34.3 (already installed)
- **Fonts:** Geist + Geist_Mono via `next/font/google` (already configured)
- **QR:** react-qr-code (must keep for scan page)
- **Layout:** PageShell wrapper (max-w-md, px-4, pb-28, pt-6), BottomNav (fixed bottom)
- **Dark mode only** (no light mode needed for hackathon)
- **Mobile-first** (primary target: 390px, secondary: 1440px)
- **PWA manifest** exists at /manifest.json
- **No body overflow** issues (overflow-x: hidden on body, overscroll-behavior: none on html)
