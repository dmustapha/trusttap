import { NextRequest, NextResponse } from 'next/server';
import { isDomainName, resolveDomain } from '@/lib/resolve-domain';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(`resolve:${ip}`, 15, 60000)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const domain = body?.domain?.trim();

  if (!domain || typeof domain !== 'string') {
    return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
  }

  if (!isDomainName(domain)) {
    return NextResponse.json({ error: 'Not a recognized domain format. Supported: .skr, .sol, .bonk' }, { status: 400 });
  }

  const walletAddress = await resolveDomain(domain);

  if (!walletAddress) {
    return NextResponse.json({ error: `Could not resolve "${domain}". Domain may not exist or is not registered.` }, { status: 404 });
  }

  return NextResponse.json({ walletAddress, domain });
}
