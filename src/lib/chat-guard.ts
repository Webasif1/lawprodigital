import {
  blockedPatterns,
  businessPatterns,
  guardReplies,
  legalBusinessContext,
  newQuestionPattern,
  personalLegalPatterns,
  smallTalkPatterns,
} from "@/content/chat-guard-rules";

/**
 * Decides, without any AI, whether a chat message is about Law Pro Digital's business and
 * website. Off-topic messages get a fixed reply and never reach the model (no tokens spent).
 * The word lists live in src/content/chat-guard-rules.ts.
 */

export type TopicCheck = { ok: true } | { ok: false; reason: "off-topic" | "legal"; reply: string };

const compile = (sources: string[]) => sources.map((s) => new RegExp(s, "i"));
const blocked = compile(blockedPatterns);
const personalLegal = compile(personalLegalPatterns);
const businessContext = new RegExp(legalBusinessContext, "i");
const smallTalk = compile(smallTalkPatterns);
const newQuestion = new RegExp(newQuestionPattern, "i");
const business = new RegExp(`\\b(?:${businessPatterns.join("|")})`, "i");

/** Short enough to be an answer to the assistant's question ("3 offices", "Houston"), not a new question. */
const SHORT_ANSWER_WORDS = 12;

const offTopic: TopicCheck = { ok: false, reason: "off-topic", reply: guardReplies.offTopic };

export function checkTopic(message: string, lastAssistantReply?: string): TopicCheck {
  const text = message.trim().replace(/\s+/g, " ");
  if (!text) return offTopic;

  if (blocked.some((r) => r.test(text))) return offTopic;
  if (personalLegal.some((r) => r.test(text)) && !businessContext.test(text)) {
    return { ok: false, reason: "legal", reply: guardReplies.legal };
  }
  if (smallTalk.some((r) => r.test(text))) return { ok: true };

  const answeringQuestion = Boolean(lastAssistantReply?.trim().endsWith("?"));
  const isAnswer = text.split(" ").length <= SHORT_ANSWER_WORDS && !newQuestion.test(text);
  if (answeringQuestion && isAnswer) return { ok: true };

  return business.test(text) ? { ok: true } : offTopic;
}
