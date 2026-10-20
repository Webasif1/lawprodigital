/**
 * Rules for the chat's topic checker (src/lib/chat-guard.ts). No AI is involved: a message
 * that is clearly off-topic gets one of the fixed replies below and never reaches the model,
 * so it costs nothing. Edit the lists here; the logic doesn't need to change.
 *
 * Patterns are case-insensitive regular expression sources.
 */

export const guardReplies = {
  offTopic:
    "Sorry, I can only help with questions about Law Pro Digital and marketing for law firms: our services, pricing, results or the free AI lead audit (/contact-us/). What would you like to know?",
  legal:
    "I’m Law Pro Digital’s marketing assistant, so I can’t give legal advice. Please speak with an immigration attorney about your case. If you run a law firm, I’m happy to help with your marketing!",
};

/** Always answered with the off-topic reply, even if a business word appears. */
export const blockedPatterns: string[] = [
  // Attempts to change the assistant's instructions.
  String.raw`ignore (all |any |the |your )?(previous|prior|above|earlier) (instructions|prompts?|rules)`,
  String.raw`system prompt|jailbreak|developer mode|pretend (you are|you're|to be)|act as (a|an)\b|roleplay|role-play`,
  // General-assistant jobs.
  String.raw`\b(write|generate|fix|debug)\b.{0,40}\b(code|program|sql|regex|python|javascript|typescript|java|php)\b`,
  String.raw`\b(poem|poetry|song|lyrics|essay|homework|assignment|short story|bedtime story|fairy tale)\b`,
  String.raw`\btranslat`,
  String.raw`\b(joke|riddle|horoscope|zodiac)\b`,
  String.raw`\b(recipe|cooking|bake|baking)\b`,
  String.raw`\b(solve|calculate)\b.{0,40}\d`,
  String.raw`^[\d\s+\-*/().^=x%]+$`,
  // Unrelated topics.
  String.raw`\b(weather|forecast)\b`,
  String.raw`\b(nba|nfl|mlb|nhl|fifa|world cup|super bowl|football|soccer|basketball|baseball|cricket)\b|\bwho won\b`,
  String.raw`\b(election|president|democrats?|republicans?|politics|political)\b`,
  String.raw`\b(symptoms?|diagnos\w*|medicine|medication|disease|pregnan\w*|dosage)\b`,
  String.raw`\b(bitcoin|crypto\w*|stock market|stocks? to buy)\b`,
];

/**
 * A visitor asking about their own immigration or legal case. Matched only when none of
 * `legalBusinessContext` appears, since a firm owner might mention green cards too.
 */
export const personalLegalPatterns: string[] = [
  String.raw`\b(my|our)\s+(visa|green ?card|asylum|case|petition|i-?\d{3}|h-?1b|work permit|citizenship|deportation|immigration status|status|application|interview|rfe|hearing)\b`,
  String.raw`\b(can|should|could|how (do|can|should))\s+i\b.{0,50}\b(visa|green ?card|asylum|citizenship|naturali[sz]|h-?1b|sponsor|deport\w*|work permit|apply)\b`,
  String.raw`\bi\b.{0,30}\b(was|got|been|am being)\s+(denied|deported|detained|arrested|sued|charged)\b`,
  String.raw`\b(overstay\w*|undocumented|illegal(ly)? (here|in the us))\b`,
];

export const legalBusinessContext = String.raw`\b(firm|clients?|office|offices|practice|marketing|leads?|ads|campaigns?|case stud\w*|attorneys? like|lawyers? like)\b`;

/** Small talk that passes without a business word, so the chat feels natural. */
export const smallTalkPatterns: string[] = [
  String.raw`^(hi|hello|hey|hiya|howdy|yo|good (morning|afternoon|evening)|thanks?( you)?|thank you( so much)?|thx|ty|ok(ay)?|cool|great|perfect|sure|yes|yeah|yep|no|nope|bye|goodbye|got it)\b[\s!.,?🙂😊👍]*$`,
  String.raw`\b(who are you|what are you|are you (a |an )?(bot|human|real|robot|person)|what can you (do|help))\b`,
];

/**
 * A new question rather than an answer. A short reply to the assistant's question
 * ("Houston", "3 offices", "smithlaw.com") passes without a business word, but a new
 * question ("can you tell me what time it is") needs one, like any first message.
 */
export const newQuestionPattern = String.raw`\?|^(what|what's|whats|who|who's|whom|when|where|why|how|which|whose|can|could|would|will|should|shall|is|are|am|was|were|do|does|did|have|has|tell me|show me|give me|explain|describe|define|please)\b|\b(can|could|would|will) (you|u)\b|\b(tell|show|give) me\b`;

/**
 * Business topics (matched at the start of a word, so "lead" also matches "leads").
 * A message needs one of these to reach the AI, unless it is small talk or a short
 * answer to the assistant's own question.
 */
export const businessPatterns: string[] = [
  String.raw`laws?\b`, "legal", "firm", "lawyer", "attorney", "practice", "paralegal",
  "immigration", "bankruptcy", "injury", String.raw`pi\b`, "criminal", "family law", "estate planning",
  "marketing", "market", "advertis", String.raw`ads?\b`, "campaign", "facebook", "instagram", String.raw`meta\b`,
  "google", String.raw`maps?\b`, String.raw`gbp\b`, "seo", "aeo", String.raw`geo\b`, "search", "rank", "chatgpt",
  String.raw`ai\b`, String.raw`a\.i`, "artificial intelligence", "intake", "chatbot", String.raw`bots?\b`, "voice agent", "automation",
  "lead", "client", "case", String.raw`calls?\b`, "phone", "website", String.raw`site\b`, String.raw`web\b`, "page", "landing",
  "pricing", "price", "cost", "budget", String.raw`fees?\b`, "package", String.raw`plans?\b`, "audit", "result", "roi",
  "video", "youtube", "tiktok", "social", "review", "reputation", "contact", "book", "consult", "email",
  String.raw`law ?pro`, "agency", "service", "traffic", "conversion", "report", "scorecard", "webinar",
  "office", "signed", "retainer", "visa", "green ?card", "nationwide", "location", "founder", "bellal",
  "work with", "onboard", "contract", "guarantee", "how long", "timeline", "your team", "experience",
  "linkedin", "upwork", "privacy", "terms",
];
