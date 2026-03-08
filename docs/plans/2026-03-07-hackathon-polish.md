# Hackathon Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix scoring imbalances, harden protocol detection, fix stale test mocks, add stablecoin support, improve UI ordering, and update .env.example before the March 9 hackathon deadline.

**Architecture:** Phased approach — backend scoring/detection fixes first (Phase 1), then UI polish (Phase 2), then housekeeping (Phase 3). Each phase is independently testable. All changes are backward-compatible with existing cached profiles.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, Helius API, Groq API

---

## Phase 1: Backend Scoring & Detection Fixes (CRITICAL)

### Task 1: Lower Financial Score from 15pts to 10pts

**Files:**
- Modify: `src/lib/constants.ts:65-76` (FINANCIAL_TIERS)
- Modify: `src/lib/scoring.ts:14-19` (calculateFinancialScore — no code change needed, reads from tiers)
- Modify: `src/types/index.ts` — no change needed (ScoreBreakdown.financial is just `number`)
- Test: `src/lib/__tests__/scoring.test.ts`

**Why:** Financial is 15/100 (15%) — too heavy. A whale with 10K SOL and zero community activity shouldn't score 15% just from holdings. Flatten to 10pts max with compressed tiers to reduce wealth-bias.

**Step 1: Update the scoring test to expect new max of 10**

Add/update test in `src/lib/__tests__/scoring.test.ts`:

```typescript
describe('calculateFinancialScore', () => {
  it('caps at 10 for mega whales', () => {
    expect(calculateFinancialScore(10000)).toBe(10);
  });
  it('returns 8 for 500+ SOL', () => {
    expect(calculateFinancialScore(500)).toBe(8);
  });
  it('returns 5 for 20+ SOL', () => {
    expect(calculateFinancialScore(20)).toBe(5);
  });
  it('returns 0 for empty wallet', () => {
    expect(calculateFinancialScore(0)).toBe(0);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/MAC/Desktop/dev/trusttap && npx vitest run src/lib/__tests__/scoring.test.ts --reporter=verbose`
Expected: FAIL — current max is 15, test expects 10.

**Step 3: Update FINANCIAL_TIERS in constants.ts**

Replace lines 65-76 of `src/lib/constants.ts` with:

```typescript
export const FINANCIAL_TIERS: { minSOL: number; points: number; label: string }[] = [
  { minSOL: 10000, points: 10, label: 'Mega Whale' },
  { minSOL: 2000,  points: 10, label: 'Whale' },
  { minSOL: 500,   points: 8,  label: 'High-Value' },
  { minSOL: 100,   points: 7,  label: 'Serious' },
  { minSOL: 20,    points: 5,  label: 'Committed' },
  { minSOL: 5,     points: 3,  label: 'Active' },
  { minSOL: 1,     points: 2,  label: 'Starter' },
  { minSOL: 0.1,   points: 1,  label: 'Dust' },
  { minSOL: 0,     points: 0,  label: 'Empty' },
];
```

Key changes: Max 10 (was 15), removed 200 SOL tier, compressed mid-range. This frees 5 points to redistribute.

**Step 4: Redistribute 5 freed points — increase Device to 25pts**

In `src/lib/scoring.ts:9`, change:
```typescript
export function calculateDeviceScore(hasSGT: boolean): number {
  return hasSGT ? 25 : 0;
}
```

Comment on line 8: `// --- Device (25 pts) --- Binary: SGT or nothing`

**Why:** Device verification (SGT) is TrustTap's differentiator. 25pts makes SGT ownership the single strongest signal — exactly what the hackathon judges want to see for a "Seeker phone" app.

**Step 5: Run all scoring tests**

Run: `cd /Users/MAC/Desktop/dev/trusttap && npx vitest run src/lib/__tests__/scoring.test.ts --reporter=verbose`
Expected: All PASS (update any existing tests that assert old maximums).

**Step 6: Run typecheck**

Run: `cd /Users/MAC/Desktop/dev/trusttap && npx tsc --noEmit`
Expected: Clean.

**Step 7: Commit**

```bash
git add src/lib/constants.ts src/lib/scoring.ts src/lib/__tests__/scoring.test.ts
git commit -m "fix: rebalance scoring — financial 15→10pts, device 20→25pts

Reduces wealth-bias and strengthens SGT (device verification) as primary differentiator.

```

---

### Task 2: Whitelist-Only Protocol Detection (Remove Spam Sources)

**Files:**
- Modify: `src/lib/helius.ts:192-215` (getProtocolsUsed inner loop)
- Test: `src/lib/__tests__/helius.test.ts`

**Why:** Current code at `helius.ts:207-213` adds ANY unknown Helius source as a protocol name (excluding only SYSTEM_PROGRAM and UNKNOWN). This inflates diversity scores with spam like "Compute Budget", "Address Lookup Table", etc.

**Step 1: Write failing test**

Add to `src/lib/__tests__/helius.test.ts`:

```typescript
it('does not add unknown sources as protocols', async () => {
  // Mock heliusRpc for signatures
  // Mock fetch for parse-transactions returning { source: 'COMPUTE_BUDGET' }
  // Assert result does NOT include 'Compute Budget'
});
```

(Exact mock structure depends on existing test patterns in helius.test.ts — read the file first.)

**Step 2: Run test to verify it fails**

Run: `cd /Users/MAC/Desktop/dev/trusttap && npx vitest run src/lib/__tests__/helius.test.ts --reporter=verbose`

**Step 3: Remove the fallback source-as-protocol code**

In `src/lib/helius.ts`, replace lines 192-215 with:

```typescript
      for (const tx of parsed) {
        if (!tx.source) continue;

        // 1. Direct source mapping (most reliable)
        const mapped = HELIUS_SOURCE_MAP[tx.source.toUpperCase()];
        if (mapped) {
          foundProtocols.add(mapped);
          continue;
        }

        // 2. Fuzzy match against known protocol names
        for (const name of protocolNames) {
          if (tx.source.toUpperCase().includes(name.split(' ')[0].toUpperCase())) {
            foundProtocols.add(name);
          }
        }

        // No fallback — unknown sources are ignored to prevent spam inflation
      }
```

**Step 4: Run tests**

Run: `cd /Users/MAC/Desktop/dev/trusttap && npx vitest run src/lib/__tests__/helius.test.ts --reporter=verbose`
Expected: All PASS.

**Step 5: Commit**

```bash
git add src/lib/helius.ts src/lib/__tests__/helius.test.ts
git commit -m "fix: whitelist-only protocol detection — stop spam source inflation

Unknown Helius sources (Compute Budget, Address Lookup Table, etc.) no longer
count as protocols. Only mapped sources and fuzzy-matched known protocols.

```

---

### Task 3: Add Stablecoin Support to Financial Calculation

**Files:**
- Modify: `src/lib/constants.ts` — Add STABLECOIN_MINTS
- Modify: `src/lib/helius.ts:222-261` (getFinancialData)
- Test: `src/lib/__tests__/helius.test.ts`

**Why:** Financial calculation ignores USDC/USDT entirely. A wallet with 10K USDC and 0 SOL scores 0 on financial depth. Stablecoins should count toward portfolio value.

**Step 1: Add stablecoin mint constants**

Add to `src/lib/constants.ts` after `LST_MINTS`:

```typescript
// Known stablecoin mints (for portfolio calculation)
// Values in USD, converted to SOL-equivalent at fetch time
export const STABLECOIN_MINTS: Record<string, { name: string; symbol: string }> = {
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': { name: 'USD Coin', symbol: 'USDC' },
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': { name: 'Tether USD', symbol: 'USDT' },
};
```

**Step 2: Update getFinancialData to include stablecoins**

In `src/lib/helius.ts`, update the import to include `STABLECOIN_MINTS`:

```typescript
import { ..., STABLECOIN_MINTS } from './constants';
```

In `getFinancialData` (around line 247-258), after the LST balance loop, add:

```typescript
    // Sum stablecoin balances (convert USD to SOL-equivalent using ~$150/SOL estimate)
    const SOL_PRICE_USD_ESTIMATE = 150;
    let stablecoinSOLEquivalent = 0;
    for (const ta of tokenResult.value) {
      const info = ta.account.data.parsed.info;
      if (STABLECOIN_MINTS[info.mint] && info.tokenAmount.uiAmount > 0) {
        stablecoinSOLEquivalent += info.tokenAmount.uiAmount / SOL_PRICE_USD_ESTIMATE;
      }
    }

    // Total portfolio = native SOL + LSTs + stablecoins (in SOL-equivalent)
    const totalPortfolioSOL = solBalance + lstBalance + stablecoinSOLEquivalent;
```

**Step 3: Run tests**

Run: `cd /Users/MAC/Desktop/dev/trusttap && npx vitest run src/lib/__tests__/helius.test.ts --reporter=verbose`

**Step 4: Run typecheck**

Run: `cd /Users/MAC/Desktop/dev/trusttap && npx tsc --noEmit`

**Step 5: Commit**

```bash
git add src/lib/constants.ts src/lib/helius.ts
git commit -m "feat: include USDC/USDT in financial portfolio calculation

Stablecoins converted to SOL-equivalent at ~$150/SOL estimate.
Prevents wallets with significant stablecoin holdings from scoring 0.

```

---

### Task 4: Delete All Stale Demo Caches

**Files:**
- Delete: `src/data/cache/profiles/2vDf99TVjPDhh6LsJJYrCWJZxbyGV39a1MHHUm9pMVVP.json`
- Delete: `src/data/cache/profiles/86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdRxApLNDk.json`
- Delete: `src/data/cache/profiles/HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH.json`

**Why:** Cached profiles were computed with old scoring (financial=15, device=20) and broken protocol detection. They need to be regenerated with the new algorithm.

**Step 1: Delete stale caches**

```bash
rm -f src/data/cache/profiles/*.json
```

**Step 2: Commit**

```bash
git add -u src/data/cache/profiles/
git commit -m "chore: delete stale profile caches for re-analysis with new scoring

```

---

## Phase 2: Test & AI Fixes

### Task 5: Fix ai.test.ts Stale Mocks (Gemini → Groq Format)

**Files:**
- Modify: `src/lib/__tests__/ai.test.ts`

**Why:** Tests still mock Gemini response format (`candidates[0].content.parts[0].text`) and reference `GEMINI_API_KEY`, but `ai.ts` now uses Groq format (`choices[0].message.content`) with `GROQ_API_KEY`. Tests pass by accident because the fallback catches errors, but they're not testing the real behavior.

**Step 1: Rewrite mock helpers and env stub**

Replace lines 10-44 of `src/lib/__tests__/ai.test.ts`:

```typescript
// Set env so llmGenerate doesn't throw "not set"
vi.stubEnv('GROQ_API_KEY', 'test-key');

import { generateTrustSummary, generateSybilAssessment, buildTrustSummaryPrompt, buildSybilPrompt } from '../ai';

// ... (keep makeAnalysis as-is)

function groqResponse(text: string) {
  return {
    ok: true,
    json: () => Promise.resolve({
      choices: [{ message: { content: text } }],
    }),
  };
}

function groqError(status = 500) {
  return {
    ok: false,
    status,
    text: () => Promise.resolve('Internal error'),
  };
}
```

**Step 2: Update all test bodies**

Replace every `geminiResponse(...)` with `groqResponse(...)` and `geminiError(...)` with `groqError(...)`.

Update test descriptions: "Gemini response" → "Groq response" (optional but cleaner).

**Step 3: Run tests**

Run: `cd /Users/MAC/Desktop/dev/trusttap && npx vitest run src/lib/__tests__/ai.test.ts --reporter=verbose`
Expected: All 11 tests PASS with correct Groq mock format.

**Step 4: Commit**

```bash
git add src/lib/__tests__/ai.test.ts
git commit -m "fix: update ai.test.ts mocks from Gemini to Groq response format

Tests now correctly mock choices[0].message.content (Groq/OpenAI format)
instead of candidates[0].content.parts[0].text (Gemini format).

```

---

### Task 6: Fix AISummary Attribution Text

**Files:**
- Modify: `src/components/trust/AISummary.tsx:52`

**Why:** The AI summary card says "— Claude analysis" but we now use Groq (Llama 3.1). Should say "— AI analysis" to be accurate.

**Step 1: Update attribution**

In `src/components/trust/AISummary.tsx:52`, change:
```typescript
              — Claude analysis
```
to:
```typescript
              — AI analysis
```

**Step 2: Commit**

```bash
git add src/components/trust/AISummary.tsx
git commit -m "fix: update AI summary attribution from 'Claude' to 'AI'

Now uses Groq/Llama, not Claude. Generic attribution is accurate.

```

---

## Phase 3: Housekeeping

### Task 7: Update .env.example

**Files:**
- Modify: `.env.example`

**Why:** Still references `GEMINI_API_KEY` which is no longer used. Should show `GROQ_API_KEY`.

**Step 1: Update .env.example**

```
HELIUS_API_KEY=your_helius_api_key
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_USE_DEMO_SGT=true
NEXT_PUBLIC_DEMO_MODE=true
```

**Step 2: Commit**

```bash
git add .env.example
git commit -m "chore: update .env.example — GEMINI_API_KEY → GROQ_API_KEY

```

---

### Task 8: Run Full Test Suite + Typecheck

**Files:** None (verification only)

**Step 1: Run all tests**

Run: `cd /Users/MAC/Desktop/dev/trusttap && npx vitest run --reporter=verbose`
Expected: All tests pass.

**Step 2: Run typecheck**

Run: `cd /Users/MAC/Desktop/dev/trusttap && npx tsc --noEmit`
Expected: Zero errors.

**Step 3: Smoke test dev server**

Run: `cd /Users/MAC/Desktop/dev/trusttap && npm run build`
Expected: Build succeeds with no errors.

---

## Summary

| Phase | Task | Impact | Risk |
|-------|------|--------|------|
| 1 | Financial 15→10, Device 20→25 | Rebalances scoring for SGT focus | Low — constants only |
| 1 | Whitelist-only protocols | Stops spam inflation | Low — removes code |
| 1 | Stablecoin support | USDC/USDT count in portfolio | Low — additive |
| 1 | Delete stale caches | Forces re-analysis | None |
| 2 | Fix ai.test.ts mocks | Tests actually test real behavior | Low |
| 2 | Fix AI attribution | Accurate UI text | None |
| 3 | Update .env.example | Correct onboarding docs | None |
| 3 | Full verification | Confidence before deadline | None |

**Total score redistribution:** 100pts → still 100pts (Device 25 + Financial 10 + Age 10 + Activity 10 + Diversity 10 + DeFi 13 + Identity 10 + Physical 12 = 100)
