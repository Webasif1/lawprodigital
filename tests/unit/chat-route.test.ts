import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The route reads the request headers through next/headers; give it the test request's.
let currentHeaders = new Headers();
vi.mock("next/headers", () => ({ headers: async () => currentHeaders }));

const ORIGIN = "http://localhost:3000";
let ipCounter = 0;

function chatRequest(body: BodyInit | null, extra: Record<string, string> = {}) {
  // A fresh IP per request, so the route's in-memory rate limits don't interfere between tests.
  const h = new Headers({ "content-type": "application/json", origin: ORIGIN, host: "localhost:3000", "x-forwarded-for": `10.9.0.${++ipCounter}`, ...extra });
  currentHeaders = h;
  return new Request(`${ORIGIN}/api/chat/`, { method: "POST", headers: h, body, ...(body instanceof ReadableStream ? { duplex: "half" } : {}) } as RequestInit);
}

const onTopic = JSON.stringify({ messages: [{ role: "user", content: "How much does law firm SEO cost?" }] });

function sse(...events: string[]) {
  return new Response(new ReadableStream({
    start(c) {
      for (const e of events) c.enqueue(new TextEncoder().encode(`data: ${e}\n\n`));
      c.close();
    },
  }), { status: 200, headers: { "content-type": "text/event-stream" } });
}

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("OPENROUTER_API_KEY", "test-key-not-real");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  const load = async () => (await import("@/app/api/chat/route")).POST;

  it("is disabled without a key and never calls the model", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await (await load())(chatRequest(onTopic));
    expect(res.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects other sites", async () => {
    const res = await (await load())(chatRequest(onTopic, { origin: "https://evil.example" }));
    expect(res.status).toBe(403);
  });

  it("rejects a chunked body over the cap even without Content-Length", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const mb = new Uint8Array(1024 * 1024).fill(120);
    let sent = 0;
    const stream = new ReadableStream<Uint8Array>({
      pull(c) {
        if (sent++ < 30) c.enqueue(mb);
        else c.close();
      },
    });
    const res = await (await load())(chatRequest(stream));
    expect(res.status).toBe(413);
    // It stops reading early instead of buffering all 30 MB.
    expect(sent).toBeLessThan(3);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a declared Content-Length over the cap", async () => {
    const res = await (await load())(chatRequest(onTopic, { "content-length": "40000" }));
    expect(res.status).toBe(413);
  });

  it("returns 400 for malformed JSON", async () => {
    const res = await (await load())(chatRequest("{nope"));
    expect(res.status).toBe(400);
  });

  it("streams the model's reply as plain text and sends the key only to OpenRouter", async () => {
    const fetchMock = vi.fn(async () => sse(JSON.stringify({ choices: [{ delta: { content: "SEO starts at " } }] }), JSON.stringify({ choices: [{ delta: { content: "$X." } }] }), "[DONE]"));
    vi.stubGlobal("fetch", fetchMock);
    const res = await (await load())(chatRequest(onTopic));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/plain");
    expect(await res.text()).toBe("SEO starts at $X.");
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit & { headers: Record<string, string> }];
    expect(url).toBe("https://openrouter.ai/api/v1/chat/completions");
    expect(init.headers.Authorization).toBe("Bearer test-key-not-real");
    const sent = JSON.parse(String(init.body));
    expect(sent.max_tokens).toBeLessThanOrEqual(200);
    expect(sent.messages[0].role).toBe("system");
  });

  it("hides upstream errors behind a generic 502", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{\"error\":{\"message\":\"Invalid API key sk-or-secret\"}}", { status: 401 })));
    const res = await (await load())(chatRequest(onTopic));
    expect(res.status).toBe(502);
    expect(await res.text()).toBe(JSON.stringify({ error: "upstream" }));
  });

  it("returns 502 when OpenRouter can't be reached or times out", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => {
      throw new DOMException("The operation was aborted due to timeout", "TimeoutError");
    }));
    const res = await (await load())(chatRequest(onTopic));
    expect(res.status).toBe(502);
  });

  it("aborts the model call when the visitor disconnects", async () => {
    let upstreamSignal: AbortSignal | undefined;
    vi.stubGlobal("fetch", vi.fn(async (_u: string, init: RequestInit) => {
      upstreamSignal = init.signal ?? undefined;
      return sse("[DONE]");
    }));
    const controller = new AbortController();
    const req = chatRequest(onTopic);
    const withSignal = new Request(req, { signal: controller.signal });
    await (await load())(withSignal);
    expect(upstreamSignal?.aborted).toBe(false);
    controller.abort();
    expect(upstreamSignal?.aborted).toBe(true);
  });
});
