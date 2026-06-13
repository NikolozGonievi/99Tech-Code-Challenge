import { useQuery } from "@tanstack/react-query";
import { getPrices } from "./getPrices";

export interface TokenPrice {
  currency: string;
  date: string;
  price: number;
}

export function useGetPrices() {
  return useQuery({
    queryKey: ["prices"],
    queryFn: getPrices,
    // The API returns duplicate entries per currency with different dates.
    // Deduplicate by keeping only the most recent record per currency, then sort alphabetically.
    select: (data) => {
      const map = new Map<string, TokenPrice>();
      for (const item of data) {
        const existing = map.get(item.currency);
        if (!existing || item.date > existing.date) {
          map.set(item.currency, item);
        }
      }
      return Array.from(map.values()).sort((a, b) =>
        a.currency.localeCompare(b.currency)
      );
    },
  });
}
