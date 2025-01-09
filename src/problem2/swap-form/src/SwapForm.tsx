import { Button } from "@nextui-org/react";
import CurrencyInput from "./CurrencyInput";
import useSwapFormState from "./hooks/useSwapFormState";
import useSwapActions from "./hooks/useSwapActions";
import { useEffect, useMemo, useState } from "react";
import useTokenBalances from "./hooks/useTokenBalances";
import ConfirmSwapModal from "./components/ConfirmSwapModal";
import { useDebounce } from "use-debounce";

export default function SwapForm() {
  const [isOpen, setIsOpen] = useState(false);

  const { swapTokens, tokenIn, tokenOut, amountIn, amountOut, setAmountIn, setAmountOut, setTokenIn, setTokenOut } =
    useSwapFormState();
  const { calculateAmountOutOnAmountIn, isLoading } = useSwapActions();
  const { balances } = useTokenBalances();
  const tokenInBalance = useMemo(() => (tokenIn?.symbol ? balances[tokenIn?.symbol] || 0 : 0), [balances, tokenIn]);

  const debouncedAmountIn = useDebounce(amountIn, 500)[0];

  const handleSwapClick = () => {
    if (!tokenIn || !tokenOut || !!errors || !amountIn || !amountOut) return;
    setIsOpen(true);
  };

  useEffect(() => {
    if (!tokenIn || !tokenOut || !debouncedAmountIn || debouncedAmountIn === "0" || isLoading) return;
    calculateAmountOutOnAmountIn(tokenIn, tokenOut, debouncedAmountIn).then(setAmountOut);
  }, [debouncedAmountIn, tokenIn, tokenOut]);

  const errors = useMemo(() => {
    if (!tokenIn) return "Please select token to swap from";
    if (!tokenOut) return "Please select token to swap to";
    if (!amountIn || amountIn === "0") return "Please enter amount to swap";
    if (parseFloat(amountIn) > tokenInBalance) return "Insufficient " + tokenIn.symbol + " balance";
    return "";
  }, [tokenIn, tokenOut, amountIn, amountOut, tokenInBalance]);

  return (
    <div className="flex flex-col gap-1 w-[400px] bg-black p-2 rounded-t-[26px] rounded-b-[20px] shadow-2xl">
      <CurrencyInput
        title="From"
        token={tokenIn}
        value={amountIn}
        onValueChange={setAmountIn}
        onTokenChange={setTokenIn}
      />
      <div className="relative">
        <Button
          onPress={() => {
            swapTokens();
          }}
          className="bg-neutral-900 text-white min-w-0 w-[40px] rounded-full border-neutral-700 border-2 p-1.5 absolute left-1/2 -translate-x-1/2 -top-5 cursor-pointer hover:bg-neutral-800 hover:border-neutral-400 z-10"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" width="20" height="20">
            <path
              d="M12 5V19"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M19 12L12 19L5 12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </Button>
        <CurrencyInput
          title="To"
          token={tokenOut}
          value={amountOut}
          onValueChange={setAmountOut}
          onTokenChange={setTokenOut}
          isLoading={isLoading}
          isDisabled={true}
        />
      </div>

      <Button
        color="primary"
        className="font-bold mt-1"
        isLoading={isLoading}
        isDisabled={!!errors}
        onPress={handleSwapClick}
      >
        {errors || "Swap"}
      </Button>
      <ConfirmSwapModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
