# TrustTap+: On-Chain Reputation for Solana Seeker

A mobile-first trust scoring system that analyzes Solana wallet history to generate verifiable reputation scores. Built for the Solana Seeker ecosystem.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Solana](https://img.shields.io/badge/Solana-Mobile-9945FF?logo=solana&logoColor=white)](https://solanamobile.com/)
[![Tests](https://img.shields.io/badge/tests-124_passing-brightgreen)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Live Demo

**[trusttap.vercel.app](https://trusttap.vercel.app)**

Tap "Connect Wallet" to auto-connect with a demo wallet and explore the full app. No setup needed.

## Demo Video

**[Watch the demo on YouTube](https://youtu.be/Rq8BfpDrnZY)**

---

## What Is TrustTap+?

TrustTap+ turns your Solana wallet history into a trust score from 0 to 100. It reads on-chain data through the Helius RPC API and scores wallets across 8 dimensions: device ownership (SGT), financial depth, wallet age, transaction activity, protocol diversity, DeFi participation, identity signals, and physical meeting verification.

Saga Genesis Token holders earn a 25-point bonus in the Device dimension, but all wallets can access the full platform and receive scores. This creates a trusted community layer on Solana Mobile where every member's reputation is backed by verifiable on-chain activity.

---

## Screenshots

| Profile | Search | Level Up | QR Scan |
|---------|--------|----------|---------|
| <img src="docs/images/profile.png" width="250"> | <img src="docs/images/search.png" width="250"> | <img src="docs/images/levelup.png" width="250"> | <img src="docs/images/scan.png" width="250"> |

---

## Features

- **8-Dimension Trust Score**: Device (SGT), financial depth, wallet age, activity volume, protocol diversity, DeFi depth, identity signals, and physical meetings
- **SGT Bonus Scoring**: Saga Genesis Token holders earn a 25-point Device bonus; all wallets get full access
- **Wallet Lookup**: Search any Solana address or .sol domain to view their trust profile
- **QR Meeting Verification**: Scan QR codes in person to cryptographically verify you met another wallet holder (Ed25519 signatures)
- **Level Up Recommendations**: AI-powered suggestions for improving your trust score based on current wallet gaps
- **Sybil Detection**: Built-in pattern detection flags bot-like activity, airdrop farming, and shallow DeFi engagement
- **AI Trust Summaries**: Natural language wallet analysis powered by Groq LLM
- **PWA Install**: Add to home screen on Seeker for a native app experience
- **SKR Tipping**: Send SKR tokens to other users after viewing their profile or verifying a meeting
- **Mobile Wallet Adapter**: Connect directly from Solana Mobile devices via MWA

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, PWA) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion |
| Wallet | Solana Mobile Wallet Adapter (MWA) |
| On-Chain Data | Helius RPC (free tier) |
| AI Summaries | Groq API (Llama) |
| QR Codes | react-qr-code + html5-qrcode |
| Crypto | tweetnacl + bs58 (Ed25519 signatures) |
| Testing | Vitest + Testing Library |
| Mobile | React Native (Expo) + MWA |
| Deployment | Vercel (web), EAS Build (Android APK) |

---

## Try It Out

Open [trusttap.vercel.app](https://trusttap.vercel.app) on your phone or desktop. Tap "Connect Wallet" to auto-connect with a demo wallet. No Seeker device, no real wallet, no extensions needed.

From there you can:

1. **Profile** - View the trust score dial, 8-dimension breakdown, AI summary, and meeting history
2. **Search** - Paste any demo wallet address below to see different trust tiers
3. **Level Up** - Toggle recommended actions on/off to preview how they change your projected score
4. **QR Scan** - See QR code generation for in-person meeting verification
5. **Sybil Detection** - Low-scoring wallets show which suspicious patterns were flagged

### Demo wallets

| Address | Score | Tier |
|---------|-------|------|
| `eHHHqVwd1DsmwmbK913uRTXKB7wT35uP775HVRffRDB3` | 86 | Highly Trusted |
| `fRRwPwbb9wqTbf9ZDHjMRVKZoDBPsjsP7Rh7VZVMqxX3` | 75 | Trusted |
| `M75RjudB15Mo7HZos9FHDRHTo9M3uTjPwdZdVq3KmMuZ` | 67 | Trusted |
| `Rb5RTuodu9VHMMVPhwXjMFTwqyDuwfH1ouZFqXTZXTsT` | 55 | Established |
| `C5myTZf59hw5X9BMoHyDmMBh5Rq3fy5yqb3XFFyh1Ddd` | 38 | Basic |
| `GVX1bw3wFqyDH3yBF3Zyq1DbsP1DmwwPFjfyyqVZRH1F` | 31 | Basic |

### On a real Seeker device

Without the `DEMO_MODE` env var, "Connect Wallet" opens Mobile Wallet Adapter (MWA), connects to your real wallet, and computes a live trust score from on-chain data. SGT holders get a 25-point Device bonus. Same app, real data.

---

## How It Works

**Scoring algorithm:** The trust score is a weighted sum across 8 dimensions, each with a defined maximum. Device ownership (SGT) is worth 25 points as a binary gate. Wallet age uses an asymptotic curve (10 points max, reaching ~6.3 at 1 year). Activity volume is tiered by transaction count (10 points). Financial depth is tiered by portfolio size in SOL-equivalent (10 points). Protocol diversity counts unique protocols with bonuses for advanced DeFi like CLMMs, derivatives, and vaults (10 points). DeFi depth scores based on interaction complexity (13 points). Identity tracks .sol domain ownership and other on-chain identity signals (10 points). Physical meetings verified via QR + Ed25519 signatures contribute up to 12 points.

**SGT scoring:** On first connect, the app queries the wallet's token accounts for the Saga Genesis Token (collection `GT22s89nU4iWFkNXj1Bw6uYhJJWDRPpShHt4Bk8f99Te`). SGT holders receive 25 points in the Device dimension. Non-holders still get full platform access with scores based on the remaining 7 dimensions (75 point max).

**Meeting verification:** When two users scan each other's QR codes, each code contains the wallet address and a timestamp. The app creates a meeting record and both parties sign it with their wallet's Ed25519 key via MWA. This proves both wallets were physically present at the same time.

```
Solana Seeker Device
  |
  v
Next.js PWA (Vercel)
  |
  +---> Mobile Wallet Adapter ---> Wallet App (sign/connect)
  |
  +---> Helius RPC API ----------> Solana Mainnet (read-only)
  |         |
  |         +---> Transaction history
  |         +---> Token balances (SGT, NFTs, DeFi)
  |         +---> Account age, staking, governance
  |
  +---> Scoring Engine ----------> 8-dimension trust score (0-100)
  |
  +---> Groq LLM API -----------> Natural language trust summary
  |
  +---> QR + Ed25519 Sigs ------> In-person meeting verification
```

---

## API Reference

All endpoints are serverless functions on Vercel. No authentication required for demo mode.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile/[address]` | Fetch trust profile for a wallet address |
| GET | `/api/meetings/[address]` | List verified meetings for a wallet |
| GET | `/api/demo-wallets` | Get all pre-computed demo wallet profiles |
| POST | `/api/ai-summary` | Generate AI trust summary for a wallet |
| GET | `/api/resolve-domain` | Resolve .sol domain to wallet address |
| POST | `/api/sybil-check` | Run sybil detection on a wallet |
| GET | `/api/skr-balance/[address]` | Check SKR token balance |
| POST | `/api/analyze-wallet` | Full wallet analysis with Helius data |
| GET | `/api/network/[wallet]` | Get wallet's on-chain network graph |
| POST | `/api/meeting/create` | Record a verified in-person meeting |

---

## Running Locally

```bash
git clone https://github.com/dmustapha/trusttap.git
cd trusttap
npm install
cp .env.example .env.local
```

Required environment variables:

| Variable | Description |
|----------|-------------|
| `HELIUS_API_KEY` | Free API key from [helius.dev](https://helius.dev) |
| `GROQ_API_KEY` | Free API key from [console.groq.com](https://console.groq.com) |
| `DEMO_MODE` | Set to `true` to use pre-computed demo wallets |
| `NEXT_PUBLIC_DEMO_MODE` | Set to `true` for client-side demo mode |
| `NEXT_PUBLIC_USE_DEMO_SGT` | Set to `true` to simulate SGT ownership in development |

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Run tests:

```bash
npm test
```

---

## Project Structure

```
trusttap/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx          # Landing / wallet connect
│   │   ├── profile/          # Trust profile dashboard
│   │   ├── search/           # Wallet lookup
│   │   ├── scan/             # QR meeting verification
│   │   ├── levelup/          # Score improvement suggestions
│   │   ├── shield/           # Sybil detection dashboard
│   │   ├── guide/            # First-time user guide
│   │   ├── badges/           # Trust tier badges
│   │   └── api/              # 10 serverless API routes
│   ├── components/           # UI components (wallet, trust, meeting, layout)
│   ├── lib/                  # Core logic
│   │   ├── helius.ts         # Helius API client
│   │   ├── scoring.ts        # Trust score algorithm (8 dimensions)
│   │   ├── cache.ts          # Profile caching layer
│   │   ├── meeting-tx.ts     # Meeting transaction builder
│   │   ├── skr.ts            # SKR token integration
│   │   └── validation.ts     # Input validation + rate limiting
│   ├── types/                # TypeScript interfaces
│   ├── context/              # React context providers
│   ├── hooks/                # Custom React hooks
│   └── data/                 # Pre-computed demo wallet data (10 wallets)
├── mobile/                   # React Native (Expo) Android app
│   ├── src/screens/          # Profile, Scan, Search, LevelUp screens
│   ├── src/hooks/            # Trust profile, meeting, wallet hooks
│   ├── src/context/          # Wallet context (MWA + demo mode)
│   └── eas.json              # EAS Build config (APK)
├── public/                   # PWA manifest, icons, favicon
├── docs/                     # Architecture docs, images
└── research/                 # Feasibility studies
```

---

## License

MIT
