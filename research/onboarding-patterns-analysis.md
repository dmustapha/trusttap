# Mobile Onboarding Patterns Research for TrustTap+

**Research Date:** March 1, 2026
**Purpose:** Identify best onboarding patterns for teaching complex concepts in a mobile-first crypto PWA
**Deadline Context:** March 9 (7 days) — hackathon build

---

## Executive Summary

After analyzing onboarding patterns from Phantom, Jupiter, Coinbase, Duolingo, and fintech apps, **3 patterns emerge as best fits** for TrustTap+:

1. **Progressive Disclosure via "?" Tooltips** (Recommend: PRIMARY)
2. **Interactive First-Use Coach Marks** (Recommend: SECONDARY)
3. **Optional 3-Card Swipe Intro** (Recommend: OPTIONAL)

**Time to implement:** 4-6 hours for all three combined.
**Why these:** Crypto-native users hate being blocked by tutorials. These patterns educate without friction.

---

## Pattern Analysis

### Pattern 1: Swipe-Through Intro Cards

**How It Works:**
iOS-style deck of 3-5 cards users swipe through before first use. Can be skipped.

**Examples Found:**
- **Coinbase:** Uses multi-step wizard with progress indicators
- **Fintech apps (2026):** Breaking long forms into "wizard-style" flows with clear progress
- **Mobile onboarding tools:** Plotline, Appcues offer carousel components

**Evaluation:**

| Criterion | Rating | Notes |
|-----------|--------|-------|
| Handles "read" content | 9/10 | Excellent for explaining concepts |
| Handles "show" content | 3/10 | Doesn't point to actual features |
| Mobile-friendly | 10/10 | Native pattern, familiar to users |
| Implementation complexity | 6/10 | Moderate (state management, swipe gestures) |
| Feels native vs annoying | 7/10 | Native BUT crypto users often skip |

**TrustTap+ Application:**
- Card 1: "What is TrustTap?" — 3-layer trust model visual
- Card 2: "Your SGT Badge" — Why it matters, device attestation
- Card 3: "Meet Someone New" — QR scan demo

**Pros:**
- Familiar pattern
- Can include visuals/animations
- Sets expectations upfront

**Cons:**
- Crypto-native users often skip immediately
- Doesn't help when they're confused *inside* the app
- Implementation time: ~2-3 hours

---

### Pattern 2: Progressive Disclosure (Contextual Tooltips + "?" Icons)

**How It Works:**
Inline "?" icons next to unfamiliar concepts. Tap to reveal bottom-sheet explainer. First-time users see automatic tooltips (dismissible).

**Examples Found:**
- **Phantom:** Tooltips for technical jargon, optional tutorials
- **Crypto wallet UX guide:** "?" icon linking to FAQs recommended as best practice for first-time users
- **Fintech design (2026):** "Inline validation and real-time feedback" as critical pattern
- **Progressive disclosure:** Creates behavioral segmentation, reduces perceived risk

**Evaluation:**

| Criterion | Rating | Notes |
|-----------|--------|-------|
| Handles "read" content | 8/10 | Great for definitions, short explainers |
| Handles "show" content | 6/10 | Can point to features via coach marks |
| Mobile-friendly | 10/10 | Native bottom-sheets, touch-optimized |
| Implementation complexity | 4/10 | Easy (CSS + state for bottom-sheet) |
| Feels native vs annoying | 9/10 | User-initiated, non-blocking |

**TrustTap+ Application:**

| Screen | Tooltip Location | Explainer Content |
|--------|------------------|-------------------|
| **Profile** | "Trust Score" badge | Bottom-sheet: "Your score (0-100) comes from 7 dimensions: SGT ownership, wallet age, transaction history, DeFi activity, NFT holdings, physical meetings, and AI risk analysis." |
| **Profile** | "SGT Badge" icon | Bottom-sheet: "Seeker Genesis Token proves you own a real Solana Seeker phone. It's soulbound (can't be transferred) and acts as your device attestation layer." |
| **Profile** | Each badge type | Bottom-sheet explaining badge criteria |
| **Scan** | "Why Meet?" | Bottom-sheet: "Physical meetings create proof-of-personhood. Scanning someone's QR proves you were in the same place at the same time — hard for Sybil farms to fake." |
| **Search** | "Sybil Risk" indicator | Bottom-sheet: "AI-powered analysis flags suspicious patterns like wallet farming, transaction wash trading, or coordinated airdrop abuse." |
| **Shield** | "How It Works" | Bottom-sheet: Sybil Shield explainer |

**Pros:**
- Non-intrusive
- User controls when they learn
- Scales to all features
- Easy to update content

**Cons:**
- Requires users to notice "?" icons
- Not great for first-time "wow" moment

**Implementation:**
- Reusable `<BottomSheet>` component
- `<HelpIcon>` component with `onClick` → open sheet
- ~2 hours to build, ~1 hour to write copy

---

### Pattern 3: Interactive Coach Marks (First-Use Spotlights)

**How It Works:**
On first visit to a screen, dimmed overlay with spotlight on key feature + tooltip. User taps "Got it" to proceed. Only shows once per screen.

**Examples Found:**
- **Plotline/fintech tools:** Spotlights, coach marks, tooltips as core onboarding UI
- **Mobile onboarding best practices:** "Contextual guidance through timely tooltips and micro-prompts"
- **Appcues/WalkMe:** Interactive tutorials that guide users through features

**Evaluation:**

| Criterion | Rating | Notes |
|-----------|--------|-------|
| Handles "read" content | 6/10 | Brief text only (2-3 sentences max) |
| Handles "show" content | 10/10 | Literally points at features |
| Mobile-friendly | 9/10 | Requires careful touch target sizing |
| Implementation complexity | 7/10 | Moderate (overlay, positioning, localStorage tracking) |
| Feels native vs annoying | 7/10 | Can feel hand-holdy if overused |

**TrustTap+ Application:**

| Screen | Coach Mark 1 | Coach Mark 2 | Coach Mark 3 |
|--------|-------------|-------------|-------------|
| **Profile** | "This is your Trust Score" (points to badge) | "Tap badges to see how you earned them" | — |
| **Scan** | "Tap here to scan someone's QR" | "Or paste their wallet address" | — |
| **Search** | "Search any Solana wallet" | "Tap Sybil Shield to see detailed risk analysis" | — |
| **Shield** | "7 dimensions analyzed by AI" | "Red = suspicious, green = trustworthy" | — |

**Pros:**
- Forces awareness of key features
- Works well for "where is X?" questions
- Feels guided without blocking

**Cons:**
- Can feel patronizing to experienced users
- Requires localStorage to track "seen" state
- Only works once — no re-access

**Implementation:**
- Reusable `<CoachMark>` component
- `useFirstVisit(screenName)` hook
- ~3-4 hours to build

---

### Pattern 4: Dedicated "Learn" Section

**How It Works:**
Tab or page with educational content (FAQs, guides, glossary).

**Examples Found:**
- **Phantom:** "Learn" section on website
- **Crypto wallet UX:** "Help button linking to FAQs" recommended

**Evaluation:**

| Criterion | Rating | Notes |
|-----------|--------|-------|
| Handles "read" content | 10/10 | Unlimited depth |
| Handles "show" content | 2/10 | Disconnected from features |
| Mobile-friendly | 8/10 | Scrollable content works well |
| Implementation complexity | 3/10 | Easy (static pages) |
| Feels native vs annoying | 8/10 | Optional, non-intrusive |

**TrustTap+ Application:**
- Add "Learn" tab to bottom nav
- Sections: "What is TrustTap?", "Trust Score Explained", "How to Meet Someone", "Badges Guide", "Sybil Detection", "FAQ"

**Pros:**
- Reference material always available
- Easy to expand over time
- Good for complex topics

**Cons:**
- Users must actively seek it out
- Doesn't help *in context*
- Adds a 5th screen to navigation

**Implementation:**
- ~2 hours to build static pages
- **BUT:** Adds navigation complexity for hackathon

---

### Pattern 5: Video/GIF Walkthroughs

**How It Works:**
Short (~15sec) auto-playing videos/GIFs demonstrating features.

**Examples Found:**
- **Plotline:** PiP videos, animations in onboarding
- **Mobile onboarding tools:** Video tutorials as core feature

**Evaluation:**

| Criterion | Rating | Notes |
|-----------|--------|-------|
| Handles "read" content | 4/10 | Not great for text-heavy concepts |
| Handles "show" content | 10/10 | Shows actual interaction |
| Mobile-friendly | 8/10 | Bandwidth considerations |
| Implementation complexity | 9/10 | High (video production + compression) |
| Feels native vs annoying | 6/10 | Can feel gimmicky |

**TrustTap+ Application:**
- 10-second loop showing QR scan flow
- GIF of trust score breakdown

**Pros:**
- Highly engaging
- Shows don't tell

**Cons:**
- Production time (not feasible for hackathon)
- File size concerns for PWA
- Requires video hosting/optimization

**Verdict:** ❌ **Skip for hackathon** — too time-intensive

---

### Pattern 6: Gradual Engagement (Duolingo Model)

**How It Works:**
Let users start using the app immediately. Delay account creation/advanced features until after "magic moment."

**Examples Found:**
- **Duolingo:** Test lesson BEFORE signup → increased retention from 12% to 55%
- **Jupiter:** "Onboard and send SOL in less than 3 steps" — emphasis on speed
- **Jupiter Send:** "Get hands-on experience immediately" without overwhelming with technical details

**Evaluation:**

| Criterion | Rating | Notes |
|-----------|--------|-------|
| Handles "read" content | 2/10 | Doesn't teach — lets users discover |
| Handles "show" content | 8/10 | Users learn by doing |
| Mobile-friendly | 10/10 | No friction |
| Implementation complexity | 8/10 | Requires rethinking flow |
| Feels native vs annoying | 10/10 | Zero interruption |

**TrustTap+ Application:**
- **Current flow:** Connect wallet → see profile
- **Gradual engagement flow:** Show demo wallet profile FIRST → "Want to see YOUR trust score? Connect wallet"

**Pros:**
- Reduces abandonment
- Users see value before commitment
- Proven pattern (Duolingo)

**Cons:**
- Requires wallet connection to calculate score (can't fully demo without it)
- May confuse users ("whose profile am I looking at?")

**Verdict:** ❌ **Not applicable** — TrustTap+ requires wallet connection to function

---

## Competitive Pattern Analysis: Crypto Apps

### Phantom Wallet
- **Approach:** Minimal onboarding, tooltips for jargon, optional tutorials
- **Strength:** Fast time-to-value
- **Weakness:** Assumes user knowledge

### Jupiter Mobile
- **Approach:** "Smoothest invite flow" — onboard in 3 steps, learning-by-doing
- **Strength:** No overwhelming technical details upfront
- **Weakness:** Less educational for complex features

### Coinbase
- **Approach:** Wizard-style multi-step onboarding, inline validation, progress indicators
- **Strength:** Guides less experienced users
- **Weakness:** Can feel slow for crypto-native users

### Key Insight:
**Crypto-native users (TrustTap+'s audience) prefer low-friction onboarding.** They'll explore features organically. Education should be *available* but not *mandatory*.

---

## Recommendations for TrustTap+

### Recommended Approach: Hybrid Model

Combine 3 patterns for optimal coverage:

#### Layer 1: Optional 3-Card Swipe Intro (OPTIONAL — Add if time permits)
**When:** First app launch (can be skipped)
**Content:**
- Card 1: "Verify the PERSON behind the wallet" + 3-layer trust visual
- Card 2: "Your SGT proves you own a real Seeker phone"
- Card 3: "Scan someone's QR to meet IRL and boost both scores"

**Implementation:** 2-3 hours
**Priority:** LOW (nice-to-have)

---

#### Layer 2: Contextual "?" Tooltips (PRIMARY — Must-have)
**When:** User taps "?" icon next to unfamiliar term
**Content:** Bottom-sheet explainers (see Pattern 2 table above)

**Implementation:**
1. Create `<BottomSheet>` component (~30 min)
2. Create `<HelpIcon>` component (~15 min)
3. Add tooltips to 8-10 key terms (~1 hour for copy + integration)
4. **Total: ~2 hours**

**Priority:** HIGH (core feature)

---

#### Layer 3: First-Use Coach Marks (SECONDARY — Recommended)
**When:** First visit to each screen
**Content:** 1-2 spotlights per screen pointing to key features

**Implementation:**
1. Create `<CoachMark>` component with overlay + spotlight (~2 hours)
2. Create `useFirstVisit(screenName)` hook (~30 min)
3. Add coach marks to 4 screens (~1 hour)
4. **Total: ~3.5 hours**

**Priority:** MEDIUM (high impact, moderate effort)

---

### Complete Implementation Plan

**Total time:** 5.5-8.5 hours (depending on whether Card Intro is included)

#### Phase 1: Core Components (2.5 hours)
- [ ] Build `<BottomSheet>` component (slide-up modal, backdrop, close button)
- [ ] Build `<HelpIcon>` component (? icon + onClick handler)
- [ ] Build `<CoachMark>` component (dimmed overlay, spotlight, tooltip)
- [ ] Build `useFirstVisit(screenName)` hook (localStorage tracking)

#### Phase 2: Content Creation (1.5 hours)
- [ ] Write tooltip copy for 10 terms (50-100 words each)
- [ ] Write coach mark copy for 8 spotlights (1-2 sentences each)
- [ ] (Optional) Write 3-card intro copy + design slides

#### Phase 3: Integration (2 hours)
- [ ] Add `<HelpIcon>` to Profile screen (3 tooltips)
- [ ] Add `<HelpIcon>` to Scan screen (2 tooltips)
- [ ] Add `<HelpIcon>` to Search screen (2 tooltips)
- [ ] Add `<HelpIcon>` to Shield screen (3 tooltips)
- [ ] Add coach marks to all 4 screens (2 per screen)

#### Phase 4: Polish (0.5 hours)
- [ ] Test on mobile viewport
- [ ] Ensure bottom-sheets don't overlap key UI
- [ ] Add animations (slide-up, fade-in)

#### Phase 5 (Optional): Card Intro (2-3 hours)
- [ ] Design 3 intro cards with Framer Motion
- [ ] Add swipe gesture handling
- [ ] Add "Skip" button
- [ ] Track completion in localStorage

---

## Why This Approach Works for TrustTap+

### Matches User Profile
- **Crypto-native Seeker owners:** Don't need hand-holding, but DO need clarity on novel concepts (3-layer trust, SGT attestation, meeting verification)
- **Mobile-first:** Bottom-sheets and coach marks are native mobile patterns
- **Hackathon judges:** Will appreciate thoughtful UX without over-engineering

### Scales to All Features
- Tooltips can be added to ANY future feature
- Coach marks guide without blocking
- No dedicated "Learn" section cluttering navigation

### Low Implementation Cost
- 5.5 hours for Layers 2 + 3 (must-haves)
- 2-3 hours for Layer 1 (optional)
- **Total: 1 day max** — feasible for March 9 deadline

### Proven Patterns
- Phantom, Coinbase, fintech apps all use tooltips + coach marks
- Progressive disclosure is UX best practice (not just crypto)

---

## Alternative: Aggressive Simplification

If time is extremely tight, **implement ONLY Layer 2 (tooltips):**

**Minimum viable onboarding:**
- 10 "?" icons throughout app
- Reusable `<BottomSheet>` component
- ~50-100 word explainers for each concept
- **Total time: 2 hours**

This alone solves 80% of confusion.

---

## Content Inventory: Required Tooltips

### Profile Screen
1. **Trust Score badge** → "How is my score calculated?"
2. **SGT Badge** → "What does SGT prove?"
3. **Each badge type** → "How do I earn this badge?"
4. **7 Dimensions breakdown** → "What do these dimensions mean?"

### Scan Screen
5. **"Why meet someone?"** → Physical verification explainer
6. **"How does QR work?"** → Meeting flow overview

### Search Screen
7. **"Sybil Risk indicator"** → How AI flags suspicious wallets
8. **"Trust Breakdown"** → What each dimension shows

### Shield Dashboard
9. **"What is Sybil Shield?"** → Product explainer
10. **"Risk Score"** → How 0-100 risk is calculated

---

## Next Steps

1. **Approve approach** — Confirm Layers 2 + 3 (or just Layer 2 if time-constrained)
2. **Write tooltip copy** — Draft 10 explainers (~1 hour)
3. **Build components** — BottomSheet + HelpIcon + CoachMark (~2.5 hours)
4. **Integrate** — Add to all screens (~2 hours)
5. **Test on mobile** — Ensure touch targets work (~30 min)

**Target completion:** March 3-4 (leaves 4-5 days for polish before March 9)

---

## Sources

### Phantom Wallet
- [Phantom Wallet Review - Pros, Cons, Safety](https://99bitcoins.com/bitcoin-wallet/phantom-wallet-review/)
- [Phantom Wallet Statistics 2026](https://coinlaw.io/phantom-wallet-statistics/)
- [What Is Phantom Wallet and How to Use It](https://nftevening.com/how-to-use-phantom-wallet/)

### Jupiter Mobile
- [Jupiter Mobile - Solana Wallet App](https://apps.apple.com/us/app/jupiter-mobile-solana-wallet/id6484069059)
- [Jupiter Send: Revolutionizing Crypto Onboarding](https://www.emostically.com/2025/08/jupiter-send-revolutionizing-crypto-onboarding.html)
- [Jupiter Exchange Introduces Mobile App](https://www.altcoinbuzz.io/cryptocurrency-news/jupiter-exchange-introduces-mobile-app/)

### Coinbase & Fintech Patterns
- [Progressive Disclosure Examples](https://userpilot.com/blog/progressive-disclosure-examples/)
- [Crypto's User Activation Crisis: Coinbase Case Study](https://medium.com/the-plg-insider/cryptos-user-activation-crisis-a-product-case-study-on-coinbase-s-activation-funnel-e2a21b6eef48)
- [Coinbase iOS Onboarding Flow](https://mobbin.com/explore/flows/f0d961ca-478f-4501-b697-d965945a541a)

### Mobile Onboarding Best Practices
- [Fintech Design Guide 2026](https://www.eleken.co/blog-posts/modern-fintech-design-guide)
- [Top 5 Mobile App Onboarding Software](https://www.plotline.so/blog/top-mobile-app-onboarding-software)
- [Mobile App Onboarding Guide (2026)](https://vwo.com/blog/mobile-app-onboarding-guide/)
- [Mobile Onboarding Best Practices](https://www.designstudiouiux.com/blog/mobile-app-onboarding-best-practices/)

### PWA & Bottom Sheets
- [Best Practices for PWA Installation](https://www.midday.io/blog/best-practices-for-pwa-installation)
- [Richer PWA Installation UI](https://developer.chrome.com/blog/richer-pwa-installation)
- [Progressive Web Apps | MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

### Duolingo Gamification
- [Duolingo Gamification Explained](https://www.strivecloud.io/blog/gamification-examples-boost-user-retention-duolingo)
- [Duolingo's Delightful User Onboarding](https://goodux.appcues.com/blog/duolingo-user-onboarding)
- [Duolingo Onboarding UX Breakdown](https://userguiding.com/blog/duolingo-onboarding-ux)

### Crypto Wallet UX
- [UI Principles for Crypto Wallets](https://graphicdesignjunction.com/2025/01/user-interface-ui-for-crypto-wallets-principles-for-designing-user-friendly-wallets/)
- [Blockchain & Crypto UX Design Guide](https://avark.agency/learn/article/blockchain-ux-design-guide/)
- [Embedded Wallets Explained (2026)](https://www.openfort.io/blog/embedded-wallet-explained)
