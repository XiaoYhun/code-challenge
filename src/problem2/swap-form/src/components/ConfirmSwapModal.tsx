import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import useSwapFormState from "../hooks/useSwapFormState";
import { ArrowDown } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import useSwapActions from "../hooks/useSwapActions";

export default function ConfirmSwapModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { tokenIn, tokenOut, amountIn, amountOut } = useSwapFormState();

  const { executeSwap, swapState, setSwapState } = useSwapActions();

  const handleClose = () => {
    onClose();
    setSwapState("initial");
  };

  return (
    <Modal
      isOpen={isOpen}
      className="w-[300px]"
      backdrop="blur"
      onClose={handleClose}
      classNames={{ base: "overflow-hidden" }}
    >
      <ModalContent>
        <ModalHeader className="flex justify-center pb-2">
          {swapState === "initial" ? "Confirm Swap" : swapState === "loading" ? "Swapping" : "Swap Succeeded!"}
        </ModalHeader>
        <ModalBody>
          <div className="h-[100px]">
            {swapState === "initial" && (
              <div className="flex flex-col gap-3 pb-3 flex-1">
                <div className="flex justify-between gap-3">
                  <div className="flex gap-2 ">
                    <img className="h-6 w-6" src={tokenIn?.iconUrl} />
                    <div className="overflow-hidden text-ellipsis">{amountIn}</div>
                  </div>
                  <div>{tokenIn?.symbol}</div>
                </div>
                <div className="pl-0.5 text-neutral-500">
                  <ArrowDown size={20} />
                </div>
                <div className="flex justify-between  gap-3 ">
                  <div className="flex gap-2 overflow-hidden text-ellipsis">
                    <img className="h-6 w-6" src={tokenOut?.iconUrl} />
                    <div className="overflow-hidden text-ellipsis">{amountOut}</div>
                  </div>
                  <div>{tokenOut?.symbol}</div>
                </div>
              </div>
            )}
            {swapState === "loading" && <DotLottieReact src="/Animation - 1736330793045.lottie" loop autoplay />}
            {swapState === "success" && <DotLottieReact src="/Animation - 1736330863297.lottie" autoplay />}
          </div>
        </ModalBody>
        <ModalFooter className="bg-default-100/70 flex flex-col gap-3 px-4">
          <div className="text-neutral-300 text-xs">
            Are you sure you want to swap {amountIn} {tokenIn?.symbol} for {amountOut} {tokenOut?.symbol}?
          </div>
          <div className="flex gap-3">
            <Button className="flex-1" onPress={handleClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              className="flex-1"
              onPress={() => {
                if (!tokenIn || !tokenOut || !amountIn || !amountOut) return;
                setSwapState("loading");
                executeSwap(tokenIn, tokenOut, amountIn, amountOut).then(() => {
                  setSwapState("success");
                });
              }}
              isDisabled={swapState !== "initial"}
            >
              Confirm Swap
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
