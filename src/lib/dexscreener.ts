import { queryOptions } from "@tanstack/react-query";

export type DexPair = {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  labels?: string[];
  baseToken: { address: string; name: string; symbol: string };
  quoteToken: { address: string; name: string; symbol: string };
  priceNative?: string;
  priceUsd?: string;
  txns?: Record<string, { buys: number; sells: number }>;
  volume?: { h24?: number; h6?: number; h1?: number; m5?: number };
  priceChange?: { m5?: number; h1?: number; h6?: number; h24?: number };
  liquidity?: { usd?: number; base?: number; quote?: number };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
  info?: { imageUrl?: string; websites?: { url: string; label?: string }[]; socials?: { url: string; type: string }[] };
};

export class DexError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}

export async function fetchTokenPairs(chain: string, address: string): Promise<DexPair[]> {
  let res: Response;
  try {
    res = await fetch(`https://api.dexscreener.com/token-pairs/v1/${chain}/${address}`);
  } catch {
    throw new DexError("DexScreener could not be reached. Check your connection and try again.");
  }
  if (res.status === 429) throw new DexError("DexScreener rate limit reached. Wait a moment and retry.", 429);
  if (!res.ok) throw new DexError(`DexScreener returned an error (${res.status}).`, res.status);
  const data = (await res.json()) as DexPair[] | null;
  const pairs = Array.isArray(data) ? data : [];
  return pairs.sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0));
}

export const tokenPairsQuery = (chain: string, address: string) =>
  queryOptions({
    queryKey: ["dex", "token-pairs", chain, address],
    queryFn: () => fetchTokenPairs(chain, address),
    staleTime: 30_000,
    retry: (count, err) => !(err instanceof DexError && err.status === 429) && count < 2,
  });
