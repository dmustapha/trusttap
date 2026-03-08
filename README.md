# TrustTap+: On-Chain Reputation for Solana Seeker

A mobile-first trust scoring system that analyzes Solana wallet history to generate verifiable reputation scores, gated exclusively for Saga Genesis Token holders.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Solana](https://img.shields.io/badge/Solana-Mobile-9945FF?logo=solana&logoColor=white)](https://solanamobile.com/)
[![Tests](https://img.shields.io/badge/tests-124_passing-brightgreen)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

![TrustTap+ Landing](docs/images/landing.png)

---

## What Is TrustTap+?

TrustTap+ turns your Solana wallet history into a trust score from 0 to 100. It reads on-chain activity (transaction age, DeFi participation, NFT holdings, governance votes, staking, domain ownership) and computes a composite reputation score. Only Saga Genesis Token holders can access the full platform, creating a trusted community layer on Solana Mobile.

---

## Screenshots

| Profile | Search | Level Up |
|---------|--------|----------|
| ![Profile](docs/images/profile.png) | ![Search](docs/images/search.png) | ![Level Up](docs/images/levelup.png) |

| QR Scan | Sybil Shield |
|---------|-------------|
| ![Scan](docs/images/scan.png) | ![Shield](docs/images/shield.png) |

---

## Features

- **7-Dimension Trust Score**: Wallet age, transaction volume, DeFi depth, NFT portfolio, governance activity, staking history, and domain ownership
- **SGT-Gated Access**: Only Saga Genesis Token holders can use the full platform
- **Wallet Lookup**: Search any Solana address or .sol domain to view their trust profile
- **QR Meeting Verification**: Scan QR codes in person to cryptographically verify you met another wallet holder
- **Level Up Recommendations**: AI-powered suggestions for improving your trust score based on current wallet gaps
- **Sybil Shield**: Detects suspicious wallet patterns (low age, bot-like activity, airdrop farming)
- **AI Trust Summaries**: Natural language wallet analysis powered by Groq LLM
- **PWA Install**: Add to home screen on Seeker for a native app experience
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
| Deploy | Vercel (serverless) |

---

## Testing the App

### With demo wallets (no wallet needed)

1. Open the live URL
2. The app ships with 10 pre-computed demo wallets spanning all trust tiers
3. Connect with the demo wallet to explore Profile, Level Up, Search, and Scan features
4. Search for any demo address to view its trust breakdown

### With a real Solana wallet

1. Open the app on a Solana Seeker device (or any browser with a Solana wallet extension)
2. Tap "Connect Wallet" to authorize via Mobile Wallet Adapter
3. The app checks for SGT ownership, then analyzes your on-chain history
4. Your trust score and full breakdown appear on the Profile page

### Demo wallet addresses

| Address | Score | Tier |
|---------|-------|------|
| `eHHHqVwd...` | 86 | Highly Trusted |
| `fRRwPwbb...` | 82 | Highly Trusted |
| `317PfVH1...` | 75 | Trusted |
| `abD5FFDf...` | 68 | Established |
| `xPybFBbd...` | 62 | Established |
| `Rb5RTuod...` | 55 | Established |
| `M75RjudB...` | 45 | Basic |
| `C5myTZf5...` | 42 | Basic |
| `juqooh7d...` | 38 | Basic |
| `GVX1bw3w...` | 31 | Basic |

---

## API Reference

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

## How It Works

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
  +---> Scoring Engine ----------> 7-dimension trust score (0-100)
  |
  +---> Groq LLM API -----------> Natural language trust summary
  |
  +---> QR + Ed25519 Sigs ------> In-person meeting verification
```

---

## Running Locally

```bash
git clone https://github.com/dmustapha/trusttap.git
cd trusttap
npm install
```

Copy the environment template and add your keys:

```bash
cp .env.example .env.local
```

Required environment variables:

| Variable | Description |
|----------|-------------|
| `HELIUS_API_KEY` | Free API key from [helius.dev](https://helius.dev) |
| `GROQ_API_KEY` | Free API key from [console.groq.com](https://console.groq.com) |
| `DEMO_MODE` | Set to `true` to use pre-computed demo wallets |
| `NEXT_PUBLIC_DEMO_MODE` | Set to `true` for client-side demo mode |
| `NEXT_PUBLIC_USE_DEMO_SGT` | Set to `true` to bypass SGT gate in development |

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

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
│   │   ├── scoring.ts        # Trust score algorithm
│   │   ├── cache.ts          # Profile caching layer
│   │   ├── meeting-tx.ts     # Meeting transaction builder
│   │   └── validation.ts     # Input validation + rate limiting
│   ├── types/                # TypeScript interfaces
│   ├── context/              # React context providers
│   ├── hooks/                # Custom React hooks
│   └── data/                 # Pre-computed demo wallet data
├── public/                   # PWA manifest, icons, favicon
├── docs/                     # Architecture docs, images
└── research/                 # Feasibility studies
```

---

## License

MIT
