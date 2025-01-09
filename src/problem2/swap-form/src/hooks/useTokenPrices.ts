import useSWR from "swr";

export interface ITokenPrice {
  currency: string;
  date: string;
  price: number;
}
export default function useTokenPrices() {
  const { data, isLoading } = useSWR<Array<ITokenPrice>>("token-prices", async () => {
    const response = await fetch("https://interview.switcheo.com/prices.json");
    const data = await response.json();
    return data;
  });

  return { data, isLoading };
}
