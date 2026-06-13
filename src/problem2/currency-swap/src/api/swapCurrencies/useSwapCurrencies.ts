import { useMutation } from "@tanstack/react-query";
import { swapCurrencies } from "./swapCurrencies";

export function useSwapCurrencies() {
  return useMutation({
    mutationFn: swapCurrencies,
  });
}
