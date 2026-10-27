import { createFileRoute } from "@tanstack/react-router";
import { FileCode2, Network, ScanSearch, ListChecks } from "lucide-react";
import { AddressLookup } from "@/components/address-lookup";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ChainSentry — Smart Contract Intelligence & Liquidity Infrastructure" },
      { name: "description", content: "Analyze EVM tokens, review contract data and submit Solidity source code from one platform." },
      { property: "og:title", content: "ChainSentry — Smart Contract Intelligence" },
      { property: "og:description", content: "Analyze EVM tokens, review contract data and submit Solidity source code." },
    ],
  }),
  component: Index,
});

const FEATURES = [
  { icon: ScanSearch, title: "EVM Token Analysis", text: "Live price, liquidity and pair data across 7 networks." },
  { icon: FileCode2, title: "Solidity Source Submission", text: "Submit contract source for structured review." },
  { icon: Network, title: "Multi-Chain Configuration", text: "Track configuration per supported network." },
  { icon: ListChecks, title: "Audit Progress Tracking", text: "Follow each submission through a clear timeline." },
];

function Index() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-20 sm:pt-28">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border bg-surface px-3 py-1 font-mono text-xs text-cyan">
          ● EVM security & infrastructure
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
          Smart Contract Intelligence &amp; Liquidity Infrastructure
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Analyze EVM tokens, review contract information, submit Solidity source code, and manage
          blockchain security and liquidity configuration requests from one platform.
        </p>
      </div>
      <div className="mt-10">
        <AddressLookup />
      </div>
      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-lg border bg-surface p-4 transition-colors hover:border-primary/50">
            <f.icon className="size-5 text-primary" />
            <h3 className="mt-3 text-sm font-medium">{f.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
