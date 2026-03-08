# TrustTap+ Competitor Visual Design Analysis

**Date:** 2026-03-01
**Purpose:** Research the visual design language of crypto/DeFi reputation and identity products to inform TrustTap+ design decisions.

---

## 1. Gitcoin Passport (now Human Passport)

**URL:** app.passport.xyz

### Visual Vibe
Clean, credential-focused dashboard. The interface centers on a single, clear metric: the Unique Humanity Score (0-100). The design feels institutional and trust-oriented rather than flashy. Built with Next.js, Chakra UI, and ethers.js. The overall aesthetic is "proof of personhood as a utility" rather than a social platform.

### Color Scheme
- **Primary Background:** Dark theme (near-black)
- **Accent Purple:** Used for wallet connection banners and interactive elements
- **Success Green:** Green banner appears when score meets threshold (20+)
- **Neutral grays** for card backgrounds and secondary elements
- Gitcoin's broader brand uses green (#0FCE7C / #02E2AC range) and purple tones

### Typography
- System/UI sans-serif fonts via Chakra UI defaults
- Clean, functional typography prioritizing readability over brand expression
- Score numbers displayed prominently in large, bold type

### Signature Design Element
**The Stamp Grid** -- Verifiable credentials ("Stamps") displayed as a grid of cards, each representing a connected identity (Twitter, Google, BrightID, ENS, etc.). Each stamp shows its verification status and individual weight. The visual metaphor is literally a passport with stamps, making the abstract concept of "identity verification" tangible and collectible.

### Trust Score Display
- Unique Humanity Score displayed as a prominent number (threshold: 20, max: 100)
- Color-coded status banners: purple (action needed), green (verified/eligible)
- Individual stamp weights shown per credential
- Additive scoring: users can see which stamps contribute what to their total

### Mobile Experience
Functional but desktop-first. The stamp grid requires scrolling on mobile. Not a native app experience.

---

## 2. Worldcoin / World App

**URL:** world.org

### Visual Vibe
Ultra-minimalist. Institutional gravitas meets Silicon Valley polish. Generous white space, minimal UI elements. The design screams "we are serious infrastructure for humanity" -- deliberate contrast with typical crypto aesthetics. The Orb hardware creates a physical-digital bridge that no other project has.

### Color Scheme
- **Primary:** Black (#000000) and White (#FFFFFF)
- **Accent Colors:** Teal and lilac as secondary tones
- **Gradient Accents:** Saturated and faded gradients in orange and purple
- Overall effect: "institutional sincerity and futuristic optimism"
- Sober, sophisticated palette with muted tones alongside monochromatic features

### Typography
Three-typeface system:
- **Basel** (sans-serif) -- primary font, international feel, high legibility at all scales
- **Untitled Serif** (Klim Type Foundry) -- used sparingly for authority
- **ABC Diatype Mono** -- labels, data visualization, infographic elements

### Signature Design Element
**The Orb Imagery** -- The physical Orb device (iris scanner) is the centerpiece of all visual communication. The seven-hand logo representing seven continents creates a circle in negative space. The entire brand is built around the tension between biological identity and digital verification. Mobile-first mini-app architecture with tab navigation, no hamburger menus.

### Trust Score Display
Binary approach: you are either "verified" (World ID) or not. No numerical score. The verification levels (Device Verified vs. Orb Verified) provide a two-tier trust hierarchy. Clean, status-based display rather than numeric scoring.

### Mobile Experience
**Excellent.** Purpose-built mobile app (World App). Mini-apps ecosystem built on React with their own UI Kit. Guidelines enforce: bottom tab navigation, no excessive scrolling, no footers/sidebars, 100dvh for iOS compatibility. Truly mobile-native.

---

## 3. Galxe

**URL:** galxe.com / app.galxe.com

### Visual Vibe
Dark, energetic, Web3-native. High visual density with layered transparency effects. The design balances technical sophistication with gamification energy. Feels like a "quest hub" meets "credential wallet." Extensive use of translucent overlays, blur effects, and decorative circular elements.

### Color Scheme
- **Primary Background:** #000000, #101113 (near-black)
- **Accent Purple:** #6b6bfd (primary interactive), #492bff (deeper blue-purple)
- **Brand Purples:** #222799 (Jacksons Purple), #180757 (Paris M), #a143e1 (Medium Purple)
- **Supporting Accents:** #ffb3cd (pink), #ffa173 (orange), #cb96eb (lavender), #ec7f3c (burnt orange)
- **Borders/Dividers:** #ffffff1a (white at 10% opacity)
- **Logo Dominant:** #080808

### Typography
- **Headlines:** "Galxe Lader Regular" (custom brand font, 50px desktop / 32px mobile)
- **Body/UI:** "Galxe Lader Medium", "Inter" (14-18px)
- **Monospace:** "Roboto Mono" for technical/status elements
- **Letter-spacing:** Tight at -0.02em to -0.01em for visual density

### Signature Design Element
**OAT Credential Badges** -- Gas-less NFT badges representing achievements (online and offline). The credential card system with decorative dashed/dotted border circles (#6b6bfd) positioned absolutely for depth. The layered transparency effect (will-change:filter) creates a sense of floating, dimensional UI. Six-column modular grid at desktop, 60px padding rhythm.

### Trust Score Display
Multi-layered:
- **Galxe Gold (GG):** Universal reward currency for completing tasks
- **Loyalty Level:** Engagement tier system (higher activity = higher level)
- **OAT Badges:** Visual credential NFTs showing specific achievements
- **Campaign Analytics:** Detailed reports on participation and points accumulation
- Credentials displayed as collectible cards in a grid layout

### Mobile Experience
Responsive with breakpoints at 2400px, 1800px, 1200px, 810px, and mobile. Horizontal scrolling sections. Sticky navigation. Mobile experience is functional but the information density can feel overwhelming on smaller screens.

---

## 4. Layer3

**URL:** layer3.xyz / app.layer3.xyz

### Visual Vibe
Retro gaming meets modern fintech. The UI deliberately evokes indie RPG aesthetics -- familiar and inviting for gamers entering Web3. Clean card-based layouts with gradient-rich banners. The design priority is "smooth and engaging" with minimal information per view to avoid overwhelming users.

### Color Scheme
- **Theme:** Dark mode default (explicitly set via JS: colorScheme: 'dark')
- **Gradient Banners:** Purple-to-violet gradients (#6164d2 to #8342b4)
- **Accent:** Bright, vibrant highlights against dark backgrounds
- **Card backgrounds:** Subtle elevation against the dark base

### Typography
- Modern sans-serif for UI elements
- Large hero headlines ("Discover onchain finance with one app")
- Clean hierarchy: section labels above feature descriptions
- Emphasis on readability with generous whitespace

### Signature Design Element
**The Quest Path System** -- Quests organized into visual "paths" with clear progression markers. Users follow step-by-step themed questlines (like levels in a game). Chests (mystery reward containers), XP accumulation, and achievement badges create a Duolingo-for-crypto feeling. Background SVG layering adds depth without clutter.

### Trust Score Display
Gamification-centric:
- **XP (Experience Points):** Platform-wide, accumulates across all communities
- **Leaderboard:** Site-wide ranking by total XP
- **Level System:** XP-based leveling with progression indicators
- **Achievement Badges:** Milestone-based unlockables
- **Stats Display:** "3M+ Users", "500M+ Transactions", "40+ Chains", "500+ Apps" as social proof
- No traditional "trust score" -- reputation is expressed through XP level and achievement collection

### Mobile Experience
Strong mobile presence. The slide-based information presentation translates well to mobile. Quest completion flows are designed for quick, thumb-friendly interactions. The gamification elements (XP bars, level indicators) work naturally on mobile.

---

## 5. DeBank

**URL:** debank.com

### Visual Vibe
Data-rich social portfolio tracker. The densest UI of all competitors -- DeBank prioritizes information completeness over visual polish. It's the "Twitter/X for DeFi wallets" -- every wallet becomes a social profile. Dark mode with a focus on data tables, asset breakdowns, and social feeds. SPA architecture (JavaScript-dependent).

### Color Scheme
- **Primary:** Dark mode theme (dark grays/blacks)
- **Accent:** Green tones for positive values/gains
- **Text:** White for primary, gray for secondary
- **Portfolio Value:** Large, prominent number display with 24h change indicator (green/red)
- Design uses muted, professional tones rather than flashy crypto neons

### Typography
- System fonts / standard sans-serif stack
- Portfolio values in large, bold display type
- Wallet addresses in monospace
- Feed content in readable body sizes
- Dense but legible information hierarchy

### Signature Design Element
**The Social Wallet Profile** -- Every wallet address becomes a rich social profile showing: portfolio value, asset distribution across chains, NFT collection, transaction history as a social feed ("Stream"), and follower counts. The "TVF" (Total Value of Followers) metric is unique to DeBank -- it shows the aggregate portfolio value of everyone following you, creating a unique social proof metric. The Web3 ID mint ($96) turns a wallet into a social handle.

### Trust Score Display
DeBank's approach is distinctive:
- **Net Worth:** Primary metric, displayed prominently
- **DNA Score:** Analyzes trading history publicly (trade-focused trust)
- **TVF (Total Value of Followers):** Social proof through follower wealth
- **Whale Rankings:** Social ranking list of most-followed whales
- **Web3 Social Rankings:** Right sidebar on Feed page
- **Chain Distribution:** Visual breakdown of assets across 35+ chains, 1300+ protocols
- No single "trust score" -- trust is inferred from on-chain wealth, activity, and social following

### Mobile Experience
**Mobile-first with push alerts.** Native apps on iOS (App Store) and Android (Google Play). Whale movement alerts across 20+ chains. The mobile app prioritizes push notifications for tracking whale moves. Portfolio tracking translates well to mobile, though the social feed can feel dense.

---

## 6. Phantom Wallet

**URL:** phantom.com (formerly phantom.app)

### Visual Vibe
Friendly, approachable, playful. Phantom is the anti-institutional crypto UI. The ghost mascot adds personality. The design philosophy centers on making crypto feel "fun and inviting for everyone." Lottie animations (wink, bounce, hearts) add warmth. The rebrand by Bakken & Baeck emphasizes simplicity, transparency, and confidence.

### Color Scheme
- **Primary Purple:** #4E44CE (Purple Heart)
- **Dark Purple Header:** #3B1E90
- **Background Gradient:** #121212 to #1E1E1E (dark mode)
- **Dark Neutral:** #2C2D30 (Shark)
- **Text:** #FFFFFF (white)
- Vibrant complementary accent colors (blues, pinks, yellows/"moonYellow")
- Theme switching between sections creates visual rhythm

### Typography
- **Custom Font:** "Phantom" typeface (created with F37 Foundry, based on F37 Zagma)
- Rounded, expressive design that complements the ghost icon
- Previously used "Circular Std" for body/title text
- Bold 24px for app name, large font for balance amounts
- Small gray text for wallet addresses

### Signature Design Element
**The Ghost** -- Phantom's redesigned ghost icon is "dynamic, distinctive, and sleeker." It represents a "trusted companion that helps you navigate the expanding multichain world." The ghost floats, winks, bounces -- it has personality. The three-button action bar (Send, Receive, Swap) with circular coin icons is the core interaction pattern. Video-first product demonstrations on the marketing site.

### Trust Score Display
Phantom doesn't display trust scores. It's a wallet, not a reputation system. However, its design language for displaying value is relevant:
- **Balance Display:** Large, prominent portfolio value
- **Token Icons:** Circular with brand-colored backgrounds (blue for USDC, gradient for SOL)
- **Transaction Hashes:** Truncated with ellipsis (AB12...XY34) for privacy
- **Action Buttons:** Three evenly-spaced bottom icons (Wallet, Swap, Settings)

### Mobile Experience
**Best-in-class.** Phantom is mobile-first and native. The wallet experience is built for thumb interaction. Clean bottom navigation, swipe gestures, responsive video assets for different device sizes. Platform detection for automatic download suggestions. The mobile experience is the primary experience, not an afterthought.

---

## 7. Jupiter

**URL:** jup.ag

### Visual Vibe
Functional, professional, tool-first. Jupiter's design prioritizes the swap interface above all. Dark space-themed aesthetic. The brand positions itself as "The Home of Onchain Finance" -- expansive but grounded. The UI is clean and purpose-built for financial transactions. Community-focused with integrated social channels.

### Color Scheme (CSS Design Tokens)
- **Primary/Accent:** rgb(199, 242, 132) -- bright lime green (#C7F284)
- **Background:** rgb(0, 0, 0) -- pure black (#000000)
- **Primary Text:** rgb(232, 249, 255) -- light cyan-white (#E8F9FF)
- **Warning:** rgb(251, 191, 36) -- amber/gold (#FBbF24)
- **Interactive Elements:** rgb(33, 42, 54) -- dark blue-gray (#212A36)
- **Module/Cards:** rgb(16, 23, 31) -- deeper blue-gray (#10171F)

### Typography
- **Primary:** Inter (weights 300-700, extensive language support)
- **Monospace:** Courier Prime (for technical/data elements)
- Theme system with dynamic switching (.changing-theme CSS class)
- Responsive layout preventing horizontal scroll (overflow-x: clip)

### Signature Design Element
**The Swap Card** -- A centered, focused swap interface card with "from" and "to" token selectors, route visualization showing the optimal path, and clear fee/slippage display. The lime green accent (#C7F284) against pure black creates a distinctive, high-contrast look that's immediately recognizable as Jupiter. The token selector UX is best-in-class on Solana.

### Trust Score Display
Not a reputation product, but relevant patterns:
- **Route Visualization:** Shows the swap path through multiple DEXes
- **Price Impact:** Clear numerical display of trade impact
- **Slippage Settings:** User-configurable with visual indicators
- **Fee Transparency:** All costs visible before confirmation

### Mobile Experience
Responsive web app, not a native mobile experience. The swap interface works well on mobile due to its focused, single-card design. Full viewport height (100vh) ensures clean mobile presentation. The simplicity of the core swap interaction translates naturally to mobile.

---

## 8. Underdog Protocol

**URL:** underdogprotocol.com / app.underdogprotocol.com

### Visual Vibe
Developer-first, API-focused, minimal. Underdog is infrastructure, not a consumer app. The design reflects this: clean authentication flows, dark theme, stripped-down UI. The dashboard is a developer tool, not a user-facing reputation display. The brand prioritizes function over form.

### Color Scheme
- **Theme:** Dark mode (full_dark.svg logo variant)
- **Background:** Dark/black
- **Minimal accent colors** -- primarily using the dark theme conventions
- Infrastructure-grade visual language, not consumer-facing

### Typography
- Clean system fonts
- Minimal typographic hierarchy
- Developer documentation style
- API-reference formatting

### Signature Design Element
**Dual Authentication Flow** -- The sign-in page presents wallet connection alongside "Sign in with Google," bridging Web3 and Web2 identity in a single, clean interface. This is the most important design decision for Underdog -- it signals that NFT/identity infrastructure should be accessible to both crypto-native and traditional users. The Passport identity system enables soulbound NFTs that update attributes based on user activity.

### Trust Score Display
Underdog powers trust/identity for others rather than displaying its own:
- **Compressed NFTs:** Credential tokens that carry verifiable attributes
- **Soulbound Tokens:** Non-transferable identity markers
- **Dynamic Attributes:** NFT metadata that updates based on on-chain activity
- **Passport System:** Identity layer that other apps build on top of
- Used by Solana SAGA phones for ownership verification

### Mobile Experience
The dashboard is a developer tool, so mobile experience is secondary. The API-first approach means the mobile experience is determined by whatever app builds on top of Underdog. The Solana Mobile integration (SAGA phones) shows mobile capability at the infrastructure level.

---

## Synthesis: TOP 5 Design Patterns in Best Crypto Reputation Apps

### Pattern 1: The Score as Hero Element

**What it is:** The single most important metric is displayed as an oversized, prominent number at the top of the profile/dashboard. Everything else orbits around it.

**Who does it best:** Gitcoin Passport (Humanity Score 0-100), DeBank (Net Worth as primary identity metric), Layer3 (XP level)

**Implementation details:**
- Large display typography (32-50px), often bold or semi-bold
- Centered or top-left placement with generous whitespace
- Color-coded context: green for good/verified, amber for in-progress, red for warning
- Secondary metrics (24h change, percentile ranking) displayed smaller beneath
- Often paired with a circular progress ring or radial gauge for visual impact

**Why it works:** Reduces cognitive load. Users can assess their status in under 2 seconds. The number becomes their identity anchor.

---

### Pattern 2: The Credential/Badge Collection Grid

**What it is:** Trust and reputation broken into individual, collectible "stamps," "badges," or "credentials" displayed as a visual grid. Each credential has a distinct icon, status indicator, and weight/value.

**Who does it best:** Gitcoin Passport (Stamps), Galxe (OAT Badges), Layer3 (Achievements), Underdog (Soulbound NFTs)

**Implementation details:**
- Card-based grid layout (2-4 columns on desktop, 1-2 on mobile)
- Each card: icon/logo + title + verification status + weight/points
- Connected credentials show the source platform's branding
- Unconnected/available credentials shown as dim/outlined cards (collection incentive)
- Hover/tap reveals more detail (when verified, expiration, weight contribution)

**Why it works:** Makes abstract "trust" tangible and collectible. Creates a completion incentive (fill your grid). Each credential is independently verifiable. The grid pattern is familiar from gaming achievement systems.

---

### Pattern 3: Dark Mode as Trust Signal

**What it is:** Near-universal adoption of dark backgrounds (#000000 to #121212) with high-contrast accent colors. This isn't just aesthetic preference -- in crypto/DeFi, dark mode has become a trust signal in itself.

**Who does it:** Every single competitor analyzed uses dark mode as primary or default.

**Implementation details:**
- Background: Pure black (#000000) or near-black (#101113, #121212, #10171F)
- Card/module surfaces: Elevated dark grays (#1E1E1E, #212A36, #2C2D30)
- Borders: White at 5-15% opacity (#ffffff0d to #ffffff26)
- Text: Pure white (#FFFFFF) primary, gray (#4d4d4d to #9CA3AF) secondary
- Accent colors: High-saturation singles -- purple (#4E44CE, #6b6bfd), lime (#C7F284), teal, or green
- Glassmorphism overlays: backdrop-filter blur(8-15px) with semi-transparent surfaces

**Why it works:** Dark mode signals "professional financial tool," reduces eye strain during extended portfolio monitoring, makes data visualizations pop, and creates visual consistency with the broader crypto ecosystem. A light-mode-first crypto app immediately reads as "consumer fintech" rather than "DeFi native."

---

### Pattern 4: Gamified Progression Systems

**What it is:** Borrowing from gaming UX: XP, levels, leaderboards, achievements, and progress bars to make reputation building feel rewarding rather than bureaucratic.

**Who does it best:** Layer3 (XP + levels + leaderboards + chests), Galxe (Loyalty Levels + Gold points + campaign completion), DeBank (whale rankings + TVF social proof)

**Implementation details:**
- **XP/Points:** Numerical accumulation displayed with progress bars toward next level
- **Levels/Tiers:** Visual tier indicators (bronze/silver/gold or numbered levels)
- **Leaderboards:** Ranked tables showing username, XP, and relative position
- **Progress Bars:** Horizontal fill bars showing completion toward goals
- **Achievement Unlocks:** Modal/toast notifications with celebratory animation
- **Streak Tracking:** Consecutive-day engagement counters

**Why it works:** Transforms "verify your identity" from a one-time chore into an ongoing engagement loop. Creates status hierarchy that users want to climb. Social comparison through leaderboards drives retention. The dopamine mechanics of gaming are well-studied and highly effective.

---

### Pattern 5: Social Proof Through Wallet-as-Identity

**What it is:** The wallet address itself becomes a social profile. On-chain history, holdings, and transactions become the "content" that establishes credibility, replacing traditional profiles.

**Who does it best:** DeBank (wallet-as-social-profile with Stream feed), Galxe (credential collection tied to wallet), Phantom (wallet as the primary identity interface)

**Implementation details:**
- **Profile Card:** Wallet address (truncated with ellipsis) + ENS/DeBank ID + avatar
- **Portfolio Display:** Total value, chain distribution, top holdings
- **Activity Feed:** Recent transactions as a social timeline
- **Follower Metrics:** Follower count, TVF (Total Value of Followers)
- **Badges/Credentials:** Visual indicators of verified achievements
- **Privacy Controls:** Selective visibility of holdings and activity

**Why it works:** In DeFi, "what you've done on-chain" is a more credible signal than "what you say about yourself." Making the wallet a social object creates organic trust signals that can't be faked. The social layer adds network effects to otherwise isolated wallets.

---

## What Makes Premium vs. Amateur in Crypto Dashboards

### Premium Signals

| Element | Premium | Amateur |
|---------|---------|---------|
| **Color** | Restrained palette, 1-2 accent colors max, dark mode with subtle elevation | Neon overload, multiple competing accent colors, harsh contrast |
| **Typography** | Custom or carefully selected fonts (Inter, custom brand fonts), tight letter-spacing (-0.01 to -0.02em), clear hierarchy | System defaults, inconsistent sizing, no clear hierarchy |
| **Data Display** | Large hero metric + supporting details on hover/drill-down | All data shown at once with no hierarchy |
| **Loading States** | Skeleton screens, shimmer effects, progress indicators | Blank screens, spinners without context, or no loading states |
| **Spacing** | Generous padding (40-60px between sections), consistent rhythm | Cramped layouts, inconsistent margins |
| **Borders** | Subtle (1px, low-opacity white/gray) or no borders at all | Heavy borders, visible dividers everywhere |
| **Animation** | Subtle transitions (200-300ms), purposeful microinteractions | No animation or over-animated ("everything bounces") |
| **Glassmorphism** | Backdrop-filter blur (8-15px), semi-transparent overlays with tinted backgrounds | Overused blur on every element, performance-killing full-page effects |
| **Error States** | Contextual inline errors, graceful fallbacks | Generic "something went wrong" or silent failures |
| **Trust Indicators** | Verified badges, domain reminders near connect buttons, audit links | "100% secure!" text without evidence |

### The Premium Formula

The best crypto reputation apps share a formula:

```
PREMIUM = Dark Mode
        + One Signature Accent Color
        + Custom Typography
        + Hero Metric Display
        + Credential Grid Collection
        + Gamification Layer
        + Mobile-First Navigation
        + Glassmorphism (sparingly)
        + Generous Whitespace
        + Status Hierarchy (tiers/levels/badges)
```

### Key Insight for TrustTap+

The most successful competitors pick ONE visual metaphor and commit to it fully:
- Gitcoin Passport: "passport with stamps"
- Layer3: "RPG quest with XP"
- DeBank: "social profile backed by wallet"
- Galxe: "achievement badge collection"
- World App: "verified human"
- Phantom: "friendly ghost companion"

TrustTap+ needs its own singular, ownable visual metaphor for trust. Not a generic "trust score" -- something that makes the concept of on-chain reputation as tangible as Gitcoin's stamps or Layer3's XP.

---

## Sources

- [Galxe](https://galxe.com) -- direct HTML/CSS analysis
- [Galxe Brand (Brandfetch)](https://brandfetch.com/galxe.com)
- [Gitcoin Passport / Human Passport](https://app.passport.xyz/)
- [Gitcoin Passport GitHub](https://github.com/passportxyz/passport)
- [Passport Score Calculation](https://support.passport.xyz/passport-knowledge-base/stamps/how-is-gitcoin-passports-score-calculated)
- [World App Guidelines](https://docs.world.org/mini-apps/design/app-guidelines)
- [Worldcoin Brand Design (World Brand Design Society)](https://worldbranddesign.com/play-create-design-brand-system-for-worldcoin-crypto/)
- [Worldcoin Brand Identity (The Brand Identity)](https://the-brandidentity.com/project/plays-identity-for-worldcoin-upholds-the-collectively-owned-currencys-drive-for-global-equality)
- [Phantom Brand Identity Blog](https://phantom.com/learn/blog/introducing-phantom-s-new-brand-identity)
- [Phantom Brand (Brandfetch)](https://brandfetch.com/phantom.app)
- [Phantom UI Spec](https://docsbot.ai/prompts/creative/phantom-wallet-ui-spec)
- [Phantom Developer Assets](https://docs.phantom.com/resources/assets)
- [Jupiter Developer Customization](https://dev.jup.ag/tool-kits/plugin/customization)
- [Layer3 Review (BitDegree)](https://www.bitdegree.org/crypto/layer3-review)
- [Layer3 New Quest Experience](https://layer3.mirror.xyz/9Cjclb13ByJCoGGemc_33ROx_L_r2WHK2IWOAEk-9vs)
- [DeBank Social Guide](https://whisperui.com/cryptocoins/debank-social)
- [DeBank Review 2026](https://cryptoadventure.com/debank-review-2026-defi-portfolio-tracking-wallet-research-and-web3-social-features/)
- [Underdog Protocol](https://www.underdogprotocol.com/)
- [Web3 Design Trends 2025 (Merge)](https://merge.rocks/blog/10-web3-design-trends-for-2025)
- [Glassmorphism UI Patterns](https://uxpilot.ai/blogs/glassmorphism-ui)
- [Web3 Design Patterns (Merge)](https://merge.rocks/blog/web3-design-in-2024-best-principles-and-patterns)
