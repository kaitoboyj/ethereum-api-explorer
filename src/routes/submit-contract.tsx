import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { CHAINS, isEvmAddress } from "@/lib/chains";

const search = z.object({ chain: z.string().optional(), address: z.string().optional() });

export const Route = createFileRoute("/submit-contract")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Submit Solidity Contract — ChainSentry" },
      { name: "description", content: "Submit Solidity source code for review and configuration." },
      { property: "og:title", content: "Submit Solidity Contract — ChainSentry" },
      { property: "og:description", content: "Submit Solidity source code for review and configuration." },
    ],
  }),
  component: SubmitPage,
});

function SubmitPage() {
  const s = Route.useSearch();
  const [chain, setChain] = useState(s.chain ?? "ethereum");
  const [address, setAddress] = useState(s.address ?? "");
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const addrOk = isEvmAddress(address);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageHeader crumbs={["Submit Contract"]} title="Submit Solidity Program" subtitle="Provide the contract details and full source code." />

      <div className="mb-6 flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-muted-foreground">
          Accounts and saved submissions are being set up. You can prepare your submission now; sending
          will be enabled once sign-in is live.
        </p>
      </div>

      <form className="space-y-5 rounded-lg border bg-card p-5" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Network</Label>
            <Select value={chain} onValueChange={setChain}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CHAINS.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Project / token name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Example Token" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Contract address</Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} className="font-mono text-sm" placeholder="0x…" aria-invalid={!!address && !addrOk} />
          {address && !addrOk && <p className="text-xs text-destructive">Enter a valid EVM address.</p>}
        </div>
        <div className="space-y-2">
          <Label>Solidity source code</Label>
          <Textarea value={source} onChange={(e) => setSource(e.target.value)} rows={16} spellCheck={false} className="font-mono text-xs leading-relaxed" placeholder={"// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract Token { ... }"} />
          <p className="text-xs text-muted-foreground">{source.length.toLocaleString()} characters</p>
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant="glow" disabled>
            Submit Solidity Program
          </Button>
        </div>
      </form>
    </div>
  );
}
