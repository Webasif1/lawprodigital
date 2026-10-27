/**
 * Monthly packages. Names and prices are from the previous lawprodigital.com/pricing/
 * page; the first line of each feature list is the package summary from the new
 * homepage brief. The old "90-Day Results Guarantee" was left out until its terms
 * are confirmed; add it back here only with written terms to link to.
 */

export type Plan = {
  name: string;
  price: number;
  /** Shown after the price, e.g. "+ ad spend". */
  priceNote?: string;
  /** One line on who the plan is for. */
  fit: string;
  features: string[];
  featured?: boolean;
};

export const pricing = {
  eyebrow: "Pricing",
  heading: "Plans for every stage of your firm",
  /** From the original pricing page. */
  intro: "The question is not “How much does it cost?” The real question is, “How many new cases will this generate?”",
  note: "Prices are per month. No long contracts. Not sure which plan fits? Start with a free AI lead audit and we’ll recommend one for your firm.",
};

export const plans: Plan[] = [
  {
    name: "The Client Generator",
    price: 1500,
    priceNote: "+ ad spend",
    fit: "Meta & Google Ads, landing page, AI intake chatbot and a monthly scorecard.",
    features: [
      "Facebook & Instagram messaging-first campaigns by office and service",
      "Google Ads (PPC) and Local Services Ads (LSA) setup & management",
      "AI intake chatbot on your website, WhatsApp and Messenger",
      "Custom landing page creation for high conversion",
      "Monthly scorecard from first click to signed client",
    ],
  },
  {
    name: "The Authority Builder",
    price: 2500,
    fit: "SEO, AEO/GEO, Google Business Profile, content and reviews.",
    featured: true,
    features: [
      "Comprehensive technical & on-site SEO",
      "AI search optimization (AEO/GEO) for ChatGPT, Gemini and AI Overviews",
      "Local SEO & Google Business Profile management",
      "Legal content marketing & blog strategy",
      "Reputation management & review generation",
      "Social media management (Facebook, LinkedIn, Instagram)",
    ],
  },
  {
    name: "The Market Dominance Package",
    price: 5000,
    priceNote: "+ ad spend",
    fit: "Everything, plus AI voice agent, video and multi-office reporting.",
    features: [
      "Everything in The Client Generator & The Authority Builder",
      "AI voice agent for after-hours calls",
      "Advanced video marketing & social media growth",
      "Multi-office reporting",
      "Custom, high-converting law firm website design",
      "Priority dedicated account management",
    ],
  },
];

/** Shown as a band under the plans. No fixed price, so it stays out of the OfferCatalog. */
export const customPlan = {
  name: "Custom Plan",
  price: "Custom quote",
  fit: "Built around your offices, practice areas and caseload goals.",
  features: [
    "Mix any services from the plans above",
    "Ads, SEO, AI intake and voice agent scoped per office",
    "Budget set around the cases you can take on",
    "Monthly scorecard from first click to signed client",
  ],
};
