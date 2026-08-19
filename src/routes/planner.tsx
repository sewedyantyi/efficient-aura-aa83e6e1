import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Workplace AI Assistant" },
      {
        name: "description",
        content:
          "Describe a goal and get an ordered task plan with estimates, priorities, and a suggested schedule you can edit.",
      },
      { property: "og:title", content: "AI Task Planner | Workplace AI Assistant" },
      {
        property: "og:description",
        content: "Break any goal into a prioritized, time-estimated action plan in seconds.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <AppShell>
      <ToolWorkspace
        tool="planner"
        icon={ListChecks}
        title="AI Task Planner"
        description="Describe your goal or workload and get a prioritized, time-estimated action plan."
        inputLabel="What do you need to get done?"
        placeholder="e.g. Launch the new pricing page in two weeks with design, copy, dev, and QA."
        cta="Build my plan"
        examples={[
          "Plan my week with 3 deadlines",
          "Prepare a quarterly business review",
          "Onboard a new team member",
        ]}
      />
    </AppShell>
  );
}
