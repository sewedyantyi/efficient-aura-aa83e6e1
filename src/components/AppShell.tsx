import { Link } from "@tanstack/react-router";
import { Mail, NotebookPen, ListChecks, Sparkles, Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Email Generator", icon: Mail, hint: "Draft emails" },
  { to: "/notes", label: "Notes Summarizer", icon: NotebookPen, hint: "Summarize meetings" },
  { to: "/planner", label: "Task Planner", icon: ListChecks, hint: "Plan your work" },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon, hint }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeOptions={{ exact: to === "/" }}
          activeProps={{
            className:
              "bg-sidebar-primary/15 text-sidebar-accent-foreground ring-1 ring-sidebar-primary/40",
          }}
        >
          <Icon className="size-4 shrink-0" />
          <span className="flex flex-col">
            <span className="font-medium">{label}</span>
            <span className="text-xs text-sidebar-foreground/50">{hint}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-3 px-2 py-1">
        <span className="gradient-hero flex size-9 items-center justify-center rounded-lg text-primary-foreground">
          <Sparkles className="size-5" />
        </span>
        <span className="leading-tight">
          <span className="block font-semibold text-sidebar-foreground">Workplace AI</span>
          <span className="block text-xs text-sidebar-foreground/55">Productivity Assistant</span>
        </span>
      </Link>
      <NavLinks onNavigate={onNavigate} />
      <div className="mt-auto rounded-lg bg-sidebar-accent/60 p-3 text-xs text-sidebar-foreground/70">
        Outputs are fully editable — tweak anything before sending or sharing.
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-72 shrink-0 bg-sidebar lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarBody />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-none bg-sidebar p-0">
              <SidebarBody onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-semibold">Workplace AI</span>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-10">
          <div className="mx-auto w-full max-w-4xl">{children}</div>
        </main>

        <footer className="border-t border-border px-4 py-5 sm:px-8">
          <p className="mx-auto max-w-4xl text-center text-xs text-muted-foreground">
            This AI assistant may generate incorrect or incomplete information. Always review outputs before use. Do not share personal or sensitive information.
          </p>
        </footer>
      </div>
    </div>
  );
}
