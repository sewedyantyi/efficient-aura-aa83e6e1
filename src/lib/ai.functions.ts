import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

const GenerateInput = z.object({
  tool: z.enum(["email", "notes", "planner"]),
  input: z.string().min(1),
  tone: z.string().optional(),
});

const SYSTEM_PROMPTS: Record<string, string> = {
  email:
    "You are a professional workplace email writer. Turn the user's rough intent into a polished, ready-to-send email. Include a subject line, greeting, concise body, and sign-off. Keep it clear and business-appropriate. Return plain text only.",
  notes:
    "You summarize meeting notes and transcripts. Produce: a short TL;DR paragraph, then 'Key Points' bullets, 'Decisions' bullets, and 'Action Items' as bullets with owner and due date when mentioned. Return plain text with simple headings.",
  planner:
    "You are a pragmatic task planner. Break the user's goal into an ordered, actionable plan. For each task give a short title, an estimate, a priority (High/Medium/Low), and dependencies where relevant. End with a suggested schedule. Return plain text.",
};

export const generateContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    const system =
      SYSTEM_PROMPTS[data.tool] +
      (data.tone ? ` Write in a ${data.tone} tone.` : "");

    try {
      const result = streamText({
        model: gateway("google/gemini-3.7-flash"),
        system,
        prompt: data.input,
      });
      return { text: await result.text };
    } catch (error: unknown) {
      const status = (error as { statusCode?: number; status?: number })?.statusCode ??
        (error as { status?: number })?.status;
      if (status === 429) throw new Error("Too many requests right now. Please try again in a moment.");
      if (status === 402) throw new Error("AI credits are exhausted. Add credits in Lovable to continue.");
      if (status === 403) throw new Error("AI access is blocked for this workspace.");
      throw new Error(
        error instanceof Error ? error.message : "The AI request failed. Please try again.",
      );
    }
  });
