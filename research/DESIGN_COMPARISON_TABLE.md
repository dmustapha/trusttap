# Crypto Reputation/Trust Platforms — Visual Design Comparison Table

**Research Date:** March 1, 2026 | **Scope:** Top 8 platforms + Solana ecosystem analysis

---

## Quick Comparison Matrix

| Platform | One Memorable Technique | Primary Colors | Typography | Hero Pattern | Animation Strategy | Mobile Adaptation |
|----------|------------------------|-----------------|-----------|--------------|-------------------|-------------------|
| **Chainalysis** | Interactive real-time transaction flow visualization with animated node connections | Navy #0A0E27 + Electric Blue #2563EB + Green #10B981 | Geometric sans-serif, high contrast, monospace for addresses | Left-aligned CTA with animated transaction viz background | Subtle node animations, smooth data transitions | Sticky header, drawer nav, simplified charts |
| **Scorechain** | Wallet clustering + interactive flow mapping | Dark Gray #1F2937 + Corporate Blue #0369A1 + Status colors (R/Y/G) | Clean sans-serif, readable line-length, monospace for numbers | Video background showing wallet tracking, right-aligned CTA | Smooth state transitions, auto-play animations | Stack-based layout, tap-to-expand, gesture controls |
| **Elliptic** | Dynamic risk scoring gauge with live threat detection visualization | Black #000000 + Deep Purple #6366F1 + Warning gradients (amber/red) | Modern geometric sans-serif, aggressive letter spacing, monospace | Full-width threat detection video, centered CTA | Risk gauge animations on load, pulsing threat indicators | Single-column, expandable cards, FAB for reports |
| **Phantom** (Wallet) | Seamless token list + NFT gallery integration (native mobile advantage) | Black #000000 + Solana Purple #9945FF + Teal #14F195 | System UI fonts (native mobile), large headline scale | Native UI balance display, Send/Receive/Swap buttons | Native gestures, smooth bottom-sheets | Native app tabs, pull-to-refresh, biometric auth |
| **Jupiter** (DEX) | Swap route visualization showing slippage optimization across pools | Dark #0F0F0F + Orange #FFA500 + Solana Purple #9945FF | Monospace for amounts, sans-serif for labels | Swap input as hero, minimal copy, execution focus | Smooth number transitions (Framer Motion), route animation | Single-column swap card, collapsible options, swipe buttons |
| **Magic Eden** (NFT) | Grid-based NFT showcase with parallax scroll + hover image swap | Black #000000 + Purple #9945FF (dominant) + Teal #14F195 | Bold sans-serif headlines, minimal body, large floor price callouts | Trending collection carousel, featured drop countdown banner | Parallax on scroll, hover transforms, smooth filters | Single-column grid, sticky header, swipe carousels |
| **Helius** (API Dashboard) | Real-time request metrics with latency distribution visualization | Tech Dark #0D1117 + Cyan #00D4FF + Blue #3B82F6 | System monospace fonts, small labels, numeric emphasis | Metric cards showing API health/uptime, call-to-action | Minimal animations, real-time counters, smooth transitions | Responsive card grid, collapsible sections, compact stats |
| **Trust Wallet** | Chain selector with smooth cross-chain asset visualization | Dark Navy #0C1932 + Brand Blue #3B82F6 + Chain-specific accents | Clean sans-serif, high readability, numeric monospace | Portfolio balance as hero, navigation tabs (Assets/Activity/Analytics) | Smooth chain transitions, subtle loading states | Native bottom-tab navigation, swipeable lists, expandable details |

---

## Design Technique Breakdown

### **Most Impactful Techniques** (Why They Work)

| Technique | Example Platform | Why It's Memorable | Web3 Trust Implication |
|-----------|------------------|-------------------|----------------------|
| **Interactive Flow Visualization** | Chainalysis | Animates complexity → understandable movement; nodes + directed lines show actual blockchain logic | Builds trust through transparency; users see *how* analysis works |
| **Risk Scoring Gauge** | Elliptic, Scorechain | Single prominent metric reduces cognitive load; color coding (red/yellow/green) is instant | Reputation is distilled to one visual; clear risk communication |
| **Native Mobile Integration** | Phantom | Embraces form factor (not responsive web); gestures + biometric auth feel native | Mobile-first trust (platform knows user, remembers them) |
| **Route Transparency** | Jupiter | Shows invisible backend work; slippage impact visible before execution | Trust through visibility; user sees the transaction path |
| **Parallax + Hover Depth** | Magic Eden | Creates perception of depth/quality; subtle micro-interactions build confidence | Visual polish = perceived reliability |
| **Real-Time Metric Updates** | Helius | Live counters + smooth transitions convey "always on, always accurate" | Trust through timeliness; no stale data |

---

## Color Palette Deep Dive

### **Solana Ecosystem Standard (What TrustTap+ MUST Differentiate From)**

```
Solana Purple:    #9945FF   ← Used by Phantom, Magic Eden, Raydium, Serum
Solana Teal:      #14F195   ← Used as secondary accent across ecosystem
Background:       #000000   ← Pure black (or #0F0F0F) — the default
Accent Blue:      #00D4FF   ← Some gradient uses
Text Primary:     #FFFFFF   ← White
Text Secondary:   #A0AEC0   ← Gray-400 range
```

### **Blockchain Analytics Palette** (Chainalysis, Scorechain, Elliptic)

```
Navy/Dark:        #0A0E27 - #1F2937   ← Professional, institutional feel
Accent Blue:      #0369A1 - #3B82F6   ← Trustworthy, not flashy
Status Colors:    Red #EF4444, Yellow #F59E0B, Green #10B981
Background:       #000000 (pure black) or dark navy
Text:             #FFFFFF (white) + Gray shades for secondary
```

### **Emerging Trend: Emerald/Teal Alternative** (For TrustTap+)

```
Primary Emerald:  #10B981   ← Differentiates from ecosystem purple
Secondary Teal:   #14B8A6   ← Related but distinct from Solana teal
Accent Cyan:      #06B6D4   ← Tech forward, not generic blue
Background:       #0F172A   ← Dark slate (not pure black — feels designed)
Text Primary:     #FFFFFF
Text Secondary:   #94A3B8
```

### **Key Insight:**
- **All** crypto platforms use **dark mode + contrasting accent**
- **All** Solana ecosystem products use **purple (#9945FF)**
- **TrustTap+ must use emerald (#10B981)** to differentiate visually while maintaining "serious tech" credibility

---

## Typography Strategy Comparison

| Platform | Display/Hero | Headline | Body | Numeric | Monospace |
|----------|--------------|----------|------|---------|-----------|
| **Chainalysis** | Geometric sans-serif 48px / 700wt | System sans-serif 28px / 600wt | System sans-serif 16px / 400wt | Bold emphasis | SF Mono 12-14px |
| **Scorechain** | Clean sans-serif 40px / 700wt | Clean sans-serif 24px / 600wt | System sans-serif 16px / 400wt | Bold 18-24px | Monaco 12px |
| **Phantom** | System UI (Roboto/Helvetica) 32px / 700wt | System 20px / 600wt | System 16px / 400wt | Bold system 20px | Monospace 14px |
| **Jupiter** | System sans-serif 36px / 700wt | System 24px / 600wt | System 16px / 400wt | Monospace 18px | Courier 12px |
| **TrustTap+ Recommendation** | Inter 40px / 700wt | Inter 28px / 600wt | Inter 16px / 400wt | Inter 22px / 600wt | JetBrains Mono 13px |

### **Rules That Apply Across All Top Platforms:**

1. **No weights < 400** (thin looks broken on mobile)
2. **Large line-height** (1.5+ for body text = readability)
3. **Monospace ONLY for raw data** (addresses, amounts, code)
4. **Numeric emphasis** (trust scores, balances are larger + bold)
5. **High contrast** (white on dark, dark on light — no gray-on-gray)
6. **Single typeface** (all platforms use one sans-serif + one monospace, max)

---

## Hero Section Patterns Analysis

### **What Works for Trust/Reputation Platforms:**

#### Pattern 1: **Metric-as-Hero** (Chainalysis, Scorechain, Elliptic)
- ✅ Single prominent data visualization (gauge, chart, or flow)
- ✅ Minimal copy (headline + one sentence)
- ✅ CTA below metric (Sign Up / Get Started)
- ✅ Background: animated data viz or video walkthrough
- ✅ Animation: subtle, on-load (not distracting)
- **Best for:** Analytics, compliance, wallet scoring

#### Pattern 2: **Form-as-Hero** (Jupiter, Phantom)
- ✅ Input/interaction element is hero (swap form, wallet connect)
- ✅ Zero unnecessary prose (action is copy)
- ✅ Minimal secondary navigation
- ✅ Background: simple or data-driven (not decorative)
- ✅ Animation: smooth transitions, not flashy
- **Best for:** Trading, wallet apps, transactional products

#### Pattern 3: **Social-Proof-as-Hero** (Magic Eden via carousel)
- ✅ Featured items carousel (collections, drops, trending)
- ✅ Live social signals (volume, sales, verified badges)
- ✅ Time urgency (countdown for drops)
- ✅ Large images (content is visual, not textual)
- ✅ Animation: parallax scroll, hover transforms
- **Best for:** Marketplaces, community products

#### Pattern 4: **Video Background Hero** (Scorechain, Elliptic)
- ✅ Auto-play video showing product in action
- ✅ Overlay with CTA + minimal copy
- ✅ Video muted, looping, no sound
- ✅ Fallback image for mobile (video = bandwidth issue)
- ❌ **Problem:** Dated feel (2022-2023 trend), mobile unfriendly
- **Verdict:** Avoid if possible; use static + animation instead

### **What DOESN'T Work:**

| Anti-Pattern | Why It Fails | Platform Example |
|--------------|-------------|------------------|
| **Generic Card Grid Hero** | No focal point; users don't know where to start | Generic SaaS templates |
| **Gradient Background** | Overused, feels unmotivated, no clarity | Most crypto projects in 2024 |
| **3D Floating Objects** | Impressive but distracting; no conversion benefit | Some NFT platforms |
| **Feature Carousel** | Too much cognitive load; users bounce | Legacy SaaS sites |
| **Stock Illustration** | Impersonal, low trust for serious products | Generic fintech templates |

---

## Animation/Motion Strategy Comparison

| Platform | Philosophy | Specific Techniques | Mobile Consideration |
|----------|-----------|-------------------|----------------------|
| **Chainalysis** | Purposeful motion = clarity | Node animations, line draws, smooth transitions | Reduced on mobile (GPU consideration) |
| **Scorechain** | Subtle state feedback | Auto-play report animations, progress bars | No flashy effects on small screens |
| **Elliptic** | Attention-driving via pulse | Risk gauge animations, threat pulse effects | Smooth, not jarring on mobile |
| **Phantom** | Native gestures | Bottom-sheet slides, swipe transitions, no Lottie | Native mobile gestures (natural feel) |
| **Jupiter** | Number transitions | Framer Motion count-up animations, route reveal | Smooth but fast (not slow/floaty) |
| **Magic Eden** | Immersion through parallax | Parallax scroll, hover image swap, filter transitions | GPU-efficient (CSS-based, not JS) |

### **Key Finding: Less is More**
- None of the top 8 platforms use intrusive animations
- Motion is functional (clarifies, doesn't impress)
- Lottie animations are avoided (bandwidth + performance)
- Native mobile gestures (swipe, long-press) > custom animations

---

## Mobile Adaptation Strategy

### **What Works Across All Platforms:**

| Strategy | Implementation | Why It Works |
|----------|----------------|-------------|
| **Stack-Based Layout** | Single column, full width | Mobile is narrow; cards must stack |
| **Sticky Header/Navigation** | Top or bottom nav stays visible | Reduces scroll friction |
| **Tap-to-Expand Cards** | Hide details behind tap; show on demand | Reduces cognitive load at scroll |
| **Bottom-Sheet Modals** | Modal slides up from bottom | Native gesture feel (not dialog box) |
| **Swipe-Based Navigation** | Horizontal swipe for tabs/sections | Native mobile interaction pattern |
| **Gesture Confirmation** | Long-press, swipe, biometric for sensitive actions | Higher security UX on mobile |
| **Responsive Charts** | Horizontal scroll for full-width charts | Data must be readable on 375px width |
| **Floating Action Button (FAB)** | Primary action (send, swap, report) as persistent FAB | Single-handed operation |
| **Collapsible Sections** | Accordion-style for deep data | Reduce initial data density |

### **What Doesn't Work on Mobile:**

- ❌ Hover states (no mouse on mobile)
- ❌ Right-click context menus (no right-click)
- ❌ Keyboard shortcuts alone (no keyboard)
- ❌ Large unoptimized images (bandwidth + load time)
- ❌ Auto-play videos (bandwidth + battery)
- ❌ Overcomplicated gestures (pinch, rotate, multi-touch)
- ❌ Keyboard-only navigation (Tab through everything)

---

## Trust Signal Design Patterns

| Trust Signal | Visual Implementation | Platforms Using It |
|--------------|----------------------|-------------------|
| **Verified Badges** | Checkmark icon in circle, color: emerald/green | All platforms |
| **Audit Confirmations** | Badge or label (e.g., "Audited by X") | Chainalysis, Scorechain |
| **Institution Logos** | Row of logos at bottom (banks, regulators, investors) | Chainalysis, Elliptic |
| **Uptime/SLA Badges** | "99.9% Uptime" badge prominent | Helius, API platforms |
| **Live User Count** | Counter showing active/verified users | Phantom, Magic Eden |
| **Recent Activity Feed** | "X just verified Y" — social proof via stream | Web3 dashboard pattern |
| **Transaction Previews** | Clear summary before execution (amount, fees, recipient) | Phantom, Jupiter |
| **Risk Color Coding** | Red/Yellow/Green for risk levels | Chainalysis, Scorechain |
| **Clear Error Messages** | Actionable explanations, not error codes | All platforms |
| **Privacy/Security Statements** | Clear data handling policies | Chainalysis, Trust Wallet |

---

## Solana Ecosystem Visual Homogeneity Analysis

### **Why They All Look the Same (And Why TrustTap+ Must Differ)**

**Shared Characteristics:**
1. **Purple Dominance** — #9945FF used by Phantom, Magic Eden, Serum, Raydium
2. **Black Background** — #000000 or #0F0F0F standard across all
3. **Teal Accent** — #14F195 as secondary, creating purple-teal pairing
4. **Card-Based Layout** — Icon + title + subtitle (AI slop pattern)
5. **Minimal Hierarchy** — Everything feels equally important
6. **Data Density** — More metrics > more clarity mindset
7. **Transaction-Focused** — All are tools for moving crypto, not social products

### **Visual Pattern Breakdown**

```
PHANTOM + MAGIC EDEN + JUPITER + RAYDIUM + SERUM
    ↓
All use #9945FF (Solana purple) + #14F195 (teal)
All use #000000 (pure black background)
All use similar sans-serif typography (system fonts)
All use card-grid layouts (generic)
All feel like "serious blockchain tools" (not social platforms)
```

**Result:** Visual convergence — you can swap UI between them and it feels "on brand" for Solana ecosystem, but not unique.

---

## TrustTap+ Design Differentiation Strategy

### **Do NOT Copy:**
- ❌ Purple + teal palette (ecosystem standard)
- ❌ Card + icon + title layout (AI slop)
- ❌ Pure black backgrounds (feels generic)
- ❌ Gradient overlays (2024 trend, dated)
- ❌ Dashboard overload with metrics (information anxiety)

### **DO Differentiate With:**

#### **Color Differentiation**
```
Use Emerald (#10B981) as primary color
Pair with Dark Teal (#14B8A6) as secondary
Background: Dark Slate (#0F172A), not pure black
Accent: Cyan (#06B6D4) for highlights
Result: Visually distinct from purple ecosystem
Trust signal: Emerald = organic, natural, trustworthy (vs. electric purple)
```

#### **Hero Section Differentiation**
```
Not another dashboard.
Not another card grid.
Hero = Single Trust Score Circle
  • Large emerald ring
  • Numeric trust score (0-100) in center
  • Single sentence explaining score
  • CTA: "View Your Reputation" or "Connect Wallet"
  • Subtle glow animation (not pulsing, not flashy)
  • Subtext: "Built from verified SGT connections"
```

#### **Social Layer Differentiation**
```
Unlike Phantom (wallet focus) or Chainalysis (analytics focus):
TrustTap+ = Social Trust Network
  • Show verified SGT-owner connections (not just metrics)
  • Visual network graph (nodes = people, edges = verified meetings)
  • Trust score includes social proof (not just transaction history)
  • "You've met X people, they've met Y people" social math
```

#### **Mobile-Native Differentiation**
```
Not a responsive web app.
Native-feeling PWA designed for Seeker phone context.
  • Biometric auth as primary, not secondary
  • Gesture-based QR scan (long-press to open scanner)
  • Bottom-sheet meeting verification flow
  • Swipe-based navigation (Phantom-style tabs)
  • "Minimize" gesture to close deep dives
```

---

## Key Takeaways for TrustTap+ Design System

| Finding | Implication for TrustTap+ |
|---------|---------------------------|
| **All platforms use dark mode** | ✅ Commit to dark mode + emerald accents (not optional) |
| **All platforms use contrasting accent color** | ✅ Use emerald (#10B981), not purple (differentiation) |
| **All platforms hide complexity** | ✅ One trust score as hero, not 10 metrics |
| **All platforms use status color coding** | ✅ Implement red/yellow/green for risk levels |
| **All platforms emphasize motion over decoration** | ✅ Animate transitions, not backgrounds |
| **All platforms optimize for mobile** | ✅ Mobile-first, not responsive web |
| **None use generic AI slop cards** | ❌ Design unique reputation score visualization |
| **All show transaction previews/details** | ✅ Show how trust score is calculated |
| **All use native app patterns when mobile** | ✅ Phantom-style bottom tabs + swipes |
| **All communicate trust through design** | ✅ Emerald + transparent algorithm = trustworthy |

---

## Next Actions

1. **Finalize Color System** — Lock in emerald/teal hex values for all component states
2. **Design Hero Section Variations** — 3-5 approaches for trust score display
3. **Create Component Library** — Trust gauge, connection badge, score ring, network node
4. **Prototype Meeting Flow** — QR scan → verification → social connection
5. **Design Profile Layout** — Trust score + verified connections + calculation breakdown
6. **Mobile Navigation Study** — Phantom-style bottom tabs vs. drawer navigation
7. **Animation Spec** — Exactly which transitions move, by how much, for how long
8. **Test Differentiation** — Why is this visually distinct from Phantom/Magic Eden/Chainalysis?

---

**Research Complete.** Ready for Design Forge Phase 5-6 with full differentiation guidelines.
