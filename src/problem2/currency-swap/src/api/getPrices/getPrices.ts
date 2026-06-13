import axios from "axios";
import { API_URLS } from "../../constants/api.constants";
import type { TokenPrice } from "./useGetPrices";

export async function getPrices(): Promise<TokenPrice[]> {
  const { data } = await axios.get<TokenPrice[]>(API_URLS.PRICES);
  return data;
}
