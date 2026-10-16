"use client";

import { useEffect, useRef, useState } from "react";

type Message = { from: "client" | "ai"; text: string };

/** An illustrative intake conversation qualifying an F-1 student about to graduate. */
const script: Message[] = [
  { from: "client", text: "Hi, I saw your video about staying in the US after graduation. I'm finishing my master's in May on an F-1 visa. What are my options?" },
  { from: "ai", text: "Congratulations on finishing your degree! I can help you get started. What did you study, and do you have a job offer yet?" },
  { from: "client", text: "Data analytics. I have an offer from a company in Texas." },
  { from: "ai", text: "Thanks. Options after graduation can include OPT, STEM OPT or an H-1B, and timing matters. When does your program end?" },
  { from: "client", text: "May 15." },
  { from: "ai", text: "I've reserved a consultation with an attorney for Thursday at 10:00 am (your time). You'll get a confirmation on WhatsApp." },
];

/**
 * Plays the conversation once when it scrolls into view, with a typing
 * indicator between messages. Every message is in the HTML from the start
 * (only hidden while waiting its turn), and reduced-motion visitors see the
 * full exchange immediately.
 */
export function ChatDemo() {
  const box = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(script.length);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: number[] = [];
    let started = false;
    // Hide all but the first message until the demo is reached.
    const hide = window.setTimeout(() => setShown(1), 0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        io.disconnect();
        let t = 600;
        for (let i = 1; i < script.length; i++) {
          const delay = script[i].from === "ai" ? 1100 : 800;
          timers.push(window.setTimeout(() => setTyping(true), t));
          t += delay;
          timers.push(
            window.setTimeout(() => {
              setTyping(false);
              setShown(i + 1);
            }, t),
          );
          t += 700;
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      window.clearTimeout(hide);
      timers.forEach(window.clearTimeout);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={box} className="relative mx-auto w-full max-w-sm">
      <div className="overflow-hidden rounded-[2rem] bg-[#0b141a] p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
        <div className="flex items-center gap-3 rounded-t-[1.6rem] bg-[#1f2c34] px-4 py-3 text-white">
          <span className="grid size-9 place-items-center rounded-full bg-gold font-display text-sm font-extrabold text-ink">LP</span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold">Immigration Law Office</span>
            <span className="block text-[0.7rem] text-white/60">{typing ? "typing…" : "AI intake assistant · online"}</span>
          </span>
        </div>
        <ol
          aria-label="Example AI intake conversation"
          className="flex min-h-[26rem] flex-col gap-2 bg-[#0b141a] bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[14px_14px] px-3 py-4"
        >
          {script.map((m, i) => (
            <li
              key={i}
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-[0.82rem] leading-snug transition-[opacity,translate] duration-500 ease-out-expo ${
                m.from === "client" ? "self-start rounded-tl-sm bg-[#202c33] text-white/90" : "self-end rounded-tr-sm bg-[#005c4b] text-white"
              } ${i < shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
            >
              {m.text}
            </li>
          ))}
          {typing && (
            <li aria-hidden className="flex gap-1 self-end rounded-2xl rounded-tr-sm bg-[#005c4b] px-3 py-3">
              {[0, 1, 2].map((d) => (
                <span key={d} className="size-1.5 animate-bounce rounded-full bg-white/70" style={{ animationDelay: `${d * 120}ms` }} />
              ))}
            </li>
          )}
        </ol>
      </div>
      <p className="mt-4 text-center text-xs text-mist">Illustrative example of an AI intake conversation</p>
    </div>
  );
}
