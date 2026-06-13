import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../constants/validation.constants";

export interface SwapFormValues {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
}

export function buildValidationSchema(priceMap: Map<string, number>) {
  return Yup.object<SwapFormValues>({
    fromCurrency: Yup.string()
      .required(VALIDATION_MESSAGES.FROM_CURRENCY_REQUIRED)
      .test("supported-from", function (value) {
        if (!value) return true;
        if (!priceMap.has(value)) {
          return this.createError({
            message: VALIDATION_MESSAGES.UNSUPPORTED_TOKEN(value),
          });
        }
        return true;
      }),

    toCurrency: Yup.string()
      .required(VALIDATION_MESSAGES.TO_CURRENCY_REQUIRED)
      .test(
        "different",
        VALIDATION_MESSAGES.CURRENCIES_MUST_DIFFER,
        function (value) {
          return value !== this.parent.fromCurrency;
        }
      )
      .test("supported-to", function (value) {
        if (!value) return true;
        if (!priceMap.has(value)) {
          return this.createError({
            message: VALIDATION_MESSAGES.UNSUPPORTED_TOKEN(value),
          });
        }
        return true;
      }),

    fromAmount: Yup.string()
      .required(VALIDATION_MESSAGES.AMOUNT_REQUIRED)
      .test("is-number", VALIDATION_MESSAGES.AMOUNT_NOT_A_NUMBER, (value) => {
        return value !== undefined && !isNaN(Number(value));
      })
      .test("is-positive", VALIDATION_MESSAGES.AMOUNT_MUST_BE_POSITIVE, (value) => {
        return value !== undefined && Number(value) > 0;
      })
      .test("not-too-large", VALIDATION_MESSAGES.AMOUNT_TOO_LARGE, (value) => {
        return value !== undefined && Number(value) <= 1_000_000_000;
      }),
  });
}
