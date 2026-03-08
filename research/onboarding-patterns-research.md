# Mobile-First Onboarding Patterns Research
**Date:** March 2, 2026
**Project:** TrustTap+
**Purpose:** Research mobile-first onboarding patterns for crypto/fintech apps to inform TrustTap+ design

---

## Executive Summary

Based on analysis of top crypto/fintech apps (Phantom, Jupiter, Coinbase, Cash App, Revolut), there are three primary onboarding approaches:

1. **Minimal/Speed-first** (Cash App, Jupiter) — ~5-15 words on first screen, single prominent CTA
2. **Narrative/Value-first** (Revolut, Phantom) — ~20-40 words, sells vision before asking for action
3. **Contextual/Progressive** (Slack, Figma) — Minimal upfront, teach-as-you-go with tooltips/coach marks

For complex products like TrustTap+ (7 trust dimensions, QR verification, sybil protection), research suggests a **hybrid approach**: minimal first screen + optional dedicated guide + contextual help on first visit to each feature.

---

## 1. Landing/Entry Screens — Concrete Examples

### Phantom Wallet (Solana)
**First Screen Pattern:**
- Welcome screen with "Create New Wallet" CTA
- Immediately asks about biometric security (Touch ID/Face ID)
- Shows Secret Recovery Phrase early in flow
- **Layout:** Centered logo → Brief tagline → Primary CTA → Secondary CTA
- **Word Count Estimate:** ~15-25 words ("Welcome to Phantom. The crypto app for everyone. Create New Wallet / Import Existing Wallet")

**Source:** [Phantom Wallet Guide](https://phantom.com/learn/guides/how-to-create-a-new-wallet), [NFT Now](https://nftnow.com/guides/how-to-set-up-and-use-phantoms-solana-wallet/)

### Jupiter Mobile (Solana)
**First Screen Pattern:**
- Emphasizes "lightning-fast swaps" and "all-in-one crypto super app"
- Fiat onramp with Apple Pay prominently mentioned
- Login with Apple ID or email (no seed phrase required)
- **Layout:** Value proposition → Visual demo → Primary CTA
- **Word Count Estimate:** ~20-30 words
- **Note:** Founder admitted initial onboarding was "2/10" at launch — not ready for mainstream

**Source:** [Blockworks](https://blockworks.co/news/solana-venue-jupiter-released-mobile-app), [Jupiter Onboard](https://jup.ag/onboard)

### Coinbase
**First Screen Pattern:**
- "Get started" CTA (misleading — directly opens buy Bitcoin flow)
- **Major UX Issue:** No actual onboarding or education
- Defaults to Bitcoin purchase without explaining anything
- **Layout:** Minimal welcome → "Get Started" button → Immediate purchase flow
- **Word Count:** ~10-15 words ("Welcome to Coinbase. Get started")
- **Lesson:** What NOT to do — "onboarding Trojan horse"

**Source:** [Built for Mars UX Analysis](https://builtformars.com/case-studies/how-coinbase-works), [TechCrunch Teardown](https://techcrunch.com/2020/09/24/coinbase-ux-teardown-5-fails-and-how-to-fix-them/)

### Cash App
**First Screen Pattern:**
- Bold, modern UI for Gen Z (oversized buttons, bold colors)
- **Single-question onboarding** to maintain momentum
- No onboarding videos — "just a thumb and curiosity"
- **Layout:** Bold visual → Single question → Large CTA
- **Word Count:** ~5-10 words per screen (extremely minimal)
- **Philosophy:** Speed and simplicity > education

**Source:** [Wavespace Banking UX](https://www.wavespace.agency/blog/banking-app-ux)

### Revolut
**First Screen Pattern:**
- "Less like a bank, more like a lifestyle app"
- Sells vision of what Revolut can do BEFORE asking for account creation
- High-energy marketing blended with compliance
- Asks about financial goals (saving vs investing vs spending) early
- **Layout:** Value narrative → Personalization questions → Account creation
- **Word Count:** ~30-50 words (longer, narrative-driven)
- **Philosophy:** Education and excitement first, compliance second

**Source:** [Craft Innovations Analysis](https://craftinnovations.global/revolut-onboarding-flow-analysis/), [Banking Onboarding Best Practices](https://craftinnovations.global/banking-onboarding-best-practices-revolut-nubank-monzo/)

---

## 2. Onboarding Guide Patterns — Three Approaches

### A. Dedicated Guide Flow (Multi-Step Walkthrough)

**Best Example: Duolingo**
- **Structure:** 7-step mobile signup process
- **Steps:**
  1. Welcome from mascot (Duo the owl)
  2. Language selection
  3. Learning goal setting
  4. Motivation questions
  5. Prior knowledge assessment
  6. Quick translation exercise (try before signup)
  7. Account creation
- **Key Pattern:** "Gradual engagement" — postpones registration until after trying product
- **Visual Design:** Progress bar, simple UI, one question per screen
- **Philosophy:** Let users DO rather than WATCH

**Metrics:**
- Mobile: 7 steps
- Web: 6 steps (prior knowledge and course overview removed)
- Conversion: High due to "try before signup"

**Source:** [UserGuiding Duolingo Breakdown](https://userguiding.com/blog/duolingo-onboarding-ux), [GoodUX Analysis](https://goodux.appcues.com/blog/duolingo-user-onboarding)

**Best Example: Revolut**
- **Structure:** Story-led onboarding from first welcome screen to verified account
- **Steps:**
  1. Vision/value proposition (what Revolut can do)
  2. Financial goal personalization
  3. Account type selection
  4. KYC/compliance (made less painful with clear progress)
  5. Feature discovery
- **Philosophy:** Onboarding as marketing — selling a vision while managing compliance

**Source:** [Craft Innovations](https://craftinnovations.global/banking-onboarding-best-practices-revolut-nubank-monzo/)

### B. Contextual/In-Situ (Tooltips & Coach Marks)

**Best Example: Figma**
- **Pattern:** Tooltips appear when users see or interact with a feature
- **Design:** Clear, concise copy + animations illustrating functionality
- **Philosophy:** "Show, not tell" — users learn by doing
- **Implementation:**
  - Almost every tooltip has brief explanation
  - Animations demonstrate feature
  - Appears at point of interaction (not upfront)
  - No long tutorial — guidance is contextual

**Source:** [Medium Design Bootcamp](https://medium.com/design-bootcamp/designing-user-onboarding-lessons-from-figma-duolingo-and-more-b585012dd1ea), [UserOnboarding Academy](https://useronboarding.academy/user-onboarding-inspirations/figmas-tooltip)

**Best Example: Slack**
- **Pattern:** Progressive onboarding revealing features gradually
- **Implementation:**
  - Channels, DMs, integrations introduced when encountered
  - Guidance appears at the right moment (not all at once)
  - Contextual to user's workflow
- **Philosophy:** Don't overwhelm at beginning — guide when relevant

**Source:** [Appcues Mobile Patterns](https://www.appcues.com/blog/essential-guide-mobile-user-onboarding-ui-ux)

### C. Hybrid (Optional Guide + Contextual Help)

**Best Example: Evernote**
- **Pattern:** Step-by-step introduction for first note creation
- **Shows:** Formatting tools, organizational options as you encounter them
- **Philosophy:** Build confidence through hands-on guidance
- **Result:** Reduces learning curve for feature-rich app

**Source:** [VWO Mobile Onboarding Guide](https://vwo.com/blog/mobile-app-onboarding-guide/)

**Best Example: Wise (TransferWise)**
- **Pattern:** Progressive disclosure — only reveal what's needed in the moment
- **Implementation:**
  - Money transfer flow: amount → recipient → live exchange rate → payment → verification
  - Each screen focused on ONE action
  - Keeps experience fast and approachable
- **Philosophy:** Contextual complexity management

**Source:** [Eleken Fintech Onboarding](https://www.eleken.co/blog-posts/fintech-onboarding-simplification)

---

## 3. Which Pattern Works Best for Complex Products?

### Research Findings

**Fintech Benchmark Stats:**
- Average mobile fintech onboarding: **6 minutes, 14 screens, 16 required fields, 29 clicks**
- 60%+ users access fintech via smartphones (mobile-first is critical)
- High-risk flows require longer onboarding, but with **clear progress indicators and contextual help**

**Source:** [Appcues Fintech Examples](https://www.appcues.com/blog/fintech-onboarding-examples)

### Best Practices for Complex Products with Multiple Concepts

#### 1. Progressive Onboarding (Most Recommended)
- **Definition:** Reveal features gradually as users explore the app
- **Best for:** Feature-rich apps, products with advanced functionality
- **Why it works:** Prevents overwhelming users with too much upfront information
- **Implementation:** Tooltips, coach marks, in-context help appearing when users encounter features

**Source:** [UserPilot Fintech Onboarding](https://userpilot.com/blog/fintech-onboarding/), [UXCam KPIs](https://uxcam.com/blog/measure-fintech-app-onboarding-kpis/)

#### 2. Personalized Onboarding Prompts
- Ask about user intent upfront (e.g., "Are you here to save, invest, or spend?")
- Tailor flow based on answer
- **Example:** Revolut asks financial goals, then customizes feature introduction
- **Benefit:** Makes onboarding feel relevant, reduces friction

**Source:** [CleverTap Fintech Best Practices](https://clevertap.com/blog/onboarding-fintech-app-users/)

#### 3. Focus on Novel Elements Only
- **Rule:** Only teach what's DIFFERENT from similar apps
- Assume users understand common patterns
- **Example:** PayPal uses welcome screen to learn user's main goal, then skips basics

**Source:** [Nielsen Norman Group](https://www.nngroup.com/articles/mobile-instructional-overlay/)

#### 4. One Concept Per Card/Screen
- Keep each screen focused on a SINGLE action or concept
- Minimize number of cards to need-to-know information only
- Always provide visible "Skip" option

**Source:** [UserPilot App Onboarding](https://userpilot.com/blog/app-onboarding-best-practices/)

#### 5. Gamification for Retention
- Progress bars, checklists, step indicators
- **Example:** Shine (French fintech) has 80% onboarding conversion with gamified progress
- Shows users how far they've come and how much is left

**Source:** [CleverTap Fintech](https://clevertap.com/blog/onboarding-best-practices-for-fintech/)

### Tradeoffs: Dedicated Tutorial vs Contextual Help

| Aspect | Dedicated Tutorial | Contextual Help |
|--------|-------------------|-----------------|
| **When to use** | Complex, unfamiliar interactions | Standard patterns with app-specific twists |
| **Pros** | Users understand before diving in | Less disruptive, just-in-time learning |
| **Cons** | Users forget before they need it; can be skipped | Users may miss hints if not paying attention |
| **Best for** | Novel gestures, unique workflows | Feature discovery, advanced functionality |
| **Examples** | Duolingo (gamified learning flow) | Figma (tooltips on first interaction) |

**Nielsen Norman Guidance:**
- Tutorials work when interaction is **novel and critical**
- Contextual help works when pattern is **familiar but has unique twist**
- For complex products: **Hybrid approach wins** — brief tutorial for core concept + contextual help for details

**Source:** [NN/G Onboarding Tutorials](https://www.nngroup.com/articles/onboarding-tutorials/)

### Mobile-Specific Constraints

**Coach Marks on Mobile (NN/G Research):**
- ✅ Present hints one-by-one at the right moment
- ✅ Teach when functions become applicable in workflow
- ❌ Don't bombard with frequent hint screens (users dismiss quickly)
- ❌ Don't show multiple coach marks in a row (short-term memory overload)

**Source:** [NN/G Mobile Instructional Overlay](https://www.nngroup.com/articles/mobile-instructional-overlay/)

---

## 4. Recommendation for TrustTap+

### Challenge
TrustTap+ needs to explain:
- 7 trust dimensions (Token Value, Activity, OG Status, DeFi Engagement, NFT Activity, Social Proof, Consistency)
- QR verification flow
- Sybil protection concepts
- Trust score meaning and interpretation
- How to use search, scan, and shield modes

### Recommended Approach: **Hybrid Progressive Onboarding**

#### Phase 1: Minimal First Screen (~15-20 words)
**Layout:**
- TrustTap+ logo
- One-sentence value prop: "On-chain reputation for Solana Seeker owners"
- Two CTAs: "Connect Wallet" (primary) / "Learn How It Works" (secondary)

**Philosophy:** Follow Cash App's speed-first approach — let users connect immediately if they want.

#### Phase 2: Optional Dedicated Guide (Accessible Anytime)
**Structure:** 5-step visual walkthrough (inspired by Duolingo)
1. What is TrustTap+? (1 screen, ~30 words, visual of trust score)
2. The 7 Trust Dimensions (1 screen, iconography + brief labels)
3. How QR Verification Works (1 screen, animated demo)
4. What Sybil Shield Does (1 screen, visual comparison)
5. Try It Now (direct to app)

**Access:**
- "Learn How It Works" button on landing screen
- "Guide" icon in top nav (always accessible)
- Auto-dismiss after first view, never forced

**Philosophy:** Duolingo's "let users DO" + Revolut's "sell the vision"

#### Phase 3: Contextual Help on First Visit (Progressive)
**Implementation:**
- First time on Profile screen: Brief tooltip explaining trust score (10 words)
- First time on Scan screen: Overlay showing QR flow (15 words + animation)
- First time on Search screen: Hint about pasting wallet addresses (8 words)
- First time on Shield screen: Explanation of sybil flags (12 words)

**Design:**
- Figma-style: Clear, concise, with visual demo
- Always dismissible
- One concept per tooltip
- Never block interaction

**Philosophy:** Slack/Figma's progressive disclosure

### Why This Hybrid Works for TrustTap+

1. **Respects Power Users:** Crypto natives can skip straight to wallet connection
2. **Educates New Users:** Optional guide for those unfamiliar with reputation systems
3. **Reduces Cognitive Load:** Contextual help appears when concepts become relevant
4. **Maintains Momentum:** No forced 14-screen onboarding (fintech average)
5. **Mobile-Optimized:** Minimal text, visual-first, one concept at a time

---

## 5. Word Count Benchmarks by Category

| App Type | First Screen Words | Onboarding Flow Total Words |
|----------|-------------------|---------------------------|
| **Speed-first** (Cash App) | 5-10 | 50-100 |
| **Balanced** (Phantom) | 15-25 | 150-250 |
| **Narrative** (Revolut) | 30-50 | 400-600 |
| **Complex Product** (Duolingo) | 20-30 | 200-400 (spread across 7 steps) |

**TrustTap+ Target:** 15-20 words first screen, 200-300 total (optional guide + contextual)

---

## 6. Layout Patterns Summary

### Pattern A: Centered Hero (Most Common)
```
┌─────────────────┐
│                 │
│      LOGO       │
│                 │
│   Tagline here  │
│   (15-25 words) │
│                 │
│  [Primary CTA]  │
│  [Secondary CTA]│
│                 │
└─────────────────┘
```
**Used by:** Phantom, Coinbase, most wallets

### Pattern B: Value Narrative
```
┌─────────────────┐
│                 │
│   Visual/Demo   │
│                 │
│  Value Prop 1   │
│  Value Prop 2   │
│  Value Prop 3   │
│                 │
│  [Get Started]  │
│                 │
└─────────────────┘
```
**Used by:** Revolut, Jupiter

### Pattern C: Immediate Action
```
┌─────────────────┐
│                 │
│    Bold Visual  │
│                 │
│  "What's your   │
│   main goal?"   │
│                 │
│  [  Option 1  ] │
│  [  Option 2  ] │
│                 │
└─────────────────┘
```
**Used by:** Cash App, PayPal (personalization-first)

**TrustTap+ Recommendation:** Pattern A (Centered Hero) for familiarity in crypto space

---

## Sources

### Crypto Wallets
- [Phantom Wallet Guide](https://phantom.com/learn/guides/how-to-create-a-new-wallet)
- [NFT Now: Phantom Setup](https://nftnow.com/guides/how-to-set-up-and-use-phantoms-solana-wallet/)
- [Blockworks: Jupiter Mobile](https://blockworks.co/news/solana-venue-jupiter-released-mobile-app)
- [Built for Mars: Coinbase UX](https://builtformars.com/case-studies/how-coinbase-works)
- [TechCrunch: Coinbase Teardown](https://techcrunch.com/2020/09/24/coinbase-ux-teardown-5-fails-and-how-to-fix-them/)

### Fintech Apps
- [Wavespace: Banking App UX](https://www.wavespace.agency/blog/banking-app-ux)
- [Craft Innovations: Revolut Analysis](https://craftinnovations.global/revolut-onboarding-flow-analysis/)
- [Banking Onboarding Best Practices](https://craftinnovations.global/banking-onboarding-best-practices-revolut-nubank-monzo/)

### Onboarding Patterns
- [UserGuiding: Duolingo Breakdown](https://userguiding.com/blog/duolingo-onboarding-ux)
- [GoodUX: Duolingo Analysis](https://goodux.appcues.com/blog/duolingo-user-onboarding)
- [Medium: Figma Onboarding](https://medium.com/design-bootcamp/designing-user-onboarding-lessons-from-figma-duolingo-and-more-b585012dd1ea)
- [Appcues: Fintech Examples](https://www.appcues.com/blog/fintech-onboarding-examples)
- [Appcues: Mobile Patterns](https://www.appcues.com/blog/essential-guide-mobile-user-onboarding-ui-ux)
- [Appcues: Simple Mobile Onboarding](https://www.appcues.com/blog/simple-mobile-onboarding)

### Research & Best Practices
- [Nielsen Norman Group: Onboarding Tutorials](https://www.nngroup.com/articles/onboarding-tutorials/)
- [Nielsen Norman Group: Mobile Overlays](https://www.nngroup.com/articles/mobile-instructional-overlay/)
- [VWO: Mobile App Onboarding Guide](https://vwo.com/blog/mobile-app-onboarding-guide/)
- [UserPilot: Fintech Onboarding](https://userpilot.com/blog/fintech-onboarding/)
- [CleverTap: Fintech Best Practices](https://clevertap.com/blog/onboarding-fintech-app-users/)
- [Eleken: Fintech Simplification](https://www.eleken.co/blog-posts/fintech-onboarding-simplification)
- [UXCam: Fintech KPIs](https://uxcam.com/blog/measure-fintech-app-onboarding-kpis/)

---

## Key Takeaways

1. **First screens are getting shorter** — 5-25 words is standard, narrative apps go to 30-50
2. **Dedicated tutorials are falling out of favor** — Progressive/contextual onboarding wins for complex products
3. **Skip buttons are mandatory** — Never force long flows
4. **One concept per screen** — Cognitive load management is critical on mobile
5. **Try before signup** — Duolingo's pattern shows this increases conversion
6. **Personalization matters** — Asking user intent upfront tailors experience
7. **Visual > Text** — Animations, demos, and iconography beat paragraphs
8. **Progress indicators essential** — For multi-step flows, show where users are
9. **Mobile memory constraints** — Don't show multiple coach marks in a row
10. **Hybrid approach wins** — Minimal first screen + optional guide + contextual help = best retention

**For TrustTap+:** Use Cash App's speed + Duolingo's optional walkthrough + Figma's contextual tooltips.
