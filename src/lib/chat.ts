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
    if (!text || text.length > (role === "user" ? CHAT_LIMITS.chars : CHAT_LIMITS.chars * 4)) return null;
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

/** Turns OpenAI-style server-sent events into a plain stream of reply text. */
export function sseToText() {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const handle = (line: string, controller: TransformStreamDefaultController<Uint8Array>) => {
    if (!line.startsWith("data:")) return; // comments such as ": OPENROUTER PROCESSING"
    const data = line.slice(5).trim();
    if (!data || data === "[DONE]") return;
    try {
      const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
      if (typeof delta === "string" && delta) controller.enqueue(encoder.encode(delta));
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
