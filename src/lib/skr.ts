import {
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from '@solana/spl-token';
import { SKR_MINT_ADDRESS, SKR_DECIMALS } from './constants';

// Use public RPC for client-side calls (no API key in bundle)
const HELIUS_RPC_URL = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com';

const SKR_MINT = new PublicKey(SKR_MINT_ADDRESS);

export async function getSKRBalance(walletAddress: string): Promise<number> {
  try {
    const connection = new Connection(HELIUS_RPC_URL);
    const owner = new PublicKey(walletAddress);
    const ata = await getAssociatedTokenAddress(SKR_MINT, owner);

    const account = await getAccount(connection, ata);
    return Number(account.amount) / (10 ** SKR_DECIMALS);
  } catch {
    return 0;
  }
}

export async function buildSKRTipTransaction(
  senderAddress: string,
  recipientAddress: string,
  amount: number,
): Promise<{ tx: Transaction; blockhash: string; lastValidBlockHeight: number }> {
  const connection = new Connection(HELIUS_RPC_URL);
  const sender = new PublicKey(senderAddress);
  const recipient = new PublicKey(recipientAddress);

  const senderATA = await getAssociatedTokenAddress(SKR_MINT, sender);
  const recipientATA = await getAssociatedTokenAddress(SKR_MINT, recipient);

  const tx = new Transaction();

  // Check if recipient has an ATA; if not, create one
  try {
    await getAccount(connection, recipientATA);
  } catch {
    tx.add(
      createAssociatedTokenAccountInstruction(
        sender, // payer
        recipientATA,
        recipient,
        SKR_MINT,
      ),
    );
  }

  const rawAmount = BigInt(Math.round(amount * (10 ** SKR_DECIMALS)));

  tx.add(
    createTransferInstruction(
      senderATA,
      recipientATA,
      sender,
      rawAmount,
    ),
  );

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = sender;

  return { tx, blockhash, lastValidBlockHeight };
}
