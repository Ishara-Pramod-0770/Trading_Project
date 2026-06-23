export type NewsCategory = "Bitcoin" | "Altcoins" | "DeFi" | "Market Updates";

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  category: NewsCategory;
}

const CURATED: NewsItem[] = [
  {
    id: "c1",
    title: "Understanding Bitcoin halving cycles and their historical impact on price",
    url: "https://www.binance.com/en/square",
    source: "CryptoPulse Digest",
    publishedAt: new Date().toISOString(),
    category: "Bitcoin",
  },
  {
    id: "c2",
    title: "Ethereum staking yields and what they mean for long-term holders",
    url: "https://www.binance.com/en/square",
    source: "CryptoPulse Digest",
    publishedAt: new Date().toISOString(),
    category: "Altcoins",
  },
  {
    id: "c3",
    title: "A beginner's guide to decentralized exchanges and liquidity pools",
    url: "https://www.binance.com/en/square",
    source: "CryptoPulse Digest",
    publishedAt: new Date().toISOString(),
    category: "DeFi",
  },
  {
    id: "c4",
    title: "How to read market structure shifts across multiple timeframes",
    url: "https://www.binance.com/en/square",
    source: "CryptoPulse Digest",
    publishedAt: new Date().toISOString(),
    category: "Market Updates",
  },
  {
    id: "c5",
    title: "Solana's ecosystem growth: what traders should watch",
    url: "https://www.binance.com/en/square",
    source: "CryptoPulse Digest",
    publishedAt: new Date().toISOString(),
    category: "Altcoins",
  },
  {
    id: "c6",
    title: "Risk management 101: position sizing and the 1% rule",
    url: "https://www.binance.com/en/square",
    source: "CryptoPulse Digest",
    publishedAt: new Date().toISOString(),
    category: "Market Updates",
  },
];

interface CryptoPanicPost {
  title: string;
  url: string;
  published_at: string;
  source?: { title: string };
  currencies?: { code: string }[];
}

function categorize(post: CryptoPanicPost): NewsCategory {
  const codes = (post.currencies ?? []).map((c) => c.code);
  if (codes.includes("BTC")) return "Bitcoin";
  if (/defi|uniswap|aave|curve|swap/i.test(post.title)) return "DeFi";
  if (codes.length > 0) return "Altcoins";
  return "Market Updates";
}

export async function getNews(): Promise<NewsItem[]> {
  const token = process.env.CRYPTOPANIC_TOKEN;
  if (!token) return CURATED;
  try {
    const res = await fetch(
      `https://cryptopanic.com/api/v1/posts/?auth_token=${token}&public=true&kind=news`,
      { next: { revalidate: 600 } },
    );
    if (!res.ok) return CURATED;
    const data = (await res.json()) as { results: CryptoPanicPost[] };
    return data.results.slice(0, 40).map((p, i) => ({
      id: `cp-${i}`,
      title: p.title,
      url: p.url,
      source: p.source?.title ?? "CryptoPanic",
      publishedAt: p.published_at,
      category: categorize(p),
    }));
  } catch {
    return CURATED;
  }
}
