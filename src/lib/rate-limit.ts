/**
 * Sliding-window limiter, per key plus a global ceiling. The global cap bounds how much
 * a route can be used even if a sender rotates IPs or spoofs X-Forwarded-For.
 * In memory is enough: the app runs as one long-lived Node process on cPanel.
 */
export function createRateLimiter({ windowMs, perKey, global, maxKeys = 5000 }: { windowMs: number; perKey: number; global: number; maxKeys?: number }) {
  const hits = new Map<string, number[]>();
  let all: number[] = [];

  return function limited(key: string, now = Date.now()) {
    all = all.filter((t) => now - t < windowMs);
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= perKey || all.length >= global) {
      hits.set(key, recent);
      return true;
    }
    recent.push(now);
    all.push(now);
    hits.delete(key);
    hits.set(key, recent);
    // Evict the least recently used keys instead of clearing everything,
    // so flooding the map with fake IPs can't reset everyone's counters.
    while (hits.size > maxKeys) hits.delete(hits.keys().next().value!);
    return false;
  };
}

/** Client IP for rate limiting: the hop appended by the nearest proxy, not the client-supplied first entry. */
export function clientIp(forwardedFor: string | null, realIp: string | null) {
  const hops = forwardedFor?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  return hops.at(-1) || realIp?.trim() || "unknown";
}
