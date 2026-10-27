import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CHAINS, isEvmAddress, normalizeAddress } from "@/lib/chains";
import { tokenPairsQuery } from "@/lib/dexscreener";

export function AddressLookup({ defaultChain = "ethereum" }: { defaultChain?: string }) {
  const [chain, setChain] = useState(defaultChain);
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isEvmAddress(address)) {
      setError("Enter a valid EVM address: 0x followed by 40 hexadecimal characters.");
      return;
    }
    setError(null);
    setLoading(true);
    const addr = normalizeAddress(address);
    try {
      await qc.prefetchQuery(tokenPairsQuery(chain, addr));
    } finally {
      setLoading(false);
    }
    navigate({ to: "/analyze/$chainId/$address", params: { chainId: chain, address: addr } });
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border bg-card p-4 shadow-2xl shadow-background/60 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Select value={chain} onValueChange={setChain}>
          <SelectTrigger className="sm:w-52" aria-label="Network">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CHAINS.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x… token contract address"
          className="flex-1 font-mono text-sm"
          aria-label="Contract address"
          aria-invalid={!!error}
          spellCheck={false}
        />
        <Button type="submit" variant="glow" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <Search />}
          Analyze Contract
        </Button>
      </div>
      <p className={`mt-3 text-xs ${error ? "text-destructive" : "text-muted-foreground"}`}>
        {error ?? "Inspect any supported EVM token without connecting a wallet."}
      </p>
    </form>
  );
}
