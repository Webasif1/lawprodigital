/**
 * Verified client testimonials only. The old homepage's "Michael H" quotes
 * contained an unfilled "[Your Agency Name]" placeholder and were not carried over.
 * The written reviews below were supplied and confirmed as genuine, client-approved
 * quotes by the site owner (2026-11-03); keep each client's consent on file.
 */
export const videoTestimonial = {
  youtubeId: "WJzkOR6Y-FE",
  /** Self-hosted copy of the video's YouTube thumbnail, so nothing loads from YouTube before play. */
  cover: "/images/video/chambers-law-firm-cover.jpg",
  client: "Chambers Law Firm",
  context: "Bankruptcy law · 6-month engagement",
} as const;

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
};

export const reviews: Review[] = [
  {
    id: "review_001",
    name: "Michael Bennett",
    role: "Managing Partner",
    company: "Bennett & Associates",
    location: "New York, NY",
    rating: 5,
    quote:
      "LawPro Digital did an excellent job redesigning our law firm's website. The new layout looks professional, navigation is much easier, and the overall experience is exactly what we wanted. Communication was smooth throughout the project.",
    service: "Law Firm Website Design",
    featured: true,
  },
  {
    id: "review_002",
    name: "Sarah Mitchell",
    role: "Founder & Attorney",
    company: "Mitchell Legal Group",
    location: "Los Angeles, CA",
    rating: 5,
    quote:
      "We wanted a website that would make a strong first impression on potential clients. LawPro Digital understood our requirements and delivered a clean, modern design. Very happy with how everything turned out.",
    service: "Website Redesign",
    featured: true,
  },
  {
    id: "review_003",
    name: "David Thompson",
    role: "Senior Attorney",
    company: "Thompson Legal Services",
    location: "Toronto, ON",
    rating: 5,
    quote:
      "The team was professional and easy to work with. They helped us improve our website structure and present our legal services more clearly. The mobile experience is also much better now.",
    service: "Web Design & Development",
    featured: true,
  },
  {
    id: "review_004",
    name: "Emily Carter",
    role: "Marketing Director",
    company: "Carter & Partners",
    location: "Chicago, IL",
    rating: 5,
    quote:
      "I appreciated how carefully the team listened to our ideas before starting. The final website feels consistent with our brand and gives visitors a much clearer understanding of what we do.",
    service: "Website Design",
    featured: false,
  },
  {
    id: "review_005",
    name: "James Wilson",
    role: "Managing Attorney",
    company: "Wilson Immigration Law",
    location: "Houston, TX",
    rating: 5,
    quote:
      "Our previous website needed a complete refresh. LawPro Digital helped us create a more modern and accessible online presence. The process was straightforward, and the team was responsive to our feedback.",
    service: "Website Redesign",
    featured: false,
  },
  {
    id: "review_006",
    name: "Olivia Parker",
    role: "Founder",
    company: "Parker Family Law",
    location: "Vancouver, BC",
    rating: 5,
    quote:
      "Really pleased with the website design and overall attention to detail. Our practice areas are now presented much more clearly, and the website feels professional without being overly complicated.",
    service: "Law Firm Web Design",
    featured: false,
  },
  {
    id: "review_007",
    name: "Robert Anderson",
    role: "Partner",
    company: "Anderson Legal Associates",
    location: "Miami, FL",
    rating: 5,
    quote:
      "LawPro Digital brought a fresh perspective to our digital presence. We especially liked the clean design, improved page structure, and attention to the details that matter to potential clients.",
    service: "Website Development",
    featured: false,
  },
  {
    id: "review_008",
    name: "Jessica Morgan",
    role: "Managing Director",
    company: "Morgan Legal Group",
    location: "Calgary, AB",
    rating: 5,
    quote:
      "Working with LawPro Digital was a positive experience. They understood our goals, suggested practical improvements, and delivered a website that better represents our firm. Would recommend their services.",
    service: "Digital Strategy & Web Design",
    featured: false,
  },
  {
    id: "review_009",
    name: "Christopher Davis",
    role: "Attorney",
    company: "Davis Business Law",
    location: "Dallas, TX",
    rating: 5,
    quote:
      "We needed a more professional online presence for our business law practice. The new website is well organized, loads smoothly, and makes it easier for visitors to find the information they need.",
    service: "Website Design & Development",
    featured: false,
  },
  {
    id: "review_010",
    name: "Amanda Wilson",
    role: "Founder & Principal Lawyer",
    company: "Wilson Legal Solutions",
    location: "Ottawa, ON",
    rating: 5,
    quote:
      "The team did a great job understanding our brand and translating it into a professional website. We particularly liked the responsive design and the way our services are organized.",
    service: "Website Redesign",
    featured: false,
  },
  {
    id: "review_011",
    name: "Matthew Johnson",
    role: "Law Firm Owner",
    company: "Johnson & Reed Law",
    location: "Seattle, WA",
    rating: 5,
    quote:
      "Great experience overall. The design feels modern and trustworthy, and the website works well on both desktop and mobile. Communication was clear, and our requested changes were handled professionally.",
    service: "Law Firm Website Design",
    featured: false,
  },
  {
    id: "review_012",
    name: "Sophia Brown",
    role: "Operations Director",
    company: "Brown Legal Partners",
    location: "Montreal, QC",
    rating: 5,
    quote:
      "We were looking for a team that understood the needs of a professional legal business. LawPro Digital delivered a polished website and helped us improve how we communicate our services online.",
    service: "Web Design & Digital Branding",
    featured: false,
  },
];
