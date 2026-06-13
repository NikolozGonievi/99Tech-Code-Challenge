export interface SwapPayload {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
}

export async function swapCurrencies(payload: SwapPayload): Promise<void> {
  // Simulate network latency for the swap transaction
  const delay = Math.floor(Math.random() * 2000) + 1000; // 1–3 seconds
  await new Promise((resolve) => setTimeout(resolve, delay));
  console.log("Swap executed:", payload);
}
