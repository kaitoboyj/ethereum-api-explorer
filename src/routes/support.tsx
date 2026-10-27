import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — ChainSentry" },
      { name: "description", content: "Get help with token analysis and contract submissions." },
      { property: "og:title", content: "Support — ChainSentry" },
      { property: "og:description", content: "Get help with token analysis and contract submissions." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader crumbs={["Support"]} title="Support" subtitle="Questions about a submission or the analyzer." />
      <div className="space-y-4">
        <div className="rounded-lg border bg-card p-5 text-sm text-muted-foreground">
          Include your submission reference when contacting support so we can find your request quickly.
          Support contact details will be published here.
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-5 text-sm">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
          <p className="text-muted-foreground">
            Our team will never message you first, and will never ask for a seed phrase, private key or
            wallet signature through chat or email.
          </p>
        </div>
      </div>
    </div>
  ),
});
