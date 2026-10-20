import { CHAT_LIMITS } from "@/content/chat-copy";

/** Pure helpers for the chat route (see tests/unit/chat.test.ts). */

export type ChatMessage = { role: "user" | "assistant"; content: string };

export function parseMessages(body: unknown): ChatMessage[] | null {
  const list = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(list) || list.length === 0 || list.length > CHAT_LIMITS.turns) return null;
  const out: ChatMessage[] = [];
  for (const m of list) {
    const role = (m as ChatMessage)?.role;
    const content = (m as ChatMessage)?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim();
    if (!text || text.length > (role === "user" ? CHAT_LIMITS.chars : CHAT_LIMITS.assistantChars)) return null;
    out.push({ role, content: text });
  }
  return out.at(-1)?.role === "user" ? out : null;
}

/** Requests without an Origin header (same-origin GETs, curl) pass; cross-site ones don't. */
export function sameOrigin(origin: string | null, host: string | null) {
  if (!origin) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export type ChatUsage = { prompt_tokens?: number; completion_tokens?: number; cost?: number };

/**
 * Turns OpenAI-style server-sent events into a plain stream of reply text. A reply cut off
 * by max_tokens ends with "…" so the cut is visible; usage (sent on the final event when
 * requested) goes to onUsage.
 */
export function sseToText({ onUsage }: { onUsage?: (usage: ChatUsage) => void } = {}) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const handle = (line: string, controller: TransformStreamDefaultController<Uint8Array>) => {
    if (!line.startsWith("data:")) return; // comments such as ": OPENROUTER PROCESSING"
    const data = line.slice(5).trim();
    if (!data || data === "[DONE]") return;
    try {
      const event = JSON.parse(data);
      const choice = event?.choices?.[0];
      const delta = choice?.delta?.content;
      if (typeof delta === "string" && delta) controller.enqueue(encoder.encode(delta));
      if (choice?.finish_reason === "length") controller.enqueue(encoder.encode("…"));
      if (event?.usage) onUsage?.(event.usage);
    } catch {
      // Ignore a malformed event rather than dropping the whole reply.
    }
  };
  return new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) handle(line.trim(), controller);
    },
    flush(controller) {
      if (buffer) handle(buffer.trim(), controller);
    },
  });
}
