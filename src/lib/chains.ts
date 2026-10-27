export type Chain = {
  slug: string; // DexScreener chain identifier
  chainId: number; // EVM chain id
  name: string;
  explorer: string;
};

export const CHAINS: Chain[] = [
  { slug: "ethereum", chainId: 1, name: "Ethereum", explorer: "https://etherscan.io" },
  { slug: "bsc", chainId: 56, name: "BNB Smart Chain", explorer: "https://bscscan.com" },
  { slug: "base", chainId: 8453, name: "Base", explorer: "https://basescan.org" },
  { slug: "arbitrum", chainId: 42161, name: "Arbitrum One", explorer: "https://arbiscan.io" },
  { slug: "optimism", chainId: 10, name: "Optimism", explorer: "https://optimistic.etherscan.io" },
  { slug: "polygon", chainId: 137, name: "Polygon PoS", explorer: "https://polygonscan.com" },
  { slug: "avalanche", chainId: 43114, name: "Avalanche C-Chain", explorer: "https://snowtrace.io" },
];

export function getChain(slug: string): Chain | undefined {
  return CHAINS.find((c) => c.slug === slug);
}

export function isEvmAddress(value: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(value.trim());
}

export function normalizeAddress(value: string): string {
  return value.trim().toLowerCase();
}
