import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import { SYSTEM_PROMPTS } from "./ai-prompts";

export const generateContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        tool: z.enum(["email", "notes", "planner"]),
        input: z.string().min(1),
        tone: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    const system =
      SYSTEM_PROMPTS[data.tool] + (data.tone ? ` Write in a ${data.tone} tone.` : "");

    try {
      const result = streamText({
        model: gateway("google/gemini-3.7-flash"),
        system,
        prompt: data.input,
      });
      return { text: await result.text };
    } catch (error: unknown) {
      const status =
        (error as { statusCode?: number; status?: number })?.statusCode ??
        (error as { status?: number })?.status;
      if (status === 429)
        throw new Error("Too many requests right now. Please try again in a moment.");
      if (status === 402)
        throw new Error("AI credits are exhausted. Add credits in Lovable to continue.");
      if (status === 403) throw new Error("AI access is blocked for this workspace.");
      throw new Error(
        error instanceof Error ? error.message : "The AI request failed. Please try again.",
      );
    }
  });
