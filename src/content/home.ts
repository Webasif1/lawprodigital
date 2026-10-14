import type { Faq, Step } from "./services";

export const hero = {
  eyebrow: "Digital marketing for law firms",
  /** Each entry is one line of the reveal; `emphasis` is appended to the last line. */
  headline: ["Be the law firm", "they call"],
  emphasis: "first.",
  sub: "Search, ads and reviews for immigration, injury, bankruptcy, criminal and harassment lawyers.",
  secondaryCta: { label: "See the results", href: "/case-study/" },
};

export const services = {
  eyebrow: "What we do",
  heading: "Eight ways we bring you clients",
  intro: "Pick one or run them together. Each links to how we do it.",
};

/** The eight offerings listed on the original homepage, linked to their page where one exists. */
export const offerings: { title: string; text: string; href?: string }[] = [
  { title: "Search engine optimization", text: "Rank on page one when people near you search for your practice area.", href: "/law-firm-seo/" },
  { title: "Pay-per-click ads", text: "Ads in front of people who are ready to hire a lawyer now.", href: "/law-firm-ppc-agency/" },
  { title: "Legal content", text: "Articles and pages that answer the questions clients ask before they call.", href: "/law-firm-seo/" },
  { title: "Reviews and reputation", text: "A simple way to ask happy clients for reviews, so more of them leave one.", href: "/law-firm-seo/" },
  { title: "Social media", text: "Regular posts that keep your firm in front of past and future clients.", href: "/social-media-marketing/" },
  { title: "Website design", text: "Pages built to turn a visitor into a call or a form.", href: "/website-design/" },
  { title: "Google Business Profile", text: "A complete, active profile so you show up in the map results near you.", href: "/law-firm-seo/" },
  { title: "Google Local Services Ads", text: "Setup and management of the pay-per-lead ads at the top of Google.", href: "/law-firm-ppc-agency/" },
];

export const specialties = [
  { title: "Immigration Lawyers", text: "who want a strong local reputation" },
  { title: "Bankruptcy Lawyers", text: "who need more client inquiries, fast" },
  { title: "Injury Lawyers", text: "who want more cases and better reviews" },
  { title: "Criminal Lawyers", text: "who need to be seen and trusted in crowded markets" },
  { title: "Sexual Harassment Lawyers", text: "who want to be known as the authority" },
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

export const whyUs = {
  eyebrow: "Why us",
  heading: "We only work with law firms",
  body: "Legal marketing has its own rules, its own costs and its own clients. Because law firms are all we do, we start on your campaigns, not on learning your industry.",
  points: [
    "A plan built for your practice area and your city.",
    "Leads and reviews tracked from the first month.",
    "Direct access to the people running your campaigns.",
    "Law firms in Seattle, San Antonio, Aurora, Bakersfield and other cities.",
  ],
};

export const process: { heading: string; intro: string; steps: Step[] } = {
  heading: "What working with us looks like",
  intro: "Five steps, from the first call to the monthly report.",
  steps: [
    { title: "Discovery & Strategy", text: "We learn your practice area, your clients and what is holding you back. Then we write a plan for your firm." },
    { title: "Implementation", text: "We run the SEO, ads, reviews and content work the plan calls for." },
    { title: "Ongoing Optimization", text: "We watch what brings in leads, and change what doesn’t." },
    { title: "Transparent Reporting", text: "You get clear reports showing what your marketing spend is producing." },
    { title: "Dedicated Support", text: "Ask us anything. The plan changes as your firm does." },
  ],
};

export const faqs: Faq[] = [
  { q: "Why do you only work with law firms?", a: "Because we already know how legal clients search and hire. That means relevant leads sooner." },
  { q: "How can you help me get more client reviews?", a: "We set up a simple process that asks satisfied clients for a review at the right moment." },
  { q: "Will this work for my city and practice area?", a: "Each campaign is set up around your city and your practice area." },
  { q: "How soon will I see new clients?", a: "Many lawyers report new inquiries within the first 3 months of working with us." },
];

export const finalCta = {
  heading: "Ready for more clients? Start with a free call.",
  text: "Tell us your practice area, your city and your goals. We’ll come back with a plan for your firm.",
};
