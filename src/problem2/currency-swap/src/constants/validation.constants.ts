export const VALIDATION_MESSAGES = {
  FROM_CURRENCY_REQUIRED: "Please select a currency to send",
  TO_CURRENCY_REQUIRED: "Please select a currency to receive",
  CURRENCIES_MUST_DIFFER: "Must be different from the sending currency",
  UNSUPPORTED_TOKEN: (name: string) => `"${name}" is not a supported token`,
  AMOUNT_REQUIRED: "Amount is required",
  AMOUNT_NOT_A_NUMBER: "Amount must be a number",
  AMOUNT_MUST_BE_POSITIVE: "Amount must be greater than 0",
  AMOUNT_TOO_LARGE: "Amount is too large",
} as const;
