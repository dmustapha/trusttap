import 'server-only';
import { TldParser } from '@onsol/tldparser';
import { Connection } from '@solana/web3.js';

const HELIUS_API_KEY = process.env.HELIUS_API_KEY || '';
const RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

const SUPPORTED_TLDS = ['.skr', '.sol', '.bonk', '.abc', '.poor'];

/** Returns true if the input looks like a domain name rather than a wallet address */
export function isDomainName(input: string): boolean {
  return SUPPORTED_TLDS.some(tld => input.toLowerCase().endsWith(tld));
}

/** Resolves a domain (e.g. "flyers4eva.skr") to a Solana wallet address */
export async function resolveDomain(domain: string): Promise<string | null> {
  try {
    const connection = new Connection(RPC_URL);
    const parser = new TldParser(connection);
    const owner = await parser.getOwnerFromDomainTld(domain.toLowerCase());
    if (!owner) return null;
    return typeof owner === 'string' ? owner : owner.toBase58();
  } catch (err) {
    console.error('Domain resolution failed for', domain, err);
    return null;
  }
}
