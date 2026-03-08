'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { PageShell } from '@/components/layout/PageShell';
import { BottomNav } from '@/components/layout/BottomNav';
import { TrustProfileCard } from '@/components/trust/TrustProfileCard';
import { AnalysisLoader } from '@/components/ui/AnalysisLoader';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { HelpIcon } from '@/components/ui/HelpIcon';
import type { TrustProfile } from '@/types';

const DOMAIN_TLDS = ['.skr', '.sol', '.bonk', '.abc', '.poor'];

function isDomain(input: string): boolean {
  return DOMAIN_TLDS.some(tld => input.toLowerCase().endsWith(tld));
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { connected, hasSGT, publicKey } = useWallet();
  const [query, setQuery] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [result, setResult] = useState<TrustProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !connected) router.push('/');
  }, [mounted, connected, router]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('trusttap_recent_searches');
      if (saved) setRecentSearches(JSON.parse(saved));
    } catch { /* ignore corrupted data */ }
  }, []);

  const searchByAddress = async (address: string) => {
    const res = await fetch(`/api/profile/${address}`);
    if (res.status === 404) {
      const analyzeRes = await fetch('/api/analyze-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      });
      if (!analyzeRes.ok) {
        const errData = await analyzeRes.json().catch(() => null);
        throw new Error(errData?.error || 'Wallet not found or not SGT-verified');
      }
      return await analyzeRes.json();
    } else if (res.ok) {
      return await res.json();
    } else {
      const data = await res.json();
      throw new Error(data.error || 'Search failed');
    }
  };

  const search = async (input: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setResolvedAddress(null);

    try {
      let address = input;

      if (isDomain(input)) {
        const res = await fetch('/api/resolve-domain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: input }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.error || `Could not resolve "${input}"`);
        }
        const data = await res.json();
        address = data.walletAddress;
        setResolvedAddress(address);
      }

      const profile = await searchByAddress(address);
      setResult(profile);

      const searchEntry = input;
      const updated = [searchEntry, ...recentSearches.filter(a => a !== searchEntry)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('trusttap_recent_searches', JSON.stringify(updated));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Auto-search from shared link query param (fire once)
  const autoSearched = useRef(false);
  useEffect(() => {
    const walletParam = searchParams.get('wallet');
    if (walletParam && connected && hasSGT && !autoSearched.current) {
      autoSearched.current = true;
      setQuery(walletParam);
      search(walletParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, connected, hasSGT]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) search(query.trim());
  };

  if (!mounted || !connected) return null;

  return (
    <>
      <PageShell>
        <div className="mb-6 flex items-center gap-1">
          <h1 className="font-[family-name:var(--font-serif-display)] text-2xl font-semibold text-[var(--text-primary)]">Search Wallet</h1>
          <HelpIcon tooltipKey="trust-labels" />
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Address or domain (e.g. name.skr)"
              className="w-full border border-[var(--bg-elevated)] bg-[var(--bg-surface)] py-3 pl-4 pr-12 font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--tt-primary)] focus:outline-none transition-colors"
            />
            {result || error ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => { setQuery(''); setResult(null); setError(null); setResolvedAddress(null); }}
                className="absolute right-1 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!query.trim() || loading}
                aria-label="Search"
                className="absolute right-1 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center text-[var(--text-muted)] transition-colors disabled:opacity-30 enabled:hover:text-[var(--tt-primary)] enabled:hover:bg-[var(--bg-elevated)]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            )}
          </div>
        </form>

        {loading && <AnalysisLoader />}
        {error && <ErrorMessage message={error} />}

        {resolvedAddress && !loading && (
          <div className="mb-3 bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--text-secondary)]">
            Resolved to <span className="font-mono text-[var(--text-primary)]">{resolvedAddress.slice(0, 8)}...{resolvedAddress.slice(-4)}</span>
          </div>
        )}

        {result && (
          <>
            <TrustProfileCard profile={result} />
            <button
              onClick={() => { setQuery(''); setResult(null); setResolvedAddress(null); }}
              className="mt-4 w-full py-3 text-center transition-colors hover:text-[var(--text-primary)]"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                borderTop: '1px solid var(--bg-elevated)',
              }}
            >
              ← New Search
            </button>
          </>
        )}

        {!result && !loading && !error && (
          <div className="mt-6">
            {/* Quick search: own wallet */}
            {publicKey && (
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-3">
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Try it
                  </span>
                  <div className="flex-1" style={{ borderTop: '1px solid var(--bg-elevated)' }} />
                </div>
                <button
                  onClick={() => { setQuery(publicKey); search(publicKey); }}
                  className="flex w-full items-center justify-between px-3 py-3 transition-colors hover:bg-[var(--bg-surface)]"
                  style={{ borderLeft: '2px solid var(--tt-primary)' }}
                >
                  <div className="text-left">
                    <span style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      Search yourself
                    </span>
                    <span className="block" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {publicKey.slice(0, 8)}&hellip;{publicKey.slice(-4)}
                    </span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tt-primary)" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-3">
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Recent
                  </span>
                  <div className="flex-1" style={{ borderTop: '1px solid var(--bg-elevated)' }} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(entry => (
                    <button
                      key={entry}
                      onClick={() => { setQuery(entry); search(entry); }}
                      className="inline-flex items-center gap-1.5 border border-[var(--bg-elevated)] bg-[var(--bg-surface)] px-3 py-1.5 font-mono text-xs text-[var(--text-secondary)] transition-colors active:scale-[0.97] hover:border-[var(--tt-primary)] hover:text-[var(--text-primary)]"
                    >
                      {isDomain(entry) ? entry : `${entry.slice(0, 8)}…${entry.slice(-4)}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search hints */}
            <div className="mb-5">
              <div className="mb-2 flex items-center gap-3">
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  What you can search
                </span>
                <div className="flex-1" style={{ borderTop: '1px solid var(--bg-elevated)' }} />
              </div>
              <div className="flex flex-col gap-1">
                {[
                  { label: 'Wallet address', example: '7xKp...3mFv' },
                  { label: '.skr domain', example: 'name.skr' },
                  { label: '.sol domain', example: 'name.sol' },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex items-baseline justify-between px-3 py-2"
                    style={{ borderLeft: '2px solid var(--bg-elevated)' }}
                  >
                    <span style={{ fontFamily: 'var(--font-serif-body)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {item.label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      {item.example}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </PageShell>
      <BottomNav />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<AnalysisLoader />}>
      <SearchContent />
    </Suspense>
  );
}
