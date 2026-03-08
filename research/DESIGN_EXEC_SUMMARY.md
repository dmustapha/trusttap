# TrustTap+ Design Research — Executive Summary

**Date:** March 1, 2026
**Purpose:** Visual differentiation strategy for trust/reputation UI in Solana ecosystem
**Status:** Research Complete → Ready for Design Phase 5-6

---

## The Core Problem

**Solana ecosystem has visual homogeneity:**
- Phantom, Magic Eden, Jupiter, Raydium, Serum all use the same colors
- Purple (#9945FF) + Teal (#14F195) + Black is the default
- Generic card layouts ("icon + title + subtitle") dominate
- Users can't distinguish products by visual language alone

**TrustTap+ must differentiate visually while maintaining "serious tech" credibility.**

---

## The Solution: Emerald-Based Design System

### Color Palette (Hex Values)

```
PRIMARY:          #10B981  (Emerald 500)
SECONDARY:        #14B8A6  (Teal 600)
ACCENT CYAN:      #06B6D4  (Cyan 500)

BACKGROUND:       #0F172A  (Slate 900 — not pure black)
SURFACE:          #111827  (Slate 800)
SURFACE RAISED:   #1F2937  (Slate 700)

TEXT PRIMARY:     #FFFFFF  (White)
TEXT SECONDARY:   #94A3B8  (Slate 400)
TEXT TERTIARY:    #64748B  (Slate 500)

STATUS SUCCESS:   #10B981  (Emerald, same as primary)
STATUS WARNING:   #F59E0B  (Amber 500)
STATUS DANGER:    #EF4444  (Red 500)

BORDER:           #334155  (Slate 700)
```

### Why This Works

1. **Emerald ≠ Purple** — Instantly differentiates from Solana ecosystem
2. **Emerald signals trust** — Associated with nature, growth, stability (organic feel vs. electric purple)
3. **Dark slate ≠ pure black** — Feels designed, not default
4. **Cyan accent adds tech edge** — Modern without being trendy
5. **High contrast** — White text on emerald passes WCAG AA easily

---

## Design Direction: The "One Metric Hero" Pattern

### Instead Of:
- ❌ Dashboard with 10 metrics
- ❌ Card grid layout
- ❌ Data overload

### Do:
- ✅ **Single Trust Score as Hero Content**
  - Large emerald ring/circle
  - Numeric score (0-100) in center
  - One sentence explaining what score means
  - Single CTA: "View Your Reputation" or "Connect Wallet"
  - Subtle glow animation (emerald pulse, not jarring)

### Hero Copy Example
```
"Your Trust Score"
[LARGE EMERALD RING: 87]
"Built from 12 verified SGT connections"
[CTA Button: "View Your Reputation"]
```

---

## Key Design Techniques to Use

| Technique | Why It Works for TrustTap+ | Example |
|-----------|---------------------------|---------|
| **Interactive Flow Visualization** | Show how reputation is calculated (transparency = trust) | Network graph of verified connections |
| **Risk Scoring Gauge** | Single metric reduces cognitive load | Emerald ring with score inside |
| **Native Mobile Gestures** | Seeker phone context requires native feel | Swipe tabs, long-press QR scan |
| **Status Color Coding** | Red/yellow/green for risk levels instantly communicates | Trust score 0-40=red, 41-70=yellow, 71-100=green |
| **Real-Time Updates** | Live counter of verified connections | "You've met 12 people, they've met X more" |
| **Transaction Previews** | Show how reputation calculation works | Breakdown: on-chain activity (40%) + verified meetings (60%) |

---

## What To Avoid (Ecosystem Patterns)

| Anti-Pattern | Why TrustTap+ Must Avoid It |
|--------------|---------------------------|
| Purple + Teal palette | Every Solana product uses it; won't differentiate |
| Generic card grid | "AI slop" — no unique visual language |
| Gradient backgrounds | 2024 trend, feels dated now |
| Pure black background | Feels default; dark slate feels designed |
| Dashboard overload | Reputation should be simple, not complex |
| Fancy 3D elements | Distracting, no conversion benefit |
| Auto-play video hero | Bandwidth issue on mobile, feels 2022 |

---

## Components to Design

### Phase 1: Core Components
1. **Trust Score Ring** — Emerald circle with numeric center
2. **Connection Badge** — Verified SGT owner indicator
3. **Network Node** — User avatar in connection graph
4. **Status Indicator** — Red/yellow/green trust level
5. **CTA Button** — Emerald primary, slate secondary

### Phase 2: Flows
1. **Meeting Verification** — QR scan → connection badge → profile update
2. **Profile Display** — Trust score + verified connections + calculation breakdown
3. **Social Graph** — Visual network of verified SGT relationships
4. **Trust Calculation** — Transparent algorithm explanation

### Phase 3: Mobile Specific
1. **Bottom-Sheet Meeting Card** — Swipe up for full verification details
2. **Tab Navigation** — Phantom-style bottom tabs (Profile/Connections/Scan)
3. **Gesture Actions** — Long-press for QR, swipe to dismiss modals
4. **Biometric Auth** — Face unlock for sensitive operations

---

## Typography System

```
DISPLAY (Hero):      Inter 40px / 700wt / 1.2 line-height
H1 (Section):        Inter 28px / 600wt / 1.3 line-height
H2 (Subsection):     Inter 24px / 600wt / 1.3 line-height
BODY (Default):      Inter 16px / 400wt / 1.5 line-height
BODY SMALL:          Inter 14px / 400wt / 1.5 line-height
NUMERIC (Emphasis):  Inter 22px / 600wt / 1.2 line-height
MONOSPACE (Wallet):  JetBrains Mono 13px / 400wt / 1.4 line-height
LABEL (Form):        Inter 12px / 500wt / 1.4 line-height
```

### Rules
- No weights < 400 (thin looks broken on mobile)
- Large line-height for readability (1.5+ for body)
- Monospace only for raw data (addresses, transaction hashes)
- Numeric values get emphasis (larger + bolder)

---

## Mobile-First Adaptation Strategy

### Navigation
- **Bottom Tab Bar** (Phantom style)
  - Profile (active tab shows trust score)
  - Connections (list of verified SGT owners met)
  - Scan (QR scanner for new connections)
  - Settings

### Hero
- Trust score ring takes full width
- Score number large + readable (min 44px tap target for mobile)
- CTA button below, full width (emerald background, slate text)

### Cards/Sections
- Single column, full width
- Tap to expand for details (accordion pattern)
- Bottom-sheet modals for deep dives
- Swipe to dismiss modals (gesture feedback)

### Forms
- Input fields 48px tall minimum (finger-friendly)
- Clear labels above, not placeholders
- Show/hide toggles for sensitive fields
- "Done" button sticky at bottom

---

## Animation Philosophy

**RULE: Motion clarifies, does not impress.**

### What Animates
- Emerald ring score: Subtle glow (500ms on load)
- Trust score number: Count-up from 0 to final score (1.2s)
- Network connections: Node fade-in, line draw (staggered 200ms apart)
- State transitions: Smooth 300ms easing (easeSmoothQuart)
- Button feedback: 100ms press state (opacity change)

### What Doesn't Animate
- Backgrounds (static, no parallax)
- Text (no letter-by-letter animation)
- Page transitions (swipe gesture only, no slide-in)
- Loading states (spinner only, no pulsing)

### Mobile Optimization
- Respect `prefers-reduced-motion` (users with vestibular disorders)
- GPU-efficient animations (CSS transforms, not DOM manipulation)
- No Lottie files (bandwidth + performance hit)

---

## Trust Signal Design Strategy

### Visual Trust Signals
1. **Verified Badge** — Checkmark in emerald circle
2. **SGT Holder Status** — "SGT Gated Account" label with badge
3. **Meeting History** — List of people you've met (with dates)
4. **Calculation Transparency** — "Your score is based on: 40% on-chain activity + 60% verified meetings"
5. **Community Endorsement** — "X verified accounts have approved you"
6. **Regulatory Clarity** — "Built on Solana mainnet, auditable on-chain"

### Copy (Examples)
```
"87 Trust Score"
"Based on 12 verified SGT holders you've met"
"Updated 2 hours ago"
"View calculation details →"
```

---

## Differentiation Checklist

### Visual
- [x] Primary color is emerald (#10B981), not purple
- [x] Background is dark slate (#0F172A), not pure black
- [x] Hero is single metric (trust score), not dashboard
- [x] Components are custom (not generic cards)
- [x] Typography uses emerald accent, not system defaults
- [x] Motion is purposeful, not decorative

### Functional
- [x] Shows verified connections (social, not just transaction history)
- [x] Explains trust calculation (transparent, not black box)
- [x] Mobile-native UX (gestures, bottom sheets, not responsive web)
- [x] Seeker phone first (Android-optimized, not cross-platform)
- [x] SGT gating visible (proof of humanity)

### Brand
- [x] Emerald = organic trust (not electric purple)
- [x] Dark slate = thoughtfully designed (not default black)
- [x] Clear copy = confidence (not jargon)
- [x] Simple hero = focus (not data overload)

---

## Design System Deliverables

### Part 1: Foundation
- [x] Color palette (hex values + usage)
- [x] Typography system (font sizes, weights, line-heights)
- [x] Component library (button, card, badge, gauge, input)
- [x] Grid system (8px baseline, 12-column layout)
- [x] Animation spec (what moves, how much, how long)

### Part 2: Screens
- [ ] Onboarding / Landing
- [ ] Wallet Connection
- [ ] Profile (Trust Score Display)
- [ ] Connections (Social Graph)
- [ ] Meeting Verification (QR Scan)
- [ ] Settings / Account
- [ ] Error States
- [ ] Loading States

### Part 3: Variations
- [ ] Variation A: (TBD — design phase)
- [ ] Variation B: (TBD — design phase)
- [ ] Variation C: (TBD — design phase)
- [ ] Variation D: (TBD — design phase)
- [ ] Variation E: (TBD — design phase)

---

## Next Steps (Design Forge Phase 5)

1. **Create Hero Variations** (3-5 approaches for trust score display)
2. **Design Connection Graph** (visual network of verified relationships)
3. **Build Component Set** (Figma library with emerald + slate palette)
4. **Prototype Meeting Flow** (QR scan → verification → social badge)
5. **Test Mobile Gestures** (Phantom-style bottom tabs + swipes)
6. **Verify Accessibility** (WCAG AA contrast, screen reader support)
7. **Compare to Ecosystem** (Why is this visually distinct?)

---

## Key References

- Full research: `/research/DESIGN_RESEARCH_CRYPTO_REPUTATION.md`
- Comparison table: `/research/DESIGN_COMPARISON_TABLE.md`
- Platforms analyzed: Chainalysis, Scorechain, Elliptic, Phantom, Jupiter, Magic Eden, Helius, Trust Wallet
- Color source: Solana brand colors (official)
- Web3 trust patterns: Coinbound, TrustScores research
- Mobile UX: Phantom app (primary reference)

---

**Status:** Ready to brief design team on Phase 5-6 variations with emerald differentiation strategy.
