import { Transaction, TransactionInstruction, PublicKey, Connection } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { MEMO_PROGRAM_ID } from './constants';

const DEVNET_RPC = 'https://api.devnet.solana.com';
const connection = new Connection(DEVNET_RPC);

export async function buildMeetingMemoTransaction(
  signer: string,
  meetingId: string,
  partnerAddress: string,
): Promise<Transaction> {
  const signerPubkey = new PublicKey(signer);
  const memo = JSON.stringify({
    type: 'trusttap_meeting',
    id: meetingId,
    partner: partnerAddress,
    timestamp: new Date().toISOString(),
  });

  const { blockhash } = await connection.getLatestBlockhash();
  const tx = new Transaction({
    recentBlockhash: blockhash,
    feePayer: signerPubkey,
  }).add(
    new TransactionInstruction({
      keys: [{ pubkey: signerPubkey, isSigner: true, isWritable: false }],
      programId: new PublicKey(MEMO_PROGRAM_ID),
      data: Buffer.from(memo),
    }),
  );
  return tx;
}
