import { Transaction, TransactionInstruction, PublicKey, Connection } from '@solana/web3.js';
import { MEMO_PROGRAM_ID } from './constants';

// Use public RPC for client-side tx building (no API key in bundle)
const HELIUS_RPC_URL = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com';
const MEMO_PID = new PublicKey(MEMO_PROGRAM_ID);

export async function buildMeetingRegistrationTx(
  signerWallet: string,
  partnerWallet: string,
  timestamp: number,
): Promise<{ tx: Transaction; blockhash: string; lastValidBlockHeight: number }> {
  const signer = new PublicKey(signerWallet);

  const memo = JSON.stringify({
    app: 'trusttap',
    v: 1,
    type: 'meeting',
    partner: partnerWallet,
    ts: Math.floor(timestamp / 1000),
  });

  const memoInstruction = new TransactionInstruction({
    keys: [{ pubkey: signer, isSigner: true, isWritable: true }],
    programId: MEMO_PID,
    data: Buffer.from(memo, 'utf-8'),
  });

  const tx = new Transaction().add(memoInstruction);

  const connection = new Connection(HELIUS_RPC_URL);
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = signer;

  return { tx, blockhash, lastValidBlockHeight };
}
