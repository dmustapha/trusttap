import type { CoachMarkStep } from '@/components/ui/CoachMark';

export const COACH_MARK_STEPS: Record<string, CoachMarkStep[]> = {
  profile: [
    {
      targetSelector: '[data-coach="score-dial"]',
      message: 'This is your trust reputation — scored 0-100 from device ownership, chain history, and real-world meetings.',
    },
    {
      targetSelector: '[data-coach="score-breakdown"]',
      message: 'Your score breaks down into 7 dimensions. Tap any ? icon to learn what each measures.',
    },
  ],

  scan: [
    {
      targetSelector: '[data-coach="scan-tabs"]',
      message: 'Meet another Seeker owner? Show your QR or scan theirs to prove you met in person.',
    },
    {
      targetSelector: '[data-coach="generate-qr"]',
      message: 'Each QR code is unique and expires in 60 seconds. Both of you earn trust points.',
    },
  ],

  search: [
    {
      targetSelector: '[data-coach="search-input"]',
      message: 'Paste any Solana wallet address to look up their trust profile and score.',
    },
  ],

  shield: [
    {
      targetSelector: '[data-coach="threshold-slider"]',
      message: 'Set how strict your bot filter should be. Higher threshold = fewer but more trusted users.',
    },
    {
      targetSelector: '[data-coach="run-filter"]',
      message: 'Run the filter to see how many wallets pass your threshold.',
    },
  ],
};
