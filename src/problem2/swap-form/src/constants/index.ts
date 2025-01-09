export type Token = {
  symbol: string;
  name: string;
  iconUrl?: string;
};

export const SUPPORTED_TOKEN_LIST: Array<Token> = [
  {
    symbol: "ETH",
    name: "Ether",
    iconUrl: "https://raw.githubusercontent.com/Switcheo/token-icons/refs/heads/main/tokens/ETH.svg",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    iconUrl: "https://raw.githubusercontent.com/Switcheo/token-icons/refs/heads/main/tokens/USDT.svg",
  },
  {
    symbol: "BLUR",
    name: "Blur",
    iconUrl: "https://raw.githubusercontent.com/Switcheo/token-icons/refs/heads/main/tokens/BLUR.svg",
  },
  {
    symbol: "GMX",
    name: "GMX",
    iconUrl: "https://raw.githubusercontent.com/Switcheo/token-icons/refs/heads/main/tokens/GMX.svg",
  },
  {
    symbol: "LUNA",
    name: "Terra",
    iconUrl: "https://raw.githubusercontent.com/Switcheo/token-icons/refs/heads/main/tokens/LUNA.svg",
  },

  {
    symbol: "ATOM",
    name: "Cosmos",
    iconUrl: "https://raw.githubusercontent.com/Switcheo/token-icons/refs/heads/main/tokens/ATOM.svg",
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    iconUrl: "https://raw.githubusercontent.com/Switcheo/token-icons/refs/heads/main/tokens/WBTC.svg",
  },
  {
    symbol: "ZIL",
    name: "Ziliqa",
    iconUrl: "https://raw.githubusercontent.com/Switcheo/token-icons/refs/heads/main/tokens/ZIL.svg",
  },
];
