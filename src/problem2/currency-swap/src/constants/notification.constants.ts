export const NOTIFICATION_MESSAGES = {
  SWAP_SUCCESS: (
    fromAmount: string,
    fromCurrency: string,
    toAmount: string,
    toCurrency: string
  ) => `Swapped ${fromAmount} ${fromCurrency} → ${toAmount} ${toCurrency}`,
  UNSUPPORTED_TOKEN_ERROR: (name: string) => `"${name}" is not a supported token`,
  PRICES_LOAD_ERROR: "Failed to load token prices. Please refresh.",
} as const;
