# TrustTap+ Scoring System v2 — Mathematical Foundation

## Design Principles

1. **Every point earned should cost something** — time, money, or physical presence
2. **Diminishing returns everywhere** — first actions matter most, prevents farming
3. **The hardest-to-fake signals weigh the most** — device > physical > chain history
4. **Score should distribute meaningfully** — not everyone at 20 or 80
5. **Cost of attack scales exponentially** — getting from 60→80 should be 10x harder than 20→40

## Mathematical Curves

### Logarithmic (for count-based data)
```
score = max × ln(1 + x/c) / ln(1 + threshold/c)
```
Where `c` controls curvature (smaller = sharper diminishing returns), capped at `max`.

**Why:** First 100 transactions matter far more than the 900th. Log naturally captures this.

### Asymptotic/Saturating (for time-based data)
```
score = max × (1 - e^(-x/τ))
```
Where `τ` is the time constant (days where you reach ~63% of max).

**Why:** Wallet age hits diminishing returns — 2 years isn't much better than 1 year.

### Binary with Bonus (for attestation)
```
score = base (if attestation exists) + bonus (if conditions met)
```

**Why:** You either have the SGT or you don't. No curve needed.

---

## Dimension Formulas

### 1. Device (SGT) — 25 pts (was 20)

**Rationale for increase:** SGT is the single hardest signal to fake. $500+ cost per identity. It should be the foundation, worth 25% of total score.

```
device = hasSGT ? 25 : 0
```

**Cost of attack:** $500+ per fake identity (buy a Seeker phone)

### 2. Wallet Age — 15 pts

```
age_score = 15 × (1 - e^(-ageDays / 180))
```

| Days | Score | % of Max |
|------|-------|----------|
| 7    | 0.6   | 4%       |
| 30   | 2.4   | 16%      |
| 90   | 5.9   | 39%      |
| 180  | 9.5   | 63%      |
| 365  | 12.9  | 87%      |
| 730  | 14.7  | 98%      |

**Anti-gaming:** Old wallets with zero activity score high on age but zero on activity/diversity/DeFi. The multi-dimensional design catches this — a bought old wallet still needs everything else.

### 3. Activity — 12 pts (was 15)

```
activity_score = 12 × ln(1 + txCount / 50) / ln(1 + 5000 / 50)
```

| Transactions | Score | % of Max |
|-------------|-------|----------|
| 10          | 0.5   | 4%       |
| 50          | 1.8   | 15%      |
| 200         | 3.7   | 31%      |
| 500         | 5.3   | 44%      |
| 1000        | 6.6   | 55%      |
| 5000        | 10.0  | 83%      |
| 10000       | 11.3  | 94%      |

**Anti-gaming:** Spam self-transactions are cheap but activity alone maxes at 12 pts. You'd need $500 (SGT) + 1 year (age) + real DeFi + meetings to score high. Spamming 10K txs only gets you 11 out of 100.

**Reduced from 15→12:** Activity is the easiest dimension to game (self-transfers cost pennies). Redistributed 3 pts to Physical meetings which can't be faked.

### 4. Protocol Diversity — 10 pts (was 15)

```
diversity_score = 10 × ln(1 + protocols / 2) / ln(1 + 11 / 2)
```

| Protocols Used | Score | % of Max |
|---------------|-------|----------|
| 1             | 2.0   | 20%      |
| 2             | 3.5   | 35%      |
| 3             | 4.7   | 47%      |
| 5             | 6.3   | 63%      |
| 8             | 8.1   | 81%      |
| 11            | 10.0  | 100%     |

**Anti-gaming:** Touching a protocol once costs gas + time. Diminishing returns mean the marginal value of protocol #8 is much less than protocol #2. We track 11 known protocols (Jupiter, Raydium, Orca, Marinade, Tensor, Magic Eden, Solend, Marginfi, Squads, SPL Governance + 1 more).

**Reduced from 15→10:** Easy to touch protocols superficially. Moved weight to harder signals.

### 5. DeFi Depth — 13 pts (was 15)

Instead of binary (has/hasn't), score depth of engagement:

```
defi_score = staking_score + lp_score + lending_score

staking_score = hasStaked ? 5 : 0
lp_score = hasLP ? 4 : 0
lending_score = hasLending ? 4 : 0
```

Still binary per category, but reweighted. Staking is most common and slightly easier → gets 5. LP and lending require more sophistication → 4 each.

**Future improvement:** Check balances (minimum threshold) to prevent dust deposits. For hackathon, binary detection is sufficient.

### 6. Identity — 10 pts

```
identity_score = domain_score + nft_score + dao_score

domain_score:
  - .skr domain: 5 pts (strongest — tied to Seeker identity)
  - .sol domain (no .skr): 3 pts
  - neither: 0

nft_score:
  - blueChipNFTCount >= 2: 3 pts
  - blueChipNFTCount == 1: 2 pts
  - else: 0

dao_score:
  - daoVoteCount > 0: 2 pts
  - else: 0
```

**Change:** Added .skr domain detection (worth MORE than .sol since it signals Seeker ownership). Max 10 (5+3+2).

### 7. Physical Meetings — 15 pts (was 10)

**Rationale for increase:** Physical meetings are THE hardest signal for bots to fake. This is TrustTap+'s killer feature. It deserves 15% of the total score.

```
physical_score = min(meetingCount × 3, 15)
```

5 meetings = max score. Each meeting = 3 pts (was 2).

**Anti-gaming protections (already built):**
- 60-second QR expiry
- Ed25519 cryptographic signatures
- Pair cooldown: same two wallets can only verify once per 7 days
- Max 5 meetings per day
- Requires physical proximity (QR scan)

---

## Weight Summary (v1 → v2)

| Dimension | v1 | v2 | Change | Reasoning |
|-----------|----|----|--------|-----------|
| Device (SGT) | 20 | **25** | +5 | Hardest to fake, foundation of system |
| Wallet Age | 15 | **15** | 0 | Good as-is |
| Activity | 15 | **12** | -3 | Easiest to game (self-transfers) |
| Diversity | 15 | **10** | -5 | Easy to touch protocols superficially |
| DeFi | 15 | **13** | -2 | Slightly reduced, still meaningful |
| Identity | 10 | **10** | 0 | Added .skr detection |
| Physical | 10 | **15** | +5 | Hardest for bots, TrustTap's differentiator |
| **Total** | **100** | **100** | | |

**Design philosophy:** Weight is proportional to cost-of-forgery. SGT ($500) and Physical (need real humans) get the most. Activity (pennies in gas) gets the least.

---

## Score Distribution (Expected)

| Score Range | Label | Who Scores Here |
|-------------|-------|----------------|
| 0-20 | Unverified | No SGT, fresh wallet |
| 21-40 | Basic | Has SGT but new/inactive wallet |
| 41-60 | Established | SGT + moderate chain history |
| 61-80 | Trusted | SGT + deep chain history + some meetings |
| 81-100 | Highly Trusted | SGT + veteran wallet + DeFi + meetings + identity |

**Minimum "probably human":** 40+ (SGT alone = 25, plus any age/activity)
**Recommended airdrop threshold:** 50-60

---

## Cost of Attack Analysis

| Target Score | What's Needed | Minimum Cost |
|-------------|---------------|-------------|
| 25 | Just buy a Seeker phone | $500 |
| 40 | Seeker + wait 6 months | $500 + 6 months |
| 55 | Seeker + 6 months + real DeFi activity | $500 + 6 months + capital |
| 70 | All above + 3 physical meetings | $500 + 6 months + capital + 3 real humans |
| 85+ | All above + 5 meetings + .skr + blue chips | $500 + 1 year + significant capital + 5 humans |

The key insight: **score 70+ requires real humans willing to vouch for you in person.** No amount of money alone can buy that.

---

## Implementation Notes

- All continuous scores should be `Math.round()` to integers for display
- `Math.min()` to cap at max for each dimension
- `Math.max(0, ...)` to floor at 0
- The `calculateTrustScore()` function sums all 7 dimensions
