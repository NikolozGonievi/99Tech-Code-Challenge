import { useMemo } from "react";
import { Formik, Form } from "formik";
import {
  Alert,
  Box,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { AmountInput } from "../../atoms/AmountInput";
import { SwapDirectionButton } from "../../atoms/SwapDirectionButton";
import { SubmitButton } from "../../atoms/SubmitButton";
import { CurrencyAutocomplete } from "../../molecules/CurrencyAutocomplete";
import { useGetPrices } from "../../api/getPrices";
import { useSwapCurrencies } from "../../api/swapCurrencies";
import { FORM_STRINGS } from "../../constants/form.constants";
import { NOTIFICATION_MESSAGES } from "../../constants/notification.constants";
import { buildValidationSchema, type SwapFormValues } from "./validation";

const INITIAL_VALUES: SwapFormValues = {
  fromCurrency: "",
  toCurrency: "",
  fromAmount: "",
};

export function SwapCurrenciesForm() {
  const { enqueueSnackbar } = useSnackbar();
  const {
    data: prices = [],
    isLoading: pricesLoading,
    isError: pricesError,
  } = useGetPrices();
  const { mutateAsync: executeSwap } = useSwapCurrencies();

  const priceMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of prices) map.set(p.currency, p.price);
    return map;
  }, [prices]);

  const currencyOptions = useMemo(
    () => prices.map((p) => p.currency),
    [prices]
  );

  const validationSchema = useMemo(
    () => buildValidationSchema(priceMap),
    [priceMap]
  );

  return (
    <>
      {pricesError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {NOTIFICATION_MESSAGES.PRICES_LOAD_ERROR}
        </Alert>
      )}

      <Formik
        initialValues={INITIAL_VALUES}
        validationSchema={validationSchema}
        onSubmit={async (values, helpers) => {
          const fromPrice = priceMap.get(values.fromCurrency)!;
          const toPrice = priceMap.get(values.toCurrency)!;
          const toAmount = (Number(values.fromAmount) * fromPrice) / toPrice;

          await executeSwap({
            fromCurrency: values.fromCurrency,
            toCurrency: values.toCurrency,
            fromAmount: Number(values.fromAmount),
            toAmount,
          });

          enqueueSnackbar(
            NOTIFICATION_MESSAGES.SWAP_SUCCESS(
              values.fromAmount,
              values.fromCurrency,
              toAmount.toFixed(6),
              values.toCurrency
            ),
            { variant: "success" }
          );
          helpers.resetForm();
        }}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          handleChange,
          handleBlur,
          setFieldValue,
          setFieldTouched,
          setValues,
        }) => {
          const fromPrice = priceMap.get(values.fromCurrency);
          const toPrice = priceMap.get(values.toCurrency);
          const fromAmountNum = Number(values.fromAmount);

          const toAmount =
            fromPrice && toPrice && fromAmountNum > 0
              ? (fromAmountNum * fromPrice) / toPrice
              : null;

          const exchangeRate =
            fromPrice && toPrice ? fromPrice / toPrice : null;

          const handleSwapDirections = () => {
            setValues({
              ...values,
              fromCurrency: values.toCurrency,
              toCurrency: values.fromCurrency,
            });
          };

          return (
            <Form noValidate>
              {/* From Section */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "action.hover",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                  }}
                >
                  {FORM_STRINGS.FROM_SECTION_LABEL}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ mt: 1.5, alignItems: "flex-start" }}
                >
                  <AmountInput
                    name="fromAmount"
                    value={values.fromAmount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fromAmount && Boolean(errors.fromAmount)}
                    helperText={touched.fromAmount && errors.fromAmount}
                    disabled={isSubmitting}
                  />
                  <Box sx={{ width: 180, flexShrink: 0 }}>
                    <CurrencyAutocomplete
                      label={FORM_STRINGS.FROM_CURRENCY_LABEL}
                      options={currencyOptions}
                      value={values.fromCurrency}
                      loading={pricesLoading}
                      priceMap={priceMap}
                      error={touched.fromCurrency && Boolean(errors.fromCurrency)}
                      helperText={touched.fromCurrency && errors.fromCurrency}
                      disabled={isSubmitting}
                      onChange={(v) => setFieldValue("fromCurrency", v)}
                      onBlur={() => setFieldTouched("fromCurrency", true)}
                    />
                  </Box>
                </Stack>

                {fromPrice && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    ≈ $
                    {(fromAmountNum * fromPrice).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    {FORM_STRINGS.USD_SUFFIX}
                  </Typography>
                )}
              </Box>

              {/* Swap direction button */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 1,
                }}
              >
                <SwapDirectionButton
                  onClick={handleSwapDirections}
                  disabled={isSubmitting}
                />
              </Box>

              {/* To Section */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "action.hover",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                  }}
                >
                  {FORM_STRINGS.TO_SECTION_LABEL}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ mt: 1.5, alignItems: "flex-start" }}
                >
                  {pricesLoading ? (
                    <Skeleton variant="rounded" width="100%" height={56} />
                  ) : (
                    <Box
                      sx={{
                        flex: 1,
                        minHeight: 56,
                        display: "flex",
                        alignItems: "center",
                        px: 2,
                        borderRadius: "12px",
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: toAmount ? "primary.main" : "divider",
                        transition: "border-color 0.2s ease",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "1.2rem",
                          fontWeight: 700,
                          color: toAmount ? "primary.main" : "text.disabled",
                        }}
                      >
                        {toAmount != null ? toAmount.toFixed(6) : "0.000000"}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ width: 180, flexShrink: 0 }}>
                    <CurrencyAutocomplete
                      label={FORM_STRINGS.TO_CURRENCY_LABEL}
                      options={currencyOptions}
                      value={values.toCurrency}
                      loading={pricesLoading}
                      priceMap={priceMap}
                      error={touched.toCurrency && Boolean(errors.toCurrency)}
                      helperText={touched.toCurrency && errors.toCurrency}
                      disabled={isSubmitting}
                      onChange={(v) => setFieldValue("toCurrency", v)}
                      onBlur={() => setFieldTouched("toCurrency", true)}
                    />
                  </Box>
                </Stack>

                {toPrice && toAmount != null && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    ≈ $
                    {(toAmount * toPrice).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    {FORM_STRINGS.USD_SUFFIX}
                  </Typography>
                )}
              </Box>

              {/* Exchange rate */}
              {exchangeRate && values.fromCurrency && values.toCurrency && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {FORM_STRINGS.EXCHANGE_RATE_LABEL}
                    </Typography>
                    <Chip
                      size="small"
                      label={`1 ${values.fromCurrency} = ${exchangeRate.toFixed(6)} ${values.toCurrency}`}
                      sx={{
                        bgcolor: "action.hover",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </>
              )}

              <SubmitButton isSubmitting={isSubmitting} disabled={pricesLoading} />

              {isSubmitting && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", textAlign: "center", mt: 1 }}
                >
                  {FORM_STRINGS.SUBMIT_PROCESSING_HINT}
                </Typography>
              )}
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
