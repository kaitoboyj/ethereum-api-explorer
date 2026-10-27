import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CopyButton({ value, label = "Copied" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setDone(true);
        toast.success(label);
        setTimeout(() => setDone(false), 1500);
      }}
      className="inline-flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {done ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
    </button>
  );
}
