import { SystemProgram, Transaction, PublicKey, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

const DEVNET_RPC = 'https://api.devnet.solana.com';

export const TIP_AMOUNTS = [0.01, 0.05, 0.1] as const;

const connection = new Connection(DEVNET_RPC);

export async function buildSOLTipTransaction(
  sender: string,
  recipient: string,
  amountSOL: number,
): Promise<Transaction> {
  const senderPubkey = new PublicKey(sender);
  const { blockhash } = await connection.getLatestBlockhash();
  const tx = new Transaction({
    recentBlockhash: blockhash,
    feePayer: senderPubkey,
  }).add(
    SystemProgram.transfer({
      fromPubkey: senderPubkey,
      toPubkey: new PublicKey(recipient),
      lamports: Math.round(amountSOL * LAMPORTS_PER_SOL),
    }),
  );
  return tx;
}
