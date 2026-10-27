import { describe, expect, it } from "vitest";
import { getChain, isEvmAddress } from "@/lib/chains";
import { formatUsd, formatPct } from "@/lib/format";

describe("chain mapping", () => {
  it("maps BNB Smart Chain to DexScreener 'bsc' and chain id 56", () => {
    expect(getChain("bsc")?.chainId).toBe(56);
  });
  it("maps Avalanche C-Chain to chain id 43114", () => {
    expect(getChain("avalanche")?.chainId).toBe(43114);
  });
});

describe("address validation", () => {
  it("accepts a 40-hex address", () => {
    expect(isEvmAddress("0xdAC17F958D2ee523a2206206994597C13D831ec7")).toBe(true);
  });
  it("rejects malformed addresses", () => {
    expect(isEvmAddress("0x123")).toBe(false);
  });
});

describe("formatting", () => {
  it("shows N/A for missing values instead of inventing one", () => {
    expect(formatUsd(undefined)).toBe("N/A");
    expect(formatPct(undefined)).toBe("N/A");
  });
});
