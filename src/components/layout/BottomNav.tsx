'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function ProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 10-16 0" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
      <rect x="7" y="7" width="10" height="10" rx="1" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function LevelUpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

const tabs = [
  { href: '/profile', label: 'Profile', icon: ProfileIcon },
  { href: '/scan', label: 'Scan', icon: ScanIcon },
  { href: '/search', label: 'Search', icon: SearchIcon },
  { href: '/levelup', label: 'Level Up', icon: LevelUpIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-base)]"
      style={{ borderTop: 'var(--rule-muted)' }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-md items-center justify-around py-2" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {tabs.map(tab => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 px-4 py-2 transition-colors ${
                isActive ? 'text-[var(--tt-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {/* Active indicator bar above icon */}
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full transition-all duration-300"
                style={{
                  width: isActive ? '16px' : '0px',
                  height: '2px',
                  background: 'var(--tt-primary)',
                  opacity: isActive ? 1 : 0,
                }}
                aria-hidden="true"
              />
              <tab.icon />
              <span className="font-[family-name:var(--font-serif-body)] text-[0.65rem]" style={{ letterSpacing: '0.05em' }}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
