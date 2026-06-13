import { useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { AmountInput } from "../../../atoms/AmountInput";
import { CurrencyAutocomplete } from "../../../molecules/CurrencyAutocomplete";
import { SwapDirectionButton } from "../../../atoms/SwapDirectionButton";
import { useGetPrices } from "../../../api/getPrices";
import { useSwapCurrencies } from "../../../api/swapCurrencies";

interface FormValues {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
}

function buildValidationSchema(priceMap: Map<string, number>) {
  return Yup.object({
    fromCurrency: Yup.string()
      .required("Please select a currency to send")
      .test("supported", function (value) {
        if (!value) return true;
        if (!priceMap.has(value)) {
          return this.createError({
            message: `"${value}" is not a supported token`,
          });
        }
        return true;
      }),
    toCurrency: Yup.string()
      .required("Please select a currency to receive")
      .test(
        "different",
        "Must be different from the sending currency",
        function (value) {
          return value !== this.parent.fromCurrency;
        },
      )
      .test("supported", function (value) {
        if (!value) return true;
        if (!priceMap.has(value)) {
          return this.createError({
            message: `"${value}" is not a supported token`,
          });
        }
        return true;
      }),
    fromAmount: Yup.number()
      .typeError("Amount must be a number")
      .required("Amount is required")
      .positive("Amount must be greater than 0")
      .max(1_000_000_000, "Amount is too large"),
  });
}

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
    () => prices.map((p: { currency: string }) => p.currency),
    [prices],
  );

  const validationSchema = useMemo(
    () => buildValidationSchema(priceMap),
    [priceMap],
  );

  const initialValues: FormValues = {
    fromCurrency: "",
    toCurrency: "",
    fromAmount: "",
  };

  return (
    <>
      {pricesError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          Failed to load token prices. Please refresh.
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, helpers) => {
          if (!priceMap.has(values.fromCurrency)) {
            enqueueSnackbar(
              `"${values.fromCurrency}" is not a supported token`,
              { variant: "error" },
            );
            return;
          }
          if (!priceMap.has(values.toCurrency)) {
            enqueueSnackbar(`"${values.toCurrency}" is not a supported token`, {
              variant: "error",
            });
            return;
          }

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
            `Swapped ${values.fromAmount} ${values.fromCurrency} → ${toAmount.toFixed(6)} ${values.toCurrency}`,
            { variant: "success" },
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
            setFieldValue("fromCurrency", values.toCurrency);
            setFieldValue("toCurrency", values.fromCurrency);
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
                  You Send
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
                      label="From"
                      options={currencyOptions}
                      value={values.fromCurrency}
                      loading={pricesLoading}
                      priceMap={priceMap}
                      error={
                        touched.fromCurrency && Boolean(errors.fromCurrency)
                      }
                      helperText={touched.fromCurrency && errors.fromCurrency}
                      disabled={isSubmitting}
                      onChange={(v: string) => setFieldValue("fromCurrency", v)}
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
                    {(fromAmountNum * fromPrice || 0).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    USD
                  </Typography>
                )}
              </Box>

              {/* Swap direction button */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 1,
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
                  You Receive
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
                      label="To"
                      options={currencyOptions}
                      value={values.toCurrency}
                      loading={pricesLoading}
                      priceMap={priceMap}
                      error={touched.toCurrency && Boolean(errors.toCurrency)}
                      helperText={touched.toCurrency && errors.toCurrency}
                      disabled={isSubmitting}
                      onChange={(v: string) => setFieldValue("toCurrency", v)}
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
                    USD
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
                      Exchange Rate
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

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting || pricesLoading}
                sx={{
                  mt: 3,
                  py: 1.8,
                  borderRadius: 3,
                  fontSize: "1rem",
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  background: isSubmitting
                    ? undefined
                    : "linear-gradient(135deg, #aa3bff 0%, #7c22c7 100%)",
                  boxShadow: isSubmitting
                    ? "none"
                    : "0 4px 20px rgba(170,59,255,0.35)",
                  "&:hover:not(:disabled)": {
                    boxShadow: "0 6px 28px rgba(170,59,255,0.5)",
                  },
                  transition: "all 0.2s ease",
                }}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {isSubmitting ? "Processing Swap…" : "Confirm Swap"}
              </Button>

              {isSubmitting && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", textAlign: "center", mt: 1 }}
                >
                  Please wait while your transaction is being processed
                </Typography>
              )}
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
