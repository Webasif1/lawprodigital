import type { Faq, Step } from "./services";

/**
 * Homepage copy, from "Law Pro Digital — New Homepage Content" (Oct 15, 2026).
 * Every figure comes from the case study library and links to its story.
 */

export const seo = {
  title: "Immigration Law Firm Marketing Agency, AI-Powered | Law Pro Digital",
  description:
    "Law Pro Digital helps US immigration law firms sign more clients with Meta Ads, SEO, AI search (AEO/GEO) and AI intake. 915 new clients in 9 months for one firm.",
};

export const hero = {
  eyebrow: "For US immigration law firms",
  /** Each entry is one line of the reveal; `emphasis` is highlighted. */
  headline: ["More Signed Clients for", "US Immigration Law Firms,"],
  emphasis: "Powered by AI",
  sub: "Meta Ads, SEO, AI search and AI intake, built around one number: signed retainers. One immigration firm we work with went from 79 to 115 new clients a month.",
  secondaryCta: { label: "Read the 9-month story", href: "/case-study/immigration-law-firm-client-growth/" },
  trust: ["No long contracts", "Monthly scorecard to signed clients", "Live dashboards on your onboarding call"],
};

export const proof = {
  stats: [
    { value: 45, prefix: "+", suffix: "%", label: "More signed clients per month for one immigration firm", href: "/case-study/immigration-law-firm-client-growth/" },
    { value: 915, label: "New clients signed in 9 months", href: "/case-study/immigration-law-firm-client-growth/" },
    { value: 15738, label: "Ad conversations and leads generated", href: "/case-study/facebook-ads-for-immigration-lawyers/" },
    { value: 0.44, prefix: "$", decimals: 2, label: "Per international contact, vs $6.73 in the US", href: "/case-study/international-clients-us-immigration-lawyer/" },
  ],
  note: "Results from a multi-office US immigration law firm client, 2025–2026.",
};

export const problem = {
  heading: "Why most immigration firms pay for leads that never sign",
  points: [
    { title: "Leads, not clients.", text: "Agencies report clicks and cost per lead. You get paid for retainers." },
    { title: "Calls with no source.", text: "At one firm we audited, 197 of 265 monthly calls had no recorded source." },
    { title: "Slow replies.", text: "Immigration clients message at night, in their own language, and move on if nobody answers." },
    { title: "Invisible in AI search.", text: "More clients now ask ChatGPT and Google's AI for a lawyer. If it doesn't name you, you don't exist." },
  ],
};

export const system = {
  heading: "One system, four jobs",
  jobs: [
    { title: "Be found", text: "Google, Google Maps, ChatGPT and Facebook, in every market you serve." },
    { title: "Be trusted", text: "Attorney-led video, reviews and answers to real client questions." },
    { title: "Be easy to reach", text: "One-tap WhatsApp and Messenger, AI intake that replies in seconds." },
    { title: "Be measured", text: "One monthly scorecard from first click to signed client, by office." },
  ],
};

export const services = {
  heading: "Everything an immigration firm needs to grow, in one team",
};

/** The eight offerings, each linked to the page that explains it. */
export const offerings: { title: string; text: string; href: string; tag: string }[] = [
  { tag: "Meta Ads", title: "Meta Ads (Facebook & Instagram)", text: "Messaging-first campaigns by office and service.", href: "/law-firm-ppc-agency/" },
  { tag: "Google Ads", title: "Google Ads & Local Services Ads", text: "Tested small, scaled on cost per signed client.", href: "/law-firm-ppc-agency/" },
  { tag: "SEO", title: "SEO for immigration lawyers", text: "Service and location pages that rank.", href: "/immigration-lawyer-seo/" },
  { tag: "AEO / GEO", title: "AI search (AEO/GEO)", text: "Get named by ChatGPT, Gemini and Google AI Overviews.", href: "/case-study/immigration-law-firm-seo-aeo-geo/" },
  { tag: "AI intake", title: "AI intake assistant", text: "24/7 replies on website, WhatsApp and phone, in multiple languages.", href: "/ai-solutions/" },
  { tag: "Maps", title: "Google Business Profile", text: "More calls and directions from Google Maps for every office.", href: "/law-firm-seo/" },
  { tag: "Video", title: "Attorney video & social media", text: "A filming workflow your attorneys can keep up with.", href: "/video-marketing-for-law-firms/" },
  { tag: "Web", title: "Website design", text: "Fast, conversion-focused sites built for legal clients.", href: "/website-design/" },
];

export const ai = {
  heading: "AI that answers every inquiry in seconds, day or night",
  body: "Our AI intake assistant replies on your website, WhatsApp and Messenger in your clients' languages, asks the right qualifying questions (visa type, timeline, location), books consultations and records where every lead came from. Your team gets qualified conversations instead of missed calls.",
  bullets: ["Replies in under 60 seconds", "Arabic, Bengali, Hindi, Spanish and more", "Books directly into your calendar", "Tracks the source of every lead"],
};

export const caseStudies = {
  heading: "Real results from a real immigration firm",
  /** Story numbers in the case study library: one featured, three supporting. */
  featured: 1,
  supporting: [3, 5, 13],
};

export const international = {
  heading: "Your next clients may not live in the US",
  body: "EB-2 NIW professionals, EB-1 talent and E-2 or EB-5 investors are searching from Dubai, Lagos, Karachi and Dhaka. We help US immigration firms reach them with small, tested campaigns, webinars and attorney-visit events.",
  /** Cost per contact by market, Feb–Oct 2026 (Story 5). */
  markets: [
    { name: "Ghana", cost: "$0.06", lon: -1.0, lat: 7.9 },
    { name: "Nigeria", cost: "$0.07", lon: 8.7, lat: 9.1 },
    { name: "Pakistan", cost: "$0.23", lon: 69.3, lat: 30.4 },
    { name: "Qatar", cost: "$0.27", lon: 51.2, lat: 25.3 },
    { name: "Bangladesh", cost: "$0.33", lon: 90.4, lat: 23.7 },
    { name: "Saudi Arabia", cost: "$0.55", lon: 45.1, lat: 23.9 },
    { name: "Turkey", cost: "$0.62", lon: 35.2, lat: 39.0 },
    { name: "Portugal", cost: "$1.18", lon: -8.2, lat: 39.4 },
    { name: "UAE", cost: "$1.88", lon: 54.4, lat: 24.4 },
  ],
  us: { name: "United States", cost: "$6.73", lon: -98.5, lat: 39.8 },
};

export const process: { heading: string; intro: string; steps: Step[] } = {
  heading: "How we work: the first 90 days",
  intro: "From a recorded audit in week one to budget that follows signed clients.",
  steps: [
    { title: "Free AI lead audit (week 1)", text: "Your Google, Maps, ads, AI visibility and after-hours intake, recorded on video." },
    { title: "Strategy and setup (weeks 2–4)", text: "Tracking, call sources, campaigns by office and service." },
    { title: "Launch and test (month 2)", text: "Ads, content and AI intake go live; small tests in new markets." },
    { title: "Scale what signs (month 3+)", text: "Budget moves to the offices and services with the lowest cost per signed client." },
    { title: "Monthly scorecard", text: "Every month, from first click to signed client, with the next steps." },
  ],
};

export const whoWeServe = {
  heading: "Built for immigration law firms first",
  body: "We specialize in US immigration firms, from solo practices to multi-office firms, especially those handling EB-2 NIW, EB-1, E-2, EB-5, family and asylum cases. We also support bankruptcy and personal injury firms.",
  caseTypes: ["EB-2 NIW", "EB-1", "E-2", "EB-5", "Family", "Asylum", "K-1", "RFE response", "Naturalization"],
  also: ["Bankruptcy", "Personal injury"],
};

/** Practice areas for the contact form and footer copy. */
export const specialties = [
  { title: "Immigration Lawyers" },
  { title: "Bankruptcy Lawyers" },
  { title: "Injury Lawyers" },
  { title: "Criminal Lawyers" },
  { title: "Sexual Harassment Lawyers" },
];

export const cities = [
  "Seattle, WA",
  "San Antonio, TX",
  "Aurora, CO",
  "Bakersfield, CA",
  "Houston, TX",
  "Dallas, TX",
  "Annapolis, MD",
  "Denver, CO",
  "Indianapolis, IN",
  "New York, NY",
];

export const pricingTeaser = [
  { name: "Client Generator", price: "$1,500/mo", note: "+ ad spend", text: "Meta & Google Ads, landing page, AI intake chatbot, monthly scorecard" },
  { name: "Authority Builder", price: "$2,500/mo", note: "", text: "SEO, AEO/GEO, Google Business Profile, content, reviews" },
  { name: "Market Dominance", price: "$5,000/mo", note: "+ ad spend", text: "Everything, plus AI voice agent, video, multi-office reporting" },
];

export const founder = {
  heading: "Why we only work with law firms",
  quote:
    "I've spent years running marketing inside a multi-office immigration firm: the ads, the content, the Google profiles and the monthly reports. Law Pro Digital brings that same system to firms like yours.",
  // TODO(owner): add the founder's name, photo and 60-second video.
  attribution: "Founder, Law Pro Digital",
};

export const faqs: Faq[] = [
  {
    q: "What does an immigration law firm marketing agency do?",
    a: "It brings new clients to an immigration firm through ads, search, AI search, Google Maps and video, and measures results against signed retainers. Law Pro Digital focuses only on law firms, mainly US immigration firms.",
  },
  {
    q: "How much does marketing cost for an immigration law firm?",
    a: "Law Pro Digital packages start at $1,500 a month plus ad spend. For one multi-office client, Meta ad spend averaged about $7,600 a month, around $75 per new client across all sources.",
  },
  {
    q: "Do Facebook ads work for immigration lawyers?",
    a: "Yes. For one client, 117 Meta campaigns produced 15,738 conversations and leads at $4.36 each, with about one signed client per 21 conversations.",
  },
  {
    q: "What is AEO and GEO for law firms?",
    a: "AEO makes your pages the direct answer Google's AI Overviews quote; GEO makes ChatGPT, Gemini and Perplexity recognize and recommend your firm.",
  },
  {
    q: "How fast will we see results?",
    a: "Ads can produce conversations in the first weeks; in our flagship case study the firm reached a steady 115 signed clients a month within about six to nine months.",
  },
  {
    q: "Can we see real results before signing?",
    a: "Yes. Case studies are anonymized for client privacy, and we walk qualified firms through the live dashboards on the onboarding call.",
  },
];

export const finalCta = {
  heading: "Find out how many clients you're missing",
  text: "In 5 minutes of video, we'll show you how your firm appears on Google, Maps and ChatGPT, and what happens when a prospect contacts you after hours.",
};
