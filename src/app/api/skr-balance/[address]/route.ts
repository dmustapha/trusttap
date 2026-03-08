import { NextResponse } from 'next/server';
import { getSKRBalance } from '@/lib/skr';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params;

  try {
    const balance = await getSKRBalance(address);
    return NextResponse.json({ balance });
  } catch {
    return NextResponse.json({ balance: 0 });
  }
}
