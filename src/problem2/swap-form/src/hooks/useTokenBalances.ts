import { create } from "zustand";
import { Token } from "../constants";

type TokenBalancesState = {
  balances: Record<string, number>;
  updateTokenBalanceAfterSwapped: (tokenIn: Token, tokenOut: Token, amountIn: string, amountOut: string) => void;
};

const useTokenBalances = create<TokenBalancesState>((set) => ({
  balances: {
    ETH: 10,
    USDC: 999,
  },
  updateTokenBalanceAfterSwapped: (tokenIn: Token, tokenOut: Token, amountIn: string, amountOut: string) =>
    set((state) => {
      const newBalances = { ...state.balances };
      newBalances[tokenIn.symbol] -= parseFloat(amountIn);
      newBalances[tokenOut.symbol] = (newBalances[tokenOut.symbol] || 0) + parseFloat(amountOut);
      return { balances: newBalances };
    }),
}));

export default useTokenBalances;
