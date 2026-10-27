import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { CHAINS } from "@/lib/chains";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — ChainSentry" },
      { name: "description", content: "How token analysis, submissions and reviews work on ChainSentry." },
      { property: "og:title", content: "Documentation — ChainSentry" },
      { property: "og:description", content: "How token analysis, submissions and reviews work." },
    ],
  }),
  component: Docs,
});

const SECTIONS = [
  { h: "Token analysis", p: "Market data comes live from the public DexScreener API. Missing fields show as N/A — values are never estimated. Market data is not a security audit." },
  { h: "Submitting a contract", p: "Provide the network, contract address and full Solidity source. Each submission gets a unique reference and a status timeline you can follow." },
  { h: "Automated vs manual review", p: "Automated static checks flag patterns for review; they are not a professional manual audit. A completed audit is only shown when a real report exists." },
  { h: "Safety", p: "We will never ask for your seed phrase or private keys. Always verify addresses and networks before sending any funds — blockchain transfers are irreversible." },
];

function Docs() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader crumbs={["Documentation"]} title="Documentation" />
      <div className="space-y-4">
        {SECTIONS.map((s) => (
          <section key={s.h} className="rounded-lg border bg-card p-5">
            <h2 className="font-medium">{s.h}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
          </section>
        ))}
        <section className="rounded-lg border bg-card p-5">
          <h2 className="font-medium">Supported networks</h2>
          <table className="mt-3 w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr className="border-b"><th className="py-2 font-normal">Network</th><th className="font-normal">Chain ID</th><th className="font-normal">DexScreener ID</th></tr>
            </thead>
            <tbody className="font-mono text-xs">
              {CHAINS.map((c) => (
                <tr key={c.slug} className="border-b last:border-0"><td className="py-2 font-sans text-sm">{c.name}</td><td>{c.chainId}</td><td>{c.slug}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
