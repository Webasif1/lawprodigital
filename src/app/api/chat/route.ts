import { headers } from "next/headers";
import { chatSystemPrompt } from "@/content/chat";
import { site } from "@/content/site";
import { type ChatMessage, parseMessages, sameOrigin, sseToText } from "@/lib/chat";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";

/**
 * Live chat, proxied to OpenRouter so the API key never reaches the browser.
 * Set OPENROUTER_API_KEY (and optionally OPENROUTER_MODEL) in the server environment;
 * without a key, GET reports the chat as disabled and the widget stays hidden.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_MODEL = "anthropic/claude-haiku-4.5";
const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

// 20 messages per IP and 300 in total per 10 minutes: enough for real conversations,
// and a hard ceiling on what a scripted abuser can spend.
const rateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, perKey: 20, global: 300 });

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
  if (Number(h.get("content-length") ?? 0) > 32_000) return json({ error: "too_large" }, 413);
  if (rateLimited(clientIp(h.get("x-forwarded-for"), h.get("x-real-ip")))) return json({ error: "rate_limited" }, 429);

  let messages: ChatMessage[] | null = null;
  try {
    messages = parseMessages(await request.json());
  } catch {
    messages = null;
  }
  if (!messages) return json({ error: "invalid" }, 400);

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
        max_tokens: 400,
        temperature: 0.4,
        stream: true,
      }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    console.error(`[chat] OpenRouter request failed: ${(err as Error).name}`);
    return json({ error: "upstream" }, 502);
  }
  if (!upstream.ok || !upstream.body) {
    console.error(`[chat] OpenRouter responded ${upstream.status}`);
    return json({ error: "upstream" }, 502);
  }

  return new Response(upstream.body.pipeThrough(sseToText()), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}
