import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ExternalLink, FileCode2, RefreshCw, SearchX, ShieldQuestion } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyButton } from "@/components/copy-button";
import { PageHeader } from "@/components/page-header";
import { getChain, isEvmAddress } from "@/lib/chains";
import { tokenPairsQuery } from "@/lib/dexscreener";
import { formatDate, formatPct, formatUsd, NA, shortAddr } from "@/lib/format";

export const Route = createFileRoute("/analyze/$chainId/$address")({
  beforeLoad: ({ params }) => {
    if (!getChain(params.chainId) || !isEvmAddress(params.address)) throw notFound();
  },
  head: ({ params }) => ({
    meta: [
      { title: `Token ${shortAddr(params.address)} on ${getChain(params.chainId)?.name ?? "EVM"} — ChainSentry` },
      { name: "description", content: "Live DexScreener market data, pairs and contract information for this token." },
      { property: "og:title", content: `Token analysis — ${shortAddr(params.address)}` },
      { property: "og:description", content: "Live market data, pairs and contract information." },
    ],
  }),
  component: AnalyzePage,
});

const SECURITY_CHECKS = [
  "Ownership & privileged permissions",
  "Minting capabilities",
  "Pause / blacklist functions",
  "Trading restrictions",
  "Transfer taxes",
  "Upgradeable proxy patterns",
  "External & low-level calls",
  "Reentrancy risks",
  "Access control patterns",
];

function AnalyzePage() {
  const { chainId, address } = Route.useParams();
  const chain = getChain(chainId)!;
  const q = useQuery(tokenPairsQuery(chainId, address));
  const [selected, setSelected] = useState(0);

  if (q.isPending) return <LoadingState />;

  if (q.isError) {
    return (
      <Shell>
        <Empty icon={AlertTriangle} title="Market data unavailable" text={q.error.message}>
          <Button variant="outline" onClick={() => q.refetch()}>
            <RefreshCw /> Retry
          </Button>
        </Empty>
      </Shell>
    );
  }

  // Pairs where the looked-up token is the base token carry its own price, so list them first.
  const isBase = (p: { baseToken: { address: string } }) => p.baseToken.address.toLowerCase() === address;
  const pairs = [...q.data].sort((a, b) => Number(isBase(b)) - Number(isBase(a)));
  if (pairs.length === 0) {
    return (
      <Shell>
        <Empty
          icon={SearchX}
          title="No trading pairs found"
          text={`DexScreener has no pairs for this address on ${chain.name}. Check the network or address.`}
        >
          <Button variant="outline" asChild>
            <Link to="/analyze" search={{ chain: chainId }}>Try another address</Link>
          </Button>
        </Empty>
      </Shell>
    );
  }

  const pair = pairs[Math.min(selected, pairs.length - 1)] ?? pairs[0]!;
  const token = isBase(pair) ? pair.baseToken : pair.quoteToken;
  const tx24 = pair.txns?.["h24"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <PageHeader
        crumbs={["Token Analyzer", chain.name, token.symbol]}
        title={
          <span className="flex items-center gap-3">
            {pair.info?.imageUrl ? (
              <img src={pair.info.imageUrl} alt="" className="size-9 rounded-full border" />
            ) : (
              <span className="flex size-9 items-center justify-center rounded-full border bg-elevated font-mono text-xs">
                {token.symbol.slice(0, 3)}
              </span>
            )}
            {token.name} <span className="text-muted-foreground">{token.symbol}</span>
          </span>
        }
        subtitle={
          <span className="flex items-center gap-2 font-mono text-xs">
            <span className="rounded border bg-surface px-1.5 py-0.5 font-sans text-cyan">{chain.name}</span>
            {address}
            <CopyButton value={address} label="Contract address copied" />
          </span>
        }
        right={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={pair.url} target="_blank" rel="noreferrer">
                DexScreener <ExternalLink />
              </a>
            </Button>
            <Button size="sm" asChild>
              <Link to="/submit-contract" search={{ chain: chainId, address }}>
                <FileCode2 /> Submit Contract
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Metric label={isBase(pair) ? "Price" : `Price (${pair.baseToken.symbol})`} value={formatUsd(pair.priceUsd)} mono />
        <Metric label="Market cap" value={formatUsd(pair.marketCap)} />
        <Metric label="FDV" value={formatUsd(pair.fdv)} />
        <Metric label="Liquidity" value={formatUsd(pair.liquidity?.usd)} />
        <Metric label="Volume 24h" value={formatUsd(pair.volume?.h24)} />
        <Change label="5m" v={pair.priceChange?.m5} />
        <Change label="1h" v={pair.priceChange?.h1} />
        <Change label="6h / 24h" v={pair.priceChange?.h6} v2={pair.priceChange?.h24} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Section title="Trading pairs" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr className="border-b">
                  <th className="py-2 pr-3 font-normal">Pair</th>
                  <th className="py-2 pr-3 font-normal">DEX</th>
                  <th className="py-2 pr-3 text-right font-normal">Liquidity</th>
                  <th className="py-2 pr-3 text-right font-normal">Vol 24h</th>
                  <th className="py-2 text-right font-normal">Price</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map((p, i) => (
                  <tr
                    key={p.pairAddress}
                    onClick={() => setSelected(i)}
                    className={`cursor-pointer border-b last:border-0 hover:bg-accent/50 ${i === selected ? "bg-primary/10" : ""}`}
                  >
                    <td className="py-2 pr-3">{p.baseToken.symbol}/{p.quoteToken.symbol}</td>
                    <td className="py-2 pr-3 capitalize text-muted-foreground">{p.dexId}</td>
                    <td className="py-2 pr-3 text-right font-mono">{formatUsd(p.liquidity?.usd)}</td>
                    <td className="py-2 pr-3 text-right font-mono">{formatUsd(p.volume?.h24)}</td>
                    <td className="py-2 text-right font-mono">{formatUsd(p.priceUsd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Selected pair">
          <Rows
            rows={[
              ["Pair", `${pair.baseToken.symbol}/${pair.quoteToken.symbol}`],
              ["DEX", pair.dexId],
              ["Pair address", <Addr key="pa" a={pair.pairAddress} />],
              ["Created", formatDate(pair.pairCreatedAt)],
              ["Txns 24h", tx24 ? `${tx24.buys} buys · ${tx24.sells} sells` : NA],
            ]}
          />
        </Section>

        <Section title="Contract information">
          <Rows
            rows={[
              ["Address", <Addr key="a" a={address} />],
              ["Chain ID", String(chain.chainId)],
              ["Verified source", "Not checked — block explorer API not configured"],
              ["Explorer", <a key="e" className="inline-flex items-center gap-1 text-primary hover:underline" href={`${chain.explorer}/token/${address}`} target="_blank" rel="noreferrer">Open <ExternalLink className="size-3" /></a>],
            ]}
          />
        </Section>

        <Section title="Security analysis" className="lg:col-span-2">
          <p className="mb-4 flex items-start gap-2 rounded-md border border-warning/30 bg-warning/5 p-3 text-xs text-muted-foreground">
            <ShieldQuestion className="mt-0.5 size-4 shrink-0 text-warning" />
            Automated static analysis needs verified source code and an analysis engine, which are not
            connected yet. Market data above is not a security audit.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {SECURITY_CHECKS.map((c) => (
              <div key={c} className="flex items-center justify-between rounded-md border bg-surface px-3 py-2 text-xs">
                <span>{c}</span>
                <span className="font-mono text-muted-foreground">Not Available</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-3xl px-4 py-20">{children}</div>;
}

function Empty({ icon: Icon, title, text, children }: { icon: typeof SearchX; title: string; text: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card p-10 text-center">
      <Icon className="mx-auto size-8 text-muted-foreground" />
      <h2 className="mt-4 font-medium">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      <div className="mt-5 flex justify-center">{children}</div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="mt-4 h-9 w-72" />
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <Skeleton className="mt-6 h-64" />
    </div>
  );
}

function Metric({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-1 text-lg font-semibold ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

function pctClass(v?: number | undefined) {
  if (v === undefined) return "text-muted-foreground";
  return v >= 0 ? "text-success" : "text-destructive";
}

function Change({ label, v, v2 }: { label: string; v?: number | undefined; v2?: number | undefined }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-xs text-muted-foreground">Change {label}</div>
      <div className="mt-1 font-mono text-lg font-semibold">
        <span className={pctClass(v)}>{formatPct(v)}</span>
        {label.includes("/") && <span className={`ml-2 ${pctClass(v2)}`}>{formatPct(v2)}</span>}
      </div>
    </div>
  );
}

function Section({ title, className = "", children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={`rounded-lg border bg-card p-5 ${className}`}>
      <h2 className="mb-4 text-sm font-medium">{title}</h2>
      {children}
    </section>
  );
}

function Rows({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="space-y-2.5 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-start justify-between gap-4">
          <dt className="text-muted-foreground">{k}</dt>
          <dd className="text-right">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Addr({ a }: { a: string }) {
  return (
    <span className="inline-flex items-center gap-1 font-mono text-xs">
      {shortAddr(a)} <CopyButton value={a} label="Address copied" />
    </span>
  );
}

