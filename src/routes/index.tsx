import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Workplace AI Assistant" },
      {
        name: "description",
        content:
          "Turn rough notes into polished, ready-to-send workplace emails with an AI assistant you can edit before sending.",
      },
      { property: "og:title", content: "Smart Email Generator | Workplace AI Assistant" },
      {
        property: "og:description",
        content: "Draft professional emails in seconds, then edit the AI output before you send.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <AppShell>
      <ToolWorkspace
        tool="email"
        icon={Mail}
        title="Smart Email Generator"
        description="Describe what you need to say and get a polished, ready-to-send email draft."
        inputLabel="What should the email say?"
        placeholder="e.g. Tell the client the design review moved to Thursday 10am and apologise for the short notice."
        cta="Generate email"
        examples={[
          "Follow up on an unanswered proposal",
          "Decline a meeting politely",
          "Ask a teammate for a status update",
        ]}
      />
    </AppShell>
  );
}
