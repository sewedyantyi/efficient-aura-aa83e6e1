import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Loader2, RotateCcw, Sparkles, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generateContent } from "@/lib/ai.functions";

type Props = {
  tool: "email" | "notes" | "planner";
  title: string;
  description: string;
  icon: LucideIcon;
  inputLabel: string;
  placeholder: string;
  examples: string[];
  cta: string;
};

export function ToolWorkspace({
  tool,
  title,
  description,
  icon: Icon,
  inputLabel,
  placeholder,
  examples,
  cta,
}: Props) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const generate = useServerFn(generateContent);

  const mutation = useMutation({
    mutationFn: (value: string) => generate({ data: { tool, input: value } }),
    onSuccess: (result) => setOutput(result.text),
    onError: (error: Error) => toast.error(error.message || "Generation failed"),
  });

  const handleGenerate = () => {
    if (!input.trim()) {
      toast.error("Add some input first.");
      return;
    }
    mutation.mutate(input.trim());
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="gradient-hero flex size-10 items-center justify-center rounded-xl text-primary-foreground">
            <Icon className="size-5" />
          </span>
          <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        </div>
        <p className="text-sm text-muted-foreground sm:text-base">{description}</p>
      </header>

      <section className="surface-card space-y-4 p-5 sm:p-6">
        <Label htmlFor="tool-input" className="text-sm font-medium">
          {inputLabel}
        </Label>
        <Textarea
          id="tool-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={placeholder}
          className="min-h-40 resize-y bg-background text-sm"
        />
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setInput(example)}
              className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {example}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={handleGenerate} disabled={mutation.isPending} className="sm:w-auto">
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {mutation.isPending ? "Generating…" : cta}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setInput("");
              setOutput("");
            }}
            className="sm:w-auto"
          >
            <RotateCcw className="size-4" />
            Clear
          </Button>
        </div>
      </section>

      <section className="surface-card space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Output</h2>
            <p className="text-xs text-muted-foreground">
              Editable — refine the AI response before you use it.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={!output}
            onClick={() => {
              navigator.clipboard.writeText(output);
              toast.success("Copied to clipboard");
            }}
          >
            <Copy className="size-4" />
            Copy
          </Button>
        </div>

        {mutation.isPending && !output ? (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
            <Loader2 className="mr-2 size-4 animate-spin" /> Working on it…
          </div>
        ) : (
          <Textarea
            value={output}
            onChange={(event) => setOutput(event.target.value)}
            placeholder="Your AI-generated result will appear here, ready to edit."
            className="min-h-72 resize-y bg-background font-mono text-sm leading-relaxed"
          />
        )}
      </section>
    </div>
  );
}
