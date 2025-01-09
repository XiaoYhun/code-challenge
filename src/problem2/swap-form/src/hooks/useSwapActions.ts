import { useCallback, useState } from "react";
import { sleep } from "../utils";
import { Token } from "../constants";
import useTokenPrices from "./useTokenPrices";
import useTokenBalances from "./useTokenBalances";

export default function useSwapActions() {
  const { data: tokenPrices } = useTokenPrices();
  const { updateTokenBalanceAfterSwapped } = useTokenBalances();
  const [isLoading, setIsLoading] = useState(false);
  const [swapState, setSwapState] = useState<"initial" | "loading" | "success">("initial");

  const calculateAmountOutOnAmountIn = useCallback(
    async (tokenIn: Token, tokenOut: Token, amountIn: string) => {
      setIsLoading(true);
      await sleep(1000);
      const tokenInPrice = tokenPrices?.find((price) => price.currency === tokenIn.symbol)?.price;
      const tokenOutPrice = tokenPrices?.find((price) => price.currency === tokenOut.symbol)?.price;
      setIsLoading(false);
      if (!tokenInPrice || !tokenOutPrice) {
        return "0";
      }
      return ((parseFloat(amountIn) * tokenInPrice) / tokenOutPrice).toFixed(18);
    },
    [tokenPrices, isLoading]
  );
  // const calculateAmountInOnAmountOut = useCallback(
  //   async (tokenOut: Token, tokenIn: Token, amountOut: string) => {
  //     setIsLoading(true);
  //     await sleep(1000);
  //     const tokenInPrice = tokenPrices?.find((price) => price.currency === tokenIn.symbol)?.price;
  //     const tokenOutPrice = tokenPrices?.find((price) => price.currency === tokenOut.symbol)?.price;
  //     setIsLoading(false);
  //     if (!tokenInPrice || !tokenOutPrice) {
  //       return "0";
  //     }
  //     return ((parseFloat(amountOut) * tokenOutPrice) / tokenInPrice).toFixed(18);
  //   },
  //   [tokenPrices, isLoading]
  // );
  const executeSwap = useCallback(async (tokenIn: Token, tokenOut: Token, amountIn: string, amountOut: string) => {
    setIsLoading(true);
    await sleep(3000);
    updateTokenBalanceAfterSwapped(tokenIn, tokenOut, amountIn, amountOut);
    setIsLoading(false);
  }, []);

  return {
    calculateAmountOutOnAmountIn,
    isLoading,
    executeSwap,
    swapState,
    setSwapState,
  };
}
