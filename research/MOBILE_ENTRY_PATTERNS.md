# Mobile App Entry Screen Patterns Research

**Research Date:** March 1, 2026
**Purpose:** Determine optimal entry screen pattern for TrustTap+ (mobile-first PWA hackathon demo)
**Context:** User concern that "most mobile apps don't have landing pages like this" — questioning need for full editorial landing page vs minimal splash/login screen

---

## Executive Summary

After analyzing mobile crypto wallets (Phantom, Jupiter, Coinbase, Trust Wallet, Rainbow), PWAs, fintech apps, and hackathon demo best practices, the research reveals:

**Key Finding:** Most native mobile crypto apps skip landing pages entirely and go straight to a minimal splash screen with "Create Wallet" / "Sign In" buttons. HOWEVER, TrustTap+ faces unique constraints as a:
1. **PWA (not native app)** — Web-based, so users may arrive via link/QR without app store context
2. **Hackathon demo** — Judges need to understand the value prop immediately
3. **Novel concept** — Trust scoring is unfamiliar; requires explanation

**Recommendation:** Hybrid approach (Pattern 4 below) — single-screen value prop + immediate action, NOT a multi-section editorial landing page.

---

## Pattern Analysis

### Pattern 1: Minimal Splash + Login (Native Crypto Apps)

**What it is:** Single screen with app logo, tagline, and "Create Wallet" / "Import Wallet" buttons. No feature explanation.

**Examples:**
- **Phantom Wallet:** Welcome screen → tap "Create New Wallet" → biometric/PIN setup → seed phrase generation
- **Coinbase Wallet:** App opens → "Get started" → social login or seed phrase setup
- **Trust Wallet:** Simple onboarding flow → create wallet → security setup → main view
- **Rainbow Wallet:** Tap "Get a new wallet" → sleek UI (closer to CashApp than Chase bank) → easy setup

**Pros:**
- Fast time-to-value (users in app in 5-10 seconds)
- Matches user expectations for mobile apps
- No cognitive load before using the product
- Ideal for apps users already know about (discovered via app store with screenshots/descriptions)

**Cons:**
- Assumes users already know what the app does
- No opportunity to explain value prop
- Fails if user arrives without context (via QR, link, etc.)
- Not suitable for novel/unfamiliar concepts

**When to use:**
- Native apps where app store provides context
- Well-known products (wallets, exchanges)
- Users actively searching for your solution

**NOT suitable for TrustTap+ because:**
- PWA (no app store to pre-educate users)
- Novel trust scoring concept
- Hackathon judges need immediate context

---

### Pattern 2: Swipeable Onboarding Cards (Traditional Apps)

**What it is:** 3-5 swipeable screens with illustrations, feature highlights, and benefits before the login/signup screen.

**Examples:**
- Fintech apps with swipeable intro cards explaining features
- Traditional approach for complex products

**Pros:**
- Educates users before they commit
- Breaks down complex features into digestible chunks
- Feels polished and intentional

**Cons:**
- **Anti-pattern in 2026** — Users skip through or abandon
- High drop-off rates (each screen is friction)
- Passive learning (not interactive)
- Violates "progressive disclosure" best practice

**Current Best Practice (2026):**
Research shows this pattern is being replaced by **progressive onboarding** (contextual hints that appear only when features are first used, not upfront static screens).

**When to use:**
- Avoid unless legally required (compliance, terms)

**NOT suitable for TrustTap+ because:**
- Outdated pattern
- High abandonment risk
- Judges won't swipe through 5 screens

---

### Pattern 3: Full Editorial Landing Page (Web Apps)

**What it is:** Multi-section marketing page with hero, features, stats, testimonials, how-it-works, FAQ, CTA, footer. Desktop-web pattern adapted to mobile.

**Examples:**
- Hackathon event sites (name, logo, dates, registration form)
- SaaS marketing pages
- Traditional web apps

**Pros:**
- Comprehensive explanation of value prop
- SEO-friendly (irrelevant for PWA)
- Works for desktop users
- Builds credibility through detail

**Cons:**
- **Not how mobile apps work** — Users expect instant utility, not reading
- Requires scrolling through multiple screens of content before action
- Violates mobile-first design principles
- Feels like a website, not an app

**When to use:**
- Desktop-first products
- B2B SaaS with complex value props
- Event/hackathon registration sites (where landing page IS the product)

**NOT suitable for TrustTap+ because:**
- Mobile-native users expect app behavior, not marketing copy
- Too much friction before value
- Judges want to try the product, not read about it

---

### Pattern 4: Single-Screen Value Prop + Action (RECOMMENDED)

**What it is:** One concise screen with:
- App name/logo
- 1-sentence value prop
- 2-3 key benefits (visual icons, minimal text)
- Primary CTA ("Connect Wallet" / "Get Started")
- Optional: "Learn More" link for those who want details

**Examples:**
- **Jupiter Mobile:** Login with Apple ID or email (no seed phrase) + instant buy with Apple Pay → seamless onboarding with value prop embedded
- **Coinbase Smart Wallet:** Passkey-based setup → minimal friction, clear prompts, quick access
- **PayPal (fintech benchmark):** Light onboarding, progressive disclosure with 1-2 steps at a time, minimal inputs
- **Recommended by 2026 best practices:** Single-screen clarity before progressive disclosure

**Pros:**
- Balances context (what is this?) with speed (get me in)
- Mobile-native feel
- Works for both app store users AND direct link arrivals
- Respects user time while explaining value
- Perfect for hackathon demos (judges understand instantly + can proceed)

**Cons:**
- Limited space to explain complex features
- Requires ruthless prioritization of messaging

**When to use:**
- PWAs and mobile-first apps
- Novel concepts that need brief explanation
- Hackathon demos
- Users arriving without app store context

**PERFECT for TrustTap+ because:**
- Explains trust scoring in <5 seconds
- Gets users to "Connect Wallet" immediately
- Works for both judges and demo users
- Feels like a modern mobile app

---

### Pattern 5: Direct Login (No Entry Screen)

**What it is:** App opens directly to login/wallet connect screen with zero preamble.

**Examples:**
- Apps where users are already authenticated (open directly to dashboard)
- Enterprise apps accessed via SSO

**Pros:**
- Absolute minimal friction
- Ideal for returning users

**Cons:**
- Confusing for first-time users
- No value prop explanation
- Assumes users already know what they're signing into

**When to use:**
- Internal tools
- Returning users only
- Products with universal name recognition

**NOT suitable for TrustTap+ because:**
- First-time users (judges, demo attendees) need context
- Trust scoring is unfamiliar

---

## PWA-Specific Considerations

### How PWAs Handle Entry Points (2026)

**Research findings:**
- PWAs support splash screens (2-3 seconds while loading)
- `start_url` in manifest defines entry point
- Best PWAs use mobile-first design → start small screen, enhance for larger
- Intuitive gestures and navigation that mirror native apps
- Smooth transitions and familiar patterns essential

**Key Difference from Native Apps:**
Native apps benefit from app store context (screenshots, descriptions, reviews). PWAs don't. Users may arrive via:
- Direct URL
- QR code scan
- Share link
- Bookmark

**Implication for TrustTap+:**
Cannot assume users know what the app is. Need a brief value prop on entry, but keep it tight (Pattern 4).

---

## Hackathon Demo Best Practices

### What Works for Judges

**Research findings:**
- Landing pages for hackathons contain: name, logo, dates, registration form
- User onboarding starts the moment a visitor comes into contact with landing page
- Transition from landing page to dashboard must be smooth and helpful
- Clear onboarding with welcome pages builds confidence for first-time attendees
- Good landing pages present value right at the beginning
- Key advantage: provides context, builds confidence, communicates next steps

**Critical Insight:**
For hackathon EVENT sites, landing page IS the product. For hackathon DEMO apps, landing page is FRICTION.

**Judges want:**
1. Instant understanding of what the app does (5-second rule)
2. Ability to try it immediately
3. Clear demonstration of technical execution

**Implication for TrustTap+:**
- One-screen value prop (what is this, why does it matter)
- Immediate "Connect Wallet" CTA
- Optional "See Demo Wallet" button for judges without Seeker phone
- Save detailed explanations for INSIDE the app (progressive disclosure)

---

## 2026 Mobile Onboarding Best Practices

### What's Changed

**2026 Trends:**
1. **Social login over seed phrases** — Coinbase Smart Wallet (passkeys), Jupiter (Apple ID/email)
2. **Progressive disclosure** — Show features when needed, not upfront
3. **Interactive over passive** — Learning by doing, not reading
4. **Speed matters** — Wallet setup from 5-10 minutes → 5-10 seconds
5. **Mobile-first, not responsive** — Design for small screen first
6. **Biometric authentication** — Face ID, Touch ID, fingerprint
7. **Plain language** — No "seed phrase," "EVM-compatible," "sign transaction" without context
8. **Account abstraction** — Smarter wallets with Web2-familiar recovery methods

### Anti-Patterns to Avoid

❌ **5+ intro screens** explaining features users don't care about yet
❌ **Static instructions** instead of guided interaction
❌ **Walls of text** before users can try the product
❌ **Technical jargon** without tooltips/context
❌ **Desktop-first responsive design** that feels clunky on mobile

### Best Practices for TrustTap+

✅ **Single value prop screen** → Connect Wallet → Progressive feature discovery
✅ **Plain language** → "Trust Score" not "On-Chain Reputation Metric"
✅ **Guided interaction** → Show QR scanner when they tap "Meet Someone"
✅ **Mobile gestures** → Swipe, tap, pull-to-refresh (native feel)
✅ **Clear CTAs** → "Connect Wallet" not "Initialize Authentication Protocol"

---

## Competitive Analysis: Crypto Wallet Entry Screens

| App | Entry Pattern | Onboarding Flow | First-Time User Experience |
|-----|---------------|-----------------|----------------------------|
| **Phantom** | Minimal splash | Welcome → "Create New Wallet" → Biometric → PIN → Seed phrase | Direct, assumes familiarity |
| **Jupiter Mobile** | Minimal splash | Login (Apple ID/email) → Apple Pay setup | Seamless, Web2-familiar |
| **Coinbase Wallet** | Minimal splash | "Get started" → Social login OR seed phrase → Passkey setup | Choice of complexity level |
| **Trust Wallet** | Minimal onboarding | Create wallet → Security setup → Main view | Fast, guided setup |
| **Rainbow Wallet** | Sleek UI | "Get a new wallet" → Apple Pay on-ramp → Dashboard | CashApp-like simplicity |

**Pattern:** ALL native crypto wallets skip marketing landing pages. They assume users already know what a wallet is (app store provided context).

**Key Difference for TrustTap+:**
Trust scoring is novel. Users DON'T know what it is. Therefore, we need BRIEF explanation, but NOT a full marketing treatment.

---

## Fintech Entry Screen Patterns

### What Fintech Apps Do

**Research findings:**
- Splash screen = minimal interface, friendly message, "Sign Up" + "Sign In" buttons, succinct feature recap
- Progressive disclosure preferred (PayPal example: 1-2 steps at a time, minimal inputs)
- Mobile-first design with gradual feature introduction
- High drop-off during KYC steps → need to reassure, explain, guide

**Key Principle:**
If your onboarding doesn't reassure, explain, and guide, users drop.

**Implication for TrustTap+:**
- Reassure: "Your wallet, your data — we only read public blockchain info"
- Explain: "Trust Score measures real on-chain activity"
- Guide: "Tap Connect Wallet to see your score"

---

## Recommendation for TrustTap+

### Recommended Pattern: **Single-Screen Value Prop + Immediate Action**

#### Structure:
```
┌─────────────────────────────────┐
│  [TrustTap+ Logo]              │
│                                 │
│  "On-Chain Trust Scores         │
│   for Solana Seeker Owners"     │
│                                 │
│  [Icon] Proof of Real Activity  │
│  [Icon] Meet & Verify IRL       │
│  [Icon] Sybil Resistance       │
│                                 │
│  [ Connect Wallet ]  (primary)  │
│  [ View Demo Wallet ]  (ghost)  │
│                                 │
│  SGT Holder? Unlock reputation  │
│  tracking.                      │
└─────────────────────────────────┘
```

#### Why This Works:
1. **Instant context** → Judges/users understand purpose in <5 seconds
2. **Mobile-native** → Feels like an app, not a website
3. **Immediate action** → No scrolling through marketing copy
4. **Hackathon-friendly** → Demo wallet option for judges without Seeker
5. **Progressive disclosure** → Detailed explanations come AFTER connection

#### What to Cut from Current Landing Page:
- ❌ Multi-section scroll (hero, stats, how it works, sybil shield, footer)
- ❌ Long-form explanations ("Here's how our trust model works...")
- ❌ Feature card grids
- ❌ Testimonials, FAQs, detailed stats

#### What to Keep:
- ✅ Logo + tagline
- ✅ 3 key benefits (icon + 3-5 words each)
- ✅ Primary CTA (Connect Wallet)
- ✅ Secondary option (View Demo Wallet)
- ✅ SGT badge/indicator

#### Where Detailed Info Goes:
- **AFTER wallet connection** → Dashboard tour, progressive hints, feature tooltips
- **Help/About section** → Accessible via menu for those who want deep dive
- **Demo mode** → Pre-loaded wallet shows all features in action

---

## Implementation Checklist

### Phase 1: Replace Landing Page with Single-Screen Entry
- [ ] Create minimal entry screen component
- [ ] Logo + 1-sentence value prop
- [ ] 3 benefit icons (max 3-5 words each)
- [ ] "Connect Wallet" primary CTA
- [ ] "View Demo Wallet" secondary CTA (for judges)
- [ ] Remove multi-section landing page

### Phase 2: Progressive Onboarding (Post-Connection)
- [ ] First-visit tour (swipeable tips overlay)
- [ ] Feature tooltips (appear on first use)
- [ ] Dashboard guide ("Try scanning a wallet")
- [ ] Settings walkthrough (enable notifications, etc.)

### Phase 3: Demo Mode Enhancements
- [ ] Pre-loaded demo wallet with full data
- [ ] Interactive demo (judges can explore features)
- [ ] "Try Your Own Wallet" CTA within demo

---

## Sources

### Crypto Wallet Onboarding
- [Phantom Wallet Setup Guide](https://nftnow.com/guides/how-to-set-up-and-use-phantoms-solana-wallet/)
- [Phantom Wallet Creation](https://phantom.com/learn/guides/how-to-create-a-new-wallet)
- [Phantom iOS Launch & UX](https://phantom.com/learn/blog/phantom-s-usd109m-series-b-and-launch-of-ios-app)
- [Jupiter Mobile Wallet](https://jup.ag/mobile)
- [Coinbase Wallet Onboarding](https://www.coinbase.com/wallet/articles/getting-started-mobile)
- [Coinbase Smart Wallet Passkeys](https://www.themarketsunplugged.com/coinbase-smart-wallet-passkeys-setup-2025/)
- [Trust Wallet Onboarding Flow](https://mobbin.com/explore/flows/ddf7bc15-0f54-4071-b4eb-f371f77f1b1d)
- [Rainbow Wallet Getting Started](https://rainbow.me/en/support/app/get-started-with-the-rainbow-app)
- [Rainbow Mobile-First Design](https://www.coindesk.com/consensus-magazine/2023/04/17/rainbow-ethereum-wallet-mobile-first-design)

### Mobile App Onboarding Best Practices (2026)
- [Mobile App Onboarding Guide 2026](https://vwo.com/blog/mobile-app-onboarding-guide/)
- [Mobile Onboarding UX Best Practices](https://www.designstudiouiux.com/blog/mobile-app-onboarding-best-practices/)
- [Top 10 Onboarding Flow Examples](https://uxcam.com/blog/10-apps-with-great-user-onboarding/)
- [Essential Guide to Mobile Onboarding](https://www.appcues.com/blog/essential-guide-mobile-user-onboarding-ui-ux)
- [Onboarding Screens Best Practices](https://userguiding.com/blog/onboarding-screens)

### Crypto Wallet UX Trends
- [Embedded Wallets with Social Login](https://www.alchemy.com/overviews/the-ultimate-guide-to-embedded-wallets-with-social-login)
- [Top Embedded Wallets 2026](https://www.openfort.io/blog/top-10-embedded-wallets)
- [Simplify Web3 Onboarding](https://sequence.xyz/blog/how-to-simplify-user-onboarding-for-a-web3-app)
- [Account Abstraction & Wallet UX](https://fxcryptonews.com/account-abstraction-explained-why-wallet-ux-is-changing-in-2026/)
- [Smart Wallets & AI for Mainstream Adoption](https://www.theblock.co/post/375647/smart-wallets-ai-ux-mainstream-crypto-adoption)

### PWA Design Patterns
- [Mobile-First Design for PWAs](https://blog.pixelfreestudio.com/how-to-use-mobile-first-design-for-progressive-web-apps/)
- [PWA UX Techniques](https://www.netguru.com/blog/pwa-ux-techniques)
- [PWA Testing Guide](https://www.pcloudy.com/blogs/how-to-test-progressive-web-apps/)
- [Next.js PWA Guide](https://nextjs.org/docs/app/guides/progressive-web-apps)

### Fintech Onboarding
- [Fintech App Signup/Onboarding Design](https://www.telerik.com/blogs/designing-effective-signup-onboarding-process-fintech-app)
- [Fintech App Design Best Practices](https://duck.design/fintech-app-design/)
- [Fintech UX Practices 2025](https://procreator.design/blog/best-fintech-ux-practices-for-mobile-apps/)
- [Fintech UI Examples for Trust](https://www.eleken.co/blog-posts/trusted-fintech-ui-examples)
- [Mobile Banking App Design](https://www.purrweb.com/blog/banking-app-design/)

### Hackathon Demo Best Practices
- [User Onboarding Starts with Landing Page](https://www.appcues.com/blog/user-onboarding-starts-with-a-good-landing-page)
- [Hackathon Landing Page Design](https://medium.com/design-bootcamp/design-process-for-a-hackathon-landing-page-ce9e27788e40)
- [MLH Hackathon Website Guide](https://guide.mlh.io/general-information/hackathon-website/main-website)

---

## Conclusion

**The User is Right:** Most mobile apps don't have multi-section landing pages. They have minimal splash screens or single-screen value props.

**But TrustTap+ is Not a Typical App:** As a PWA demonstrating a novel concept at a hackathon, we need BRIEF context before "Connect Wallet."

**The Solution:** Pattern 4 (Single-Screen Value Prop + Action)
- 1 screen (not 5+ sections)
- Instant clarity (what is this, why does it matter)
- Immediate action (Connect Wallet)
- Progressive disclosure (details come after connection)

**Next Steps:**
1. Redesign entry screen to single-screen pattern
2. Move detailed explanations into post-connection onboarding
3. Enhance demo wallet for judges
4. Test with mobile users for <5-second comprehension
