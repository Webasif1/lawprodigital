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

/**
 * Reads a request body as JSON, giving up once it passes maxBytes. The Content-Length check
 * alone isn't enough: a chunked upload has no Content-Length and would otherwise be read whole.
 * Returns "too_large" past the cap and null for a body that isn't JSON.
 */
export async function readJsonCapped(request: Request, maxBytes: number): Promise<unknown | "too_large" | null> {
  if (Number(request.headers.get("content-length") ?? 0) > maxBytes) return "too_large";
  if (!request.body) return null;
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel().catch(() => {});
      return "too_large";
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const c of chunks) {
    bytes.set(c, offset);
    offset += c.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
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

/**
 * Removes markdown emphasis (**bold**, *italic*, _italic_) the model sometimes adds despite
 * the plain-text rule, so the widget never shows stray asterisks. Lone symbols ("5 * 3",
 * snake_case) are left alone.
 */
export function stripEmphasis(text: string) {
  return text
    .replace(/(\*\*|__)(?=\S)([^\n]*?\S)\1/g, "$2")
    .replace(/(^|[^\w*])\*(?=\S)([^*\n]*?\S)\*(?![\w*])/g, "$1$2")
    .replace(/(^|[^\w_])_(?=\S)([^_\n]*?\S)_(?![\w_])/g, "$1$2");
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
