# TrustTap+ Project Architecture
**Version:** 1.0
**Date:** February 28, 2026
**Source of Truth:** `docs/TRUSTTAP-PRD.md`

> Every technical decision in this document is derived from the PRD. Nothing is invented here. This document translates PRD requirements into implementation blueprints.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Directory Structure](#2-directory-structure)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Data Layer](#5-data-layer)
6. [External Services](#6-external-services)
7. [Type System](#7-type-system)
8. [Module Specifications](#8-module-specifications)
9. [API Route Specifications](#9-api-route-specifications)
10. [State Management](#10-state-management)
11. [Wallet Integration](#11-wallet-integration)
12. [Cryptographic Operations](#12-cryptographic-operations)
13. [Caching Architecture](#13-caching-architecture)
14. [Error Handling Strategy](#14-error-handling-strategy)
15. [Environment Configuration](#15-environment-configuration)
16. [Dependency Map](#16-dependency-map)
17. [Build & Deploy Pipeline](#17-build--deploy-pipeline)
18. [Performance Budget](#18-performance-budget)
19. [Testing Strategy](#19-testing-strategy)
20. [Implementation Order](#20-implementation-order)

---

## 1. System Overview

### High-Level Architecture

TrustTap+ is a **monorepo** containing a Next.js 16 PWA with API routes serving as the backend. There is no separate Express server — Next.js API routes handle all backend logic. This simplifies deployment, reduces moving parts, and matches the builder's strongest framework.

```
┌─────────────────────────────────────────────────────────────────┐
│                     SEEKER CHROME BROWSER                       │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   NEXT.JS 16 PWA                          │  │
│  │                                                           │  │
│  │  ┌─────────────────────┐  ┌────────────────────────────┐  │  │
│  │  │   PAGES (App Router)│  │   API ROUTES (/api/*)      │  │  │
│  │  │                     │  │                            │  │  │
│  │  │  /          Connect │  │  POST /api/analyze-wallet  │  │  │
│  │  │  /profile   Score   │  │  POST /api/ai-summary      │  │  │
│  │  │  /scan      Meet    │  │  POST /api/meeting/create   │  │  │
│  │  │  /search    Lookup  │  │  GET  /api/profile/:addr    │  │  │
│  │  │  /shield    Sybil   │  │  GET  /api/meetings/:addr   │  │  │
│  │  │                     │  │  POST /api/sybil-check      │  │  │
│  │  └──────────┬──────────┘  └─────────────┬──────────────┘  │  │
│  │             │                            │                │  │
│  │  ┌──────────┴────────────────────────────┴──────────────┐  │  │
│  │  │                 SHARED LIB LAYER                     │  │  │
│  │  │                                                      │  │  │
│  │  │  lib/helius.ts     Helius API client                 │  │  │
│  │  │  lib/scoring.ts    Trust score algorithm             │  │  │
│  │  │  lib/meeting.ts    Meeting verification + crypto     │  │  │
│  │  │  lib/wallet.ts     MWA connection helpers            │  │  │
│  │  │  lib/ai.ts         Claude API integration            │  │  │
│  │  │  lib/cache.ts      Cache read/write                  │  │  │
│  │  │  lib/badges.ts     Badge evaluation                  │  │  │
│  │  │  lib/validation.ts Input validation utilities        │  │  │
│  │  │  lib/constants.ts  Program IDs, addresses, config    │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
     ┌────────────┐  ┌──────────┐  ┌──────────────┐
     │  HELIUS    │  │ SOLANA   │  │  CLAUDE API  │
     │  FREE TIER │  │ MAINNET  │  │  (Anthropic) │
     │            │  │ (R/O)    │  │              │
     │  DAS API   │  │ RPC      │  │  Haiku model │
     │  parse-tx  │  │          │  │  for cost    │
     │  getSigs   │  │          │  │  efficiency  │
     └────────────┘  └──────────┘  └──────────────┘
```

### Why Next.js API Routes Instead of Express

The PRD specifies "Node.js + Express" for the backend. However, Next.js API routes provide identical functionality with these advantages:

1. **Single deployment artifact** — no separate server process to manage
2. **Shared TypeScript types** — frontend and backend use the same interfaces
3. **Same-origin requests** — no CORS configuration needed
4. **Builder familiarity** — Dami knows Next.js better than Express
5. **Zero additional cost** — runs on the same process

The API routes implement the exact same endpoints specified in PRD Section 10. If a separate Express server is ever needed (e.g., for WebSocket support in production), the lib modules are framework-agnostic and can be imported into any Node.js server.

### Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend location | Next.js API routes (not separate Express) | Single process, shared types, builder knows it |
| State management | React Context + local state (not Redux/Zustand) | App has 4 screens, minimal cross-screen state |
| Database | JSON file cache (not SQLite) | Simpler for hackathon. No native dependencies. Portable. |
| Styling | Tailwind CSS v4 | Already configured by create-next-app. Builder knows it. |
| Animation | Framer Motion | PRD specifies this. Builder knows it from Next.js. |
| QR library | react-qr-code (gen) + html5-qrcode (scan) | PRD specifies these. Web Camera API, no native deps. |
| Crypto | tweetnacl + bs58 | PRD specifies these. Standard Ed25519 for Solana. |
| AI model | Claude Haiku (claude-haiku-4-5-20251001) | Cheapest for simple text generation. PRD says ~$0.002/wallet. |

---

## 2. Directory Structure

```
trusttap/
├── .env.local                    # API keys (gitignored)
├── .gitignore
├── next.config.ts                # Next.js configuration + PWA config
├── package.json
├── tsconfig.json
├── tailwind.config.ts            # (if needed beyond v4 defaults)
├── postcss.config.mjs
│
├── public/
│   ├── manifest.json             # PWA manifest
│   ├── icons/                    # PWA icons (192x192, 512x512)
│   ├── sw.js                     # Service worker (basic offline support)
│   └── ...                       # Static assets
│
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout (providers, nav shell)
│   │   ├── page.tsx              # / — Connect Wallet screen
│   │   ├── profile/
│   │   │   └── page.tsx          # /profile — Trust Profile (main screen)
│   │   ├── scan/
│   │   │   └── page.tsx          # /scan — Meet Someone (QR exchange)
│   │   ├── search/
│   │   │   └── page.tsx          # /search — Wallet Lookup
│   │   ├── shield/
│   │   │   └── page.tsx          # /shield — Sybil Shield Dashboard
│   │   ├── globals.css           # Global styles + Tailwind imports
│   │   └── api/                  # API routes (backend)
│   │       ├── analyze-wallet/
│   │       │   └── route.ts      # POST /api/analyze-wallet
│   │       ├── ai-summary/
│   │       │   └── route.ts      # POST /api/ai-summary
│   │       ├── meeting/
│   │       │   └── create/
│   │       │       └── route.ts  # POST /api/meeting/create
│   │       ├── profile/
│   │       │   └── [address]/
│   │       │       └── route.ts  # GET /api/profile/:address
│   │       ├── meetings/
│   │       │   └── [address]/
│   │       │       └── route.ts  # GET /api/meetings/:address
│   │       └── sybil-check/
│   │           └── route.ts      # POST /api/sybil-check
│   │
│   ├── components/               # Reusable UI components
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx     # Bottom tab navigation
│   │   │   └── PageShell.tsx     # Common page wrapper (padding, max-width)
│   │   ├── trust/
│   │   │   ├── ScoreDial.tsx     # Circular score gauge (0-100, animated)
│   │   │   ├── ScoreBreakdown.tsx # 7 horizontal bars
│   │   │   ├── BadgeRow.tsx      # Horizontal badge chips
│   │   │   ├── AISummary.tsx     # AI trust summary card
│   │   │   ├── MeetingHistory.tsx # List of verified meetings
│   │   │   └── TrustProfileCard.tsx # Mini profile (used in search results)
│   │   ├── meeting/
│   │   │   ├── QRGenerator.tsx   # QR code display with countdown
│   │   │   ├── QRScanner.tsx     # Camera scanner + paste fallback
│   │   │   ├── MeetingConfirm.tsx # Partner preview + confirm button
│   │   │   └── MeetingSuccess.tsx # "Meeting Verified!" animation
│   │   ├── shield/
│   │   │   ├── ThresholdSlider.tsx # Trust score threshold input
│   │   │   ├── FilterAnimation.tsx # Animated dot filtering
│   │   │   └── ResultsDashboard.tsx # Filtered results summary
│   │   ├── wallet/
│   │   │   ├── ConnectButton.tsx  # "Connect Wallet" CTA
│   │   │   └── SGTGate.tsx       # "Seeker Required" screen
│   │   └── ui/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorMessage.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── lib/                      # Core business logic (shared frontend + API)
│   │   ├── helius.ts             # Helius API client
│   │   ├── scoring.ts            # Trust score algorithm
│   │   ├── badges.ts             # Badge evaluation logic
│   │   ├── meeting.ts            # Meeting challenge generation + verification
│   │   ├── wallet.ts             # MWA connection + SGT checking helpers
│   │   ├── ai.ts                 # Claude API integration
│   │   ├── cache.ts              # JSON file cache read/write
│   │   ├── validation.ts         # Input validation (wallet addresses, etc.)
│   │   └── constants.ts          # Program IDs, SGT addresses, score thresholds
│   │
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts              # All interfaces from PRD Section 9
│   │
│   ├── hooks/                    # React custom hooks
│   │   ├── useWallet.ts          # Wallet connection state
│   │   ├── useTrustProfile.ts    # Profile fetching + caching
│   │   └── useMeeting.ts         # Meeting flow state machine
│   │
│   ├── context/                  # React Context providers
│   │   └── WalletContext.tsx      # Wallet connection + SGT state
│   │
│   └── data/                     # Pre-computed demo data
│       ├── demo-wallets.json     # 10 pre-analyzed mainnet wallets
│       └── sybil-demo.json       # 1,000 wallet Sybil Shield demo data
│
├── docs/                         # Documentation
│   ├── TRUSTTAP-PRD.md           # Product Requirements (source of truth)
│   ├── ARCHITECTURE.md           # This file
│   └── context/                  # Conversation context snapshots
│
└── research/                     # Research files (read-only reference)
    ├── FINAL-IDEA-VERDICT-V5.md
    ├── TRUSTTAP-FEASIBILITY-MAXIMIZED.md
    ├── v5-trusttap-deep-dive.md
    └── v5-warroom-brief.md
```

### Why This Structure

| Directory | Purpose | Rationale |
|-----------|---------|-----------|
| `src/app/` | Pages + API routes | Next.js 16 App Router convention |
| `src/components/` | UI components organized by feature domain | Mirrors the 4 screens + shared UI |
| `src/lib/` | Business logic, framework-agnostic | Can be tested independently. Used by both pages and API routes. |
| `src/types/` | Single source for TypeScript interfaces | PRD defines 8 interfaces — all live here |
| `src/hooks/` | React hooks for data fetching / state | Keeps page components thin |
| `src/context/` | Global state (wallet connection) | Only wallet state needs to be global |
| `src/data/` | Static JSON files | Pre-computed demo wallets loaded at build/startup |

---

## 3. Frontend Architecture

### Page Hierarchy

```
layout.tsx (Root)
├── WalletContext.Provider
│   ├── page.tsx (/) ─────── Connect Wallet
│   │                         └── SGTGate (if no SGT)
│   ├── profile/page.tsx ──── Trust Profile
│   │                         ├── ScoreDial
│   │                         ├── BadgeRow
│   │                         ├── ScoreBreakdown
│   │                         ├── AISummary
│   │                         └── MeetingHistory
│   ├── scan/page.tsx ──────── Meet Someone
│   │                         ├── QRGenerator (tab 1)
│   │                         ├── QRScanner (tab 2)
│   │                         ├── MeetingConfirm
│   │                         └── MeetingSuccess
│   ├── search/page.tsx ────── Wallet Lookup
│   │                         └── TrustProfileCard (results)
│   └── shield/page.tsx ────── Sybil Shield
│                              ├── ThresholdSlider
│                              ├── FilterAnimation
│                              └── ResultsDashboard
└── BottomNav (persistent across /profile, /scan, /search, /shield)
```

### Navigation Flow

```
/ (Connect Wallet)
│
├── No wallet connected ──► Stay on /
├── Wallet connected, no SGT ──► Show SGTGate overlay on /
└── Wallet connected, has SGT ──► Redirect to /profile
                                   │
                                   ├── /profile (default tab)
                                   ├── /scan
                                   ├── /search
                                   └── /shield
```

**BottomNav** is rendered in `layout.tsx` but only visible when the user is authenticated (wallet connected + SGT verified). The connect page (`/`) has no navigation bar.

### Route Protection

Pages `/profile`, `/scan`, `/search`, and `/shield` are protected. If a user navigates directly to them without a connected wallet + SGT, they redirect to `/`.

```typescript
// In each protected page:
const { wallet, hasSGT, isLoading } = useWallet();

if (isLoading) return <LoadingSpinner />;
if (!wallet || !hasSGT) {
  redirect('/');
}
```

### Component Design Principles

1. **Thin pages** — Pages fetch data via hooks, then compose components. No business logic in pages.
2. **Props over context** — Components receive data via props. Only wallet connection uses context.
3. **Loading/error/empty** — Every data-dependent component handles all three states.
4. **Mobile-first** — All components designed for 375px minimum width. Desktop is bonus.

---

## 4. Backend Architecture

### API Routes Overview

All backend logic lives in `src/app/api/`. Each route file exports HTTP method handlers.

```typescript
// Example: src/app/api/analyze-wallet/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 1. Parse + validate input
  // 2. Business logic (via lib/ modules)
  // 3. Return JSON response
}
```

### Request Pipeline

Every API route follows the same pattern:

```
Request
  │
  ▼
[1. Parse body / params]
  │
  ▼
[2. Validate input] ──── Invalid ──► 400 response
  │
  ▼
[3. Business logic] ──── Error ──► 500 response
  │ (calls lib/ modules)
  ▼
[4. Return JSON response]
```

### API Route → Lib Module Mapping

| API Route | Primary Lib Modules Used |
|-----------|-------------------------|
| `POST /api/analyze-wallet` | `validation.ts` → `cache.ts` → `helius.ts` → `scoring.ts` → `badges.ts` → `cache.ts` |
| `POST /api/ai-summary` | `validation.ts` → `ai.ts` |
| `POST /api/meeting/create` | `validation.ts` → `meeting.ts` (verify sigs) → `cache.ts` (check anti-gaming) → `cache.ts` (store) → `scoring.ts` (recalculate) |
| `GET /api/profile/[address]` | `validation.ts` → `cache.ts` → (if miss) `helius.ts` → `scoring.ts` → `badges.ts` → `ai.ts` → `cache.ts` |
| `GET /api/meetings/[address]` | `validation.ts` → `cache.ts` |
| `POST /api/sybil-check` | `validation.ts` → `cache.ts` (batch lookup) |

### Rate Limiting

Basic in-memory rate limiting using a Map with TTL:

```typescript
// lib/rate-limit.ts
const requestCounts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = requestCounts.get(key);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) return false;

  entry.count++;
  return true;
}
```

| Endpoint | Rate Limit |
|----------|-----------|
| `POST /api/analyze-wallet` | 10 requests / minute / IP |
| `POST /api/ai-summary` | 10 requests / minute / IP |
| `POST /api/meeting/create` | 5 requests / minute / wallet |
| `GET /api/profile/[address]` | 30 requests / minute / IP |
| `POST /api/sybil-check` | 5 requests / minute / IP |

---

## 5. Data Layer

### Storage Strategy: JSON File Cache

For the hackathon, all data is stored as JSON files on the filesystem. No database driver dependencies.

```
src/data/
├── demo-wallets.json       # Pre-computed (10 wallets, read-only)
├── sybil-demo.json         # Pre-generated (1,000 wallets for Sybil Shield)
└── (runtime, gitignored):
    ├── cache/
    │   └── profiles/
    │       ├── {walletAddress}.json   # CacheEntry per wallet
    │       └── ...
    └── meetings/
        └── meetings.json              # Array of Meeting records
```

### Cache Module Interface

```typescript
// lib/cache.ts

// Profile cache
export async function getCachedProfile(walletAddress: string): Promise<CacheEntry | null>;
export async function setCachedProfile(entry: CacheEntry): Promise<void>;
export async function isProfileStale(entry: CacheEntry): boolean;

// Meeting storage
export async function getMeetings(walletAddress: string): Promise<Meeting[]>;
export async function getMeetingBetween(walletA: string, walletB: string): Promise<Meeting | null>;
export async function storeMeeting(meeting: Meeting): Promise<void>;
export async function countMeetingsToday(walletAddress: string): Promise<number>;
export async function getLastMeetingBetween(walletA: string, walletB: string): Promise<Meeting | null>;

// Demo data
export function loadDemoWallets(): Map<string, CacheEntry>;
export function loadSybilDemoData(): WalletCheckResult[];
```

### Data Initialization

On first API request (or app startup in development):

1. Load `demo-wallets.json` into an in-memory `Map<string, CacheEntry>`
2. Load `sybil-demo.json` into memory for the Sybil Shield endpoint
3. Create `cache/profiles/` and `meetings/` directories if they don't exist
4. Demo wallets are always served from memory (never expire)
5. Live-analyzed wallets are written to `cache/profiles/{address}.json`

### Meeting Storage Schema

```json
// meetings/meetings.json
[
  {
    "id": "uuid-v4",
    "walletA": "Base58...",
    "walletB": "Base58...",
    "timestamp": "2026-02-28T15:30:00.000Z",
    "signatureA": "Base58...",
    "signatureB": "Base58...",
    "verified": true
  }
]
```

For the hackathon scale (demo with <50 meetings), a single JSON file with in-memory reads is sufficient. Writes are atomic (read → modify → write entire file).

---

## 6. External Services

### Helius API (Free Tier)

**Base URL:** `https://mainnet.helius-rpc.com/?api-key={HELIUS_API_KEY}`

**Budget:** 1,000,000 credits/month free. TrustTap uses ~5,110 credits for 10 demo wallets (0.5% of budget).

| Operation | Endpoint | Credits | Used For |
|-----------|----------|---------|----------|
| SGT check | `getAssetsByOwner` (DAS API) | 10/call | Verify SGT ownership |
| NFT holdings | `getAssetsByOwner` (DAS API) | 10/call | NFT count, blue-chip detection |
| Wallet age | `getSignaturesForAddress` | 1/call | First transaction timestamp |
| Transaction count | `getSignaturesForAddress` (paginate) | 1/page | Total confirmed txs |
| Protocol detection | `parse-transactions` | 100/batch | Source field → protocol names |

```typescript
// lib/helius.ts — module interface

export async function checkSGTOwnership(walletAddress: string): Promise<boolean>;
export async function getWalletAssets(walletAddress: string): Promise<HeliusAsset[]>;
export async function getWalletAge(walletAddress: string): Promise<{ ageDays: number; firstTxDate: string }>;
export async function getTransactionCount(walletAddress: string): Promise<number>;
export async function getProtocolsUsed(walletAddress: string): Promise<string[]>;
export async function getWalletAnalysis(walletAddress: string): Promise<WalletAnalysis>;
```

**Request pattern for `getAssetsByOwner`:**

```typescript
const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 'sgt-check',
    method: 'getAssetsByOwner',
    params: {
      ownerAddress: walletAddress,
      page: 1,
      limit: 1000,
      displayOptions: { showFungible: false }
    }
  })
});
```

**SGT Detection:**

```typescript
const hasSGT = assets.result.items.some(
  asset => asset.grouping?.some(
    g => g.group_value === 'GT22s89nU4iWFkNXj1Bw6uYhJJWDRPpShHt4Bk8f99Te'
  )
);
```

**Request pattern for `getSignaturesForAddress`:**

```typescript
const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 'wallet-age',
    method: 'getSignaturesForAddress',
    params: [
      walletAddress,
      { limit: 1, commitment: 'confirmed' }
      // Note: to get oldest first, paginate backwards using 'before' param
    ]
  })
});
```

**Request pattern for `parse-transactions` (Helius enhanced):**

```typescript
const response = await fetch(
  `https://api.helius.xyz/v0/transactions/?api-key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactions: signatureArray }) // max 100 per batch
  }
);
// Returns: [{ type: "SWAP", source: "JUPITER", ... }, ...]
```

### Claude API (Anthropic)

**Model:** `claude-haiku-4-5-20251001` (fastest, cheapest for simple text generation)

**Cost:** ~$0.002 per wallet analysis (200 input tokens + 100 output tokens)

```typescript
// lib/ai.ts — module interface

export async function generateTrustSummary(analysis: WalletAnalysis, score: number): Promise<string>;
export async function generateSybilAssessment(analysis: WalletAnalysis): Promise<{
  assessment: 'HUMAN' | 'LIKELY HUMAN' | 'UNCERTAIN' | 'LIKELY BOT' | 'BOT';
  confidence: string;
  explanation: string;
}>;
```

**Implementation uses the Anthropic SDK:**

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const response = await client.messages.create({
  model: 'claude-haiku-4-5-20251001',
  max_tokens: 200,
  messages: [{ role: 'user', content: prompt }]
});
```

### Solana RPC (via Helius)

Helius provides standard Solana JSON-RPC access on the same endpoint. No additional configuration needed. Used for `getSignaturesForAddress` which is a standard RPC method.

### SNS (Solana Name Service)

For `.sol` domain detection. Can be checked via Helius DAS API (domains show up as assets) or the `@bonfida/spl-name-service` SDK.

**Simplest approach for hackathon:** Check DAS API response for assets with domain-type metadata. If a `.sol` domain appears in the wallet's assets, it owns a domain.

---

## 7. Type System

All types live in `src/types/index.ts`. These are copied directly from PRD Section 9.

```typescript
// src/types/index.ts

// ─── Core Domain Types ───

export interface WalletAnalysis {
  walletAddress: string;
  hasSGT: boolean;
  walletAge: number;              // Days since first transaction
  firstTransactionDate: string;   // ISO 8601
  transactionCount: number;
  protocolsUsed: string[];
  hasStakedSOL: boolean;
  hasLPPositions: boolean;
  hasLendingPositions: boolean;
  nftCount: number;
  blueChipNFTCount: number;
  hasSolDomain: boolean;
  solDomain?: string;
  daoVoteCount: number;
  meetingCount: number;
  analyzedAt: string;             // ISO 8601
}

export interface TrustProfile {
  walletAddress: string;
  score: number;
  label: TrustLabel;
  color: string;
  breakdown: ScoreBreakdown;
  badges: Badge[];
  aiSummary: string;
  sybilAssessment: string;
  meetingHistory: Meeting[];
  analysis: WalletAnalysis;
  cachedAt: string;
}

export type TrustLabel = 'Unverified' | 'Basic' | 'Established' | 'Trusted' | 'Highly Trusted';

export interface ScoreBreakdown {
  device: number;       // 0-20
  walletAge: number;    // 0-15
  activity: number;     // 0-15
  diversity: number;    // 0-15
  defi: number;         // 0-15
  identity: number;     // 0-10
  physical: number;     // 0-10
}

export interface Meeting {
  id: string;
  walletA: string;
  walletB: string;
  timestamp: string;    // ISO 8601
  signatureA: string;
  signatureB: string;
  verified: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  earnedAt?: string;
}

export interface MeetingChallenge {
  walletAddress: string;
  timestamp: number;    // Unix milliseconds
  nonce: string;
  signature: string;    // Base58 Ed25519 signature
}

// ─── API Request/Response Types ───

export interface AnalyzeWalletRequest {
  walletAddress: string;
}

export interface AISummaryRequest {
  walletData: WalletAnalysis;
}

export interface AISummaryResponse {
  summary: string;
  sybilAssessment: 'HUMAN' | 'LIKELY HUMAN' | 'UNCERTAIN' | 'LIKELY BOT' | 'BOT';
  confidence: string;
}

export interface CreateMeetingRequest {
  walletA: string;
  walletB: string;
  timestamp: string;
  signatureA: string;
  signatureB: string;
}

export interface CreateMeetingResponse {
  success: boolean;
  meetingId: string;
  newScores: { walletA: number; walletB: number };
}

export interface SybilCheckRequest {
  walletAddresses: string[];
  minTrustScore: number;
}

export interface SybilCheckResult {
  total: number;
  sgtVerified: number;
  meetsThreshold: number;
  rejected: number;
  results: WalletCheckResult[];
}

export interface WalletCheckResult {
  walletAddress: string;
  hasSGT: boolean;
  trustScore: number | null;
  passed: boolean;
  reason?: string;
}

// ─── Cache Types ───

export interface CacheEntry {
  walletAddress: string;
  analysis: WalletAnalysis;
  profile: TrustProfile;
  cachedAt: string;
  expiresAt: string;
  source: 'precomputed' | 'live';
}

// ─── Anti-Gaming Types ───

export type AntiGamingViolation = 'daily_limit' | 'cooldown' | 'self_meeting' | 'expired_challenge';
```

---

## 8. Module Specifications

### lib/constants.ts

Centralized configuration. All magic values from the PRD live here.

```typescript
// SGT addresses (PRD Section 6, Feature 1)
export const SGT_COLLECTION_ADDRESS = 'GT22s89nU4iWFkNXj1Bw6uYhJJWDRPpShHt4Bk8f99Te';
export const SGT_MINT_AUTHORITY = 'GT2zuHVaZQYZSyQMgJPLzvkmyztfyXg2NJunqFp4p3A4';

// Known protocol program IDs (PRD Section 6, Feature 2)
export const PROTOCOL_PROGRAM_IDS: Record<string, string> = {
  'Jupiter':        'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
  'Raydium AMM':    '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
  'Raydium CLMM':   'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK',
  'Marinade':        'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD',
  'Orca Whirlpool': 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc',
  'Tensor':          'TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN',
  'Magic Eden':      'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K',
  'Solend':          'So1endDq2YkqhipRh3WViPa8hFSl6XYA9oMVFwLQbaw',
  'Marginfi':        'MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA',
  'SPL Governance':  'GovER5Lthms3bLBqWub97yVRMmNLaGKKOjL7SdN4QNpM',
  'Squads':          'SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu',
};

// Score thresholds (PRD Section 11)
export const SCORE_LABELS: { max: number; label: TrustLabel; color: string }[] = [
  { max: 20, label: 'Unverified', color: '#EF4444' },
  { max: 40, label: 'Basic',      color: '#F97316' },
  { max: 60, label: 'Established', color: '#EAB308' },
  { max: 80, label: 'Trusted',    color: '#22C55E' },
  { max: 100, label: 'Highly Trusted', color: '#10B981' },
];

// Anti-gaming constants (PRD Section 13)
export const MAX_MEETINGS_PER_DAY = 5;
export const PAIR_COOLDOWN_DAYS = 7;
export const CHALLENGE_EXPIRY_MS = 60_000; // 60 seconds
export const MAX_PHYSICAL_SCORE = 10;
export const POINTS_PER_MEETING = 2;

// Badge definitions (PRD Section 11)
export const BADGE_DEFINITIONS: { id: string; name: string; description: string }[] = [
  { id: 'veteran',    name: 'Veteran',     description: 'Active Solana participant for over a year' },
  { id: 'defi-degen', name: 'DeFi Degen',  description: 'Diverse DeFi activity across the ecosystem' },
  { id: 'whale',      name: 'Whale',       description: 'Notable economic commitment to Solana' },
  { id: 'governor',   name: 'Governor',    description: 'Active participant in on-chain governance' },
  { id: 'networker',  name: 'Networker',   description: 'Well-connected in the Seeker community' },
  { id: 'og',         name: 'OG',          description: 'Early Solana ecosystem participant' },
  { id: 'builder',    name: 'Builder',     description: 'Contributor to the Solana ecosystem' },
];

// Cache configuration
export const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
export const CACHE_DIR = 'src/data/cache/profiles';
export const MEETINGS_FILE = 'src/data/meetings/meetings.json';
```

### lib/scoring.ts

Pure function. Deterministic. No side effects. Directly implements PRD Section 11.

```typescript
export function calculateTrustScore(analysis: WalletAnalysis): {
  score: number;
  breakdown: ScoreBreakdown;
  label: TrustLabel;
  color: string;
};

export function calculateDeviceScore(hasSGT: boolean): number;        // 0 or 20
export function calculateAgeScore(ageDays: number): number;           // 0, 5, 10, or 15
export function calculateActivityScore(txCount: number): number;      // 0, 5, 10, or 15
export function calculateDiversityScore(protocols: string[]): number; // 0-15 (3 per protocol, cap 15)
export function calculateDefiScore(analysis: WalletAnalysis): number; // 0-15 (5 per category)
export function calculateIdentityScore(analysis: WalletAnalysis): number; // 0-10
export function calculatePhysicalScore(meetingCount: number): number; // 0-10 (2 per meeting, cap 10)

export function getScoreLabel(score: number): TrustLabel;
export function getScoreColor(score: number): string;
```

### lib/badges.ts

Evaluates badge criteria against WalletAnalysis. Pure function.

```typescript
export function evaluateBadges(analysis: WalletAnalysis): Badge[];
```

**Badge criteria (from PRD Section 11):**

| Badge ID | Condition |
|----------|-----------|
| `veteran` | `analysis.walletAge > 365` |
| `defi-degen` | `analysis.protocolsUsed.length >= 5` |
| `whale` | TBD threshold — for hackathon, skip or set high NFT/token count |
| `governor` | `analysis.daoVoteCount > 0` |
| `networker` | `analysis.meetingCount >= 5` |
| `og` | `analysis.walletAge > 730` (2 years) |
| `builder` | TBD — detect NFT creation or program deployment in transaction history |

### lib/meeting.ts

Handles meeting challenge generation, signature verification, and anti-gaming checks.

```typescript
// Client-side: generate a challenge for QR display
export function createMeetingChallenge(walletAddress: string): Omit<MeetingChallenge, 'signature'>;

// Client-side: build the message string for signing
export function buildChallengeMessage(walletAddress: string, timestamp: number, nonce: string): string;

// Client + server: verify an Ed25519 signature on a challenge
export function verifyMeetingSignature(challenge: MeetingChallenge): boolean;

// Server-side: check all anti-gaming rules
export async function checkAntiGamingRules(
  walletA: string,
  walletB: string,
  timestamp: string
): Promise<{ allowed: boolean; violation?: AntiGamingViolation }>;
```

**Message format (PRD Section 6, Feature 5):**
```
{walletAddress}:{timestamp}:{nonce}
```

**Signature verification uses tweetnacl:**
```typescript
import nacl from 'tweetnacl';
import bs58 from 'bs58';

export function verifyMeetingSignature(challenge: MeetingChallenge): boolean {
  const message = buildChallengeMessage(
    challenge.walletAddress,
    challenge.timestamp,
    challenge.nonce
  );
  const messageBytes = new TextEncoder().encode(message);
  const signatureBytes = bs58.decode(challenge.signature);
  const publicKeyBytes = bs58.decode(challenge.walletAddress);

  return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
}
```

### lib/validation.ts

Input validation for all API endpoints.

```typescript
// Solana wallet addresses are Base58-encoded, 32-44 characters
export function isValidWalletAddress(address: string): boolean;

// Validate meeting creation request
export function validateCreateMeetingRequest(body: unknown): {
  valid: boolean;
  data?: CreateMeetingRequest;
  error?: string;
};

// Validate analyze-wallet request
export function validateAnalyzeWalletRequest(body: unknown): {
  valid: boolean;
  data?: AnalyzeWalletRequest;
  error?: string;
};

// Validate sybil-check request
export function validateSybilCheckRequest(body: unknown): {
  valid: boolean;
  data?: SybilCheckRequest;
  error?: string;
};
```

---

## 9. API Route Specifications

Each route is mapped directly from PRD Section 10. See that section for full request/response shapes. This section covers implementation details only.

### POST /api/analyze-wallet/route.ts

```
Input: { walletAddress: string }
│
├── Validate address format
├── Check cache (demo wallets in-memory, live wallets on disk)
│   ├── Hit + fresh → return cached profile
│   └── Miss or stale ↓
├── Call helius.checkSGTOwnership()
│   └── No SGT → 404
├── Call helius.getWalletAnalysis() (orchestrates all Helius calls)
├── Call scoring.calculateTrustScore(analysis)
├── Call badges.evaluateBadges(analysis)
├── Write to cache
└── Return TrustProfile (without AI summary — that's a separate call)
```

### POST /api/ai-summary/route.ts

```
Input: { walletData: WalletAnalysis }
│
├── Validate wallet data has required fields
├── Call ai.generateTrustSummary(walletData, score)
├── Call ai.generateSybilAssessment(walletData)
└── Return { summary, sybilAssessment, confidence }
```

**Note:** AI summary is a separate endpoint so the frontend can load the profile instantly from cache and fetch the AI summary asynchronously.

### POST /api/meeting/create/route.ts

```
Input: { walletA, walletB, timestamp, signatureA, signatureB }
│
├── Validate all fields present and valid format
├── Verify signatureA via meeting.verifyMeetingSignature()
├── Verify signatureB via meeting.verifyMeetingSignature()
├── Check anti-gaming rules via meeting.checkAntiGamingRules()
│   └── Violation → 403 with violation type
├── Store meeting record via cache.storeMeeting()
├── Recalculate scores for both wallets
└── Return { success, meetingId, newScores }
```

### GET /api/profile/[address]/route.ts

```
Input: walletAddress (URL param)
│
├── Validate address format
├── Check cache
│   ├── Hit → return profile
│   └── Miss → call POST /api/analyze-wallet logic internally
└── Return full TrustProfile
```

### GET /api/meetings/[address]/route.ts

```
Input: walletAddress (URL param)
│
├── Validate address format
├── Query meetings from cache.getMeetings(address)
└── Return { walletAddress, meetings, total }
```

### POST /api/sybil-check/route.ts

```
Input: { walletAddresses: string[], minTrustScore: number }
│
├── Validate input
├── For hackathon demo: return pre-generated data from sybil-demo.json
│   (Filtered by the provided minTrustScore threshold)
├── For live mode: batch lookup each wallet from cache
└── Return SybilCheckResult
```

---

## 10. State Management

### Global State: WalletContext

Only wallet connection state is global. Everything else is fetched per-page.

```typescript
// src/context/WalletContext.tsx

interface WalletState {
  publicKey: string | null;       // Connected wallet address
  connected: boolean;
  hasSGT: boolean;                // SGT verification result
  isConnecting: boolean;
  isCheckingSGT: boolean;
  error: string | null;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
}
```

### Page-Level State

Each page manages its own data via hooks:

```typescript
// /profile page
const { profile, isLoading, error, refresh } = useTrustProfile(walletAddress);

// /scan page
const { step, challenge, partnerProfile, confirm, reset } = useMeeting(walletAddress);

// /search page — local state only (search input + result)

// /shield page — local state only (threshold + demo results)
```

### Hook: useTrustProfile

```typescript
interface UseTrustProfileReturn {
  profile: TrustProfile | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useTrustProfile(walletAddress: string | null): UseTrustProfileReturn;
```

Fetches from `GET /api/profile/{address}`. Then asynchronously fetches AI summary from `POST /api/ai-summary` and merges it into the profile.

### Hook: useMeeting

State machine for the meeting exchange flow:

```
IDLE → GENERATING_QR → SHOWING_QR → SCANNING → VERIFYING → CONFIRMING → SUBMITTING → SUCCESS
                                                                                        │
                                                                                        └→ IDLE (reset)
```

```typescript
type MeetingStep =
  | 'idle'
  | 'showing_qr'      // Displaying own QR
  | 'scanning'         // Camera/paste active
  | 'partner_preview'  // Showing scanned partner's profile
  | 'submitting'       // Sending to backend
  | 'success'          // Meeting verified
  | 'error';           // Something went wrong

interface UseMeetingReturn {
  step: MeetingStep;
  challenge: MeetingChallenge | null;   // Current QR challenge
  partnerChallenge: MeetingChallenge | null;
  partnerProfile: TrustProfile | null;
  error: string | null;
  timeRemaining: number;                // QR countdown (seconds)

  generateQR: () => Promise<void>;
  handleScan: (data: string) => Promise<void>;
  handlePaste: (data: string) => Promise<void>;
  confirmMeeting: () => Promise<void>;
  reset: () => void;
}
```

---

## 11. Wallet Integration

### Mobile Wallet Adapter (MWA)

MWA works in Chrome browser on Seeker. For development, we test with browser wallets that support the Wallet Standard.

**Key operations:**

1. **Connect wallet** — get public key
2. **Sign message** — for meeting challenges (Ed25519 signature)

```typescript
// lib/wallet.ts

import { useWallet } from '@solana/wallet-adapter-react'; // or MWA equivalent

export async function connectWallet(): Promise<string>; // Returns public key (Base58)
export async function signMessage(message: Uint8Array): Promise<Uint8Array>; // Returns signature
export function disconnectWallet(): void;
```

### Wallet Adapter Packages

```
@solana/wallet-adapter-base
@solana/wallet-adapter-react
@solana/wallet-adapter-react-ui
@solana/wallet-adapter-wallets
```

For MWA-specific support on Seeker's Chrome:
```
@solana-mobile/wallet-adapter-mobile
```

### Connection Flow in WalletContext

```typescript
async function connect() {
  setIsConnecting(true);
  try {
    // 1. Request wallet connection (triggers MWA chooser on Seeker)
    const pubkey = await connectWallet();
    setPublicKey(pubkey);
    setConnected(true);

    // 2. Check SGT ownership
    setIsCheckingSGT(true);
    const sgtResult = await fetch(`/api/profile/${pubkey}`).then(r => {
      if (r.status === 404) return { hasSGT: false };
      return r.json();
    });
    setHasSGT(sgtResult.hasSGT !== false);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsConnecting(false);
    setIsCheckingSGT(false);
  }
}
```

---

## 12. Cryptographic Operations

### Meeting Challenge Signing

**Algorithm:** Ed25519 (same as Solana's native signing)

**Flow (User A — QR Generator):**

```typescript
// 1. Create challenge data
const challenge = {
  walletAddress: myPublicKey,
  timestamp: Date.now(),
  nonce: crypto.randomUUID()
};

// 2. Build message string
const message = `${challenge.walletAddress}:${challenge.timestamp}:${challenge.nonce}`;

// 3. Sign via wallet adapter (MWA / Seed Vault)
const messageBytes = new TextEncoder().encode(message);
const signatureBytes = await wallet.signMessage(messageBytes);

// 4. Encode signature as Base58
const signature = bs58.encode(signatureBytes);

// 5. Combine into QR payload
const qrPayload: MeetingChallenge = { ...challenge, signature };
const qrData = JSON.stringify(qrPayload);
```

**Flow (User B — Scanner/Verifier):**

```typescript
// 1. Parse QR payload
const challenge: MeetingChallenge = JSON.parse(scannedData);

// 2. Verify signature
const isValid = verifyMeetingSignature(challenge);

// 3. Check freshness
const isExpired = Date.now() - challenge.timestamp > CHALLENGE_EXPIRY_MS;

// 4. If valid + fresh: generate counter-signature
const counterMessage = `${challenge.walletAddress}:${challenge.timestamp}:${challenge.nonce}:${myPublicKey}`;
const counterSigBytes = await wallet.signMessage(new TextEncoder().encode(counterMessage));
const counterSignature = bs58.encode(counterSigBytes);

// 5. Submit both to backend
await fetch('/api/meeting/create', {
  method: 'POST',
  body: JSON.stringify({
    walletA: challenge.walletAddress,
    walletB: myPublicKey,
    timestamp: new Date(challenge.timestamp).toISOString(),
    signatureA: challenge.signature,
    signatureB: counterSignature
  })
});
```

### Dependencies

```
tweetnacl       — Ed25519 sign/verify (nacl.sign.detached.verify)
bs58            — Base58 encode/decode for signatures and public keys
```

Both are small, pure-JS, zero-dependency packages.

---

## 13. Caching Architecture

### Three-Tier Cache

```
Tier 1: In-Memory (demo wallets)
  ├── Loaded from demo-wallets.json at startup
  ├── Never expires
  ├── ~10 entries
  └── Lookup: O(1) via Map

Tier 2: Filesystem (live-analyzed wallets)
  ├── Written to src/data/cache/profiles/{address}.json
  ├── Expires after 24 hours (checked on read)
  ├── Grows as users search wallets
  └── Lookup: O(1) via filename

Tier 3: API (Helius + Claude)
  ├── Called only on cache miss
  ├── Results written to Tier 2
  └── 5-15 second latency
```

### Cache Read Logic

```typescript
async function getProfile(address: string): Promise<TrustProfile | null> {
  // Tier 1: check in-memory demo wallets
  const demo = demoWallets.get(address);
  if (demo) return demo.profile;

  // Tier 2: check filesystem
  const cached = await getCachedProfile(address);
  if (cached && !isProfileStale(cached)) return cached.profile;

  // Tier 3: fetch live (caller handles this)
  return null;
}
```

### Meeting Cache

Meetings are append-only. The file is small (hackathon scale). Read into memory, filter, return.

```typescript
async function getMeetings(walletAddress: string): Promise<Meeting[]> {
  const allMeetings = await readMeetingsFile();
  return allMeetings.filter(
    m => m.walletA === walletAddress || m.walletB === walletAddress
  );
}
```

---

## 14. Error Handling Strategy

### Frontend Error Boundaries

Each page wraps its content in an error boundary that shows `ErrorMessage` component.

### API Error Response Format

All API errors follow a consistent shape:

```typescript
interface APIError {
  error: string;        // Human-readable message
  code?: string;        // Machine-readable code (e.g., "daily_limit")
  details?: unknown;    // Additional context
}
```

### Error Scenarios by Feature

| Feature | Error | User Sees | Recovery |
|---------|-------|-----------|----------|
| SGT Gate | Helius API down | "Unable to verify device. Please try again." | Retry button |
| SGT Gate | No SGT found | "Seeker Required" screen with explanation | "Connect Different Wallet" |
| Wallet Analysis | Rate limited | "Analysis in progress. Please wait." | Auto-retry after cooldown |
| Wallet Analysis | Empty wallet | Profile with score 20 (SGT only) | Normal — expected for new wallets |
| AI Summary | Claude API down | Profile shows all data except AI summary | "AI summary unavailable" text |
| QR Exchange | Expired challenge | "QR expired. Ask for a fresh one." | Partner generates new QR |
| QR Exchange | Invalid signature | "Invalid verification data." | Retry scan |
| Meeting Create | Anti-gaming violation | Specific message per rule | Inform user of the rule |
| Search | Invalid address | "Invalid wallet address" inline error | Fix input |
| Search | Not SGT-verified | "This wallet is not SGT-verified" | Informational |

### Retry Strategy

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(r => setTimeout(r, baseDelayMs * Math.pow(2, attempt)));
    }
  }
  throw new Error('Unreachable');
}
```

Used by `lib/helius.ts` for all Helius API calls.

---

## 15. Environment Configuration

### .env.local (gitignored)

```env
# Helius API (free tier)
HELIUS_API_KEY=your_helius_api_key

# Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key

# Network configuration
HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=
HELIUS_API_URL=https://api.helius.xyz/v0

# Feature flags (hackathon)
NEXT_PUBLIC_USE_DEMO_SGT=true        # Use mock SGT on devnet
NEXT_PUBLIC_DEMO_MODE=true           # Load pre-computed wallets
```

### Environment Access Pattern

```typescript
// Server-side only (API routes, lib modules)
const heliusKey = process.env.HELIUS_API_KEY;
const anthropicKey = process.env.ANTHROPIC_API_KEY;

// Client-side (prefixed with NEXT_PUBLIC_)
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
```

---

## 16. Dependency Map

### Production Dependencies

| Package | Version | Purpose | Size | Used By |
|---------|---------|---------|------|---------|
| `next` | 16.1.6 | Framework | (already installed) | Everything |
| `react` | 19.2.3 | UI library | (already installed) | Everything |
| `react-dom` | 19.2.3 | React DOM | (already installed) | Everything |
| `tweetnacl` | ^1.0.3 | Ed25519 signatures | 7KB | `lib/meeting.ts` |
| `bs58` | ^6.0.0 | Base58 encoding | 3KB | `lib/meeting.ts` |
| `react-qr-code` | ^2.0.15 | QR code generation | 15KB | `QRGenerator.tsx` |
| `html5-qrcode` | ^2.3.8 | QR code scanning | 120KB | `QRScanner.tsx` |
| `framer-motion` | ^11.0.0 | Animations | 140KB | Components |
| `@anthropic-ai/sdk` | ^0.30.0 | Claude API client | 50KB | `lib/ai.ts` |
| `@solana/wallet-adapter-base` | ^0.9.0 | Wallet connection | 20KB | `lib/wallet.ts` |
| `@solana/wallet-adapter-react` | ^0.15.0 | React hooks for wallet | 10KB | `context/WalletContext.tsx` |
| `@solana/wallet-adapter-react-ui` | ^0.9.0 | Wallet UI components | 25KB | Connect button |
| `@solana/wallet-adapter-wallets` | ^0.19.0 | Wallet adapters | 30KB | Provider config |
| `@solana-mobile/wallet-adapter-mobile` | ^2.0.0 | MWA support | 15KB | Mobile connection |

### Dev Dependencies

Already installed: `typescript`, `eslint`, `eslint-config-next`, `tailwindcss`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom`.

### Install Command (Day 1)

```bash
npm install tweetnacl bs58 react-qr-code html5-qrcode framer-motion \
  @anthropic-ai/sdk \
  @solana/wallet-adapter-base @solana/wallet-adapter-react \
  @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets \
  @solana-mobile/wallet-adapter-mobile
```

---

## 17. Build & Deploy Pipeline

### Development

```bash
npm run dev              # Next.js dev server (Turbopack)
```

### Production Build

```bash
npm run build            # Next.js production build
npm run start            # Serve production build locally
```

### PWA Configuration

**next.config.ts additions:**
```typescript
const nextConfig: NextConfig = {
  output: 'standalone',  // For potential containerized deployment
};
```

**public/manifest.json:**
```json
{
  "name": "TrustTap+",
  "short_name": "TrustTap",
  "description": "Your trust passport for crypto",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#10B981",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### APK Wrapping (Day 9, Optional)

```bash
npx @nicbarker/nicbarker.github.io init  # Bubblewrap
# Or: npx bubblewrap init --manifest https://trusttap.local/manifest.json
```

Wraps the PWA as an Android APK (Trusted Web Activity) for dApp Store submission.

### Typecheck

```bash
npx tsc --noEmit        # Run before every commit
```

---

## 18. Performance Budget

### Target Metrics (from PRD Section 18)

| Metric | Target |
|--------|--------|
| Cached profile load | < 3 seconds |
| QR meeting exchange (end-to-end) | < 30 seconds |
| Score dial animation | 60fps |
| AI summary generation | < 5 seconds |
| All interactions | < 100ms response |

### Bundle Size Budget

| Route | Target JS Size (gzipped) |
|-------|-------------------------|
| `/` (Connect) | < 50KB |
| `/profile` | < 100KB (includes chart lib) |
| `/scan` | < 150KB (includes QR scanner) |
| `/search` | < 60KB |
| `/shield` | < 80KB |

### Optimization Strategies

1. **Dynamic imports** for heavy components (QR scanner, charts)
2. **Pre-computed demo data** avoids API calls during demo
3. **Async AI summary** — profile renders immediately, AI text loads after
4. **No SSR for authenticated pages** — all protected pages are client-only

```typescript
// Dynamic import for QR scanner (only loaded on /scan page)
const QRScanner = dynamic(() => import('@/components/meeting/QRScanner'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
```

---

## 19. Testing Strategy

### Hackathon Testing (Minimal, Focused)

Given the 9-day timeline, testing focuses on critical paths only:

| Test Type | What to Test | Tool |
|-----------|-------------|------|
| **Unit** | `scoring.ts` — trust score calculation | Jest or Vitest |
| **Unit** | `meeting.ts` — signature verification | Jest or Vitest |
| **Unit** | `validation.ts` — input validation | Jest or Vitest |
| **Manual** | Full QR exchange flow (two browser windows) | Manual |
| **Manual** | All error states | Manual |

### Critical Unit Tests

```typescript
// scoring.test.ts
describe('calculateTrustScore', () => {
  it('returns 20 for SGT-only wallet with no history');
  it('returns 88 for DeFi Dami persona (PRD example 1)');
  it('returns 85 for Conference Carlos persona (PRD example 2)');
  it('returns 23 for New User Nadia persona (PRD example 3)');
  it('caps protocol diversity at 15 points');
  it('caps physical meetings at 10 points');
  it('assigns correct label and color for each score range');
});

// meeting.test.ts
describe('verifyMeetingSignature', () => {
  it('returns true for valid signature');
  it('returns false for tampered message');
  it('returns false for wrong public key');
});
```

These tests validate the core algorithm against the PRD's worked examples, ensuring the implementation matches the specification exactly.

---

## 20. Implementation Order

### Dependency Graph

```
Types (types/index.ts)           ← No dependencies. Build first.
  │
  ├── Constants (lib/constants.ts) ← Only depends on types
  │
  ├── Validation (lib/validation.ts) ← Only depends on constants
  │
  ├── Helius Client (lib/helius.ts) ← Depends on types, constants
  │
  ├── Scoring (lib/scoring.ts) ← Depends on types, constants
  │
  ├── Badges (lib/badges.ts) ← Depends on types, constants
  │
  ├── Cache (lib/cache.ts) ← Depends on types
  │
  ├── Meeting (lib/meeting.ts) ← Depends on types, constants, cache
  │
  ├── AI (lib/ai.ts) ← Depends on types
  │
  ├── Wallet (lib/wallet.ts) ← Depends on types
  │
  └── API Routes ← Depend on all lib modules
      │
      └── Pages ← Depend on API routes + components
          │
          └── Components ← Depend on types + hooks
```

### Build Sequence (Maps to PRD 9-Day Timeline)

**Day 1: Foundation**
1. `src/types/index.ts` — all interfaces
2. `src/lib/constants.ts` — all constants
3. `src/lib/validation.ts` — input validators
4. `src/lib/wallet.ts` — MWA connection
5. `src/context/WalletContext.tsx` — wallet state provider
6. `src/app/page.tsx` — Connect Wallet screen
7. `src/components/wallet/ConnectButton.tsx`
8. `src/components/wallet/SGTGate.tsx`
9. `src/components/layout/BottomNav.tsx`
10. Install all dependencies

**Day 2: Data Engine**
1. `src/lib/helius.ts` — all Helius API methods
2. Pre-compute 10 demo wallets → `src/data/demo-wallets.json`
3. `src/lib/cache.ts` — cache read/write

**Day 3: Scoring + API**
1. `src/lib/scoring.ts` — trust score algorithm
2. `src/lib/badges.ts` — badge evaluation
3. `src/app/api/analyze-wallet/route.ts`
4. `src/app/api/profile/[address]/route.ts`
5. Unit tests for scoring (validate against PRD examples)

**Day 4: AI + Profile UI**
1. `src/lib/ai.ts` — Claude integration
2. `src/app/api/ai-summary/route.ts`
3. `src/components/trust/*` — all trust profile components
4. `src/hooks/useTrustProfile.ts`
5. `src/app/profile/page.tsx`

**Day 5: Meeting System**
1. `src/lib/meeting.ts` — challenge + verification
2. `src/app/api/meeting/create/route.ts`
3. `src/app/api/meetings/[address]/route.ts`
4. `src/components/meeting/*` — QR + scanner + confirmation
5. `src/hooks/useMeeting.ts`
6. `src/app/scan/page.tsx`

**Day 6: Sybil Shield + Search**
1. `src/data/sybil-demo.json` — generate demo data
2. `src/app/api/sybil-check/route.ts`
3. `src/components/shield/*`
4. `src/app/shield/page.tsx`
5. `src/app/search/page.tsx`

**Day 7: Polish**
1. Animations (Framer Motion on all components)
2. Error states, loading states, empty states
3. PWA manifest + icons
4. Feature freeze

---

*This architecture document is derived entirely from the PRD (`docs/TRUSTTAP-PRD.md`). Every interface, constant, endpoint, and flow traces back to a specific PRD section. No data has been invented.*
