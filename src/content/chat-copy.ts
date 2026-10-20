/** Client-safe chat copy and limits (the system prompt lives in chat.ts, which reads files). */

/** Copy for the live chat widget. */
export const chatCopy = {
  launcher: "Ask us anything",
  launcherHint: "Try it at 11 PM. It still answers.",
  title: "Law Pro Digital assistant",
  status: "AI assistant · replies in seconds",
  greeting:
    "Hi! I’m Law Pro Digital’s AI assistant, the same kind of intake assistant we build for law firms. Ask me about our services and results, or tell me about your firm and I’ll suggest where to start.",
  disclaimer: "AI assistant. It can make mistakes, and it doesn’t give legal advice.",
  placeholder: "Type your message…",
  error: "Sorry, I couldn’t reply just now. Please try again, or use the contact form.",
  busy: "Lots of messages right now. Please wait a minute and try again.",
};

export const CHAT_LIMITS = { turns: 16, chars: 600 } as const;

/** Dispatched on window to open the chat from anywhere (e.g. the homepage demo). */
export const OPEN_CHAT_EVENT = "lpd:open-chat";
