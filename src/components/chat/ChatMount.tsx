"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ChatWidget = dynamic(() => import("./ChatWidget"), { ssr: false });

/**
 * Asks the server whether the live chat is configured (it needs OPENROUTER_API_KEY) once
 * the page has settled, and only then loads the widget. The widget sets `data-chat="on"`
 * on <html>, so "Try the live chat" buttons elsewhere appear only when it can open.
 */
export function ChatMount() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const check = () =>
      fetch("/api/chat/", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : { enabled: false }))
        .then((d: { enabled?: boolean }) => {
          if (!cancelled && d.enabled) setEnabled(true);
        })
        .catch(() => {});
    // After first paint and the hero animations, so the chat never competes with them.
    const timer = window.setTimeout(check, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return enabled ? <ChatWidget /> : null;
}
