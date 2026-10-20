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
  busy: "You’ve sent a lot of messages in a short time. Please wait a few minutes, or use the contact form.",
  handoff: "Let’s continue properly: your free AI lead audit shows exactly where your firm is losing leads.",
  handoffCta: "Get your free AI lead audit",
};

/**
 * Kept small on purpose: every message re-sends the history, so these bound the tokens per reply.
 * turns = messages sent to the model; chars = a visitor message; assistantChars = a past reply
 * (trimmed by the widget); perConversation = visitor messages before handing off to the audit
 * (keep it below the per-IP burst limit in src/app/api/chat/route.ts, or the handoff never shows).
 */
export const CHAT_LIMITS = { turns: 8, chars: 400, assistantChars: 400, perConversation: 6 } as const;

/** Dispatched on window to open the chat from anywhere (e.g. the homepage demo). */
export const OPEN_CHAT_EVENT = "lpd:open-chat";
