"use client";

import Link from "next/link";
import { type FormEvent, type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/ui/icons";
import { CHAT_LIMITS, chatCopy, OPEN_CHAT_EVENT } from "@/content/chat-copy";
import { stripEmphasis } from "@/lib/chat";

type Msg = { role: "user" | "assistant"; content: string };

const suggestions = ["What does the free audit include?", "Do you work with bankruptcy firms?", "What results have you had with Meta Ads?"];

/** Site paths in a reply ("/pricing/", "/case-study/…/") become links. */
function linkify(text: string): ReactNode[] {
  return text.split(/((?<![\w.])\/(?:[a-z0-9-]+\/)+)/g).map((part, i) =>
    i % 2 ? (
      <Link key={i} href={part} className="font-semibold underline underline-offset-2 hover:text-brass">
        {part}
      </Link>
    ) : (
      part
    ),
  );
}

/**
 * What the API sees: the latest turns, starting with a visitor message (the greeting isn't
 * sent), with past replies trimmed. Every message re-sends this, so it stays small.
 */
function history(messages: Msg[]) {
  const recent = messages.slice(-CHAT_LIMITS.turns);
  while (recent[0]?.role === "assistant") recent.shift();
  return recent.map((m) => (m.role === "assistant" ? { ...m, content: m.content.slice(0, CHAT_LIMITS.assistantChars) } : m));
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");
  const launcher = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    // Only now can the chat be opened from elsewhere on the page.
    document.documentElement.dataset.chat = "on";
    return () => {
      window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
      delete document.documentElement.dataset.chat;
    };
  }, []);

  useEffect(() => {
    if (open) field.current?.focus();
  }, [open]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [messages, busy]);

  const close = () => {
    setOpen(false);
    window.setTimeout(() => launcher.current?.focus(), 0);
  };

  // After this many visitor messages, hand off to the audit instead of chatting on.
  const handedOff = messages.filter((m) => m.role === "user").length >= CHAT_LIMITS.perConversation;

  async function send(text: string) {
    const content = text.trim().slice(0, CHAT_LIMITS.chars);
    if (!content || busy || handedOff) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setError(null);
    setBusy(true);
    let reply = "";
    try {
      const res = await fetch("/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history(next) }),
      });
      if (!res.ok || !res.body) throw new Error(res.status === 429 ? "busy" : "failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      setMessages([...next, { role: "assistant", content: "" }]);
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: reply }]);
      }
      if (!reply.trim()) throw new Error("failed");
      setAnnounce(reply);
    } catch (err) {
      setMessages(reply.trim() ? [...next, { role: "assistant", content: reply }] : next);
      setError((err as Error).message === "busy" ? chatCopy.busy : chatCopy.error);
    } finally {
      setBusy(false);
      field.current?.focus();
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send(input);
    }
  };

  return (
    <>
      {!open && (
        <button
          ref={launcher}
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className="on-dark fixed right-4 bottom-4 z-40 flex min-h-12 items-center gap-3 rounded-full bg-navy py-2 pr-5 pl-2 text-left text-paper shadow-[0_18px_40px_-16px_rgba(8,18,38,0.8)] ring-1 ring-white/15 transition-colors duration-(--dur-fast) hover:bg-navy-2 sm:right-6 sm:bottom-6"
        >
          <span aria-hidden className="relative grid size-9 place-items-center rounded-full bg-gold font-display text-xs font-extrabold text-ink">
            LP
            <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-emerald-400 ring-2 ring-navy" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold">{chatCopy.launcher}</span>
            <span className="hidden text-xs text-mist sm:block">{chatCopy.launcherHint}</span>
          </span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="chat-title"
          onKeyDown={(e) => e.key === "Escape" && close()}
          className="fixed inset-x-3 bottom-3 z-55 flex h-[min(38rem,calc(100dvh-1.5rem))] flex-col overflow-hidden rounded-card bg-surface text-ink shadow-[0_30px_80px_-24px_rgba(8,18,38,0.55)] ring-1 ring-line motion-safe:animate-[chat-in_220ms_var(--ease-out-expo)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[24rem]"
        >
          <div className="on-dark flex items-center gap-3 bg-navy px-4 py-3 text-paper">
            <span aria-hidden className="grid size-9 place-items-center rounded-full bg-gold font-display text-xs font-extrabold text-ink">
              LP
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span id="chat-title" className="block text-sm font-semibold">
                {chatCopy.title}
              </span>
              <span className="block text-xs text-mist">{busy ? "typing…" : chatCopy.status}</span>
            </span>
            <button
              type="button"
              onClick={close}
              className="grid size-11 place-items-center rounded-full text-paper/80 transition-colors hover:bg-white/10 hover:text-paper"
            >
              <span aria-hidden className="text-2xl leading-none">×</span>
              <span className="sr-only">Close chat</span>
            </button>
          </div>

          <ol ref={log} aria-label="Conversation" className="flex flex-1 flex-col gap-2.5 overflow-y-auto bg-wash px-4 py-4 text-[0.92rem] leading-snug">
            <li className="max-w-[88%] self-start rounded-2xl rounded-tl-sm bg-surface px-3.5 py-2.5 ring-1 ring-line">{chatCopy.greeting}</li>
            {messages.map((m, i) => (
              <li
                key={i}
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 whitespace-pre-wrap ${
                  m.role === "user" ? "self-end rounded-tr-sm bg-navy text-paper" : "self-start rounded-tl-sm bg-surface ring-1 ring-line"
                }`}
              >
                <span className="sr-only">{m.role === "user" ? "You: " : "Assistant: "}</span>
                {m.role === "assistant" ? linkify(stripEmphasis(m.content)) : m.content}
              </li>
            ))}
            {busy && messages.at(-1)?.role === "user" && (
              <li aria-hidden className="flex gap-1 self-start rounded-2xl rounded-tl-sm bg-surface px-3.5 py-3.5 ring-1 ring-line">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="size-1.5 rounded-full bg-muted motion-safe:animate-bounce" style={{ animationDelay: `${d * 120}ms` }} />
                ))}
              </li>
            )}
            {messages.length === 0 && (
              <li className="mt-1 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="min-h-10 rounded-full bg-surface px-3.5 text-left text-sm font-medium ring-1 ring-line transition-shadow hover:ring-navy"
                  >
                    {s}
                  </button>
                ))}
              </li>
            )}
          </ol>
          <p aria-live="polite" className="sr-only">
            {announce}
          </p>

          <form onSubmit={onSubmit} className="border-t border-line bg-surface p-3">
            {error && (
              <p role="alert" className="mb-2 rounded-field bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-200">
                {error}
              </p>
            )}
            {handedOff && !busy ? (
              <div className="rounded-field bg-wash p-3 ring-1 ring-line">
                <p className="text-sm">{chatCopy.handoff}</p>
                <Link
                  href="/contact-us/"
                  onClick={close}
                  className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-tag bg-gold px-4 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft"
                >
                  {chatCopy.handoffCta}
                  <ArrowIcon aria-hidden className="size-4" />
                </Link>
              </div>
            ) : (
              <div className="flex items-end gap-2">
                <label htmlFor="chat-input" className="sr-only">
                  Message
                </label>
                <textarea
                  ref={field}
                  id="chat-input"
                  rows={1}
                  value={input}
                  maxLength={CHAT_LIMITS.chars}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={chatCopy.placeholder}
                  className="max-h-32 min-h-11 flex-1 resize-none rounded-field border-0 bg-wash px-3.5 py-2.5 text-[0.95rem] ring-1 ring-line placeholder:text-muted/70 focus:ring-2 focus:ring-navy focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-gold text-ink transition-colors hover:bg-gold-soft disabled:opacity-50"
                >
                  <ArrowIcon aria-hidden className="size-4" />
                  <span className="sr-only">Send</span>
                </button>
              </div>
            )}
            <p className="mt-2 text-[0.7rem] text-muted">{chatCopy.disclaimer}</p>
          </form>
        </div>
      )}
    </>
  );
}
