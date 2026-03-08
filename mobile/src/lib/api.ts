const BASE_URL = 'https://trusttap.vercel.app';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { timeout = 15000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${res.status}`);
    }

    return res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  getProfile: (address: string) =>
    apiFetch<any>(`/api/profile/${address}`),

  analyzeWallet: (walletAddress: string) =>
    apiFetch<any>('/api/analyze-wallet', {
      method: 'POST',
      body: JSON.stringify({ walletAddress }),
    }),

  getAISummary: (walletData: any) =>
    apiFetch<any>('/api/ai-summary', {
      method: 'POST',
      body: JSON.stringify({ walletData }),
    }),

  getDemoWallets: () =>
    apiFetch<any[]>('/api/demo-wallets'),

  createMeeting: (data: any) =>
    apiFetch<any>('/api/meeting/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  sybilCheck: (data: any) =>
    apiFetch<any>('/api/sybil-check', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resolveDomain: (domain: string) =>
    apiFetch<any>(`/api/resolve-domain?domain=${encodeURIComponent(domain)}`),
};
