/**
 * Local landing pages: one page per sub-city, grouped under a practice hub.
 *
 * URL: /{hub}/{city-slug}/  e.g. /immigration-law-firm-marketing/sugar-land-tx/
 *
 * Rules for every location page (see the "Local SEO Page Plan" doc):
 * - Every number is either from the case study library (linked) or from a public source (linked).
 * - Most of each page is specific to the city: market data, competition, neighbors, problems, FAQs.
 * - Clients are never named, except the Chambers Law Firm video testimonial they agreed to.
 * - Meta titles over 48 characters render without the brand suffix (see pageMetadata), so keep them 49–60.
 */

import type { Faq, Step } from "./services";

export type Practice = "immigration" | "personal-injury";

export type LocalStat = { value: string; label: string; source: { label: string; href: string } };

export type LocalService = { title: string; answer: string; text: string; href?: string };

export type Location = {
  slug: string;
  practice: Practice;
  city: string;
  state: string;
  stateCode: string;
  metro: string;
  neighbors: string[];
  related: string[];
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  eyebrow: string;
  h1: { lead: string; emphasis: string };
  answer: string;
  market: { heading: string; intro: string; stats: LocalStat[]; note: string };
  problems: { heading: string; intro: string; items: { title: string; text: string }[] };
  services: { heading: string; intro: string; items: LocalService[] };
  process: { heading: string; intro: string; steps: Step[] };
  comparison: { heading: string; intro: string; rows: { label: string; us: string; agency: string; leads: string }[] };
  faq: Faq[];
  closing: { heading: string; text: string };
  updated: string;
};

export const practiceHubs: Record<Practice, { slug: string; label: string; short: string; firms: string }> = {
  immigration: { slug: "immigration-law-firm-marketing", label: "Immigration Law Firm Marketing", short: "Immigration", firms: "immigration law firms" },
  "personal-injury": { slug: "personal-injury-law-firm-marketing", label: "Personal Injury Law Firm Marketing", short: "Personal injury", firms: "personal injury and bankruptcy law firms" },
};

/** Proof shown on every page. Each figure links to the story it comes from. */
export const locationProof = [
  { value: "79 → 115", label: "Signed clients a month for one US immigration law firm", href: "/case-study/immigration-law-firm-client-growth/" },
  { value: "915", label: "New clients signed in 9 months", href: "/case-study/immigration-law-firm-client-growth/" },
  { value: "+81%", label: "Google clicks, with ChatGPT visitors doubled", href: "/case-study/immigration-law-firm-seo-aeo-geo/" },
  { value: "1,053", label: "Calls from Google Business Profiles, top-5 map ranking", href: "/case-study/law-firm-google-business-profile-calls/" },
];

export const injuryProof = [
  { value: "14", label: "Google LSA leads for a bankruptcy firm, from a rebuilt website", href: "/case-study/bankruptcy-lawyer-marketing-from-scratch/" },
  { value: "79 → 115", label: "Signed clients a month for a multi-office law firm", href: "/case-study/immigration-law-firm-client-growth/" },
  { value: "+81%", label: "Google clicks, with ChatGPT visitors doubled", href: "/case-study/immigration-law-firm-seo-aeo-geo/" },
  { value: "1,053", label: "Calls from Google Business Profiles, top-5 map ranking", href: "/case-study/law-firm-google-business-profile-calls/" },
];

/** Same sentence on every page, so search engines and AI tools learn one consistent description. */
export const entitySentence =
  "Law Pro Digital is a digital growth agency for US immigration law firms, specializing in Meta Ads, SEO, AI search (AEO/GEO) and AI-powered client intake.";

const census = (place: string) => ({ label: "US Census QuickFacts", href: `https://www.census.gov/quickfacts/fact/table/${place}/PST045224` });

/* ---------- Shared building blocks (each takes the city so no two pages read the same) ---------- */

const immigrationServices = (city: string, area: string): LocalService[] => [
  { title: "Immigration lawyer SEO", answer: `We rank your practice pages for the cases you want in ${city} and ${area}.`, text: "Pages for family petitions, green cards, citizenship, work visas and asylum, each answering the questions clients search, with technical SEO done right.", href: "/immigration-lawyer-seo/" },
  { title: "Local SEO and Google Business Profile", answer: `Your firm shows up in the map pack when people search near ${city}.`, text: "Profile setup, weekly posts, photos, reviews and Q&A. For one firm this produced 1,053 calls and a top-5 map ranking.", href: "/law-firm-seo/" },
  { title: "AEO and GEO (AI search)", answer: `We get your firm named when people ask ChatGPT, Gemini or Google's AI Overviews for an immigration lawyer in ${city}.`, text: "Answer-first pages, consistent business facts across the web, FAQ and schema markup. One firm doubled its ChatGPT visitors.", href: "/ai-search-optimization-for-lawyers/" },
  { title: "AI-based marketing", answer: "AI finds the services, languages and neighborhoods that produce signed clients, then shifts budget there.", text: "Weekly analysis of ads, calls and intake data, with plain-English recommendations you approve." },
  { title: "Google Ads and Local Services Ads", answer: "Paid search for people ready to hire, measured by cost per signed client.", text: "Campaigns by service and language, call tracking on every number and negative keywords that stop wasted spend.", href: "/law-firm-ppc-agency/" },
  { title: "Facebook and Instagram ads", answer: "Messaging-first Meta campaigns that start real conversations in English and other languages.", text: "The same system produced 15,738 conversations and leads for one immigration firm.", href: "/facebook-instagram-ads-for-law-firms/" },
  { title: "AI client intake", answer: "Every inquiry gets a reply in seconds, day or night, so more leads become retained clients.", text: "AI chat on your site, WhatsApp and Messenger that qualifies the case, books the consultation and hands off to your team.", href: "/ai-solutions/" },
  { title: "Content writing", answer: `Clear, attorney-reviewed articles and FAQs that answer what ${city} clients search.`, text: "Visa Bulletin updates, process timelines and cost guides that build trust and rank." },
  { title: "Website design", answer: "A fast, mobile-first site built to turn visitors into consultations.", text: "Multilingual pages, click-to-call, WhatsApp and booking on every page.", href: "/website-design/" },
  { title: "Branding and video marketing", answer: "Attorney-led video and a clear brand that make families trust you before they call.", text: "Short videos for Facebook, Instagram and YouTube. One firm's video work reached 8.5M views.", href: "/video-marketing-for-law-firms/" },
];

const injuryServices = (city: string): LocalService[] => [
  { title: "Personal injury and bankruptcy SEO", answer: `We rank your practice pages for car accident, injury and bankruptcy searches in ${city}.`, text: "Pages for every case type you take, written to answer real client questions, with technical SEO done right.", href: "/law-firm-seo/" },
  { title: "Local SEO and Google Business Profile", answer: `Your firm shows up in the map pack when people search near ${city}.`, text: "Profile setup, weekly posts, photos, reviews and Q&A. For one firm this produced 1,053 calls and a top-5 map ranking.", href: "/law-firm-seo/" },
  { title: "Google Local Services Ads", answer: "Pay per lead, with the Google Screened badge at the very top of the results.", text: "For one bankruptcy firm, $1,855 in LSA spend produced 14 qualified leads at $132 each.", href: "/law-firm-ppc-agency/" },
  { title: "AEO and GEO (AI search)", answer: `We get your firm named when people ask ChatGPT or Google's AI Overviews for a lawyer in ${city}.`, text: "Answer-first pages, consistent business facts across the web, FAQ and schema markup.", href: "/ai-search-optimization-for-lawyers/" },
  { title: "AI-based marketing", answer: "AI finds the case types and neighborhoods that sign, then shifts budget there.", text: "Weekly analysis of ads, calls and intake data, with plain-English recommendations you approve." },
  { title: "Google Ads and Meta Ads", answer: "Paid search and social for people ready to hire, measured by cost per signed case.", text: "Campaigns by case type, call tracking on every number and negative keywords that stop wasted spend.", href: "/facebook-instagram-ads-for-law-firms/" },
  { title: "AI client intake", answer: "Every accident or debt inquiry gets a reply in seconds, so fewer cases go to the next firm.", text: "AI chat on your site, text and Messenger that qualifies the case and books the consultation.", href: "/ai-solutions/" },
  { title: "Content writing", answer: `Clear articles that answer what ${city} clients ask after an accident or about bankruptcy.`, text: "Florida deadlines, insurance steps, Chapter 7 vs Chapter 13 guides, reviewed by your attorneys." },
  { title: "Website design", answer: "A fast, mobile-first site built to turn visitors into consultations.", text: "Click-to-call, text and booking on every page.", href: "/website-design/" },
  { title: "Branding and video marketing", answer: "Attorney-led video that builds trust before the first call.", text: "Short videos for Facebook, Instagram and YouTube, plus a clear brand that stands apart from TV firms.", href: "/video-marketing-for-law-firms/" },
];

const process = (city: string): { heading: string; intro: string; steps: Step[] } => ({
  heading: "From free call to signed cases in 90 days",
  intro: "A clear plan, with a scorecard every month.",
  steps: [
    { title: "Free AI lead audit (week 1)", text: `We record a video review of your Google ranking, map listing, ads, AI visibility and after-hours response in ${city}.` },
    { title: "Strategy and setup (weeks 2–4)", text: "Call tracking, intake, practice pages and campaigns by service and language." },
    { title: "Launch and test (month 2)", text: "SEO, ads, content and AI intake go live; small tests find what signs best." },
    { title: "Scale what signs (month 3+)", text: "Budget moves to the services with the lowest cost per signed client." },
  ],
});

const comparison = (city: string) => ({
  heading: "Law Pro Digital vs a general agency vs a lead seller",
  intro: `What ${city} firms get from each option.`,
  rows: [
    { label: "Works only with law firms", us: "Yes", agency: "Rarely", leads: "Yes" },
    { label: "Campaigns in your clients' languages", us: "Yes", agency: "Rarely", leads: "No" },
    { label: "Ranks you in ChatGPT and AI Overviews", us: "Yes", agency: "Rarely", leads: "No" },
    { label: "AI intake that replies in seconds", us: "Yes", agency: "No", leads: "No" },
    { label: "Leads only for your firm", us: "Yes", agency: "Yes", leads: "Often shared" },
    { label: "Custom package for your caseload", us: "Yes", agency: "Sometimes", leads: "No" },
    { label: "Reports cost per signed client", us: "Yes", agency: "Rarely", leads: "No" },
    { label: "Long contracts", us: "No", agency: "Often", leads: "Often" },
  ],
});

const commonFaq = (city: string): Faq[] => [
  { q: `Can you build a custom package for my ${city} firm?`, a: "Yes. Plans start at $1,500 a month plus ad spend, and we build custom packages around your caseload, languages, budget and the services you want to grow. Tell us your goals on the free call and we send a written proposal." },
  { q: "Can you get our firm recommended by ChatGPT and Google's AI?", a: "Yes. AI tools name firms they can verify and quote. We publish answer-first pages, keep your business details consistent across the web and add FAQ and schema markup. For one immigration firm this doubled visitors from ChatGPT." },
  { q: "Do I have to sign a long contract?", a: "No. We earn the next month by showing results in a monthly scorecard, from first click to signed client." },
];

const closing = (city: string, area: string) => ({
  heading: `Ready to sign more cases in ${city}?`,
  text: `Book a free call or send the form. We will show you where your firm ranks today, what competitors in ${area} are doing, and the fastest way to more signed cases.`,
});

const UPDATED = "2026-10-29";

/* ---------- The 12 wave 1 pages ---------- */

export const locations: Location[] = [
  {
    slug: "sugar-land-tx", practice: "immigration", city: "Sugar Land", state: "Texas", stateCode: "TX", metro: "Houston",
    neighbors: ["Missouri City", "Stafford", "Richmond", "Rosenberg", "Fulshear", "Meadows Place", "Fort Bend County"],
    related: ["katy-tx", "pasadena-tx"],
    metaTitle: "Immigration Lawyer SEO Sugar Land: More Signed Cases",
    metaDescription: "Sugar Land immigration firms: rank on Google, Maps and ChatGPT, run multilingual ads and sign more cases with AI intake. Custom packages. Free call.",
    primaryKeyword: "immigration lawyer seo sugar land",
    eyebrow: "Sugar Land, TX · Fort Bend County",
    h1: { lead: "Immigration Lawyer SEO & AI Marketing in", emphasis: "Sugar Land, TX" },
    answer: "Law Pro Digital helps immigration law firms in Sugar Land sign more retained clients. We rank your firm on Google, Google Maps and AI answers like ChatGPT, run Meta and Google ads in the languages your clients speak, and reply to every inquiry in seconds with AI intake. Every month you see cost per signed client, not clicks.",
    market: {
      heading: "Sugar Land: a large, multilingual immigration market",
      intro: "More than a third of Sugar Land residents were born outside the US, and nearly half speak another language at home. That is steady demand for family petitions, green cards, citizenship and work visas, and many firms competing for it.",
      stats: [
        { value: "35.7%", label: "of residents were born outside the US (2020–2024)", source: census("sugarlandcitytexas") },
        { value: "45.0%", label: "speak a language other than English at home", source: census("sugarlandcitytexas") },
        { value: "107,726", label: "residents (July 2025 estimate)", source: census("sugarlandcitytexas") },
        { value: "38.7%", label: "of residents are Asian alone, by Census race definitions", source: census("sugarlandcitytexas") },
      ],
      note: "What it means for your firm: clients search in English and in their own language, compare several firms online and often ask an AI tool first. The firm that answers fastest, in the right language, signs the case.",
    },
    problems: {
      heading: "Why Sugar Land immigration firms lose cases they should win",
      intro: "We audit every new firm before we touch a campaign. In Fort Bend County the same three gaps come up again and again.",
      items: [
        { title: "Directories take the clicks", text: "Search \"immigration lawyer Sugar Land\" and directories like Martindale, LawInfo and Cornell LII fill page one. Your own site sits below them, so people call whoever the directory shows first." },
        { title: "Searches in other languages go unanswered", text: "Nearly half of Sugar Land speaks another language at home. If your site, Google profile and ads only speak English, those cases go to the firm that answers in the client's language." },
        { title: "Leads arrive after hours and wait", text: "Immigration clients message at night and on weekends. At one firm we audited, 197 of 265 monthly calls had no recorded source, so nobody knew which leads were lost." },
      ],
    },
    services: { heading: "Everything your Sugar Land firm needs to grow, from one team", intro: "One team, one monthly scorecard, every channel measured to signed retainers.", items: immigrationServices("Sugar Land", "Fort Bend County") },
    process: process("Sugar Land"), comparison: comparison("Sugar Land"),
    faq: [
      { q: "How much does immigration lawyer SEO cost in Sugar Land?", a: "Plans start at $1,500 a month, plus ad spend if you run ads. Most Sugar Land immigration firms start with SEO, Google Business Profile and AI intake, then add Meta or Google ads once tracking shows which services sign best." },
      { q: "How long does it take to rank in Sugar Land?", a: "Google Maps and AI intake usually show results in the first 30 to 60 days. Practice pages for competitive services like green cards typically take 3 to 6 months to reach page one. Ads can bring consultations in the first month." },
      { q: "Do you run ads in languages other than English?", a: "Yes. We run campaigns in the languages your clients speak, with intake that replies in the same language, so the conversation does not stop at the first message." },
      ...commonFaq("Sugar Land"),
    ],
    closing: closing("Sugar Land", "Fort Bend County"), updated: UPDATED,
  },
  {
    slug: "katy-tx", practice: "immigration", city: "Katy", state: "Texas", stateCode: "TX", metro: "Houston",
    neighbors: ["Cinco Ranch", "Fulshear", "Brookshire", "Cypress", "Richmond", "Sealy", "West Houston"],
    related: ["sugar-land-tx", "pasadena-tx"],
    metaTitle: "Katy Immigration Law Firm Marketing That Signs Cases",
    metaDescription: "Katy immigration firms: rank on Google and ChatGPT, run Meta and Google ads that sign cases and convert leads with AI intake. Custom packages. Free call.",
    primaryKeyword: "immigration law firm marketing katy",
    eyebrow: "Katy, TX · West Houston",
    h1: { lead: "Immigration Law Firm Marketing in", emphasis: "Katy, TX" },
    answer: "Law Pro Digital helps immigration law firms in Katy and west Houston turn searches into signed cases. We combine immigration lawyer SEO, Google Maps, AI search, Meta and Google ads and AI intake into one system, so families find you first, hear back in seconds and book a consultation.",
    market: {
      heading: "Katy is growing fast, and its clients search before they call",
      intro: "Katy city limits are small, but the wider Katy area reaches across Harris, Fort Bend and Waller counties. One in five Katy residents was born abroad, and a third speak another language at home.",
      stats: [
        { value: "20.2%", label: "of Katy residents were born outside the US (2020–2024)", source: census("katycitytexas") },
        { value: "33.6%", label: "speak a language other than English at home", source: census("katycitytexas") },
        { value: "29.8%", label: "of residents are Hispanic or Latino", source: census("katycitytexas") },
        { value: "11.6%", label: "of residents are Asian alone", source: census("katycitytexas") },
      ],
      note: "What it means for your firm: Katy families compare firms on their phones, often in two languages. A strong Google Maps listing and fast replies decide who gets the consultation.",
    },
    problems: {
      heading: "Why Katy immigration firms miss out on local cases",
      intro: "Three gaps we see when we audit firms in west Houston.",
      items: [
        { title: "LawInfo and FindLaw own page one", text: "Search \"immigration lawyer Katy TX\" and directory pages from LawInfo and FindLaw fill the results, listing dozens of firms side by side. Clients pick from the list, not from your site." },
        { title: "Katy firms compete with all of Houston", text: "Big Houston firms advertise across the metro. Without pages and a map listing built for Katy and Cinco Ranch, you pay Houston prices for clicks that never sign." },
        { title: "No follow-up on weekend leads", text: "Families reach out after work and on weekends. Without instant replies, a lead that waits until Monday often hires someone else." },
      ],
    },
    services: { heading: "What we do for Katy immigration firms", intro: "Every service is measured to signed retainers, in one monthly scorecard.", items: immigrationServices("Katy", "west Houston") },
    process: process("Katy"), comparison: comparison("Katy"),
    faq: [
      { q: "How much does immigration law firm marketing cost in Katy?", a: "Plans start at $1,500 a month, plus ad spend. Many Katy firms start with Google Business Profile, SEO for their top services and AI intake, then add Meta ads to reach families searching in Spanish and other languages." },
      { q: "Can a Katy firm rank against big Houston firms?", a: "Yes, locally. Google favors the closest relevant firm in the map pack, and Katy-specific pages answer Katy searches better than a Houston page. We build both, so you win the searches near your office first." },
      { q: "How fast will we see new consultations?", a: "Ads and AI intake can add consultations in the first month. Map rankings usually improve in 30 to 60 days, and organic pages for competitive services take 3 to 6 months." },
      ...commonFaq("Katy"),
    ],
    closing: closing("Katy", "west Houston"), updated: UPDATED,
  },
  {
    slug: "pasadena-tx", practice: "immigration", city: "Pasadena", state: "Texas", stateCode: "TX", metro: "Houston",
    neighbors: ["Deer Park", "South Houston", "La Porte", "Baytown", "Pearland", "Channelview", "East Houston"],
    related: ["sugar-land-tx", "katy-tx"],
    metaTitle: "Pasadena TX Immigration Lawyers: Fill Your Calendar",
    metaDescription: "Spanish and English marketing for Pasadena, TX immigration lawyers: local SEO, Google Maps, Meta ads and AI intake. Custom packages. Free 30-minute call.",
    primaryKeyword: "immigration lawyer marketing pasadena tx",
    eyebrow: "Pasadena, TX · East Harris County",
    h1: { lead: "Immigration Lawyer Marketing in", emphasis: "Pasadena, TX" },
    answer: "Law Pro Digital helps immigration lawyers in Pasadena, Texas fill their consultation calendar. We run Spanish and English campaigns across Google, Google Maps, Facebook and Instagram, rank your firm in AI answers, and reply to every inquiry in seconds with bilingual AI intake.",
    market: {
      heading: "Pasadena is a Spanish-first immigration market",
      intro: "Seven in ten Pasadena residents are Hispanic or Latino, more than half speak another language at home, and over a quarter were born outside the US. Clients here often search, message and decide in Spanish.",
      stats: [
        { value: "70.9%", label: "of residents are Hispanic or Latino", source: census("pasadenacitytexas") },
        { value: "53.9%", label: "speak a language other than English at home", source: census("pasadenacitytexas") },
        { value: "26.9%", label: "were born outside the US (2020–2024)", source: census("pasadenacitytexas") },
        { value: "148,539", label: "residents (July 2025 estimate)", source: census("pasadenacitytexas") },
      ],
      note: "What it means for your firm: a Spanish-language website, Google profile and Meta ads are not extras in Pasadena. They are where most of your cases start.",
    },
    problems: {
      heading: "Why Pasadena immigration firms lose Spanish-speaking clients",
      intro: "What our audits find in east Harris County.",
      items: [
        { title: "Directories outrank local firms", text: "Search \"immigration lawyer Pasadena TX\" and Lawyers.com, LawInfo, Martindale and Cornell LII take most of page one. Clients meet the directory before they meet you." },
        { title: "English-only ads and pages", text: "With more than half of residents speaking another language at home, English-only campaigns leave most of the market to firms that answer in Spanish." },
        { title: "Messages answered too late", text: "Most families message after work. If WhatsApp and Messenger inquiries wait hours for a reply, the case often goes elsewhere." },
      ],
    },
    services: { heading: "Bilingual marketing for Pasadena immigration lawyers", intro: "Spanish and English, measured to signed retainers in one monthly scorecard.", items: immigrationServices("Pasadena", "east Harris County") },
    process: process("Pasadena"), comparison: comparison("Pasadena"),
    faq: [
      { q: "Do you run Spanish-language campaigns in Pasadena?", a: "Yes. We build Spanish and English ads, landing pages and Google Business Profile posts, and the AI intake replies in the client's language, day or night." },
      { q: "What does immigration lawyer marketing cost in Pasadena, TX?", a: "Plans start at $1,500 a month plus ad spend. Smaller Pasadena firms often start with Google Maps, Spanish Meta ads and AI intake, then add SEO for their top services." },
      { q: "Which services bring the most cases in Pasadena?", a: "It depends on your practice, and tracking shows it within weeks. For one immigration firm, citizenship (N-400) inquiries cost $3.23 each on Meta, among the lowest of 13 services we measured." },
      ...commonFaq("Pasadena"),
    ],
    closing: closing("Pasadena", "east Harris County"), updated: UPDATED,
  },
  {
    slug: "mcallen-tx", practice: "immigration", city: "McAllen", state: "Texas", stateCode: "TX", metro: "Rio Grande Valley",
    neighbors: ["Edinburg", "Mission", "Pharr", "Weslaco", "Hidalgo", "Harlingen", "Hidalgo County"],
    related: ["pasadena-tx", "garland-tx"],
    metaTitle: "McAllen Immigration Lawyer SEO: More Signed Clients",
    metaDescription: "McAllen and Rio Grande Valley immigration firms: own Google, Maps and AI answers, run bilingual ads and sign more cases with AI intake. Custom packages.",
    primaryKeyword: "immigration lawyer seo mcallen",
    eyebrow: "McAllen, TX · Rio Grande Valley",
    h1: { lead: "Immigration Lawyer SEO & Lead Generation in", emphasis: "McAllen, TX" },
    answer: "Law Pro Digital helps immigration lawyers in McAllen and the Rio Grande Valley get found and hired. We rank your firm above the directories on Google and Google Maps, get you named in AI answers, run bilingual Meta and Google ads, and answer every inquiry in seconds with AI intake.",
    market: {
      heading: "McAllen is a bilingual border market with heavy immigration demand",
      intro: "Nearly three in four McAllen residents speak another language at home, and more than a quarter were born outside the US. Immigration questions here are everyday family questions, asked in Spanish and English.",
      stats: [
        { value: "73.7%", label: "speak a language other than English at home", source: census("mcallencitytexas") },
        { value: "87.0%", label: "of residents are Hispanic or Latino", source: census("mcallencitytexas") },
        { value: "26.2%", label: "were born outside the US (2020–2024)", source: census("mcallencitytexas") },
        { value: "150,640", label: "residents (July 2025 estimate)", source: census("mcallencitytexas") },
      ],
      note: "What it means for your firm: in McAllen the firm that answers in Spanish, ranks on Maps and replies first gets the call. Directories are the main competitor online, and they can be beaten.",
    },
    problems: {
      heading: "Why McAllen immigration firms depend on directories",
      intro: "What the local search results and our audits show.",
      items: [
        { title: "Page one is all directories", text: "Search \"immigration lawyer McAllen\" and FindLaw, Martindale, LawInfo and Cornell LII fill the results. Few local firms have pages strong enough to rank on their own." },
        { title: "Spanish searches go to whoever answers", text: "With most residents speaking Spanish at home, a firm with Spanish pages, Spanish Google posts and Spanish intake wins searches that English-only sites never see." },
        { title: "Leads without tracking", text: "Many firms cannot say which calls came from Google, Facebook or referrals. Without tracking, budget goes to the wrong channels." },
      ],
    },
    services: { heading: "What we do for McAllen immigration firms", intro: "Bilingual, measured to signed retainers, in one monthly scorecard.", items: immigrationServices("McAllen", "the Rio Grande Valley") },
    process: process("McAllen"), comparison: comparison("McAllen"),
    faq: [
      { q: "Can our firm outrank FindLaw and Martindale in McAllen?", a: "Yes, for many searches. Directories rank on one generic page per city. A firm page that answers specific questions, plus a strong Google Business Profile and reviews, often beats them for service and Spanish-language searches." },
      { q: "How much does immigration lawyer SEO cost in McAllen?", a: "Plans start at $1,500 a month plus ad spend. Many Rio Grande Valley firms start with Google Maps, Spanish content and AI intake." },
      { q: "Do you cover Edinburg, Mission and Pharr too?", a: "Yes. We target the whole Rio Grande Valley from one plan, with Google profile and page signals for each area you serve." },
      ...commonFaq("McAllen"),
    ],
    closing: closing("McAllen", "the Rio Grande Valley"), updated: UPDATED,
  },
  {
    slug: "irving-tx", practice: "immigration", city: "Irving", state: "Texas", stateCode: "TX", metro: "Dallas–Fort Worth",
    neighbors: ["Las Colinas", "Grand Prairie", "Coppell", "Euless", "Carrollton", "Farmers Branch", "Dallas"],
    related: ["garland-tx", "sugar-land-tx"],
    metaTitle: "Irving Immigration Law Firm SEO: Rank on Google & AI",
    metaDescription: "Irving immigration firms: SEO, AI search optimization, Google and Meta ads, content and AI intake from a law-firm-only team. Custom packages. Free call.",
    primaryKeyword: "immigration law firm seo irving",
    eyebrow: "Irving, TX · Dallas–Fort Worth",
    h1: { lead: "Immigration Law Firm SEO & Marketing in", emphasis: "Irving, TX" },
    answer: "Law Pro Digital helps immigration law firms in Irving rank on Google, Google Maps and AI answers, and turn that visibility into signed cases. We run SEO, Meta and Google ads, content and AI intake as one system, measured every month by cost per signed client.",
    market: {
      heading: "Irving: more than four in ten residents were born abroad",
      intro: "More than four in ten Irving residents were born outside the US, and six in ten speak another language at home. Demand spans family immigration, citizenship and employment visas for the Las Colinas business district.",
      stats: [
        { value: "42.5%", label: "of residents were born outside the US (2020–2024)", source: census("irvingcitytexas") },
        { value: "61.8%", label: "speak a language other than English at home", source: census("irvingcitytexas") },
        { value: "23.2%", label: "of residents are Asian alone", source: census("irvingcitytexas") },
        { value: "43.4%", label: "of residents are Hispanic or Latino", source: census("irvingcitytexas") },
      ],
      note: "What it means for your firm: Irving needs two messages at once, family immigration in Spanish and work visas for professionals. One generic page cannot win both.",
    },
    problems: {
      heading: "Why Irving immigration firms struggle online",
      intro: "What the search results and our audits show in Dallas–Fort Worth.",
      items: [
        { title: "Template agency pages crowd the results", text: "Search \"law firm SEO Irving\" and national agencies show the same template page for every city. Firms hire them, and their own sites end up looking just as generic." },
        { title: "Two audiences, one message", text: "Families looking for green cards and professionals looking for H-1B or green card sponsorship need different pages, ads and intake questions." },
        { title: "Dallas competition raises costs", text: "Dallas firms bid across the metro. Without Irving-specific campaigns and tracking, ad budgets go to clicks that never become clients." },
      ],
    },
    services: { heading: "What we do for Irving immigration firms", intro: "Family and employment immigration, measured to signed retainers.", items: immigrationServices("Irving", "Dallas–Fort Worth") },
    process: process("Irving"), comparison: comparison("Irving"),
    faq: [
      { q: "Do you market employment visas as well as family cases in Irving?", a: "Yes. We build separate pages, ads and intake flows for family petitions, citizenship and employment cases, so each audience gets the answer it searched for." },
      { q: "How much does immigration law firm SEO cost in Irving?", a: "Plans start at $1,500 a month plus ad spend. Firms covering both family and employment immigration usually need a custom package with more pages and campaigns." },
      { q: "How long until we rank in Irving?", a: "Map rankings usually improve within 30 to 60 days. Service pages typically need 3 to 6 months to reach page one, and ads can bring consultations in the first month." },
      ...commonFaq("Irving"),
    ],
    closing: closing("Irving", "Dallas–Fort Worth"), updated: UPDATED,
  },
  {
    slug: "garland-tx", practice: "immigration", city: "Garland", state: "Texas", stateCode: "TX", metro: "Dallas–Fort Worth",
    neighbors: ["Rowlett", "Mesquite", "Richardson", "Sachse", "Rockwall", "Wylie", "Dallas"],
    related: ["irving-tx", "mcallen-tx"],
    metaTitle: "Garland Immigration Lawyers: Win the Spanish Searches",
    metaDescription: "Grow your Garland immigration practice with local SEO, AI search, bilingual Meta ads and AI intake that turns leads into retained clients. Custom packages.",
    primaryKeyword: "immigration lawyer marketing garland",
    eyebrow: "Garland, TX · Dallas County",
    h1: { lead: "Immigration Lawyer Marketing in", emphasis: "Garland, TX" },
    answer: "Law Pro Digital helps immigration lawyers in Garland win more local cases. We rank your firm on Google, Google Maps and AI answers, run bilingual Meta and Google ads, publish content that answers real client questions, and reply to every inquiry in seconds with AI intake.",
    market: {
      heading: "Garland has a large immigrant community and few strong local firm websites",
      intro: "Nearly a third of Garland residents were born outside the US and more than half speak another language at home. Many clients search in Spanish, and others in Vietnamese and other Asian languages.",
      stats: [
        { value: "31.7%", label: "of residents were born outside the US (2020–2024)", source: census("garlandcitytexas") },
        { value: "53.1%", label: "speak a language other than English at home", source: census("garlandcitytexas") },
        { value: "45.7%", label: "of residents are Hispanic or Latino", source: census("garlandcitytexas") },
        { value: "249,625", label: "residents (July 2025 estimate)", source: census("garlandcitytexas") },
      ],
      note: "What it means for your firm: Garland is big enough to support several busy immigration practices, and the firms that show up in every language clients use will take the largest share.",
    },
    problems: {
      heading: "Why Garland immigration firms lose cases to Dallas",
      intro: "What the local results and our audits show.",
      items: [
        { title: "Directories and out-of-town firms rank first", text: "Search \"immigration lawyer Garland TX\" and LawInfo, Martindale and Cornell LII share page one with firms based elsewhere that built Garland pages. Local firms are hard to find." },
        { title: "No Spanish-language presence", text: "With nearly half the city Hispanic or Latino, a firm without Spanish pages, Spanish reviews and Spanish ads misses a large part of local demand." },
        { title: "Content that does not answer questions", text: "Clients search questions like how long a green card takes or what citizenship costs. Firms whose sites only list services rarely appear for those searches or in AI answers." },
      ],
    },
    services: { heading: "What we do for Garland immigration firms", intro: "Local, bilingual and measured to signed retainers.", items: immigrationServices("Garland", "east Dallas County") },
    process: process("Garland"), comparison: comparison("Garland"),
    faq: [
      { q: "How do we beat out-of-town firms that rank in Garland?", a: "With a strong Google Business Profile at your Garland address, Garland-specific pages that answer real questions, and steady reviews. Google favors the closest relevant firm in the map pack." },
      { q: "What does immigration lawyer marketing cost in Garland?", a: "Plans start at $1,500 a month plus ad spend, with custom packages for firms that want more services, languages or offices." },
      { q: "Can you run ads in Vietnamese and other languages?", a: "Yes. We run campaigns in the languages your clients speak, with intake that answers in the same language." },
      ...commonFaq("Garland"),
    ],
    closing: closing("Garland", "east Dallas County"), updated: UPDATED,
  },
  {
    slug: "doral-fl", practice: "immigration", city: "Doral", state: "Florida", stateCode: "FL", metro: "Miami",
    neighbors: ["Miami", "Hialeah", "Miami Springs", "Sweetwater", "Medley", "Fontainebleau", "Kendall"],
    related: ["hialeah-fl", "kissimmee-fl"],
    metaTitle: "Doral Immigration Lawyer SEO: Own Google & ChatGPT",
    metaDescription: "Doral immigration attorneys: rank in Google, Maps and ChatGPT, run Spanish-language ads and convert more consultations with AI intake. Custom packages.",
    primaryKeyword: "immigration lawyer seo doral",
    eyebrow: "Doral, FL · Miami-Dade County",
    h1: { lead: "Immigration Lawyer SEO & AI Marketing in", emphasis: "Doral, FL" },
    answer: "Law Pro Digital helps immigration attorneys in Doral get found on Google, Google Maps and AI tools like ChatGPT, then turn those searches into signed cases. We run Spanish and English SEO, Meta and Google ads and AI intake that answers every inquiry in seconds.",
    market: {
      heading: "In Doral, seven in ten residents were born abroad",
      intro: "Doral's residents were mostly born abroad, and more than nine in ten residents speak another language at home. Immigration is a daily need here, and clients research in Spanish.",
      stats: [
        { value: "70.3%", label: "of residents were born outside the US (2020–2024)", source: census("doralcityflorida") },
        { value: "93.3%", label: "speak a language other than English at home", source: census("doralcityflorida") },
        { value: "85.5%", label: "of residents are Hispanic or Latino", source: census("doralcityflorida") },
        { value: "81,634", label: "residents (July 2025 estimate)", source: census("doralcityflorida") },
      ],
      note: "What it means for your firm: in Doral, Spanish is the default. Your website, Google profile, ads, videos and intake all need to work in Spanish first.",
    },
    problems: {
      heading: "Why Doral immigration firms work too hard for each case",
      intro: "What we see in Miami-Dade audits.",
      items: [
        { title: "Generic agency pages, generic results", text: "Search \"law firm SEO Doral\" and template agency pages fill the results. Firms that hire them get the same generic pages, which rarely rank for real immigration questions." },
        { title: "Spanish content is thin", text: "Many sites have one translated page. Clients searching in Spanish for asylum, TPS, family petitions or citizenship find directories and national firms instead." },
        { title: "Too many leads, too little follow-up", text: "Busy Miami-Dade firms often get more messages than staff can answer. AI intake replies in seconds and books qualified consultations." },
      ],
    },
    services: { heading: "What we do for Doral immigration attorneys", intro: "Spanish-first, measured to signed retainers.", items: immigrationServices("Doral", "Miami-Dade County") },
    process: process("Doral"), comparison: comparison("Doral"),
    faq: [
      { q: "Do you write Spanish content for Doral immigration firms?", a: "Yes. We write Spanish pages, FAQs, Google posts and video scripts, reviewed by your attorneys, so you rank for the searches Doral clients actually make." },
      { q: "How much does immigration lawyer SEO cost in Doral?", a: "Plans start at $1,500 a month plus ad spend. Doral firms usually need Spanish and English content, so many choose a custom package." },
      { q: "Can AI intake handle Spanish conversations?", a: "Yes. It replies in Spanish or English, asks your screening questions, books the consultation and hands the conversation to your team." },
      ...commonFaq("Doral"),
    ],
    closing: closing("Doral", "Miami-Dade County"), updated: UPDATED,
  },
  {
    slug: "hialeah-fl", practice: "immigration", city: "Hialeah", state: "Florida", stateCode: "FL", metro: "Miami",
    neighbors: ["Miami Lakes", "Hialeah Gardens", "Miami Springs", "Doral", "Opa-locka", "Medley", "Miami"],
    related: ["doral-fl", "kissimmee-fl"],
    metaTitle: "Hialeah Immigration Lawyers: More Cases, Less Ad Waste",
    metaDescription: "Hialeah immigration firms: bilingual SEO, Google Business Profile, Meta and Google ads, video and AI intake that signs more cases. Custom packages.",
    primaryKeyword: "immigration lawyer marketing hialeah",
    eyebrow: "Hialeah, FL · Miami-Dade County",
    h1: { lead: "Immigration Lawyer Marketing in", emphasis: "Hialeah, FL" },
    answer: "Law Pro Digital helps immigration lawyers in Hialeah sign more cases for less ad spend. We build trust in Spanish with video, reviews and a verified Google profile, rank your firm on Google and AI answers, run Meta and Google ads, and reply to every inquiry in seconds with AI intake.",
    market: {
      heading: "In Hialeah, three in four residents were born abroad",
      intro: "More than nine in ten Hialeah residents speak another language at home. Clients here choose a lawyer they trust, in Spanish.",
      stats: [
        { value: "74.5%", label: "of residents were born outside the US (2020–2024)", source: census("hialeahcityflorida") },
        { value: "92.6%", label: "speak a language other than English at home", source: census("hialeahcityflorida") },
        { value: "95.1%", label: "of residents are Hispanic or Latino", source: census("hialeahcityflorida") },
        { value: "230,968", label: "residents (July 2025 estimate)", source: census("hialeahcityflorida") },
      ],
      note: "What it means for your firm: trust decides the case. Local news has covered people posing as immigration lawyers in Hialeah, so verified profiles, real reviews and attorney video matter more here than anywhere.",
    },
    problems: {
      heading: "Why Hialeah immigration firms pay too much for each case",
      intro: "What we see in Spanish-language search and our audits.",
      items: [
        { title: "Directories win the Spanish searches", text: "Search \"abogado de inmigración Hialeah\" and Avvo, Expertise and Abogado.com fill the results. Firms without strong Spanish pages lose those clients to the directories' lists." },
        { title: "Trust is hard to earn online", text: "After news of fake immigration lawyers in the area, clients look for proof: bar status, reviews, video of the attorney. Sites without it lose the call." },
        { title: "Ads that pay for clicks, not cases", text: "Without tracking to signed clients, ad budgets go to cheap clicks. For one firm, the office with the most expensive leads actually had the cheapest clients." },
      ],
    },
    services: { heading: "What we do for Hialeah immigration lawyers", intro: "Spanish-first, built on trust, measured to signed retainers.", items: immigrationServices("Hialeah", "Miami-Dade County") },
    process: process("Hialeah"), comparison: comparison("Hialeah"),
    faq: [
      { q: "How do you build trust for a Hialeah firm online?", a: "With a verified Google Business Profile, steady real reviews, attorney-led video in Spanish and clear pages that show your bar membership and experience. These also help AI tools recommend you." },
      { q: "What does immigration lawyer marketing cost in Hialeah?", a: "Plans start at $1,500 a month plus ad spend. We build custom packages for firms that want Spanish video, more services or several offices." },
      { q: "Do you market for personal injury firms in Hialeah too?", a: "Yes. Immigration is our main focus, and we also work with personal injury and bankruptcy firms." },
      ...commonFaq("Hialeah"),
    ],
    closing: closing("Hialeah", "Miami-Dade County"), updated: UPDATED,
  },
  {
    slug: "kissimmee-fl", practice: "immigration", city: "Kissimmee", state: "Florida", stateCode: "FL", metro: "Orlando",
    neighbors: ["Orlando", "St. Cloud", "Celebration", "Poinciana", "Buenaventura Lakes", "Hunters Creek", "Osceola County"],
    related: ["doral-fl", "hialeah-fl"],
    metaTitle: "Kissimmee Immigration & Injury Firms: Sign More Cases",
    metaDescription: "Kissimmee immigration and injury lawyers: SEO, AI search, bilingual paid ads and AI intake from a team that only works with law firms. Custom packages.",
    primaryKeyword: "immigration law firm marketing kissimmee",
    eyebrow: "Kissimmee, FL · Osceola County",
    h1: { lead: "Immigration & Injury Law Firm Marketing in", emphasis: "Kissimmee, FL" },
    answer: "Law Pro Digital helps immigration and personal injury firms in Kissimmee and Osceola County sign more cases. We rank your firm on Google, Google Maps and AI answers, run bilingual Meta and Google ads, and reply to every inquiry in seconds with AI intake, measured by cost per signed client.",
    market: {
      heading: "Kissimmee is a fast-growing, bilingual market south of Orlando",
      intro: "More than a third of Kissimmee residents were born outside the US, and nearly seven in ten speak another language at home. Clients need both immigration help and, on busy tourist-corridor roads, accident lawyers.",
      stats: [
        { value: "37.4%", label: "of residents were born outside the US (2020–2024)", source: census("kissimmeecityflorida") },
        { value: "69.2%", label: "speak a language other than English at home", source: census("kissimmeecityflorida") },
        { value: "68.8%", label: "of residents are Hispanic or Latino", source: census("kissimmeecityflorida") },
        { value: "85,591", label: "residents (July 2025 estimate)", source: census("kissimmeecityflorida") },
      ],
      note: "What it means for your firm: Kissimmee clients search in Spanish and English, and Orlando firms compete for them. Local pages and a strong map listing in Osceola County give you the edge.",
    },
    problems: {
      heading: "Why Kissimmee firms lose cases to Orlando",
      intro: "What the local results and our audits show.",
      items: [
        { title: "Orlando firms and directories rank first", text: "Search for lawyers in Kissimmee and template agency pages and FindLaw listings show up alongside Orlando firms. Local firms rarely appear on their own." },
        { title: "One English page for two languages", text: "With most residents speaking another language at home, firms without Spanish pages and intake lose many of the searches that start in Spanish." },
        { title: "Injury leads go cold fast", text: "Accident victims call several firms in the first hours. The firm that replies first, day or night, usually signs the case." },
      ],
    },
    services: { heading: "What we do for Kissimmee law firms", intro: "Immigration first, injury too, all measured to signed retainers.", items: immigrationServices("Kissimmee", "Osceola County") },
    process: process("Kissimmee"), comparison: comparison("Kissimmee"),
    faq: [
      { q: "Do you work with both immigration and personal injury firms in Kissimmee?", a: "Yes. Immigration is our main focus, and we also run SEO, ads and intake for personal injury and bankruptcy firms." },
      { q: "How much does law firm marketing cost in Kissimmee?", a: "Plans start at $1,500 a month plus ad spend. Firms with two practice areas usually choose a custom package so each gets its own pages and campaigns." },
      { q: "Can we rank in Orlando too?", a: "Yes, over time. We start where you can win fastest, Kissimmee and Osceola County, then expand pages and map signals toward Orlando." },
      ...commonFaq("Kissimmee"),
    ],
    closing: closing("Kissimmee", "Osceola County"), updated: UPDATED,
  },
  {
    slug: "brandon-fl", practice: "personal-injury", city: "Brandon", state: "Florida", stateCode: "FL", metro: "Tampa Bay",
    neighbors: ["Tampa", "Riverview", "Valrico", "Seffner", "Plant City", "Lithia", "Hillsborough County"],
    related: [],
    metaTitle: "Brandon FL Injury Lawyer Marketing: Beat the TV Firms",
    metaDescription: "Brandon injury and bankruptcy firms: Google LSA, local SEO, AI search and intake that signs more cases, backed by real law firm results. Custom packages.",
    primaryKeyword: "personal injury lawyer marketing brandon fl",
    eyebrow: "Brandon, FL · Hillsborough County",
    h1: { lead: "Personal Injury & Bankruptcy Lawyer Marketing in", emphasis: "Brandon, FL" },
    answer: "Law Pro Digital helps personal injury and bankruptcy firms in Brandon compete with the big Tampa TV firms. We rank your firm on Google, Google Maps and AI answers, run Google Local Services Ads and Meta ads, and reply to every accident or debt inquiry in seconds with AI intake.",
    market: {
      heading: "Brandon is a large suburb with big-firm competition",
      intro: "Brandon is home to more than 114,000 people, east of Tampa along I-75 and the Selmon Expressway. Large Tampa injury firms advertise heavily here, so smaller firms need to win the local searches.",
      stats: [
        { value: "114,626", label: "residents (2020 Census)", source: census("brandoncdpflorida") },
        { value: "29.7%", label: "speak a language other than English at home", source: census("brandoncdpflorida") },
        { value: "30.9%", label: "of residents are Hispanic or Latino", source: census("brandoncdpflorida") },
        { value: "$79,685", label: "median household income (2020–2024)", source: census("brandoncdpflorida") },
      ],
      note: "What it means for your firm: you cannot outspend the TV firms, but you can out-answer them. Local pages, fast replies and Spanish intake win cases they miss.",
    },
    problems: {
      heading: "Why Brandon injury firms lose cases to Tampa's biggest names",
      intro: "What the local search results show.",
      items: [
        { title: "Big Tampa firms built Brandon pages", text: "Search \"personal injury lawyer Brandon FL\" and large Tampa firms with Brandon location pages take most of page one, including one of the biggest national injury brands." },
        { title: "Slow replies lose accident cases", text: "Accident victims contact several firms in the first hours. If your intake waits until morning, a faster firm signs the case." },
        { title: "Bankruptcy clients search quietly", text: "People facing debt research privately, often at night, and ask AI tools first. Firms without clear, answer-first pages are invisible to them." },
      ],
    },
    services: { heading: "What we do for Brandon injury and bankruptcy firms", intro: "Measured to signed cases, in one monthly scorecard.", items: injuryServices("Brandon") },
    process: process("Brandon"), comparison: comparison("Brandon"),
    faq: [
      { q: "Can a Brandon firm compete with the big Tampa injury firms?", a: "Yes, locally. Google favors the closest relevant firm in the map pack, Local Services Ads charge per lead, and fast AI intake wins cases slower firms miss. You compete on speed and relevance, not TV budgets." },
      { q: "Do Google Local Services Ads work for bankruptcy lawyers?", a: "Yes. For one Maryland bankruptcy firm we rebuilt the website and ran LSA: $1,855 produced 14 qualified leads at $132 each." },
      { q: "How much does injury lawyer marketing cost in Brandon?", a: "Plans start at $1,500 a month plus ad spend. Injury firms usually add more ad budget, and we build a custom package around your case types." },
      ...commonFaq("Brandon"),
    ],
    closing: closing("Brandon", "Hillsborough County"), updated: UPDATED,
  },
  {
    slug: "duluth-ga", practice: "immigration", city: "Duluth", state: "Georgia", stateCode: "GA", metro: "Atlanta",
    neighbors: ["Suwanee", "Lawrenceville", "Norcross", "Johns Creek", "Peachtree Corners", "Buford", "Gwinnett County"],
    related: ["fairfax-va", "irving-tx"],
    metaTitle: "Duluth GA Immigration Lawyer SEO: Lead Gwinnett Search",
    metaDescription: "Duluth and Gwinnett immigration firms: multilingual SEO, AI search (AEO/GEO), Meta and Google ads and AI intake that books consultations. Custom packages.",
    primaryKeyword: "immigration lawyer seo duluth ga",
    eyebrow: "Duluth, GA · Gwinnett County",
    h1: { lead: "Immigration Lawyer SEO & Marketing in", emphasis: "Duluth, GA" },
    answer: "Law Pro Digital helps immigration lawyers in Duluth and Gwinnett County reach clients in every language they search in. We rank your firm on Google, Google Maps and AI answers, run multilingual Meta and Google ads, and answer every inquiry in seconds with AI intake.",
    market: {
      heading: "Duluth sits at the heart of Gwinnett's international community",
      intro: "Nearly a third of Duluth residents were born outside the US, and almost four in ten speak another language at home. More than one in five residents is Asian, alongside a large Hispanic community.",
      stats: [
        { value: "30.9%", label: "of residents were born outside the US (2020–2024)", source: census("duluthcitygeorgia") },
        { value: "38.3%", label: "speak a language other than English at home", source: census("duluthcitygeorgia") },
        { value: "22.1%", label: "of residents are Asian alone", source: census("duluthcitygeorgia") },
        { value: "16.3%", label: "of residents are Hispanic or Latino", source: census("duluthcitygeorgia") },
      ],
      note: "What it means for your firm: clients in Duluth search in English and in many other languages. The firm that shows up in their language, with reviews from their community, wins.",
    },
    problems: {
      heading: "Why Duluth immigration firms are hard to find",
      intro: "What the Gwinnett search results and our audits show.",
      items: [
        { title: "Directories fill the results", text: "Search for immigration and law firm marketing in Duluth and Lawyers.com directory pages take most of the results. Few local firm sites rank on their own." },
        { title: "Many languages, one website", text: "Almost four in ten Duluth residents speak another language at home. A site and Google profile in English only leaves most searches to other firms." },
        { title: "Atlanta firms take the ad clicks", text: "Atlanta firms bid across the metro. Without Gwinnett-specific campaigns, your budget pays for clicks from people who will never visit your office." },
      ],
    },
    services: { heading: "What we do for Duluth immigration firms", intro: "Multilingual, local and measured to signed retainers.", items: immigrationServices("Duluth", "Gwinnett County") },
    process: process("Duluth"), comparison: comparison("Duluth"),
    faq: [
      { q: "Can you market our firm in Korean or Vietnamese?", a: "Yes. We run campaigns and write content in the languages your clients speak, with intake that replies in the same language. Your attorneys review everything before it goes live." },
      { q: "How much does immigration lawyer SEO cost in Duluth, GA?", a: "Plans start at $1,500 a month plus ad spend. Multilingual firms usually choose a custom package with pages and ads for each language." },
      { q: "Do you cover all of Gwinnett County?", a: "Yes. One plan can cover Duluth, Norcross, Lawrenceville, Suwanee and the rest of Gwinnett, with map and page signals for each area you serve." },
      ...commonFaq("Duluth"),
    ],
    closing: closing("Duluth", "Gwinnett County"), updated: UPDATED,
  },
  {
    slug: "fairfax-va", practice: "immigration", city: "Fairfax", state: "Virginia", stateCode: "VA", metro: "Washington DC",
    neighbors: ["Fairfax City", "Annandale", "Falls Church", "Springfield", "Centreville", "Herndon", "Reston"],
    related: ["duluth-ga", "irving-tx"],
    metaTitle: "Fairfax Immigration Law Firm SEO: Rank on Google & AI",
    metaDescription: "Fairfax and Northern Virginia immigration firms: SEO, AI search, paid ads, content and AI intake to sign more family, asylum and work-visa cases.",
    primaryKeyword: "immigration law firm seo fairfax va",
    eyebrow: "Fairfax, VA · Northern Virginia",
    h1: { lead: "Immigration Law Firm SEO & AI Marketing in", emphasis: "Fairfax, VA" },
    answer: "Law Pro Digital helps immigration law firms in Fairfax and Northern Virginia rank on Google, Google Maps and AI answers, and turn those searches into signed family, asylum and work-visa cases. We run SEO, Meta and Google ads, content and AI intake as one measured system.",
    market: {
      heading: "Fairfax County: about 350,000 residents born abroad",
      intro: "Fairfax County has nearly 1.2 million residents, and more than three in ten were born outside the US. Nearly four in ten speak another language at home.",
      stats: [
        { value: "30.8%", label: "of county residents were born outside the US (2020–2024)", source: census("fairfaxcountyvirginia") },
        { value: "39.0%", label: "speak a language other than English at home", source: census("fairfaxcountyvirginia") },
        { value: "1,167,873", label: "county residents (July 2025 estimate)", source: census("fairfaxcountyvirginia") },
        { value: "21.8%", label: "of residents are Asian alone", source: census("fairfaxcountyvirginia") },
      ],
      note: "What it means for your firm: Northern Virginia clients are well researched and often ask AI tools first. Clear answers, strong reviews and a verified Google profile decide who gets the consultation.",
    },
    problems: {
      heading: "Why Fairfax immigration firms lose cases to directories and DC firms",
      intro: "What the Northern Virginia results and our audits show.",
      items: [
        { title: "Directories own the results", text: "Search \"immigration law firm Fairfax VA\" and Nolo, LawInfo, Lawyers.com and USLegal fill page one. Local firm sites are pushed down." },
        { title: "DC-area competition raises ad costs", text: "Firms across DC, Maryland and Virginia bid on the same searches. Without tracking to signed clients, budgets go to clicks that never hire." },
        { title: "Research-heavy clients need answers", text: "Professionals and families compare firms carefully and ask ChatGPT. Firms without answer-first content and consistent business details are left out of AI answers." },
      ],
    },
    services: { heading: "What we do for Fairfax immigration firms", intro: "Family, asylum and employment immigration, measured to signed retainers.", items: immigrationServices("Fairfax", "Northern Virginia") },
    process: process("Fairfax"), comparison: comparison("Fairfax"),
    faq: [
      { q: "How much does immigration law firm SEO cost in Fairfax?", a: "Plans start at $1,500 a month plus ad spend. Northern Virginia firms with several practice areas or languages usually choose a custom package." },
      { q: "Do you market asylum services responsibly?", a: "Yes. We use clear, honest messaging with no promises about outcomes. For one firm, asylum campaigns cut cost per inquiry by 85% using video and plain-language ads." },
      { q: "Can you cover Annandale, Falls Church and Herndon too?", a: "Yes. We target all of Fairfax County and nearby Northern Virginia areas from one plan, with page and map signals for each." },
      ...commonFaq("Fairfax"),
    ],
    closing: closing("Fairfax", "Northern Virginia"), updated: UPDATED,
  },
];

export const getLocation = (practice: Practice, slug: string) => locations.find((l) => l.practice === practice && l.slug === slug);

export const locationHref = (l: Pick<Location, "practice" | "slug">) => `/${practiceHubs[l.practice].slug}/${l.slug}/`;
