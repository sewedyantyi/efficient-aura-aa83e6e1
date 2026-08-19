import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | Workplace AI Assistant" },
      {
        name: "description",
        content:
          "Paste raw meeting notes or a transcript and get a TL;DR, key points, decisions, and action items you can edit.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | Workplace AI Assistant" },
      {
        property: "og:description",
        content: "Turn messy meeting notes into clear summaries, decisions, and action items.",
      },
    ],
  }),
  component: NotesPage,
});

const SAMPLE_NOTES = `We had a meeting about the marketing campaign.
John will handle social media.
Sarah will design posters.
The deadline is next Friday.
We agreed to increase the budget.`;

function NotesPage() {
  return (
    <AppShell>
      <ToolWorkspace
        tool="notes"
        icon={NotebookPen}
        title="Meeting Notes Summarizer"
        description="Paste raw meeting notes and get a structured output with a summary, action items, decisions, and deadlines."
        inputLabel="Paste your meeting notes or transcript"
        placeholder="e.g. Sprint review — Ana said the API is delayed, Tom will re-test onboarding by Friday, we agreed to push launch to the 12th..."
        cta="Summarize"
        defaultInput={SAMPLE_NOTES}
        examples={[
          "Weekly standup notes",
          "Client discovery call transcript",
          "Project kickoff meeting",
        ]}
      />
    </AppShell>
  );
}
