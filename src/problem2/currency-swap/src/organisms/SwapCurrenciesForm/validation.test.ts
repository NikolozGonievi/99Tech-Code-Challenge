import { buildValidationSchema } from "./validation";
import { VALIDATION_MESSAGES } from "../../constants/validation.constants";

const supportedTokens = ["ETH", "BTC", "USDC", "BNB"];

function makeMap(tokens: string[]): Map<string, number> {
  const map = new Map<string, number>();
  tokens.forEach((t, i) => map.set(t, (i + 1) * 100));
  return map;
}

const priceMap = makeMap(supportedTokens);
const schema = buildValidationSchema(priceMap);

async function getError(field: string, values: object): Promise<string | undefined> {
  try {
    await schema.validateAt(field, values);
    return undefined;
  } catch (err: unknown) {
    return (err as { message: string }).message;
  }
}

describe("buildValidationSchema", () => {
  describe("fromCurrency", () => {
    it("requires a value", async () => {
      const err = await getError("fromCurrency", {
        fromCurrency: "",
        toCurrency: "ETH",
        fromAmount: "10",
      });
      expect(err).toBe(VALIDATION_MESSAGES.FROM_CURRENCY_REQUIRED);
    });

    it("accepts a supported token", async () => {
      const err = await getError("fromCurrency", {
        fromCurrency: "BTC",
        toCurrency: "ETH",
        fromAmount: "10",
      });
      expect(err).toBeUndefined();
    });

    it("rejects an unsupported token", async () => {
      const err = await getError("fromCurrency", {
        fromCurrency: "FAKECOIN",
        toCurrency: "ETH",
        fromAmount: "10",
      });
      expect(err).toBe(VALIDATION_MESSAGES.UNSUPPORTED_TOKEN("FAKECOIN"));
    });
  });

  describe("toCurrency", () => {
    it("requires a value", async () => {
      const err = await getError("toCurrency", {
        fromCurrency: "BTC",
        toCurrency: "",
        fromAmount: "10",
      });
      expect(err).toBe(VALIDATION_MESSAGES.TO_CURRENCY_REQUIRED);
    });

    it("accepts a supported token different from fromCurrency", async () => {
      const err = await getError("toCurrency", {
        fromCurrency: "BTC",
        toCurrency: "ETH",
        fromAmount: "10",
      });
      expect(err).toBeUndefined();
    });

    it("rejects the same currency as fromCurrency", async () => {
      const err = await getError("toCurrency", {
        fromCurrency: "ETH",
        toCurrency: "ETH",
        fromAmount: "10",
      });
      expect(err).toBe(VALIDATION_MESSAGES.CURRENCIES_MUST_DIFFER);
    });

    it("rejects an unsupported token", async () => {
      const err = await getError("toCurrency", {
        fromCurrency: "BTC",
        toCurrency: "FAKECOIN",
        fromAmount: "10",
      });
      expect(err).toBe(VALIDATION_MESSAGES.UNSUPPORTED_TOKEN("FAKECOIN"));
    });
  });

  describe("fromAmount", () => {
    it("requires a value", async () => {
      const err = await getError("fromAmount", {
        fromCurrency: "BTC",
        toCurrency: "ETH",
        fromAmount: "",
      });
      expect(err).toBe(VALIDATION_MESSAGES.AMOUNT_REQUIRED);
    });

    it("rejects non-numeric input", async () => {
      const err = await getError("fromAmount", {
        fromCurrency: "BTC",
        toCurrency: "ETH",
        fromAmount: "abc",
      });
      expect(err).toBe(VALIDATION_MESSAGES.AMOUNT_NOT_A_NUMBER);
    });

    it("rejects zero", async () => {
      const err = await getError("fromAmount", {
        fromCurrency: "BTC",
        toCurrency: "ETH",
        fromAmount: "0",
      });
      expect(err).toBe(VALIDATION_MESSAGES.AMOUNT_MUST_BE_POSITIVE);
    });

    it("rejects negative numbers", async () => {
      const err = await getError("fromAmount", {
        fromCurrency: "BTC",
        toCurrency: "ETH",
        fromAmount: "-5",
      });
      expect(err).toBe(VALIDATION_MESSAGES.AMOUNT_MUST_BE_POSITIVE);
    });

    it("rejects amounts exceeding the maximum", async () => {
      const err = await getError("fromAmount", {
        fromCurrency: "BTC",
        toCurrency: "ETH",
        fromAmount: "2000000000",
      });
      expect(err).toBe(VALIDATION_MESSAGES.AMOUNT_TOO_LARGE);
    });

    it("accepts a valid positive amount", async () => {
      const err = await getError("fromAmount", {
        fromCurrency: "BTC",
        toCurrency: "ETH",
        fromAmount: "1.5",
      });
      expect(err).toBeUndefined();
    });
  });

  describe("full schema validation", () => {
    it("passes for a valid swap", async () => {
      const isValid = await schema.isValid({
        fromCurrency: "BTC",
        toCurrency: "ETH",
        fromAmount: "0.5",
      });
      expect(isValid).toBe(true);
    });

    it("fails when any field is invalid", async () => {
      const isValid = await schema.isValid({
        fromCurrency: "",
        toCurrency: "ETH",
        fromAmount: "10",
      });
      expect(isValid).toBe(false);
    });
  });
});
