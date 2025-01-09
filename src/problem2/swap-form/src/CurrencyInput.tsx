import { Button, Input, Skeleton } from "@nextui-org/react";
import SelectTokenModal from "./components/SelectTokenModal";
import { useMemo, useRef, useState } from "react";
import { Token } from "./constants";
import useTokenBalances from "./hooks/useTokenBalances";
import useTokenPrices from "./hooks/useTokenPrices";
import { Wallet } from "lucide-react";

export default function CurrencyInput({
  token,
  title,
  value,
  isLoading,
  isDisabled,
  onValueChange,
  onTokenChange,
}: {
  title: string;
  token?: Token;
  value?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  onValueChange?: (value: string) => void;
  onTokenChange?: (token: Token) => void;
}) {
  const [isFocusing, setIsFocusing] = useState(false);
  const [isOpenSelectTokenModal, setIsOpenSelectTokenModal] = useState(false);
  const { balances } = useTokenBalances();
  const { data: tokenPrices, isLoading: tokenPricesLoading } = useTokenPrices();
  const tokenBalance = useMemo(() => (token?.symbol ? balances[token?.symbol] : 0), [balances, token]);
  const tokenPrice = useMemo(
    () => tokenPrices?.find((price) => price.currency === token?.symbol)?.price || 0,
    [tokenPrices, token]
  );

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`relative rounded-[20px] border  flex items-center p-3 py-4 transition-all  bg-gradient-to-r from-neutral-800 to-neutral-950  ${
        isFocusing ? "border-neutral-500" : "border-neutral-800"
      }`}
      style={{
        backgroundSize: "200% 100%",
        backgroundPosition: !isFocusing ? "0 100%" : "100% 100%",
      }}
      onClick={() => {
        inputRef.current?.focus();
      }}
    >
      <div className="flex-1 flex flex-col gap-3">
        <div className="font-extrabold text-sm text-neutral-400">{title}</div>
        <div>
          {isLoading ? (
            <Skeleton className="w-[250px] h-[40px] opacity-90 rounded-full" />
          ) : (
            <Input
              ref={inputRef}
              value={value ? value.toString() : ""}
              onValueChange={(value: string) => {
                const v = value.replace(/^0+/, "");
                if (/^\d*\.?\d*$/.test(v) || v === "") {
                  onValueChange?.(v);
                }
              }}
              variant="flat"
              classNames={{ inputWrapper: "!bg-transparent shadow-none pl-1", input: "text-2xl font-black pl-0" }}
              onFocus={() => setIsFocusing(true)}
              onBlur={() => setIsFocusing(false)}
              isDisabled={isDisabled}
            />
          )}
        </div>
        {tokenPricesLoading || isLoading ? (
          <div>
            <Skeleton className="h-5 w-[70px] rounded-full" />
          </div>
        ) : (
          <div className="text-sm text-neutral-400">{value ? `$${(+value * tokenPrice).toFixed(2)}` : "-"}</div>
        )}
      </div>
      <div className="">
        {token ? (
          <Button
            className="rounded-full !bg-neutral-900 px-2 py-1 h-fit font-bold border-neutral-700 shadow-md border-1"
            onPress={() => setIsOpenSelectTokenModal(true)}
          >
            <img className="rounded-full w-6 h-6" src={token.iconUrl}></img> {token.symbol}
          </Button>
        ) : (
          <Button
            radius="full"
            size="sm"
            color="primary"
            className="font-bold"
            onPress={() => setIsOpenSelectTokenModal(true)}
          >
            Select Token
          </Button>
        )}
      </div>
      <div
        className="absolute right-4 top-4 text-xs text-neutral-400 flex items-center gap-2 cursor-pointer hover:text-white"
        onClick={() => {
          !isDisabled && onValueChange?.(tokenBalance.toString());
        }}
      >
        <Wallet size={14} />
        {tokenBalance || 0}
      </div>
      <SelectTokenModal
        isOpen={isOpenSelectTokenModal}
        onClose={() => setIsOpenSelectTokenModal(false)}
        onSelect={onTokenChange}
      />
    </div>
  );
}
