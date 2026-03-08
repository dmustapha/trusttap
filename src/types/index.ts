// ─── Core Domain Types ───

export interface WalletAnalysis {
  walletAddress: string;
  hasSGT: boolean;
  walletAge: number;
  firstTransactionDate: string;
  transactionCount: number;
  protocolsUsed: string[];
  hasStakedSOL: boolean;
  hasLPPositions: boolean;
  hasLendingPositions: boolean;
  nftCount: number;
  blueChipNFTCount: number;
  hasSolDomain: boolean;
  solDomain?: string;
  daoVoteCount: number;
  meetingCount: number;
  solBalance: number;          // Native SOL balance
  lstBalance: number;          // Liquid staking token balance in SOL-equivalent
  totalPortfolioSOL: number;   // Total portfolio value in SOL-equivalent
  stakingLevel: number;        // 0-5 graduated staking depth
  lpLevel: number;             // 0-4 graduated LP depth
  lendingLevel: number;        // 0-4 graduated lending depth
  analyzedAt: string;
}

export interface TrustProfile {
  walletAddress: string;
  score: number;
  label: TrustLabel;
  color: string;
  breakdown: ScoreBreakdown;
  badges: Badge[];
  aiSummary: string;
  sybilAssessment: string;
  meetingHistory: Meeting[];
  analysis: WalletAnalysis;
  scoreHistory?: ScoreSnapshot[];
  cachedAt: string;
}

export type TrustLabel = 'Unverified' | 'Basic' | 'Established' | 'Trusted' | 'Highly Trusted';

export interface ScoreBreakdown {
  device: number;
  financial: number;
  walletAge: number;
  activity: number;
  diversity: number;
  defi: number;
  identity: number;
  physical: number;
}

export interface Meeting {
  id: string;
  walletA: string;
  walletB: string;
  timestamp: string;
  signatureA: string;
  signatureB: string;
  verified: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  earnedAt?: string;
  progress?: string;
}

export interface ScoreSnapshot {
  score: number;
  timestamp: string;
}

export interface MeetingChallenge {
  walletAddress: string;
  timestamp: number;
  nonce: string;
  signature: string;
}

// ─── API Request/Response Types ───

export interface AnalyzeWalletRequest {
  walletAddress: string;
}

export interface AISummaryRequest {
  walletData: WalletAnalysis;
}

export interface AISummaryResponse {
  summary: string;
  sybilAssessment: 'HUMAN' | 'LIKELY HUMAN' | 'UNCERTAIN' | 'LIKELY BOT' | 'BOT';
  confidence: string;
}

export interface CreateMeetingRequest {
  walletA: string;
  walletB: string;
  timestamp: string;
  signatureA: string;
  signatureB: string;
  nonceA: string;
  nonceB: string;
}

export interface CreateMeetingResponse {
  success: boolean;
  meetingId: string;
  newScores: { walletA: number; walletB: number };
}

export interface SybilCheckRequest {
  walletAddresses: string[];
  minTrustScore: number;
  requireSGT?: boolean;
}

export interface SybilCheckResult {
  total: number;
  sgtVerified: number;
  meetsThreshold: number;
  rejected: number;
  results: WalletCheckResult[];
}

export interface WalletCheckResult {
  walletAddress: string;
  hasSGT: boolean;
  trustScore: number | null;
  passed: boolean;
  reason?: string;
}

// ─── Cache Types ───

export interface CacheEntry {
  walletAddress: string;
  analysis: WalletAnalysis;
  profile: TrustProfile;
  cachedAt: string;
  expiresAt: string;
  source: 'precomputed' | 'live';
}

// ─── Anti-Gaming Types ───

export type AntiGamingViolation = 'daily_limit' | 'cooldown' | 'self_meeting' | 'expired_challenge';

// ─── API Error ───

export interface APIError {
  error: string;
  code?: string;
  details?: string;
}
