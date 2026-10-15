/**
 * Service pages. Copy is carried over from the previous lawprodigital.com
 * pages. Unverifiable figures (e.g. "5 Years Experience", "15 Law Firms",
 * "5+ Law Firms Served", "$50000+ Ad Spend Managed", unattributed percentage
 * results) and placeholder testimonials were intentionally not carried over.
 */

export type Feature = { title: string; text?: string };
export type Step = { title: string; text: string };
export type Faq = { q: string; a: string };

export type ServiceSection =
  | { kind: "features"; id: string; eyebrow?: string; heading: string; intro?: string; items: Feature[] }
  | { kind: "prose"; id: string; eyebrow?: string; heading: string; paragraphs: string[]; bullets?: string[]; closing?: string }
  | { kind: "process"; id: string; eyebrow?: string; heading: string; intro?: string; steps: Step[] }
  | { kind: "tags"; id: string; eyebrow?: string; heading: string; intro?: string; items: string[]; closing?: string }
  | { kind: "faq"; id: string; heading: string; items: Faq[] };

export type Service = {
  slug: string;
  navLabel: string;
  /** <title> (brand suffix is added by the layout template). */
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  headline: { lead: string; emphasis: string; tail: string };
  intro: string;
  /** One-line summary used in listings. */
  summary: string;
  sections: ServiceSection[];
  closing?: { heading: string; text: string };
  /** Story numbers from the case study library (src/content/source/case-studies.md). */
  relatedStories: number[];
};

export const services: Service[] = [
  {
    slug: "law-firm-seo",
    navLabel: "Law Firm SEO",
    metaTitle: "Law Firm SEO — Rank Higher & Win More Clients",
    metaDescription:
      "SEO for law firms: local SEO, Google Business Profile optimization, legal keyword research, on-page and technical SEO, content and reputation management — built for lawyers.",
    eyebrow: "Law Firm SEO",
    headline: { lead: "SEO that gets your law firm", emphasis: "found", tail: "by the clients searching for you" },
    intro:
      "Rank on page one for your legal services and local searches. Law Pro Digital builds SEO for lawyers in Immigration, Bankruptcy, Injury, Criminal, Sexual Harassment and other practice areas.",
    summary: "Rank on page one for your legal services and local searches.",
    sections: [
      {
        kind: "prose",
        id: "why",
        eyebrow: "Why it matters",
        heading: "Clients are searching Google for a lawyer right now",
        paragraphs: [
          "Legal problems are urgent, and clients turn to search first. If your firm isn’t showing up locally, you’re missing out — but the right law-firm-focused SEO strategy can change that.",
        ],
        bullets: [
          "Rank higher in local search results where clients are looking now",
          "Build trust with content that answers your clients’ toughest questions",
          "Build a strong and trustworthy online reputation",
          "Convert website visitors into paying clients",
        ],
      },
      {
        kind: "features",
        id: "services",
        eyebrow: "What’s included",
        heading: "Our SEO services for law firms",
        intro: "Law firms face unique challenges, so every engagement is built around your practice area and local market.",
        items: [
          { title: "Local SEO & Google Business Profile", text: "Optimize your profile — info, photos, posts and reviews — to boost local visibility and attract nearby clients." },
          { title: "Legal Keyword Research", text: "We identify the high-converting keywords your ideal clients are actually searching for." },
          { title: "On-Page SEO", text: "Each practice-area page is optimized to rank for the services you want more cases in — no fluff." },
          { title: "Content That Builds Authority", text: "Earn trust with clear, useful blog posts, FAQs and client-focused content that drives organic traffic." },
          { title: "Review & Reputation Management", text: "Amplify positive reviews to build credibility, improve local rankings and attract more cases." },
          { title: "Mobile & Technical SEO", text: "Your site will load fast, work on every device, and meet Google’s technical standards." },
          { title: "Authority-Boosting Backlinks", text: "Build foundational, high-quality backlinks to grow your firm’s online authority." },
          { title: "Conversion Optimization (CRO)", text: "Improve calls-to-action, contact forms and layout to turn more visitors into consultations." },
          { title: "Clear SEO Reporting", text: "Simple, transparent reports showing your growth in rankings, traffic and leads — no jargon." },
        ],
      },
      {
        kind: "tags",
        id: "specialties",
        eyebrow: "Practice areas",
        heading: "SEO built for your legal specialty",
        items: ["Immigration Lawyers", "Bankruptcy Lawyers", "Personal Injury Lawyers", "Criminal Defense Lawyers", "Sexual Harassment Lawyers"],
        closing: "Strategies are customized for your specialty and your local market.",
      },
    ],
    relatedStories: [13, 12, 14],
  },
  {
    slug: "immigration-lawyer-seo",
    navLabel: "Immigration Lawyer SEO",
    metaTitle: "Immigration Lawyer SEO That Drives More Clients",
    metaDescription:
      "Immigration lawyer SEO from Law Pro Digital: local SEO, Google Business Profile, immigration keyword research, content and reputation management that help you get found by clients searching online.",
    eyebrow: "Immigration Lawyer SEO",
    headline: { lead: "Immigration lawyer SEO that", emphasis: "drives more clients", tail: "to your firm — fast" },
    intro:
      "Struggling to stand out as an immigration lawyer? Law Pro Digital specializes in SEO that helps you get found by clients actively searching online.",
    summary: "Get found by clients searching for visas, green cards, asylum and more.",
    sections: [
      {
        kind: "prose",
        id: "why",
        eyebrow: "Why it matters",
        heading: "Why SEO for immigration lawyers matters more than ever",
        paragraphs: [
          "Immigration law is complex, and clients are searching Google for answers. If your firm isn’t showing up locally, you’re missing out — but the right immigration-focused SEO strategy can change that.",
        ],
        bullets: [
          "Show up at the top when clients search for “immigration lawyer near me”",
          "Build trust with powerful content that answers your clients’ toughest questions",
          "Manage strong reviews that make prospects feel confident choosing you",
          "Outsmart your competition and grow your caseload",
        ],
      },
      {
        kind: "features",
        id: "services",
        eyebrow: "What’s included",
        heading: "Our SEO services for immigration lawyers",
        intro: "We know immigration law firms face unique challenges, so we offer services built around your specific needs:",
        items: [
          { title: "Local SEO & Google Profile", text: "Get found in local search and Google Maps with full Google Business Profile optimization — info, photos, posts, and review management." },
          { title: "Immigration Keyword Research", text: "We identify high-converting keywords your ideal immigration clients are actually searching for — visas, asylum, and more." },
          { title: "On-Page Immigration SEO", text: "Each page is optimized to rank for key services like green cards, work permits, and citizenship — no fluff." },
          { title: "Content That Educates & Converts", text: "We create blogs, FAQs, and guides that answer real client questions and drive organic traffic to your site." },
          { title: "Review & Reputation Management", text: "We help you collect real client reviews and respond professionally to build trust and improve your local rankings." },
          { title: "Mobile & Technical SEO", text: "Your site will load fast, work on every device, and meet Google’s technical standards for better search visibility." },
          { title: "Authority-Boosting Backlinks", text: "We build high-quality backlinks from trusted legal and immigration-related sites to grow your online authority." },
          { title: "Conversion Optimization (CRO)", text: "We improve your site’s calls-to-action, contact forms, and layout to turn more visitors into real consultations." },
          { title: "Clear SEO Reporting", text: "Get simple, transparent SEO reports showing your growth in rankings, traffic, and leads — no jargon, just results." },
        ],
      },
    ],
    relatedStories: [12, 14, 6],
  },
  {
    slug: "law-firm-ppc-agency",
    navLabel: "Law Firm PPC",
    metaTitle: "Law Firm PPC Agency | Expert Google Ads for Lawyers & Attorneys",
    metaDescription:
      "Partner with a top law firm PPC agency. We help lawyers and attorneys win more cases with targeted Google Ads, high-converting landing pages, and proven PPC strategies.",
    eyebrow: "Law Firm PPC",
    headline: { lead: "Get more clients with a results-driven", emphasis: "PPC agency", tail: "for lawyers & law firms" },
    intro:
      "Win more high-value cases with precision PPC for lawyers. Law Pro Digital’s experts run strategic Google Ads that turn clicks into real clients.",
    summary: "Capture ready-to-hire clients with smart ad campaigns.",
    sections: [
      {
        kind: "prose",
        id: "why",
        eyebrow: "Qualified leads & growth",
        heading: "A law firm PPC agency that turns ad spend into cases",
        paragraphs: [
          "Stop wasting your ad budget and start generating high-value cases with a trusted law firm PPC agency. We specialize in transforming every advertising dollar into qualified leads, predictable case flow, and measurable ROI.",
          "Generic digital marketing won’t grow your law practice effectively. You need a specialized law firm PPC agency that truly understands the legal industry — including compliance requirements, tough competition, and what motivates legal clients to take action.",
          "At Law Pro Digital, we’re more than just a PPC company for law firms. We’re your strategic marketing partner, dedicated to maximizing every click, call, and case.",
        ],
      },
      {
        kind: "features",
        id: "services",
        eyebrow: "Our services",
        heading: "Our law firm PPC services",
        intro: "End-to-end law firm PPC services that cover every major platform and campaign type.",
        items: [
          { title: "Google Search Ads", text: "Capture high-intent clients the moment they’re searching for legal help." },
          { title: "Google Display Ads", text: "Build brand awareness and retarget potential clients across the web." },
          { title: "PPC Landing Pages", text: "Convert more visitors with pages designed for legal conversion rates." },
          { title: "Google Local Service Ads", text: "Win the top local results and get phone calls from nearby prospects." },
          { title: "Facebook Advertising", text: "Reach your ideal audience where they spend their time." },
          { title: "Instagram Campaigns", text: "Showcase your expertise with eye-catching visuals." },
          { title: "LinkedIn Advertising", text: "Target business clients and referral partners with precision." },
          { title: "YouTube Video Ads", text: "Build trust and authority through video content." },
        ],
      },
      {
        kind: "tags",
        id: "industries",
        eyebrow: "Law firms we help",
        heading: "Industries we help",
        items: ["Bankruptcy Lawyer", "Immigration Lawyer", "Personal Injury Lawyer", "Criminal Defense Lawyer", "Business Lawyer", "Family Lawyer", "Divorce Lawyer"],
      },
      {
        kind: "process",
        id: "process",
        eyebrow: "How we work",
        heading: "We keep it simple — and powerful",
        steps: [
          { title: "Discovery & Audit", text: "We analyze your current PPC campaigns (or build new ones from scratch) and identify untapped opportunities." },
          { title: "Strategy", text: "Every law firm gets its own plan based on their goals, competition, and location." },
          { title: "Execution", text: "Our experts handle ad creation, landing page design, keyword research, tracking, and compliance." },
          { title: "Ongoing Management", text: "We continually optimize bids, ads, and targeting to maximize your ROI — so you get better results every month." },
          { title: "Transparent Reporting", text: "Detailed analytics show exactly how many leads you’re getting and where your investment is going." },
        ],
      },
      {
        kind: "prose",
        id: "choose",
        eyebrow: "Choose us",
        heading: "Why choose our law firm PPC agency?",
        paragraphs: ["Choosing the right law firm PPC agency can make all the difference. Here’s why attorneys trust us:"],
        bullets: [
          "100% focus on law firm PPC marketing — no distractions, just results.",
          "Deep understanding of legal advertising rules for safe, compliant campaigns.",
          "Data-driven decisions powered by advanced analytics.",
          "Complete transparency: clear communication, no hidden fees.",
        ],
      },
      {
        kind: "faq",
        id: "faq",
        heading: "Frequently asked questions",
        items: [
          { q: "What makes your law firm PPC agency different?", a: "We specialize solely in law firm PPC services with deep legal industry knowledge and tested strategies built for attorneys’ needs." },
          { q: "Do you manage all types of lawyer PPC advertising?", a: "Yes! From Google Search Ads to Facebook and YouTube campaigns, we handle all major platforms for lawyers." },
          { q: "How quickly can I see results?", a: "Most firms see increased leads within days or weeks of campaign launch — PPC is fast!" },
          { q: "Is my ad spend transparent?", a: "Absolutely. You always see where every dollar goes with detailed reporting." },
        ],
      },
    ],
    relatedStories: [2, 3, 5],
  },
  {
    slug: "website-design",
    navLabel: "Website Design",
    metaTitle: "Law Firm Website Design That Converts Visitors Into Clients",
    metaDescription:
      "Law Pro Digital delivers expert website design for law firms, combining legal industry expertise with advanced SEO strategies to attract and convert clients effectively.",
    eyebrow: "Website Design",
    headline: { lead: "Crafting exceptional", emphasis: "websites", tail: "for law firms" },
    intro:
      "Law Pro Digital delivers expert website design for law firms, combining legal industry expertise with advanced SEO strategies to attract and convert clients effectively.",
    summary: "Turn visitors into paying clients.",
    sections: [
      {
        kind: "features",
        id: "why",
        eyebrow: "Why it matters",
        heading: "Why specialized website design for lawyers matters",
        intro:
          "Unlike generic website services, lawyer website design requires a nuanced understanding of both legal industry standards and client expectations. Our designs are crafted to deliver results.",
        items: [
          { title: "Highlight Legal Expertise", text: "Showcase your firm’s areas of expertise clearly and authoritatively." },
          { title: "Legal Compliance", text: "Ensure compliance with legal marketing ethics and guidelines." },
          { title: "Client-Focused Navigation", text: "Clear navigation built for potential clients seeking legal counsel." },
          { title: "Trust Signals", text: "Attorney bios, credentials, and third-party endorsements." },
          { title: "Local Search Optimization", text: "Capture relevant local client traffic effectively." },
        ],
      },
      {
        kind: "prose",
        id: "custom",
        eyebrow: "Custom design",
        heading: "Customized designs reflecting your firm’s unique identity",
        paragraphs: [
          "Our team collaborates closely with your firm to create a custom website that embodies your brand, legal philosophy, and service offerings. Every element — from typography and color palette to content structure — is designed to project authority and instill client confidence.",
          "Mobile-first approach for optimal viewing experience: we ensure your website looks perfect on any device, enhancing user experience and accessibility for clients.",
          "Legal marketing compliance & ethical design: we ensure your website adheres to legal marketing best practices, maintaining ethical standards.",
        ],
      },
      {
        kind: "prose",
        id: "cost",
        eyebrow: "Transparent pricing",
        heading: "Transparent website design cost for law firms",
        paragraphs: ["Every law firm has unique needs, so we give you a personalized quote based on your specific requirements and goals. Your investment reflects:"],
        bullets: [
          "The complexity of your site’s design and functionality",
          "Content development including attorney profiles and practice area descriptions",
          "SEO integration built for legal keywords",
          "Post-launch support and maintenance",
        ],
        closing:
          "We offer scalable packages from affordable basic sites to comprehensive digital platforms customized for larger firms or multi-practice offices. No obligation — free consultation included.",
      },
      {
        kind: "features",
        id: "approaches",
        eyebrow: "By practice area",
        heading: "Design approaches for every practice",
        items: [
          { title: "Personal Injury Law Firm", text: "Modern, client-focused design with integrated case evaluation forms and attorney spotlights." },
          { title: "Corporate Law Practice", text: "Professional, sophisticated design emphasizing expertise in business law and corporate transactions." },
          { title: "Family Law Attorneys", text: "Compassionate, approachable design with emphasis on trust and understanding for sensitive legal matters." },
        ],
      },
      {
        kind: "prose",
        id: "choose",
        eyebrow: "Choose us",
        heading: "Hire a trusted law firm website design expert",
        paragraphs: ["Choosing the right partner for your lawyer website design is critical. Law Pro Digital offers the expertise and dedication your firm deserves."],
        bullets: [
          "Experience working exclusively with legal professionals",
          "A comprehensive approach combining design, SEO, and content strategy",
          "Commitment to legal marketing compliance and ethical standards",
          "Responsive client service ensuring your vision becomes reality",
        ],
      },
      {
        kind: "faq",
        id: "faq",
        heading: "Frequently asked questions",
        items: [
          { q: "What features should a high-quality lawyer website include?", a: "Clear attorney profiles, practice area pages, trust signals (awards, certifications), responsive design, fast load times, and SEO-friendly architecture." },
          { q: "How long does it take to develop a law firm website?", a: "Typically 6 to 8 weeks from initial consultation to launch, depending on complexity." },
          { q: "Can you redesign my existing website while maintaining SEO rankings?", a: "Yes. We follow best practices to ensure no loss of search engine equity during redesigns." },
          { q: "Are your websites compliant with legal advertising regulations?", a: "Absolutely. We ensure all content meets jurisdiction-specific ethical guidelines." },
        ],
      },
    ],
    relatedStories: [14, 12, 1],
  },
  {
    slug: "social-media-marketing",
    navLabel: "Social Media Marketing",
    metaTitle: "Social Media Marketing for Law Firms",
    metaDescription:
      "Law Pro Digital helps law firms grow through strategic, trust-building social media marketing tailored to legal professionals — Facebook, Instagram, LinkedIn, YouTube and more.",
    eyebrow: "Social Media Marketing",
    headline: { lead: "Building a powerful", emphasis: "social media", tail: "presence for law firms" },
    intro: "Law Pro Digital helps law firms grow through strategic, trust-building social media marketing built for legal professionals.",
    summary: "Build real connections with potential clients online.",
    sections: [
      {
        kind: "features",
        id: "why",
        eyebrow: "Why Law Pro Digital",
        heading: "Why choose Law Pro Digital for your law firm’s social media marketing",
        intro:
          "Navigating social media as a law firm requires expert precision and professionalism. Our custom strategies ensure your message reaches the right audience — compliant, credible, and impactful.",
        items: [
          { title: "Specialized Focus", text: "We cater specifically to lawyers and law firms, including bankruptcy, immigration, personal injury, criminal defense, family, and divorce lawyers." },
          { title: "Customized Strategy", text: "Every law firm is different. We create a personalized social media marketing strategy built around your practice areas and goals." },
          { title: "Comprehensive Management", text: "From content creation to ongoing social media marketing management, we handle every aspect so you can focus on your clients." },
          { title: "Data-Driven Campaigns", text: "Our targeted social media marketing campaigns use analytics and insights to maximize your ROI." },
          { title: "Trusted Consultant", text: "As your dedicated social media marketing consultant, we provide expert guidance to keep your firm ahead of trends and compliant with industry standards." },
        ],
      },
      {
        kind: "prose",
        id: "platforms",
        eyebrow: "Every major platform",
        heading: "Our social media marketing services for law firms",
        paragraphs: [
          "We help law firms grow on every major platform. Use Facebook for trust-building and updates, Instagram for storytelling and testimonials, and LinkedIn for professional networking. Share legal insights on Twitter, visual content on Pinterest, and build authority with educational videos on YouTube.",
        ],
      },
      {
        kind: "features",
        id: "specialties",
        eyebrow: "Legal specialties",
        heading: "Targeted solutions for key legal specialties",
        intro: "Our social media marketing services are uniquely designed to address the needs of various law practices.",
        items: [
          { title: "Bankruptcy Lawyers", text: "Educate clients on debt relief options and financial recovery through clear posts and videos." },
          { title: "Immigration Lawyers", text: "Share success stories and updates on immigration law changes to build trust." },
          { title: "Personal Injury Lawyers", text: "Promote client victories and injury prevention tips to attract potential claimants." },
          { title: "Criminal Defense Lawyers", text: "Highlight defense strategies and legal rights awareness campaigns." },
          { title: "Family & Divorce Lawyers", text: "Provide compassionate insights and guidance on sensitive family matters." },
        ],
      },
      {
        kind: "process",
        id: "process",
        eyebrow: "Our process",
        heading: "Our process, from strategy to success",
        steps: [
          { title: "Discovery & Consultation", text: "Understand your firm’s goals, target audience, and current social media presence." },
          { title: "Strategy Development", text: "Design a customized roadmap incorporating keyword-rich content aligned with your practice areas." },
          { title: "Content Creation", text: "Develop engaging posts, videos, infographics, and ads optimized for each platform." },
          { title: "Campaign Execution", text: "Launch targeted campaigns focusing on lead generation and brand awareness." },
          { title: "Ongoing Management & Reporting", text: "Continuously monitor performance, refine strategies, and provide transparent reports." },
        ],
      },
    ],
    closing: {
      heading: "Ready to grow your law firm with expert social media marketing?",
      text: "As a social media marketing agency specializing in law firms, Law Pro Digital is here to help you build authority, attract quality leads, and enhance client engagement across all major platforms.",
    },
    relatedStories: [7, 15, 2],
  },
  {
    slug: "video-marketing-for-law-firms",
    navLabel: "Video Marketing",
    metaTitle: "Video Marketing for Law Firms",
    metaDescription:
      "Law Pro Digital creates impactful video marketing for law firms — meet-the-lawyer, explainer, Q&A, attorney bio and brand videos — to build trust, boost visibility, and attract more clients.",
    eyebrow: "Video Marketing",
    headline: { lead: "", emphasis: "Video marketing", tail: "that builds trust for law firms" },
    intro: "Law Pro Digital creates impactful video marketing for law firms to build trust, boost visibility, and attract more clients.",
    summary: "Build trust and authority through video content.",
    sections: [
      {
        kind: "features",
        id: "types",
        eyebrow: "What we make",
        heading: "Types of law firm marketing videos",
        intro: "We create a diverse range of video content built for different marketing goals.",
        items: [
          { title: "Meet-the-Lawyer Videos", text: "Personalize your firm by introducing attorneys to potential clients." },
          { title: "Explainer Videos", text: "Simplify complex legal topics to educate and inform your audience." },
          { title: "Client Testimonials", text: "Build credibility with authentic stories from satisfied clients." },
          { title: "Short Videos", text: "Capture attention quickly on social media platforms with concise messages." },
          { title: "Question and Answer Videos", text: "Address common legal questions to position your firm as a helpful resource." },
          { title: "Attorney Biography Video", text: "Highlight qualifications, experience, and unique value propositions of each lawyer." },
          { title: "Brand Video", text: "Communicate your firm’s mission, values, and personality to create a strong brand identity." },
        ],
      },
      {
        kind: "prose",
        id: "platforms",
        eyebrow: "Distribution",
        heading: "Best platforms for video marketing",
        paragraphs: [
          "We help law firms maximize reach and engagement by using top-performing video platforms. From educational content on YouTube and creative short-form videos on TikTok, to targeted campaigns on Facebook, engaging visuals on Instagram, and authority-building content on LinkedIn — we craft custom video strategies for every audience.",
        ],
      },
      {
        kind: "tags",
        id: "industries",
        eyebrow: "Law firms we help",
        heading: "Industries we help",
        intro: "Our video marketing services cater to the specific needs of various law specialties:",
        items: ["Bankruptcy Lawyers", "Immigration Lawyers", "Personal Injury Lawyers", "Criminal Defense Lawyers", "Family Lawyers", "Divorce Lawyers"],
        closing: "We understand the nuances of marketing in each area and create videos that effectively address client concerns and highlight your expertise.",
      },
      {
        kind: "prose",
        id: "choose",
        eyebrow: "Choose us",
        heading: "Why choose Law Pro Digital for your video marketing?",
        paragraphs: [
          "We’re a dedicated video marketing company for law firms, offering custom strategies, pro-level production, legal industry expertise, and full-service management to boost your online presence with data-driven results.",
        ],
      },
      {
        kind: "process",
        id: "process",
        eyebrow: "Our process",
        heading: "Bringing your law firm’s story to life",
        steps: [
          { title: "Consultation & Strategy", text: "Understand your firm’s objectives and target audience." },
          { title: "Creative Development", text: "Scriptwriting, storyboarding, and concept design." },
          { title: "Content Creation", text: "Production." },
          { title: "Distribution & Promotion", text: "Sharing videos strategically on relevant platforms to maximize visibility." },
          { title: "Performance Analysis", text: "Tracking engagement metrics and refining campaigns for better results." },
        ],
      },
    ],
    closing: {
      heading: "Ready to grow your law firm’s marketing with video?",
      text: "Partner with Law Pro Digital, the video marketing agency for law firms. Let us help you create powerful videos that engage clients and grow your practice.",
    },
    relatedStories: [15, 7, 1],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export const serviceHref = (slug: string) => `/${slug}/`;
