export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatBalance(balance?: number) {
  if (!balance) {
    return "";
  }
  return balance.toLocaleString(undefined, { maximumFractionDigits: 4, minimumFractionDigits: 0 });
}

export function formatPrice(price: number) {
  if (!price) {
    return "";
  }
  return price.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 });
}
