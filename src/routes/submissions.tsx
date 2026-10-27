import { createFileRoute, Link } from "@tanstack/react-router";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/submissions")({
  head: () => ({
    meta: [
      { title: "My Submissions — ChainSentry" },
      { name: "description", content: "Track the status of your contract submissions." },
      { property: "og:title", content: "My Submissions — ChainSentry" },
      { property: "og:description", content: "Track the status of your contract submissions." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <PageHeader crumbs={["My Submissions"]} title="My Submissions" subtitle="Your submission history and status timeline." />
      <div className="rounded-lg border bg-card p-12 text-center">
        <Inbox className="mx-auto size-8 text-muted-foreground" />
        <h2 className="mt-4 font-medium">No submissions yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">Submissions you send will appear here with their progress.</p>
        <Button className="mt-5" asChild>
          <Link to="/submit-contract">Submit a contract</Link>
        </Button>
      </div>
    </div>
  ),
});
