/**
 * POST /api/polish — rephrase a guru's collateral message for clarity.
 *
 * Inactive by default: with no ANTHROPIC_API_KEY set it returns 503 and the
 * client falls back to its local mock. To turn it on:
 *
 *   vercel env add ANTHROPIC_API_KEY          # then redeploy
 *   vercel env add VITE_AI_POLISH_ENDPOINT    # value: /api/polish
 *
 * The client (src/lib/ai/polishMessage.ts) strips every URL before calling this
 * and re-appends them afterwards, so no referral link is ever sent to the model
 * — do not add URL handling here.
 */

import Anthropic from "@anthropic-ai/sdk";

/* Kept in sync with POLISH_SYSTEM_PROMPT in src/lib/ai/polishMessage.ts. The
   client copy is the one the product rules are reviewed against; this is the
   copy the model actually receives. */
const SYSTEM_PROMPT = `You rephrase a mentor's own social post for clarity and flow. You are a copy editor, not a marketer.

Rules:
- Keep the writer's voice, tone, and any personal details. It must still sound like them, not like marketing copy.
- Preserve any program name exactly as written, character for character.
- Do not invent statistics, outcomes, testimonials, or any claim about the program that is not already in the text.
- Do not add hashtags, emoji, calls to action, or promotional language.
- Do not lengthen the text. The result must be the same length or shorter.
- Fix awkward phrasing, redundancy, and run-on sentences. Keep the original meaning.
- Return only the rewritten message. No preamble, no quotes, no commentary, no explanation.`;

/** Guard against a runaway request body — these messages are short. */
const MAX_INPUT_CHARS = 8_000;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  if (!process.env.ANTHROPIC_API_KEY) {
    return json({ error: "Polish endpoint is not configured." }, 503);
  }

  let text: unknown;
  let protectedPhrases: unknown;
  try {
    ({ text, protectedPhrases } = (await req.json()) as Record<string, unknown>);
  } catch {
    return json({ error: "Malformed JSON body." }, 400);
  }

  if (typeof text !== "string" || !text.trim()) {
    return json({ error: "`text` must be a non-empty string." }, 400);
  }
  if (text.length > MAX_INPUT_CHARS) {
    return json({ error: "`text` is too long to polish." }, 413);
  }

  // Phrases the rewrite must reproduce verbatim (program name, promo code).
  const keepVerbatim = Array.isArray(protectedPhrases)
    ? protectedPhrases.filter((p): p is string => typeof p === "string" && Boolean(p))
    : [];
  const verbatimNote = keepVerbatim.length
    ? `\n\nReproduce these exactly as written: ${keepVerbatim.join(" | ")}`
    : "";

  try {
    const client = new Anthropic();
    const message = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      // Thinking is on by default on this model and shares the max_tokens
      // budget. `low` effort suits a scoped copy-edit; leaving thinking on
      // (rather than disabling it) avoids the tag-leakage failure mode that
      // would corrupt a message the guru posts verbatim.
      thinking: { type: "adaptive" },
      output_config: { effort: "low" },
      messages: [{ role: "user", content: `${text}${verbatimNote}` }],
    });

    // Safety classifiers can decline with a 200 + stop_reason "refusal";
    // reading content[0] unconditionally would break here.
    if (message.stop_reason === "refusal") {
      return json({ error: "That message couldn't be polished." }, 422);
    }

    const rewritten = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    if (!rewritten) return json({ error: "The rewrite came back empty." }, 502);
    return json({ text: rewritten }, 200);
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return json({ error: "Too many polish requests — try again shortly." }, 429);
    }
    if (err instanceof Anthropic.APIError) {
      return json({ error: "The polish service is unavailable." }, 502);
    }
    return json({ error: "Unexpected error while polishing." }, 500);
  }
}
