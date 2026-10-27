import { createFileRoute } from "@tanstack/react-router";
import { AddressLookup } from "@/components/address-lookup";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/analyze/")({
  head: () => ({
    meta: [
      { title: "Token Analyzer — ChainSentry" },
      { name: "description", content: "Look up any EVM token's live pairs, liquidity and price data." },
      { property: "og:title", content: "Token Analyzer — ChainSentry" },
      { property: "og:description", content: "Look up any EVM token's live pairs, liquidity and price data." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageHeader crumbs={["Token Analyzer"]} title="Token Analyzer" subtitle="Choose a network and paste a token contract address." />
      <AddressLookup />
    </div>
  ),
});
