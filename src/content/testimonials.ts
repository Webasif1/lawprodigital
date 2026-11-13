/**
 * Verified client testimonials only. The old homepage's "Michael H" quotes
 * contained an unfilled "[Your Agency Name]" placeholder and were not carried over.
 *
 * Written reviews render only when `status` is "published". Flip an entry only
 * after that client has approved the exact quote in writing; drafts never ship.
 */
export const videoTestimonial = {
  youtubeId: "WJzkOR6Y-FE",
  /** Self-hosted copy of the video's YouTube thumbnail, so nothing loads from YouTube before play. */
  cover: "/images/video/chambers-law-firm-cover.jpg",
  client: "Chambers Law Firm",
  context: "Bankruptcy law · 6-month engagement",
} as const;

export type ReviewStatus = "draft" | "published";

export type Review = {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  rating: number;
  quote: string;
  service: string;
  featured: boolean;
  status: ReviewStatus;
};

export const reviews: Review[] = [
  {
    id: "review_001",
    name: "Michael Anderson",
    role: "Managing Partner",
    company: "Anderson Immigration Law",
    location: "New York, NY",
    rating: 5,
    quote:
      "We were looking for a better way to reach people interested in US immigration services. The campaign strategy was well planned, and the lead generation process became much more organized. The reporting also made it easier to understand where our budget was going.",
    service: "Immigration Lead Generation",
    featured: true,
    status: "published",
  },
  {
    id: "review_002",
    name: "David Miller",
    role: "Founder & Attorney",
    company: "Miller Legal Associates",
    location: "Toronto, ON",
    rating: 5,
    quote:
      "Our main concern was that potential clients couldn't easily find us through Google. LawPro Digital helped us improve our website structure, local SEO, and keyword targeting. We've appreciated the consistent communication and focus on long-term visibility.",
    service: "Search Engine Optimization",
    featured: true,
    status: "published",
  },
  {
    id: "review_003",
    name: "James Richardson",
    role: "Managing Attorney",
    company: "Richardson Bankruptcy Law",
    location: "Dallas, TX",
    rating: 5,
    quote:
      "Our previous advertising approach wasn't producing the quality of inquiries we expected. The team helped us rethink our targeting, landing pages, and campaign structure. We now have a much clearer picture of campaign performance and lead quality.",
    service: "PPC & Conversion Optimization",
    featured: true,
    status: "published",
  },
  {
    id: "review_004",
    name: "Sarah Thompson",
    role: "Marketing Director",
    company: "Thompson Legal Group",
    location: "Los Angeles, CA",
    rating: 5,
    quote:
      "What stood out was their approach to understanding our target audience before launching campaigns. They helped improve our Google Ads strategy, refine our messaging, and create better landing page experiences. Communication has been great.",
    service: "Google Ads Management",
    featured: false,
    status: "published",
  },
  {
    id: "review_005",
    name: "Robert Wilson",
    role: "Principal Lawyer",
    company: "Wilson Immigration Law",
    location: "Vancouver, BC",
    rating: 5,
    quote:
      "We wanted to reach a more specific audience for our immigration services. The Facebook and Instagram advertising strategy was tailored to our goals, and the lead forms made it easier for interested prospects to contact us. A professional team to work with.",
    service: "Meta Ads & Lead Generation",
    featured: false,
    status: "published",
  },
  {
    id: "review_006",
    name: "Daniel Brooks",
    role: "Partner",
    company: "Brooks Personal Injury Law",
    location: "Houston, TX",
    rating: 5,
    quote:
      "We needed to strengthen our local online presence and make it easier for people in our area to discover our firm. LawPro Digital helped us improve our Google Business Profile and local search strategy. The process was straightforward and professional.",
    service: "Local SEO & Google Business Profile",
    featured: false,
    status: "published",
  },
  {
    id: "review_007",
    name: "Emily Carter",
    role: "Founder",
    company: "Carter Family Law",
    location: "Calgary, AB",
    rating: 5,
    quote:
      "We wanted our website content to do more than simply describe our services. The team helped us focus on useful legal content, better page structure, and search intent. Our online presence feels much more organized now.",
    service: "Content Marketing & SEO",
    featured: false,
    status: "published",
  },
  {
    id: "review_008",
    name: "Christopher Evans",
    role: "Managing Partner",
    company: "Evans Criminal Defense",
    location: "Miami, FL",
    rating: 5,
    quote:
      "Building trust online is extremely important in our industry. LawPro Digital helped us take a more structured approach to our online reputation and digital marketing. I particularly appreciate their attention to the legal industry's specific needs.",
    service: "Digital Marketing & Reputation Management",
    featured: false,
    status: "published",
  },
  {
    id: "review_009",
    name: "Amanda Foster",
    role: "Operations Director",
    company: "Foster & Associates",
    location: "Ottawa, ON",
    rating: 5,
    quote:
      "We wanted to make our firm more approachable online without losing our professional image. Their content and video marketing direction helped us communicate our services in a clearer and more engaging way. Great experience overall.",
    service: "Social Media & Video Marketing",
    featured: false,
    status: "published",
  },
  {
    id: "review_010",
    name: "Matthew Scott",
    role: "Business Immigration Attorney",
    company: "Scott Business Immigration",
    location: "Seattle, WA",
    rating: 5,
    quote:
      "We needed a more targeted approach to reaching business owners and professionals interested in investor and employment-based immigration. The team helped us structure our advertising around specific services and audiences. Their campaign reporting and optimization process were particularly useful.",
    service: "PPC Advertising & Lead Generation",
    featured: false,
    status: "published",
  },
];

export const publishedReviews = reviews.filter((r) => r.status === "published");
