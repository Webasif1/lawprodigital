/**
 * Monthly plans as published on the previous lawprodigital.com/pricing/ page.
 * The "90-Day Results Guarantee" listed on the old page was left out until its
 * terms are confirmed; add it back here only with written terms to link to.
 */

export type Plan = {
  name: string;
  price: number;
  /** One line on who the plan is for. */
  fit: string;
  features: string[];
};

export const pricing = {
  eyebrow: "Pricing",
  heading: "Plans for every stage of your firm",
  /** From the original pricing page. */
  intro: "The question is not “How much does it cost?” The real question is, “How many new cases will this generate?”",
  note: "Prices are per month. Not sure which plan fits? Book a free strategy call and we’ll recommend one for your practice area and city.",
};

export const plans: Plan[] = [
  {
    name: "The Client Generator",
    price: 1500,
    fit: "Paid ads that bring in calls and form leads now.",
    features: [
      "Google Ads (PPC) campaign setup & management",
      "Facebook & Instagram targeted advertising",
      "Google Local Services Ads (LSA) optimization",
      "Custom landing page creation for high conversion",
      "Monthly performance analytics & ROI reporting",
    ],
  },
  {
    name: "The Authority Builder",
    price: 2500,
    fit: "Search rankings, reviews and content that keep working month after month.",
    features: [
      "Comprehensive technical & on-site SEO",
      "Local SEO & Google Business Profile management",
      "Legal content marketing & blog strategy",
      "Reputation management & review generation",
      "Social media management (Facebook, LinkedIn, Instagram)",
    ],
  },
  {
    name: "The Market Dominance Package",
    price: 5000,
    fit: "Everything we do, run together for one firm.",
    features: [
      "Everything in The Client Generator & The Authority Builder",
      "Custom, high-converting law firm website design",
      "Advanced video marketing & social media growth",
      "Priority dedicated account management",
    ],
  },
];
