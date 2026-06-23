import type { CoinMeta, Timeframe } from "./types";

// Featured coins shown on the dashboard (per spec)
export const FEATURED_COINS: CoinMeta[] = [
  { symbol: "BTCUSDT", base: "BTC", name: "Bitcoin", color: "#f7931a" },
  { symbol: "ETHUSDT", base: "ETH", name: "Ethereum", color: "#627eea" },
  { symbol: "SOLUSDT", base: "SOL", name: "Solana", color: "#14f195" },
  { symbol: "BNBUSDT", base: "BNB", name: "BNB", color: "#f3ba2f" },
  { symbol: "XRPUSDT", base: "XRP", name: "XRP", color: "#23292f" },
  { symbol: "ADAUSDT", base: "ADA", name: "Cardano", color: "#0033ad" },
];

// A broader universe for the Market page
export const MARKET_COINS: CoinMeta[] = [
  ...FEATURED_COINS,
  { symbol: "DOGEUSDT", base: "DOGE", name: "Dogecoin", color: "#c2a633" },
  { symbol: "AVAXUSDT", base: "AVAX", name: "Avalanche", color: "#e84142" },
  { symbol: "LINKUSDT", base: "LINK", name: "Chainlink", color: "#2a5ada" },
  { symbol: "MATICUSDT", base: "MATIC", name: "Polygon", color: "#8247e5" },
  { symbol: "DOTUSDT", base: "DOT", name: "Polkadot", color: "#e6007a" },
  { symbol: "LTCUSDT", base: "LTC", name: "Litecoin", color: "#345d9d" },
  { symbol: "TRXUSDT", base: "TRX", name: "TRON", color: "#ff060a" },
  { symbol: "ATOMUSDT", base: "ATOM", name: "Cosmos", color: "#2e3148" },
];

export const COIN_BY_SYMBOL: Record<string, CoinMeta> = Object.fromEntries(
  MARKET_COINS.map((c) => [c.symbol, c]),
);

// Approximate circulating supply (in base units). Binance market-data does not
// expose market cap, so we derive it as price * supply. Refresh periodically.
export const CIRCULATING_SUPPLY: Record<string, number> = {
  BTCUSDT: 19_700_000,
  ETHUSDT: 120_400_000,
  SOLUSDT: 470_000_000,
  BNBUSDT: 145_900_000,
  XRPUSDT: 57_000_000_000,
  ADAUSDT: 35_400_000_000,
  DOGEUSDT: 146_000_000_000,
  AVAXUSDT: 408_000_000,
  LINKUSDT: 626_000_000,
  MATICUSDT: 9_900_000_000,
  DOTUSDT: 1_500_000_000,
  LTCUSDT: 75_500_000,
  TRXUSDT: 86_500_000_000,
  ATOMUSDT: 390_000_000,
};

export const TIMEFRAMES: { value: Timeframe; label: string }[] = [
  { value: "1m", label: "1m" },
  { value: "5m", label: "5m" },
  { value: "15m", label: "15m" },
  { value: "1h", label: "1H" },
  { value: "4h", label: "4H" },
  { value: "1d", label: "1D" },
];
