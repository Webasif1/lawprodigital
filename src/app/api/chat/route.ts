import { headers } from "next/headers";
import { chatSystemPrompt } from "@/content/chat";
import { site } from "@/content/site";
import { type ChatMessage, type ChatUsage, parseMessages, readJsonCapped, sameOrigin, sseToText } from "@/lib/chat";
import { checkTopic } from "@/lib/chat-guard";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";

/**
 * Live chat, proxied to OpenRouter so the API key never reaches the browser.
 * Set OPENROUTER_API_KEY (and optionally OPENROUTER_MODEL) in the server environment;
 * without a key, GET reports the chat as disabled and the widget stays hidden.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Cheap, fast and non-reasoning (no hidden thinking tokens): about $0.0001 per reply.
const DEFAULT_MODEL = "google/gemini-2.5-flash-lite";
const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
// 8 turns of at most 400 characters is well under this, even with multi-byte text.
const MAX_BODY_BYTES = 32_000;

/**
 * Chat limits, in visitor messages (one message = one model call). The burst window stops
 * scripted floods; the daily site-wide ceiling caps the worst-case daily spend even if
 * someone rotates IPs. Counters are in memory and reset when the app restarts.
 */
const CHAT_RATE = {
  burst: { windowMs: 10 * 60 * 1000, perKey: 8, global: 300 },
  daily: { windowMs: 24 * 60 * 60 * 1000, perKey: 40, global: 800 },
};
const burstLimited = createRateLimiter(CHAT_RATE.burst);
const dailyLimited = createRateLimiter(CHAT_RATE.daily);

const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export function GET() {
  return json({ enabled: Boolean(process.env.OPENROUTER_API_KEY) });
}

export async function POST(request: Request) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return json({ error: "disabled" }, 503);

  const h = await headers();
  // Only this site's own pages may use the chat.
  if (!sameOrigin(h.get("origin"), h.get("host"))) return json({ error: "forbidden" }, 403);
  const ip = clientIp(h.get("x-forwarded-for"), h.get("x-real-ip"));
  const limit = burstLimited(ip) ? CHAT_RATE.burst : dailyLimited(ip) ? CHAT_RATE.daily : null;
  if (limit) {
    return Response.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": String(Math.round(limit.windowMs / 1000)) } },
    );
  }

  let body: unknown;
  try {
    body = await readJsonCapped(request, MAX_BODY_BYTES);
  } catch {
    body = null;
  }
  if (body === "too_large") return json({ error: "too_large" }, 413);
  const messages: ChatMessage[] | null = parseMessages(body);
  if (!messages) return json({ error: "invalid" }, 400);

  // Rule-based topic check (no AI): off-topic questions get a fixed reply and cost nothing.
  const lastReply = messages.findLast((m) => m.role === "assistant")?.content;
  const topic = checkTopic(messages[messages.length - 1].content, lastReply);
  if (!topic.ok) {
    console.log(`[chat] answered by rule: ${topic.reason}`);
    return new Response(topic.reply, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Chat-Source": "rule" },
    });
  }

  let upstream: Response;
  try {
    upstream = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": site.url,
        "X-Title": site.name,
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
        messages: [{ role: "system", content: chatSystemPrompt() }, ...messages],
        // About 120 words at most; the prompt asks for under 50.
        max_tokens: 160,
        temperature: 0.3,
        stream: true,
        usage: { include: true },
      }),
      // Stop the model call too if the visitor closes the chat mid-reply.
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(30_000)]),
    });
  } catch (err) {
    console.error(`[chat] OpenRouter request failed: ${(err as Error).name}`);
    return json({ error: "upstream" }, 502);
  }
  if (!upstream.ok || !upstream.body) {
    console.error(`[chat] OpenRouter responded ${upstream.status}`);
    return json({ error: "upstream" }, 502);
  }

  // Token counts only, never message text, so the log shows real per-reply cost.
  const onUsage = (u: ChatUsage) =>
    console.log(`[chat] tokens in=${u.prompt_tokens ?? "?"} out=${u.completion_tokens ?? "?"}${u.cost !== undefined ? ` cost=$${u.cost}` : ""}`);
  return new Response(upstream.body.pipeThrough(sseToText({ onUsage })), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}
