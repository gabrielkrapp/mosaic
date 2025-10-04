import { MiniKit, Tokens, tokenToDecimals, PayCommandInput } from '@worldcoin/minikit-js';

export const RECEIVER_ADDRESS = process.env.NEXT_PUBLIC_MOSAIC_WALLET ?? '0xYourWalletAddressHere';

export async function initiatePayment(amountWLD: number, description: string) {
  if (!MiniKit.isInstalled()) {
    throw new Error('MiniKit is not installed');
  }

  const payload: PayCommandInput = {
    reference: `mosaic-${Date.now()}`,
    to: RECEIVER_ADDRESS,
    tokens: [
      {
        symbol: Tokens.WLD,
        token_amount: tokenToDecimals(amountWLD, Tokens.WLD).toString(),
      },
    ],
    description: description,
  };

  return await MiniKit.commandsAsync.pay(payload);
}
