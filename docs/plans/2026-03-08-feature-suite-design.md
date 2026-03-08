# TrustTap+ Feature Suite — Implementation Design

**Date:** 2026-03-08
**Deadline:** 2026-03-09 (hackathon)
**Scope:** 6 features across UI, scoring, on-chain, and branding

---

## Feature 1: ScoreBreakdown Display Fix

### Problem
`ScoreBreakdown.tsx` line 8 shows `walletAge` max=15 and line 13 shows `physical` max=15, but actual scoring caps are 10 and 12 respectively.

### Fix
```
Line 8:  { key: 'walletAge', label: 'Wallet Age', max: 15, delay: 0.5 }
         → max: 10

Line 13: { key: 'physical', label: 'Physical', max: 15, delay: 1.25 }
         → max: 12
```

### Files
- `src/components/trust/ScoreBreakdown.tsx` — 2 line changes

---

## Feature 2: "TrustScore" Rename

### Scope
Rename all user-facing instances of "Trust Score", "trust score", "TrustTap score" → "TrustScore" (branded, one word).

### Occurrences (exhaustive)

| File | Line | Current | New |
|------|------|---------|-----|
| `src/data/tooltip-content.tsx:10` | title | "Your Trust Score" | "Your TrustScore" |
| `src/data/tooltip-content.tsx:12` | body | "Your TrustTap score ranges" | "Your TrustScore ranges" |
| `src/data/tooltip-content.tsx:30` | body | "foundation of your trust score" | "foundation of your TrustScore" |
| `src/data/tooltip-content.tsx:112` | body | "based on its trust score" | "based on its TrustScore" |
| `src/data/tooltip-content.tsx:128` | body | "trust score" | "TrustScore" |
| `src/data/tooltip-content.tsx:139` | body | "trust score" | "TrustScore" |
| `src/components/meeting/MeetingConfirm.tsx:42` | label | "Trust Score" | "TrustScore" |
| `src/components/trust/ShareProfile.tsx:51` | text | "trust score" | "TrustScore" |
| `src/components/ui/AnalysisLoader.tsx:15` | fact | "trust score" | "TrustScore" |
| `src/components/shield/ThresholdSlider.tsx:12` | label | "Minimum Trust Score" | "Minimum TrustScore" |
| `src/components/shield/ResultsDashboard.tsx:52` | text | "trust score" | "TrustScore" |
| `src/app/badges/page.tsx:90` | heading | "Trust Score Tiers" | "TrustScore Tiers" |
| `src/app/badges/page.tsx:80` | text | "trust score" | "TrustScore" |
| `src/app/shield/page.tsx:79` | text | "trust score" | "TrustScore" |
| `src/app/guide/page.tsx:42` | body | "trust score" | "TrustScore" |

### NOT renamed (internal/API)
- Variable names: `trustScore`, `minTrustScore` (camelCase is fine)
- Function names: `calculateTrustScore` (internal)
- Type fields: `TrustProfile`, `TrustLabel` (internal)
- Test files (maintain as-is)

### Files
~10 files, ~15 string changes. Zero logic changes.

---

## Feature 3: Level Up Page (Shield Replacement)

### Concept
Interactive TrustScore growth simulator. Replaces Shield as 4th nav tab. User toggles hypothetical actions to see projected score changes in real-time. Pure client-side — no API calls.

### Page Layout (390x844 mobile viewport)

```
┌──────────────────────────────┐
│ Level Up              42→67  │  ← Header + animated score pill
├──────────────────────────────┤
│                              │
│        ╭──────────╮          │
│       ╱   67/100   ╲        │  ← ScoreDial with dual arcs
│      │   Trusted    │        │     (dim=current, bright=projected)
│       ╲            ╱         │
│        ╰──────────╯          │
│         +25 points           │  ← Spring-animated delta badge
│    Established → Trusted     │  ← Tier transition label
│                              │
├──────────────────────────────┤
│ ● QUICK WINS           3 ▾  │  ← Collapsible group header
│ ├─ ☐ Get SGT Verified  +25  │     Toggle + delta preview
│ ├─ ☐ Register .skr     +4   │
│ └─ ☐ Register .sol     +2   │
├──────────────────────────────┤
│ ● ONE TRANSACTION       4 ▾  │
│ ├─ ☐ Stake SOL          +5  │
│ ├─ ☐ Provide Liquidity  +4  │
│ ├─ ☐ Lend/Supply        +4  │
│ └─ ☐ Use new protocol   +3  │
├──────────────────────────────┤
│ ● SOCIAL                3 ▾  │
│ ├─ ☐ Meet Seeker owner  +3  │
│ ├─ ☐ Vote in DAO        +1  │
│ └─ ☐ Blue-chip NFT      +2  │
├──────────────────────────────┤
│ ● LONG GAME             2 ▾  │
│ ├─ ☐ 1 year wallet age  +2  │
│ └─ ☐ 200+ transactions  +2  │
├──────────────────────────────┤
│  How it works                │
│  Toggle actions to simulate  │
│  your projected TrustScore.  │
│  Then go do them.            │
└──────────────────────────────┘
```

### Scoring Logic (exact deltas)

Each action modifies a copy of the user's `WalletAnalysis`, then calls `calculateTrustScore(modifiedAnalysis)`. Deltas shown are **actual computed differences**, not static numbers.

#### Action Definitions

```typescript
interface LevelUpAction {
  id: string;
  label: string;
  group: 'quick' | 'transaction' | 'social' | 'long';
  // Function that returns true if this action is available (not already done)
  isAvailable: (analysis: WalletAnalysis) => boolean;
  // Function that modifies a copy of analysis when toggled on
  apply: (analysis: WalletAnalysis) => WalletAnalysis;
}
```

**Quick Wins:**

| Action | isAvailable | apply | Typical delta |
|--------|-------------|-------|---------------|
| Get SGT Verified | `!a.hasSGT` | `{...a, hasSGT: true}` | +25 |
| Register .skr domain | `!a.solDomain?.endsWith('.skr')` | `{...a, solDomain: 'you.skr', hasSolDomain: true}` | +2 to +4 |
| Register .sol domain | `!a.hasSolDomain && !a.solDomain?.endsWith('.skr')` | `{...a, hasSolDomain: true}` | +2 |

**One Transaction:**

| Action | isAvailable | apply | Typical delta |
|--------|-------------|-------|---------------|
| Stake SOL | `a.stakingLevel < 5` | `{...a, stakingLevel: 5}` | +1 to +5 |
| Provide Liquidity | `a.lpLevel < 4` | `{...a, lpLevel: 4}` | +1 to +4 |
| Lend/Supply | `a.lendingLevel < 4` | `{...a, lendingLevel: 4}` | +1 to +4 |
| Use new protocol | `a.protocolsUsed.length < 11` | Add protocols to reach next tier | +1 to +7 |

**Social:**

| Action | isAvailable | apply | Typical delta |
|--------|-------------|-------|---------------|
| Meet Seeker owner | `a.meetingCount < 5` | `{...a, meetingCount: a.meetingCount + 1}` | +2 to +3 |
| Vote in DAO | `a.daoVoteCount < 20` | `{...a, daoVoteCount: nextTier}` | +1 to +3 |
| Blue-chip NFT | `a.blueChipNFTCount < 2` | `{...a, blueChipNFTCount: a.blueChipNFTCount + 1}` | +1 to +2 |

**Long Game:**

| Action | isAvailable | apply | Typical delta |
|--------|-------------|-------|---------------|
| 1 year active | `a.walletAge < 730` | `{...a, walletAge: a.walletAge + 365}` | +1 to +3 |
| 200+ transactions | `a.transactionCount < 200` | `{...a, transactionCount: 200}` | +2 to +4 |

#### Multiple Toggle Interaction

When multiple toggles are active, they're ALL applied to a single modified analysis copy:

```typescript
function computeProjectedScore(
  baseAnalysis: WalletAnalysis,
  activeToggles: Set<string>,
  actions: LevelUpAction[]
): { score: number; breakdown: ScoreBreakdown; label: TrustLabel; color: string } {
  let modified = { ...baseAnalysis };
  for (const action of actions) {
    if (activeToggles.has(action.id)) {
      modified = action.apply(modified);
    }
  }
  return calculateTrustScore(modified);
}
```

This handles caps correctly — toggling Stake+LP+Lend won't exceed DeFi cap of 13.

### ScoreDial Enhancement

Dual-arc approach:
- **Dim arc** (current): `stroke="var(--bg-elevated)"` opacity 0.4, strokeWidth 2.5
- **Bright arc** (projected): `stroke="var(--tt-primary)"` with glow, strokeWidth 2.5
- When toggles change, animate bright arc's `strokeDashoffset` via Framer Motion `animate` prop
- Score number inside uses `useSpring` for smooth counting: `const springScore = useSpring(projectedScore, { stiffness: 100, damping: 20 })`

### Toggle UI Component

Each action toggle:
```
┌─────────────────────────────────┐
│ ☐ Stake SOL              +5    │
│   Earn up to 5 DeFi points     │  ← subtitle (optional)
└─────────────────────────────────┘
```

- Left: custom checkbox (square, emerald when checked, sharp corners matching design language)
- Center: action label in serif body font
- Right: delta in mono font, emerald color
- Left border: 2px solid transparent → emerald when checked
- Tap anywhere on the row to toggle

### Animations

1. **Dual-arc dial**: `motion.circle` with `animate={{ strokeDashoffset }}` and `transition={{ type: "spring", stiffness: 60, damping: 15 }}`
2. **Score counter**: `useSpring(score, { stiffness: 100, damping: 20 })` → `useTransform(spring, Math.round)`
3. **Delta badge**: `motion.span` with `key={delta}` to re-trigger entrance, `initial={{ scale: 0, opacity: 0 }}`, `animate={{ scale: 1, opacity: 1 }}`, `transition={{ type: "spring", stiffness: 300, damping: 15 }}`
4. **Accordion groups**: `AnimatePresence` with `motion.div` using `initial={{ height: 0, opacity: 0 }}`, `animate={{ height: "auto", opacity: 1 }}` — Framer Motion handles height auto natively
5. **Tier transition**: `AnimatePresence mode="wait"` with fade for label changes

### Nav Update

In `BottomNav.tsx`:
- Replace `{ href: '/shield', label: 'Shield', icon: ShieldIcon }` with `{ href: '/levelup', label: 'Level Up', icon: LevelUpIcon }`
- New icon: upward trending arrow (line chart going up)

```tsx
function LevelUpIcon(_props: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
```

### Files
- `src/app/levelup/page.tsx` — NEW: main page
- `src/components/levelup/ProjectedDial.tsx` — NEW: dual-arc dial
- `src/components/levelup/ActionGroup.tsx` — NEW: collapsible toggle group
- `src/components/levelup/ActionToggle.tsx` — NEW: individual toggle row
- `src/lib/levelup-actions.ts` — NEW: action definitions + compute function
- `src/components/layout/BottomNav.tsx` — swap Shield→LevelUp
- Delete: `src/app/shield/page.tsx` (or keep for reference)

---

## Feature 4: My Network Visualization

### Concept
Concentric circle trust graph embedded in Profile page. Shows meeting connections as SVG visualization.

### Layout in Profile Page

Inserted between `MeetingHistory` and `ShareProfile` (line ~139 in profile/page.tsx):

```
... MeetingHistory ...

┌──────────────────────────────┐
│ MY NETWORK             3 ↗   │  ← tt-label + connection count
├──────────────────────────────┤
│                              │
│         ○   ○                │
│        ╱  ╲╱ ╲               │
│       ○───●───○              │  ← SVG concentric graph
│        ╲  ╱╲ ╱               │     320x320, centered
│         ○   ○                │
│                              │
├──────────────────────────────┤
│ ┌─ 7xKp... ─────────────┐   │  ← Mini card (on tap)
│ │ TrustScore: 67 Trusted │   │
│ │ [View Profile]         │   │
│ └────────────────────────┘   │
└──────────────────────────────┘

... ShareProfile ...
```

### SVG Specifications

**Container:**
```html
<div style="width: 100%; max-width: 320px; margin: 0 auto; touch-action: manipulation;">
  <svg viewBox="0 0 320 320" width="100%" preserveAspectRatio="xMidYMid meet">
```

**Coordinate system:**
- Center: (160, 160)
- Ring 1 radius: 80px (direct connections)
- Ring 2 radius: 140px (friends-of-friends)

**Node positioning formula:**
```typescript
// Ring 1: N nodes evenly spaced, starting from top
const angle = (2 * Math.PI * i) / N - Math.PI / 2;
const x = 160 + 80 * Math.cos(angle);
const y = 160 + 80 * Math.sin(angle);

// Ring 2: M nodes with half-step offset
const angle2 = (2 * Math.PI * j) / M - Math.PI / 2 + Math.PI / M;
const x2 = 160 + 140 * Math.cos(angle2);
const y2 = 160 + 140 * Math.sin(angle2);
```

**Node specs:**

| Element | Radius | Fill | Stroke | Opacity |
|---------|--------|------|--------|---------|
| Center | r=18 | #10b981 | none | 1.0 + glow filter |
| Ring 1 | r=12 | rgba(16,185,129,0.25) | #10b981 1px | 1.0 |
| Ring 2 | r=8 | rgba(16,185,129,0.12) | none | 0.3 |
| Hit area (ring 1) | r=22 | transparent | none | pointer-events: all |

**Connection lines:**
- Center→Ring 1: stroke #10b981, opacity 0.2, width 0.5px
- Ring 1→Ring 2: stroke #10b981, opacity 0.1, width 0.5px

**Text labels:**
- Center: "You" at (160, 185), monospace 10px, #10b981
- Ring 1: first 4 chars of address, monospace 8px, placed below node (above if in bottom half)
- Ring 2: no labels

**Capacity limits:**
- Ring 1: max 10 nodes (11 before overlap at 44px tap targets). If >10, show 9 + overflow "+N" node
- Ring 2: max 20 nodes. If >20, show 19 + overflow "+N" node

**Touch interaction:**
- Tap ring 1 node → `selectedNode` state set → mini card slides up
- Mini card shows: truncated address, TrustScore, label, "View Profile" link (→ /search?wallet=ADDRESS)
- Tap elsewhere or tap same node → dismiss card
- iOS Safari: `cursor: pointer` on all interactive `<g>` elements (required for click events)

**Empty state (0 meetings):**
```svg
<circle cx="160" cy="160" r="80" fill="none" stroke="#10b981" stroke-opacity="0.15"
        stroke-width="1" stroke-dasharray="6 4" />
<text x="160" y="155" text-anchor="middle" fill="#6ee7b7" font-size="11" opacity="0.5">
  No connections yet
</text>
<text x="160" y="172" text-anchor="middle" fill="#6ee7b7" font-size="9" opacity="0.35">
  Meet Seeker owners to grow your network
</text>
```

**Animations (Framer Motion):**
- Center node: `initial={{ scale: 0 }}` → `animate={{ scale: 1 }}` with spring
- Ring 1 nodes: staggered entrance using `variants` with `staggerChildren: 0.08`, `initial={{ scale: 0, opacity: 0 }}` → `animate={{ scale: 1, opacity: 1 }}`
- Ring 2 nodes: same but delayed by 0.5s after ring 1 completes, opacity target 0.3
- Connection lines: `initial={{ pathLength: 0 }}` → `animate={{ pathLength: 1 }}` synced with node entrance
- Mini card: `AnimatePresence` + `motion.div` with `initial={{ y: 20, opacity: 0 }}` → `animate={{ y: 0, opacity: 1 }}`
- Center node pulse: CSS keyframes `@keyframes pulse { 0%,100% { filter: drop-shadow(0 0 4px #10b981); } 50% { filter: drop-shadow(0 0 8px #10b981); } }`

### Data Source

**New API endpoint:** `GET /api/network/{wallet}`

Response:
```typescript
{
  direct: Array<{
    wallet: string;
    score: number;
    label: TrustLabel;
    meetingDate: string;
  }>;
  extended: Array<{
    wallet: string;
    connectedTo: string;  // which ring-1 wallet this connects to
  }>;
}
```

Implementation: read from meetings.json + profile cache files. No external API calls.

### Files
- `src/components/trust/NetworkGraph.tsx` — NEW: SVG visualization component
- `src/components/trust/NetworkMiniCard.tsx` — NEW: tap-to-view detail card
- `src/app/api/network/[wallet]/route.ts` — NEW: API endpoint
- `src/app/profile/page.tsx` — add NetworkGraph section

---

## Feature 5: On-Chain Meeting Registration

### Concept
After meeting verification succeeds, optionally record the meeting on Solana via a Memo transaction. This creates a real on-chain footprint and qualifies for the SKR bonus prize.

### Flow

```
Meeting verified (MeetingSuccess screen)
  ↓
Show success checkmark + updated scores (existing)
  ↓
────────── REGISTER ON-CHAIN ──────────
"Record this meeting on Solana to boost your TrustScore"
  ↓
[ Register On-Chain ]    [ Skip ]
  ↓ (tap Register)
Build memo tx → MWA prompt → user signs
  ↓
Success: "Registered! View on Solscan ↗"
  OR
Fail: "Registration failed — meeting still verified locally"
  ↓
[ Done ]
```

### Transaction Structure

**SPL Memo v2** (program ID: `MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr`)

```typescript
import { TransactionInstruction, PublicKey, Transaction } from '@solana/web3.js';

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

function buildMeetingRegistrationTx(
  signerWallet: string,
  partnerWallet: string,
  timestamp: number,
): Transaction {
  const signer = new PublicKey(signerWallet);

  const memo = JSON.stringify({
    app: "trusttap",
    v: 1,
    type: "meeting",
    partner: partnerWallet,
    ts: Math.floor(timestamp / 1000),
  });
  // ~95 bytes, well within 566 byte limit

  const memoInstruction = new TransactionInstruction({
    keys: [{ pubkey: signer, isSigner: true, isWritable: true }],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(memo, 'utf-8'),
  });

  const tx = new Transaction().add(memoInstruction);
  return tx;
}
```

**Transaction cost:** ~5000 lamports (0.000005 SOL) — negligible.

### MWA Signing Integration

Follow existing pattern from `src/lib/skr.ts:buildSKRTipTransaction`:
1. Build unsigned Transaction
2. Set `recentBlockhash` and `feePayer`
3. Pass to wallet adapter's `signAndSendTransaction`
4. Await confirmation

```typescript
// In the component:
const { signAndSendTransaction } = useWallet();

async function registerOnChain() {
  setRegistering(true);
  try {
    const tx = buildMeetingRegistrationTx(publicKey, partnerAddress, Date.now());
    const connection = new Connection(HELIUS_RPC_URL);
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = new PublicKey(publicKey);

    const signature = await signAndSendTransaction(tx);
    await connection.confirmTransaction(signature, 'confirmed');
    setTxSignature(signature);
    setRegistered(true);
  } catch (err) {
    // Meeting is still verified locally regardless
    setRegError(err instanceof Error ? err.message : 'Registration failed');
  } finally {
    setRegistering(false);
  }
}
```

### Demo Mode Fallback

Check existing demo mode flag (WalletContext uses `isDemoMode` in localStorage).

In demo mode:
1. Skip MWA signing
2. Simulate 2s delay
3. Generate fake signature: `"DEMO" + btoa(partnerAddress.slice(0,8) + timestamp).slice(0,40)`
4. Show same success UI with "(demo)" label next to Solscan link

### Error Handling

| Scenario | Detection | UX |
|----------|-----------|-----|
| User rejects | Error name contains "reject" or "denied" | "No problem — meeting still verified locally" |
| No SOL | "insufficient" in error message | "Need ~0.000005 SOL for the transaction fee" |
| Network error | Timeout or connection error | "Network issue — try again later" |
| MWA unavailable | signAndSendTransaction undefined | Auto-fallback to demo mode |

### UI in MeetingSuccess

Add below existing "Done" button:

```
────── REGISTER ON-CHAIN ──────

Record this meeting on Solana
to boost your TrustScore

[ Register On-Chain ]  ← emerald bg, prominent
       Skip            ← text link, muted

(after success):
✓ Registered on-chain
  View on Solscan ↗   ← link to solscan.io/tx/{sig}
```

### Files
- `src/lib/meeting.ts` — add `buildMeetingRegistrationTx()`
- `src/components/meeting/MeetingSuccess.tsx` — add registration section
- `src/lib/constants.ts` — add `MEMO_PROGRAM_ID`

---

## Feature 6: SKR Tipping (Secondary)

### Concept
Surface existing `buildSKRTipTransaction()` in two places:
1. **MeetingSuccess** — after on-chain registration, show "Tip SKR" as tertiary action
2. **Search results** — when viewing someone's profile, show "Tip SKR" if user has SKR balance

### Tip UI Component

```typescript
interface TipButtonProps {
  recipientAddress: string;
  onTipSent?: (signature: string) => void;
}
```

Renders:
- Row of preset amounts: [1, 5, 10] SKR as emerald-outlined buttons
- Tap amount → build tx → MWA prompt → confirm
- Success: "Tipped {amount} SKR ✓"
- Error: "Tip failed — {reason}"

### Preset Amounts
```
[ 1 SKR ]  [ 5 SKR ]  [ 10 SKR ]
```

Each is a button with:
- Border: 1px solid var(--bg-elevated)
- On hover: border-color var(--tt-primary)
- Mono font, 0.75rem
- Left-border accent when selected

### Files
- `src/components/trust/TipButton.tsx` — NEW: reusable tip UI
- `src/components/meeting/MeetingSuccess.tsx` — add tip section after registration
- `src/components/trust/TrustProfileCard.tsx` — add tip button to expanded view (if expanded inline search is implemented)

---

## Implementation Phases

### Phase 1: Quick Fixes (30 min)
1. ScoreBreakdown max value fix
2. TrustScore rename across all files
3. Typecheck

### Phase 2: Level Up Page (2-3 hrs)
1. Create `src/lib/levelup-actions.ts` — action definitions + compute function
2. Create `src/components/levelup/ProjectedDial.tsx` — dual-arc dial with spring animation
3. Create `src/components/levelup/ActionGroup.tsx` — collapsible group with count badge
4. Create `src/components/levelup/ActionToggle.tsx` — toggle row with delta
5. Create `src/app/levelup/page.tsx` — main page composing all components
6. Update `BottomNav.tsx` — Shield → Level Up swap
7. Typecheck + screenshot verification

### Phase 3: My Network (1.5-2 hrs)
1. Create `src/app/api/network/[wallet]/route.ts` — API endpoint
2. Create `src/components/trust/NetworkGraph.tsx` — SVG visualization
3. Create `src/components/trust/NetworkMiniCard.tsx` — tap detail card
4. Add to profile page
5. Seed demo meeting data (15-20 meetings between demo wallets)
6. Typecheck + screenshot verification

### Phase 4: On-Chain Integration (1-1.5 hrs)
1. Add `MEMO_PROGRAM_ID` to constants
2. Add `buildMeetingRegistrationTx()` to meeting.ts
3. Extend MeetingSuccess with registration prompt
4. Add demo mode fallback
5. Add TipButton component
6. Add tip to MeetingSuccess + search results
7. Typecheck + screenshot verification

### Phase 5: Verification
1. `npx tsc --noEmit` — zero errors
2. Screenshot every page on 390x844 viewport
3. Test Level Up toggles with demo wallet data
4. Test network graph with demo meetings
5. Test on-chain registration flow (demo mode)
6. Test all nav links and routing

---

## Design Language Compliance

All new UI must follow established patterns:
- Left-border accents (2px solid var(--tt-primary))
- Sharp corners everywhere (no rounded-xl)
- Editorial typography: serif display, serif body, mono data, uppercase UI labels
- Emerald/teal palette (#10B981 / #14B8A6), NO purple
- Underline tabs (not pill tabs)
- tt-label class for section labels
- PageShell wrapper for all pages
- BottomNav on all pages

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| MWA signing fragile on emulator | Demo mode fallback with simulated tx |
| Empty meeting history = dead network graph | Seed 15-20 demo meetings |
| Level Up shows no actions for fully-maxed wallet | Show "You've reached maximum TrustScore!" state |
| Score dial animation janky on low-end | Use CSS transforms (GPU-accelerated), not layout properties |
| SVG touch events fail on iOS Safari | cursor:pointer on all interactive elements |
