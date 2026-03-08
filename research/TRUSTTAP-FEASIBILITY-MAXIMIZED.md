# TRUSTTAP+ FEASIBILITY MAXIMIZED — $0 BUILD GUIDE
**Date:** 2026-02-28
**Goal:** De-risk every piece. Guarantee 100% implementation. Zero cost.

---

## THE $0 STACK (Everything Free)

| Layer | Tool | Cost | Notes |
|-------|------|------|-------|
| Mobile Framework | React Native + Expo | $0 | Official Solana Mobile template |
| Wallet Connection | Mobile Wallet Adapter | $0 | Open source |
| Emulator | Android Studio AVD | $0 | Runs on Mac |
| Test Wallet | Mock MWA Wallet | $0 | Simulates Seed Vault |
| SGT Check | Helius DAS API (free tier) | $0 | 10 credits/call, 1M credits/month free |
| Wallet History | Solana RPC `getSignaturesForAddress` | $0 | 1 credit/call on Helius free tier |
| Transaction Parsing | Helius `parse-transactions` | $0 | 100 credits/call, free tier |
| AI Summary | Claude API | $0 | Via your existing access |
| QR Generation | react-native-qrcode-svg | $0 | Open source |
| QR Scanning | expo-camera | $0 | Built into Expo |
| UI Styling | NativeWind (Tailwind for RN) | $0 | You already know Tailwind |
| Components | React Native Reusables | $0 | shadcn-style copy-paste |
| Navigation | Expo Router | $0 | File-based routing |
| Score Dial | react-native-circular-progress | $0 | Open source |
| Charts | react-native-gifted-charts | $0 | Open source |
| Animations | Reanimated + Lottie | $0 | Pre-installed with Expo |
| Backend | Node.js + Express on laptop | $0 | Local for hackathon |
| Video Recording | OBS Studio / macOS built-in | $0 | Free |
| Video Editing | iMovie / CapCut | $0 | Free |
| Device Frames | Mock.video | $0 | Free web tool |

**Total cost: $0.00**

---

## SETUP: GUARANTEED PATH (Day 1)

### Step 1: Scaffold (15 min)
```bash
# Option A: Official CLI (recommended)
npm create solana-dapp@latest
# Select: Solana Mobile → pick template

# Option B: Direct Expo template
yarn create expo-app --template @solana-mobile/solana-mobile-expo-template
```

**CRITICAL:** Use `yarn`, NOT `npm`. npm causes module resolution errors with the Solana Mobile template. Use Yarn Classic (1.22.x).

### Step 2: Android Emulator (30 min)
1. Install Android Studio
2. Create AVD: Pixel 7, API 33+, Google Play image
3. Set a PIN on emulator (required for wallet connection)
4. Set "Camera Back" to "VirtualScene" (for QR scanning)

### Step 3: Mock Wallet (30 min)
1. Clone: `github.com/solana-mobile/mock-mwa-wallet`
2. Build in Android Studio
3. Install on emulator
4. Emulator MUST have PIN set or wallet silently fails

### Step 4: Verify (15 min)
- [ ] Template app builds and runs on emulator
- [ ] Mock wallet installed, PIN set
- [ ] Wallet connection works (chooser dialog appears)
- [ ] Devnet SOL airdrop works

**If this fails by end of Day 1 → Fallback to PWA (see below)**

### Known Pitfalls to Avoid
1. **Never use Expo Go** — MWA needs custom dev build
2. **Import order matters** — `react-native-get-random-values` MUST be imported before `@solana/web3.js`
3. **Stick with web3.js v1** — v2 has different APIs, most examples use v1
4. **Use Expo SDK 49+** — use `expo-crypto` instead of `react-native-get-random-values` with Expo Router
5. **WiFi issues** — use `npx expo start --dev-client --tunnel` if connection fails

---

## WALLET ANALYSIS: FREE TIER STRATEGY

### The Problem
Helius `getTransactionsForAddress` (the easy way) costs 100 credits AND requires $49/mo Developer plan.

### The $0 Workaround
Use standard RPC calls instead:

**Step 1:** `getSignaturesForAddress` → 1 credit per call (free tier)
- Returns up to 1,000 tx signatures per call
- Paginate with `before` parameter for full history

**Step 2:** Helius `parse-transactions` endpoint → 100 credits per batch (free tier)
- Submit batch of signatures
- Returns decoded transactions with `type` (SWAP, NFT_SALE, TRANSFER, etc.) and `source` (JUPITER, RAYDIUM, ORCA, MARINADE, etc.)
- Automatic protocol detection for 500+ transaction types

**Step 3:** `getAssetsByOwner` DAS API → 10 credits per call (free tier)
- Returns all NFTs and tokens
- Used for SGT check, NFT holdings, blue-chip detection

### Budget for 10 Demo Wallets

| Operation | Credits | Calls |
|-----------|---------|-------|
| getAssetsByOwner (SGT + NFTs) | 100 | 10 |
| getSignaturesForAddress | 10 | ~10 |
| parse-transactions | ~5,000 | ~50 |
| **Total** | **~5,110** | **~70** |

That's **0.5% of the 1M free monthly credits.** We could analyze hundreds of wallets for free.

### Pre-Compute + Cache Strategy (Eliminates ALL Demo Risk)
1. During development (Days 2-5): analyze 10 interesting mainnet wallets
2. Store results as JSON files in the app
3. During demo: app reads from cache → instant response, zero API calls
4. Optional: support "live" lookup for wallets not in cache (uses real API)

### Cross-Network Architecture (Allowed)
- **App on devnet** (for program interactions, demo transactions)
- **Wallet analysis queries mainnet** (read-only, for real wallet data)
- These are separate RPC endpoints — standard practice

---

## SGT VERIFICATION: SIMPLE

### One API Call
```typescript
const response = await fetch('https://mainnet.helius-rpc.com/?api-key=FREE_KEY', {
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

const assets = await response.json();
const hasSGT = assets.result.items.some(
  asset => asset.grouping?.some(
    g => g.group_value === 'GT22s89nU4iWFkNXj1Bw6uYhJJWDRPpShHt4Bk8f99Te'
  )
);
```

### For Devnet Demo
Mock SGT by minting a non-transferable token on devnet with matching metadata structure. Gate on that instead. Document that production uses real SGT collection address.

---

## QR MEETING EXCHANGE: BULLETPROOF DEMO STRATEGY

### The Problem
Camera-based QR scanning on emulators is clunky (requires navigating a 3D virtual room).

### The Solution: Build Both, Demo Paste

**Build the full QR UI** (generation + scanner with camera overlay) — it looks impressive.

**Add a "Paste verification data" link** below the scanner — this is the demo path.

**Demo flow:**
1. User A generates QR code (visually displayed on screen — judges see it)
2. User A taps "Copy verification data" (copies JSON payload to clipboard)
3. User B taps "Paste verification data" on scanner screen
4. Same cryptographic verification runs (challenge + signature check)
5. Meeting verified on both devices

**The verification is identical** whether it comes from QR scan or paste. The crypto doesn't change.

### Libraries
- **Generation:** `react-native-qrcode-svg` — just `<QRCode value={payload} size={250} />`
- **Scanning:** `expo-camera` CameraView with `onBarcodeScanned`
- **Paste fallback:** `expo-clipboard`
- **Signing:** `@solana-mobile/mobile-wallet-adapter-protocol-web3js` — `wallet.signMessages()`
- **Verification:** `tweetnacl` + `bs58` — Ed25519 signature verification

### QR Payload Structure
```typescript
interface TrustVerificationPayload {
  walletAddress: string;    // Base58 public key
  timestamp: number;        // Unix ms
  nonce: string;            // crypto.randomUUID()
  message: string;          // Original challenge string
  signature: string;        // Base58-encoded Ed25519 signature
}
```

### Emulator QR Scanning (If Wanted)
The Android emulator has a virtual scene camera. You can inject QR code images:
1. Emulator → Extended Controls → Camera → Virtual Scene Images → Add Image
2. Navigate to the wall in the 3D room (hold SHIFT + arrow keys)
3. Point virtual camera at QR on wall → scanner detects it

**But the paste method is more reliable for demos.**

### Deep Link Alternative (Bonus)
Add `trusttap://verify?wallet=...&sig=...` deep linking via `expo-linking`. Test between emulators with `adb shell am start -W -a android.intent.action.VIEW -d "trusttap://verify?..."`. Useful for asynchronous verification requests.

---

## UI: FAST + BEAUTIFUL

### Styling: NativeWind (Tailwind for RN)
You already know Tailwind. NativeWind is the same utility classes. Zero new mental model.
```bash
npm install nativewind react-native-reanimated react-native-safe-area-context
npm install --dev tailwindcss@^3.4.17
npx tailwindcss init
```

### Components: React Native Reusables
shadcn/ui philosophy for React Native. Copy-paste components built on NativeWind.
- Closest to the workflow you know
- Alternative: Gluestack UI v3 (more comprehensive, also NativeWind-native)

### Navigation: Expo Router
File-based routing (like Next.js App Router):
```
app/
  (tabs)/
    _layout.tsx       ← Tab bar definition
    index.tsx         ← Home
    profile.tsx       ← My Trust Profile
    scan.tsx          ← Scan / Meet
    search.tsx        ← Lookup Wallet
  confirm-meeting.tsx ← Modal
```

### Trust Score Dial
`react-native-circular-progress` — 10 minutes to integrate:
```tsx
<AnimatedCircularProgress
  size={200}
  width={15}
  fill={trustScore}
  tintColor={getColorForScore(trustScore)}
  backgroundColor="#e0e0e0"
>
  {(fill) => <Text style={styles.score}>{Math.round(fill)}</Text>}
</AnimatedCircularProgress>
```

### Charts: react-native-gifted-charts
Best visual quality for score breakdown bars. Expo-compatible.
```bash
npx expo install react-native-gifted-charts expo-linear-gradient react-native-svg
```

### Animations Priority
| Animation | Tool | Time |
|-----------|------|------|
| Score dial filling up | Reanimated + SVG | 1-2 hrs |
| Score number counting | Reanimated `withTiming` | 30 min |
| Screen transitions | Expo Router built-in | 15 min |
| Trust verified confetti | Lottie (free JSON from LottieFiles) | 15 min |
| Card appear effects | Reanimated `FadeInDown` | 30 min |
| Badge unlock | Lottie | 15 min |

**Total animation work: 3-4 hours for a polished feel.**

---

## DEMO VIDEO: PRODUCTION QUALITY

### Recording
- **Single emulator:** Android Studio built-in recorder (Extended Controls → Record and Playback)
- **Two emulators side-by-side:** OBS Studio with two Window Capture sources
- **Quick alternative:** macOS `Cmd+Shift+5` screen recording

### Two Emulators Simultaneously
- Create 2 AVDs in Android Studio, run both
- Each needs ~2GB RAM (4GB total + Android Studio)
- Apple Silicon Macs handle this well (ARM emulator runs natively)
- Install app on both: `adb -s emulator-5554 install app.apk` and `adb -s emulator-5556 install app.apk`

### Post-Production
1. Add device frame: **Mock.video** (free, upload recording → add Pixel frame → download)
2. Record voiceover: QuickTime Player → New Audio Recording
3. Edit together: **iMovie** or **CapCut** (both free)
4. Export: 1080p MP4

### Video Structure (Colosseum Standard)
Two videos required:
1. **Pitch video (90s):** Hook → Problem → Product → Trust Model → Sybil Shield → Close
2. **Technical demo (90s):** Architecture → SGT Verification → Trust Engine → QR Exchange → Solana Integration

---

## FALLBACK PLANS

### Fallback 1: PWA Instead of React Native
If RN + Solana Mobile Stack setup fails by end of Day 2:
- Build a Next.js mobile-responsive web app
- MWA works in Android Chrome (same wallet connection)
- Wrap as APK using Bubblewrap CLI for dApp Store submission
- **Officially supported by Solana Mobile**
- You're MUCH faster with Next.js

### Fallback 2: Sybil Shield (Simpler Product)
If wallet analysis engine isn't working by end of Day 3:
- Drop the trust scoring, keep SGT gating
- Build focused airdrop filter: "1 SGT = 1 human = 1 fair claim"
- Same shocking stat, simpler scope, still wins on innovation
- **Pivot trigger: End of Day 3**

### Fallback 3: Pre-Recorded Demo
If live demo has issues:
- Pre-record all flows during development
- Edit into polished video with device frames
- Submit the video as the demo
- This is standard for hackathons — most submissions are video-based

---

## REVISED 9-DAY BATTLE PLAN

### Day 1 (Mar 1): Foundation — CRITICAL
- [ ] Install Android Studio + create AVD
- [ ] Scaffold app with `npm create solana-dapp@latest` (use yarn)
- [ ] Install Mock MWA wallet on emulator
- [ ] Get wallet connection working
- [ ] Helius free tier signup + test DAS API call
- [ ] **GATE:** If wallet connection doesn't work by EOD → investigate Day 2 morning, PWA fallback by noon
- **Deliverable:** App runs, wallet connects, SGT check returns data

### Day 2 (Mar 2): Wallet Analysis Engine
- [ ] Implement `getSignaturesForAddress` (free tier)
- [ ] Implement `parse-transactions` for protocol detection
- [ ] Implement `getAssetsByOwner` for NFTs + SGT
- [ ] Parse: wallet age, tx count, protocols, staking, NFTs, domains
- [ ] Pre-compute analysis for 5-10 interesting mainnet wallets
- [ ] Cache results as JSON
- **Deliverable:** Wallet data fetched and cached for demo wallets

### Day 3 (Mar 3): Trust Score + Backend
- [ ] Weighted scoring algorithm (0-100, 7 layers)
- [ ] Backend API: Express server for score caching + meeting storage
- [ ] Badge system: Veteran, DeFi Degen, Whale, Governor, Networker
- [ ] Score interpretation: color coding (Red/Orange/Yellow/Green/Emerald)
- [ ] **GATE:** If wallet analysis isn't working → pivot to Sybil Shield
- **Deliverable:** Trust scores computed, backend serves cached profiles

### Day 4 (Mar 4): AI Summary + Trust Profile UI
- [ ] Claude API integration for trust summaries
- [ ] Sybil detection prompt (bot/farm pattern analysis)
- [ ] Trust Profile screen: score dial, breakdown chart, badges, AI text
- [ ] NativeWind styling, color-coded trust levels
- [ ] Loading states, empty states
- **Deliverable:** Beautiful trust profile with AI-generated summary

### Day 5 (Mar 5): QR Meeting Exchange
- [ ] QR code generation (react-native-qrcode-svg)
- [ ] QR scanner screen (expo-camera)
- [ ] Paste fallback (expo-clipboard)
- [ ] MWA message signing for challenges
- [ ] Signature verification (tweetnacl)
- [ ] Backend: store meeting records, anti-gaming rules
- [ ] Meeting history on profile
- **Deliverable:** Two emulators can exchange trust data and create meetings

### Day 6 (Mar 6): Sybil Shield + Polish
- [ ] "Verify Airdrop Eligibility" screen
- [ ] Dashboard: X wallets checked, Y verified, Z rejected
- [ ] Wallet search/lookup screen
- [ ] SKR integration mentions (earn for meetings, stake for visibility)
- [ ] Edge cases, error handling, graceful failures
- **Deliverable:** Complete feature set, Sybil Shield working

### Day 7 (Mar 7): Feature Freeze + Animations
- [ ] Animations: score dial, confetti, card transitions (Reanimated + Lottie)
- [ ] App icon, splash screen, branding
- [ ] Final bug fixes
- [ ] Practice demo flow end-to-end
- [ ] **FEATURE FREEZE at end of day**
- **Deliverable:** Polished, feature-complete app

### Day 8 (Mar 8): Video Production
- [ ] Record all demo flows (OBS / Android Studio recorder)
- [ ] Record voiceover (QuickTime)
- [ ] Edit pitch video (90s) in iMovie/CapCut
- [ ] Edit technical demo video (90s) in iMovie/CapCut
- [ ] Add device frames (Mock.video)
- [ ] Write submission copy
- **Deliverable:** Both videos complete, submission ready

### Day 9 (Mar 9): Submit
- [ ] Final review of everything
- [ ] Submit to hackathon platform
- [ ] Share build thread on Twitter
- **Deliverable:** SUBMITTED

---

## CONFIDENCE LEVELS (REVISED)

| Component | Confidence | Why |
|-----------|-----------|-----|
| SGT Gate | 95% | Single API call, well-documented |
| Wallet Analysis | 90% | Free tier workaround proven, pre-cached |
| Trust Score Algorithm | 95% | Pure math, no external dependencies |
| AI Summary | 95% | Simple API call to Claude |
| Trust Profile UI | 90% | NativeWind = Tailwind you know |
| QR Meeting (with paste fallback) | 95% | Paste guarantees it works |
| Backend | 95% | Express.js, your comfort zone |
| Sybil Shield Feature | 90% | Extension of existing trust score |
| Demo Video | 90% | OBS + iMovie, standard tooling |
| **Overall** | **92%** | **Highest confidence version yet** |

---

## KEY INSIGHT: WHY THIS IS NOW NEARLY GUARANTEED

The three biggest risks were:
1. ~~React Native setup~~ → Official template + yarn fixes known issues + PWA fallback
2. ~~Helius costs~~ → Free tier + DIY workaround = $0
3. ~~QR on emulator~~ → Paste fallback makes demo bulletproof

Every risk now has a workaround. Every component has a fallback. Total cost: $0.
