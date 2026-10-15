/**
 * Case studies, carried over from the previous lawprodigital.com posts.
 * All figures below are the ones published on the original pages.
 *
 * Image blocks reference files in /public/images/case-studies/. The original
 * screenshots could not be recovered during the rebuild; an image block is
 * rendered only when its file exists, so dropping the originals into that
 * folder (same file names) and rebuilding is enough to show them.
 */

export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "facts"; items: { label: string; value: string }[] }
  | { type: "table"; head: string[]; rows: string[][]; caption?: string }
  | { type: "callout"; text: string }
  | { type: "image"; file: string; alt: string; width: number; height: number; caption?: string }
  | { type: "video"; youtubeId: string; title: string };

export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  category: "Bankruptcy" | "Immigration";
  client: string;
  industry: string;
  duration: string;
  channels: string;
  summary: string;
  published: string;
  stats: Stat[];
  cardImage?: { file: string; alt: string; width: number; height: number };
  blocks: Block[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "bankruptcy-law-firm-99-percent-lead-conversion",
    title: "How We Helped a Bankruptcy Law Firm Achieve 99% Lead Conversion in 6 Months",
    shortTitle: "99% lead conversion for a bankruptcy law firm",
    metaTitle: "How We Helped a Bankruptcy Law Firm Achieve 99% Lead Conversion in 6 Months",
    metaDescription:
      "Discover how we helped a bankruptcy law firm achieve 99% lead conversion in just 6 months through targeted legal marketing and lead generation.",
    category: "Bankruptcy",
    client: "Chambers Law Firm",
    industry: "Legal Services (Bankruptcy Law)",
    duration: "6 Months",
    channels: "Website Development, SEO, Social Media Management, Google Local Service Ads (LSA)",
    summary:
      "From minimal digital presence to leading local search and generating daily high-quality leads — through a complete website redesign, SEO, social media growth and Google LSA.",
    published: "2025-08-09",
    stats: [
      { value: 99, suffix: "%", label: "Lead conversion rate" },
      { value: 132, prefix: "$", label: "Cost per lead" },
      { value: 14, label: "Leads in one month" },
    ],
    cardImage: { file: "case-study-05.png", alt: "Chambers Law Firm case study", width: 1200, height: 616 },
    blocks: [
      { type: "image", file: "chambers-law-firm-HOmepage.jpg", alt: "Chambers Law Firm homepage", width: 1024, height: 542 },
      { type: "h2", text: "Project Overview" },
      {
        type: "p",
        text: "Over 6 months, we helped Chambers Law Firm go from minimal digital presence to leading local search and generating daily high-quality leads. Through a complete website redesign, SEO execution, strategic social media growth, and high-converting Google LSA campaigns, we achieved a 99% conversion rate and an impressive $132 cost per lead.",
      },
      { type: "h2", text: "Challenges" },
      { type: "p", text: "When we began working with Chambers Law Firm:" },
      {
        type: "list",
        items: [
          "Their existing website had poor content organization and lacked SEO.",
          "There was no cohesive digital marketing strategy.",
          "Social media presence was minimal or nonexistent.",
          "Lead generation through online channels was insufficient.",
        ],
      },
      {
        type: "p",
        text: "These challenges demanded a full-scale digital transformation to position Chambers Law Firm as a leading bankruptcy attorney in their local market.",
      },
      { type: "h2", text: "1. Website Development & SEO Strategy" },
      {
        type: "p",
        text: "We started by completely redesigning the firm’s website from scratch. The previous site lacked structure and SEO-friendly content. Our process included:",
      },
      {
        type: "list",
        items: [
          "Conducting thorough keyword research focused on bankruptcy law services and local geographic targeting.",
          "Planning site architecture and content mapping using Miro and spreadsheets for clear visualization.",
          "Creating 14+ pages including service pages (bankruptcy-related), and essential pages such as Home, About Us, Contact, Appointment Booking, Disclaimer, and more.",
          "Ensuring every page was optimized for SEO best practices — meta tags, headings, content relevancy — and prioritized user experience.",
        ],
      },
      { type: "image", file: "keywords-research-for-the-chambers-law-firm.jpg", alt: "Keywords research for the Chambers Law Firm", width: 1024, height: 432, caption: "Keyword research" },
      { type: "image", file: "basic-Structure-for-the-chambers-law-firm.jpg", alt: "Site architecture for the Chambers Law Firm", width: 1024, height: 509, caption: "Site architecture" },
      { type: "h2", text: "2. Website Launch & SEO Execution" },
      { type: "p", text: "Once the website was developed:" },
      {
        type: "list",
        items: [
          "We launched the site and submitted all pages for Google indexing.",
          "Implemented on-page SEO and technical SEO improvements (mobile optimization, site speed).",
          "Built foundational backlinks to enhance domain authority.",
          "Within the first three months post-launch, organic traffic began to climb steadily.",
        ],
      },
      { type: "image", file: "gogole-search-console.jpg", alt: "Google Search Console performance for the Chambers Law Firm", width: 1024, height: 500, caption: "Google Search Console performance" },
      { type: "h2", text: "3. Social Media Growth & Engagement" },
      { type: "p", text: "To amplify brand awareness and engage potential clients:" },
      {
        type: "list",
        items: [
          "Established professional profiles on Facebook, YouTube, and LinkedIn.",
          "Posted daily educational content — images and videos — focused on bankruptcy law insights.",
          "Engaged with followers actively to build community trust.",
        ],
      },
      { type: "p", text: "Results on Facebook within a short period:" },
      { type: "list", items: ["361 organic followers", "300+ Likes", "Substantial organic reach demonstrated through Facebook Insights"] },
      { type: "image", file: "social-emdia-setup.jpg", alt: "Social media setup", width: 1024, height: 664, caption: "Facebook page setup" },
      { type: "image", file: "facebook-insight.png", alt: "Facebook insight", width: 1200, height: 552, caption: "Facebook Insights" },
      { type: "h2", text: "4. Lead Generation via Google Local Service Ads (LSA)" },
      { type: "p", text: "Understanding lead quality was paramount for legal services:" },
      {
        type: "list",
        items: [
          "We recommended Google Local Service Ads targeting specific local areas relevant to the client’s practice.",
          "Verified the Google Business Profile to enable LSA campaigns.",
          "Configured precise location targeting and budget controls.",
        ],
      },
      {
        type: "callout",
        text: "Outcome: daily leads began flowing in immediately with an impressive 99% conversion rate — most leads became paying clients. Chambers Law Firm consistently ranked #1 in Google Maps for targeted keywords.",
      },
      { type: "image", file: "LSA-lead-result.jpg", alt: "LSA lead result", width: 900, height: 728, caption: "Local Service Ads leads" },
      {
        type: "table",
        head: ["Metric", "Value"],
        rows: [
          ["Leads Generated", "14 (in 1 month)"],
          ["Total Ad Spend", "$1,855.38"],
          ["Cost Per Lead", "$132"],
          ["Client Conversion", "99%"],
        ],
      },
      { type: "p", text: "Given that client fees range from $1,750 to $4,500 per Chapter 7 bankruptcy case, this campaign delivered outstanding ROI." },
      { type: "h2", text: "Results Summary" },
      {
        type: "table",
        head: ["Key Performance Indicator", "Outcome"],
        rows: [
          ["Website Pages Created", "14+"],
          ["Organic Traffic Growth", "Significant within 3 months"],
          ["Social Media Followers (Facebook)", "361+ (organic)"],
          ["Lead Conversion Rate", "99%"],
          ["Cost Per Lead", "$132"],
          ["Leads Generated (1 Month)", "14"],
        ],
      },
      { type: "h3", text: "What’s Next?" },
      { type: "p", text: "Building on this success, we plan to:" },
      {
        type: "list",
        items: [
          "Continue scaling Google LSA campaigns to maintain a steady flow of high-quality leads.",
          "Introduce display advertising campaigns to boost brand awareness further.",
          "Maintain ongoing social media engagement with consistent, value-driven content.",
          "Develop and optimize a full digital marketing funnel built for legal services growth.",
        ],
      },
      { type: "h2", text: "Client Testimonial" },
      { type: "p", text: "Our partnership culminated in strong client satisfaction after six months of work. Hear directly from Chambers Law Firm about their experience working with us:" },
      { type: "video", youtubeId: "WJzkOR6Y-FE", title: "Chambers Law Firm on working with Law Pro Digital" },
      { type: "h2", text: "Conclusion" },
      {
        type: "p",
        text: "This project illustrates how a strategic, data-driven approach to digital marketing can transform a legal practice’s online presence and profitability. By combining expert website development, targeted SEO, active social media management, and tightly targeted paid ads, we delivered measurable results that matter — quality leads with excellent conversion rates.",
      },
    ],
  },
  {
    slug: "how-i-generated-240000-in-projected-revenue-from-a-932-ad-spend-for-an-immigration-law-firm",
    title: "How I Generated $240,000 in Projected Revenue from a $932 Ad Spend for an Immigration Law Firm",
    shortTitle: "86 eligible EB-2 NIW candidates from $932",
    metaTitle: "How I Generated $240,000 in Projected Revenue from a $932 Ad Spend for an Immigration Law Firm",
    metaDescription:
      "This case study details the strategy, execution, and remarkable results of the \"EB-2 NIW Evaluation Campaign 2.\" By implementing a precision-targeted, full-funnel digital marketing system, a $932 ad spend produced 86 qualified EB-2 NIW candidates.",
    category: "Immigration",
    client: "U.S. Immigration Law Firm",
    industry: "Immigration Lawyer (EB-2 NIW)",
    duration: "19 Days",
    channels: "Meta Ads (Facebook & Instagram), free evaluation offer, lead qualification form",
    summary:
      "A free EB-2 NIW evaluation offer for PhDs and post-doctoral researchers brought 130 evaluation requests and 86 eligible candidates. At the firm’s $4,000 fee and a projected 70% signing rate, that pipeline is worth a projected $240,000.",
    published: "2026-04-11",
    stats: [
      { value: 86, label: "Eligible candidates" },
      { value: 10.84, prefix: "$", decimals: 2, label: "Cost per eligible candidate" },
      { value: 932, prefix: "$", label: "Total ad spend" },
    ],
    blocks: [
      {
        type: "p",
        text: "Immigration law firms often struggle to find high-value clients for specialized services like the EB-2 National Interest Waiver (NIW) at a sensible cost. Broad marketing channels bring high acquisition costs and low-quality leads.",
      },
      {
        type: "p",
        text: "This case study covers the strategy, execution and results of the “EB-2 NIW Evaluation Campaign 2.” A precision-targeted, full-funnel system turned a $932.00 advertising budget into a pipeline of 86 highly qualified candidates for a U.S.-based immigration law firm, representing a projected revenue of $240,000.",
      },
      {
        type: "facts",
        items: [
          { label: "Client", value: "U.S. immigration law firm" },
          { label: "Service", value: "EB-2 NIW ($4,000 fee)" },
          { label: "Campaign dates", value: "March 14 – April 1, 2026" },
          { label: "Platform", value: "Meta Ads (Facebook & Instagram)" },
        ],
      },
      { type: "h2", text: "The Challenge" },
      {
        type: "p",
        text: "The EB-2 NIW is a visa category for foreign nationals with advanced degrees or exceptional ability whose work in the U.S. would greatly benefit the nation. The audience is narrow: PhD holders, post-doctoral researchers and distinguished academic professionals.",
      },
      { type: "p", text: "The firm faced three hurdles in marketing this $4,000 service:" },
      {
        type: "list",
        ordered: true,
        items: [
          "Reaching a niche audience: general advertising platforms often lack the targeting needed to reach post-doctoral researchers and academic professionals.",
          "High cost of acquisition: search PPC for immigration keywords is expensive and drains budgets without guaranteeing qualified leads.",
          "Quality over quantity: the firm needed candidates who met the strict EB-2 NIW requirements, not a high volume of generic inquiries that waste case managers’ time.",
        ],
      },
      { type: "h2", text: "The Strategy" },
      { type: "p", text: "We designed a full-funnel marketing system (top, middle and bottom of funnel) built on precise targeting and lead qualification." },
      { type: "h3", text: "The free evaluation offer" },
      {
        type: "p",
        text: "Instead of asking prospects to commit to a $4,000 legal service straight away, the campaign offered a low-friction entry point: a “Free EB-2 NIW Evaluation” for post-doctorates and PhDs. It gave prospects immediate value and let the firm assess eligibility before investing significant time.",
      },
      { type: "h3", text: "Lead qualification system" },
      {
        type: "p",
        text: "At the core was an evaluation form that asked about each candidate’s academic background, publications, citations and professional achievements. Only candidates with a high likelihood of approval were passed to the firm’s case managers.",
      },
      { type: "h3", text: "Precise audience targeting" },
      {
        type: "p",
        text: "The campaign ran on Meta Ads (Facebook and Instagram). Targeting focused on academic credentials and professional interests: PhD holders (35% of the target audience), post-doc researchers (30%) and broader academic professionals (20%), so ads reached people who already met the foundational EB-2 NIW requirements.",
      },
      { type: "h2", text: "Campaign Performance" },
      { type: "p", text: "“EB-2 NIW Evaluation Campaign 2” ran from March 14 to April 1, 2026." },
      {
        type: "table",
        caption: "Top-of-funnel metrics",
        head: ["Metric", "Result"],
        rows: [
          ["Total ad spend", "$932.00"],
          ["Reach", "27,629 accounts"],
          ["Impressions", "51,637"],
          ["Link clicks", "1,037"],
          ["Click-through rate (CTR)", "3.82%"],
          ["Landing page views", "901 (estimated)"],
        ],
      },
      { type: "p", text: "A 3.82% CTR is well above average for the legal sector, a sign that the ad creative and the free evaluation offer resonated with the academic audience." },
      { type: "h3", text: "Conversion and pipeline" },
      {
        type: "p",
        text: "The firm received 130 evaluation requests. The qualification system identified 86 of them as highly eligible for the EB-2 NIW service: 41 eligible candidates in the first five days, and another 39 in the following five days.",
      },
      { type: "h2", text: "Cost Efficiency" },
      { type: "p", text: "All figures are based on the verified total ad spend of $932.00." },
      {
        type: "table",
        head: ["Metric", "Cost"],
        rows: [
          ["Cost per link click", "$0.90"],
          ["Cost per evaluation request", "$7.17"],
          ["Cost per eligible candidate", "$10.84"],
        ],
      },
      { type: "h2", text: "Projected Revenue" },
      {
        type: "p",
        text: "The 86 eligible candidates were in the evaluation process with the firm’s case managers at the time of writing. Based on the firm’s historical data for highly qualified NIW leads, we project a 70% retainer signing rate.",
      },
      {
        type: "table",
        caption: "Projection at a 70% signing rate",
        head: ["Item", "Value"],
        rows: [
          ["Eligible candidates", "86"],
          ["Projected clients (70%)", "60"],
          ["Service fee", "$4,000"],
          ["Projected revenue", "$240,000"],
        ],
      },
      {
        type: "p",
        text: "That is a projected 25,651% return on the $932.00 ad spend (257.5x), with a projected cost of $15.53 per paying client.",
      },
      { type: "h3", text: "Scenario analysis" },
      {
        type: "table",
        head: ["Signing rate", "Clients", "Projected revenue", "Projected ROI"],
        rows: [
          ["50%", "43", "$172,000", "18,354%"],
          ["60%", "51", "$204,000", "21,788%"],
          ["80%", "68", "$272,000", "29,084%"],
        ],
      },
      {
        type: "callout",
        text: "Revenue figures are projections based on eligible candidates and the firm’s signing rate. Campaign metrics are from actual performance; client confidentiality has been maintained.",
      },
      { type: "h2", text: "How We Help Immigration Lawyers Grow" },
      {
        type: "list",
        ordered: true,
        items: [
          "Access to high-value clients: systems that attract clients for specialized services like EB-1, EB-2 NIW and O-1 visas.",
          "Lower acquisition costs: precise targeting and optimized funnels lower the cost per lead and per client.",
          "Better use of staff time: lead qualification means attorneys and case managers spend time only on prospects who are eligible and ready.",
          "Predictable growth: data-driven systems that produce a consistent pipeline of qualified cases.",
        ],
      },
      { type: "p", text: "If you are an immigration attorney who wants to build this kind of pipeline, let’s talk." },
    ],
  },
  {
    slug: "us-immigration-leads-dubai-meta-ads-case-study",
    title: "Digital Marketing Case Study: U.S. Immigration Lead Generation Campaign (Dubai Market)",
    shortTitle: "U.S. immigration leads from Dubai in 12 days",
    metaTitle: "U.S. Immigration Lead Generation Campaign (Dubai Market) — Case Study",
    metaDescription:
      "How a 12-day Meta Ads campaign generated 176 leads at $1.14 per lead for a U.S. immigration law firm targeting Dubai residents interested in EB-2 NIW, E-2, EB-5, EB-3 and H-1B.",
    category: "Immigration",
    client: "U.S. Immigration Law Firm",
    industry: "Immigration Lawyer",
    duration: "12 Days",
    channels: "Meta Ads (Facebook & Instagram) lead generation",
    summary:
      "Generate qualified leads from Dubai interested in U.S. immigration services including EB-2 NIW, E-2, EB-5, EB-3 and H-1B.",
    published: "2025-08-09",
    stats: [
      { value: 176, label: "Leads generated" },
      { value: 1.14, prefix: "$", decimals: 2, label: "Cost per lead" },
      { value: 199.89, prefix: "$", decimals: 2, label: "Total spend" },
    ],
    cardImage: { file: "unnamed-1.png", alt: "U.S. immigration leads Dubai campaign", width: 1200, height: 620 },
    blocks: [
      { type: "image", file: "Facebook-dubai-ads-performence.jpg", alt: "Facebook Dubai ads performance", width: 1024, height: 585 },
      { type: "h2", text: "Campaign Overview" },
      {
        type: "facts",
        items: [
          { label: "Client", value: "U.S. Immigration Law Firm" },
          { label: "Target Market", value: "Dubai (UAE residents interested in migrating to the U.S.)" },
          { label: "Start Date", value: "July 16, 2025" },
          { label: "End Date", value: "July 27, 2025" },
          { label: "Total Days Active", value: "12 Days" },
        ],
      },
      { type: "p", text: "Campaign objective: generate qualified leads from Dubai interested in various U.S. immigration services including:" },
      {
        type: "list",
        items: [
          "EB-2 NIW (National Interest Waiver)",
          "E-2 (Investor Visa)",
          "EB-5 (Investment-Based Green Card)",
          "EB-3 (Skilled & Unskilled Worker Visa)",
          "H-1B (Skilled Worker Visa with Employer Sponsorship)",
        ],
      },
      { type: "h2", text: "Performance Metrics (From Meta Ads)" },
      {
        type: "table",
        head: ["Metric", "Value"],
        rows: [
          ["Total Leads Generated", "176"],
          ["Cost Per Lead (CPL)", "$1.14"],
          ["Total Amount Spent", "$199.89"],
        ],
      },
      { type: "h3", text: "CTR & Conversion Data" },
      {
        type: "list",
        items: [
          "The campaign peaked around July 22 with the highest daily lead volume (~28–30 leads).",
          "Consistent performance from July 17–25, with leads averaging between 18–25/day.",
          "A sharp drop-off on July 26–27, likely due to budget depletion or audience saturation.",
        ],
      },
      { type: "h2", text: "Strategy Breakdown" },
      { type: "h3", text: "01. Targeting" },
      {
        type: "list",
        items: [
          "Geo: United Arab Emirates (Dubai-focused targeting)",
          "Demographics: Age 25–45, working professionals, investors, and skilled workers.",
          "Interests & behavior: people interested in U.S. immigration, study/work in the U.S., business expansion",
          "High-income segments (for EB-5 & E-2)",
          "Sponsored job seekers (for H-1B and EB-3)",
        ],
      },
      { type: "h3", text: "02. Ad Creative & Copy" },
      {
        type: "list",
        items: [
          "Tone: Professional, informative, trustworthy",
          "Headline hooks: “Want to Move to the U.S. from Dubai?”, “Green Card Without Job Offer?”, “Invest in Your American Dream”",
          "Visuals: Culturally resonant imagery, U.S. landmarks, legal",
          "Calls to action: “Apply Now”, “Check Your Eligibility”, “Free Assessment”",
        ],
      },
      { type: "h3", text: "03. Lead Form" },
      { type: "p", text: "Customized Instant Form via Meta Ads with the following key fields:" },
      { type: "list", items: ["Name", "Phone & Email", "Current Occupation", "Service Interest (EB2 NIW, EB5, E2, EB3, H1B)", "Timeframe to Apply"] },
      { type: "h2", text: "Insights from Leads (Collected Data Summary)" },
      {
        type: "table",
        head: ["Service Type", "% of Interested Leads"],
        rows: [
          ["EB2 NIW", "41% (Most popular)"],
          ["E-2 Investor", "24%"],
          ["EB-5", "16%"],
          ["EB-3", "12%"],
          ["H-1B", "7%"],
        ],
      },
      { type: "h3", text: "Analysis" },
      {
        type: "list",
        items: [
          "EB2 NIW led the results due to its no job offer requirement and appeal to professionals in Dubai.",
          "E-2 performs well among business owners and mid-level investors.",
          "EB-5 generates quality leads but lower volume, likely due to high investment threshold.",
          "EB-3 & H1B generate niche interest — mostly younger job-seeking professionals.",
        ],
      },
      { type: "h2", text: "Optimization Suggestions" },
      {
        type: "list",
        ordered: true,
        items: [
          "Retargeting funnel: retarget viewers who opened the form but didn’t submit. Use testimonials, success stories, or lawyer explainer videos.",
          "Service-specific landing pages: create separate pages or follow-up sequences specific to EB2 NIW, E2, etc.",
          "WhatsApp integration: add a WhatsApp CTA for direct consultation to capture more high-intent leads.",
          "Lookalike audience expansion: use lead data to create lookalikes in Dubai & surrounding expat-heavy regions.",
          "Test creative rotation: ads with immigration stories and lawyer videos tend to outperform generic graphics.",
        ],
      },
      { type: "h2", text: "Campaign Outcome & ROI Estimate" },
      {
        type: "table",
        caption: "Projections below are estimates based on law-firm average conversion rates, not tracked outcomes.",
        head: ["Item", "Value"],
        rows: [
          ["Qualified Leads", "176"],
          ["Estimated Conversion Rate (Law firm avg)", "~5–10%"],
          ["Potential Clients Acquired", "~9–17"],
          ["Estimated Revenue per Client (conservatively)", "$3,500+"],
          ["Projected Revenue", "$31,500 – $59,500"],
          ["Ad Spend", "$199.89"],
          ["Estimated ROAS (Return on Ad Spend)", "157x – 297x"],
        ],
      },
      { type: "h2", text: "Conclusion" },
      {
        type: "p",
        text: "This campaign clearly validated the Dubai market’s demand for U.S. immigration services — especially EB2 NIW and E2. With a remarkably low cost per lead and strong data-backed insights, this campaign provides a replicable blueprint for scaling across GCC and other global expat regions.",
      },
    ],
  },
  {
    slug: "e2-visa-lead-generation-for-us-immigration-lawyers-dubai",
    title: "How We Got 81 E-2 Visa Leads from Dubai for U.S. Immigration Lawyers — With Just $200!",
    shortTitle: "81 E-2 visa leads from Dubai with $200",
    metaTitle: "How We Got 81 E-2 Visa Leads from Dubai for U.S. Immigration Lawyers — With Just $200",
    metaDescription:
      "E-2 Treaty Investor Visa lead generation for U.S. immigration lawyers: a Meta Lead Ads campaign targeting Dubai-based entrepreneurs and investors delivered 81 leads at $2.47 per lead.",
    category: "Immigration",
    client: "U.S. Immigration Law Firm",
    industry: "Immigration Lawyer",
    duration: "09 Days",
    channels: "Meta (Facebook & Instagram) Lead Ads",
    summary: "Qualified E-2 Visa leads for U.S. immigration law firms, from Dubai-based entrepreneurs and investors.",
    published: "2025-08-09",
    stats: [
      { value: 81, label: "E-2 visa leads" },
      { value: 2.47, prefix: "$", decimals: 2, label: "Cost per lead" },
      { value: 199.94, prefix: "$", decimals: 2, label: "Total spend" },
    ],
    cardImage: { file: "E2-Lead-in-dubai.jpg", alt: "E2 lead in Dubai", width: 1024, height: 580 },
    blocks: [
      { type: "image", file: "E2-Lead-in-dubai.jpg", alt: "E2 lead in Dubai", width: 1024, height: 580 },
      {
        type: "facts",
        items: [
          { label: "Service Type", value: "Legal Digital Marketing & Lead Generation" },
          { label: "Focus Visa", value: "E-2 Treaty Investor Visa" },
          { label: "Target Audience", value: "Dubai-Based Entrepreneurs & Investors" },
          { label: "Client Objective", value: "Qualified E-2 Visa Leads for U.S. Immigration Law Firms" },
          { label: "Platform", value: "Meta (Facebook & Instagram) Lead Ads" },
          { label: "Budget", value: "$200" },
          { label: "Total Leads Generated", value: "81" },
          { label: "Cost Per Lead", value: "$2.47" },
          { label: "Campaign Duration", value: "15–23 July 2025" },
        ],
      },
      { type: "h2", text: "Client Goal" },
      {
        type: "p",
        text: "U.S. immigration lawyers face increasing demand for E-2 visa services — especially from international investors in Dubai looking to legally expand their businesses into the United States. The goal was simple yet ambitious:",
      },
      {
        type: "callout",
        text: "Deliver qualified, investment-ready leads to a U.S.-based immigration law firm within a limited budget — and prove that smart legal marketing can generate real, high-value prospects.",
      },
      { type: "h2", text: "Why Focus on the E-2 Visa and Dubai Market?" },
      {
        type: "p",
        text: "The E-2 Treaty Investor Visa is one of the most attractive U.S. immigration options for global investors. In recent years, Dubai has emerged as a high-potential hotspot due to its business-friendly environment and globally mobile investor base. Immigration attorneys across the U.S. are aggressively seeking Dubai-based clients with E-2 potential — but they struggle to reach the right audience efficiently.",
      },
      { type: "h2", text: "Our Strategy: Targeted, Intent-Driven Legal Marketing" },
      { type: "h3", text: "1. Targeting Strategy" },
      {
        type: "list",
        items: [
          "Location: Dubai, United Arab Emirates",
          "Audience interests: U.S. immigration, business investment, global mobility, entrepreneurship, wealth management",
          "Behaviors: High-income demographics, frequent travelers, business page admins",
          "Exclusions: Students, unrelated service interests (to reduce junk leads)",
        ],
      },
      { type: "h3", text: "2. Lead Magnet Form Design" },
      {
        type: "p",
        text: "We created a custom Facebook lead form with qualifying questions that immigration lawyers need to know upfront. This wasn’t just name and email collection — this was lead filtration at the source. Key questions included:",
      },
      {
        type: "list",
        items: [
          "Country of citizenship",
          "Investment budget for U.S. business",
          "Current business ownership",
          "Timeline for moving to the U.S.",
          "Preferred U.S. state (optional)",
          "Phone number & WhatsApp for direct legal follow-up",
        ],
      },
      { type: "h3", text: "3. Ad Creative & Messaging" },
      { type: "p", text: "We used professionally branded visuals and persuasive copy, including:" },
      {
        type: "list",
        items: [
          "“Move from Dubai to the U.S. with a Business Visa”",
          "“E-2 Visa: Start or Buy a U.S. Business — Live Legally”",
          "“U.S. Immigration Lawyers Ready to Assist You – Start Today”",
        ],
      },
      { type: "p", text: "Multiple formats were tested: video ads, static image posts, and short-form mobile-friendly text." },
      { type: "h2", text: "Campaign Results (15–23 July 2025)" },
      {
        type: "table",
        head: ["Metric", "Result"],
        rows: [
          ["Leads Generated", "81"],
          ["Total Spend", "$199.94"],
          ["Cost Per Lead (CPL)", "$2.47"],
          ["Qualified Prospects", "~50 (based on form completeness + investor intent)"],
          ["Projected Conversion Rate", "~20% (16+ potential cases for immigration attorneys)"],
        ],
      },
      { type: "p", text: "These results mean real legal case opportunities delivered at scale." },
      { type: "h2", text: "Why This Worked for U.S. Immigration Lawyers" },
      {
        type: "list",
        items: [
          "Pre-qualified leads: lawyers don’t have time to chase cold contacts. We filtered for real investor intent.",
          "Legal-focused messaging: we spoke the language of U.S. immigration services with clarity and authority.",
          "High-converting format: Facebook lead ads worked smoothly across mobile devices — capturing leads directly within the app.",
          "Immediate CRM integration: leads were routed to call support for direct follow-up, maximizing conversion potential.",
        ],
      },
      { type: "h2", text: "Conclusion" },
      {
        type: "p",
        text: "This campaign proves that legal digital marketing doesn’t need big budgets — it needs smart execution. Whether you offer E-2, EB-5, EB-1A, or NIW visa services, the same approach helps you attract serious prospects who are ready to talk to a lawyer, rather than only downloading a checklist.",
      },
    ],
  },
  {
    slug: "google-call-ads-leads-immigration-lawyers-los-angeles",
    title: "How One Simple Google Call Ads Test Generated Real Leads for Immigration Lawyers in Los Angeles",
    shortTitle: "A 7-day Google Call Ads test in Los Angeles",
    metaTitle: "How One Simple Google Call Ads Test Generated Real Leads for Immigration Lawyers in Los Angeles",
    metaDescription:
      "A 7-day Google Call-Only campaign for immigration and asylum lawyers in Los Angeles: 9 calls, 6 over 30 seconds, ~$14.88 per call on a $134 total spend.",
    category: "Immigration",
    client: "U.S. Immigration Law Firm",
    industry: "Immigration Lawyer",
    duration: "07 Days",
    channels: "Google Search — Call Only (Mobile Click-to-Call)",
    summary: "A 7-day PPC experiment that turned clicks into calls — and calls into clients.",
    published: "2025-08-09",
    stats: [
      { value: 9, label: "Calls received" },
      { value: 6, label: "Calls over 30 seconds" },
      { value: 134, prefix: "$", label: "Total spend" },
    ],
    cardImage: { file: "Los-angelas-call-ads-performence-overview.jpg", alt: "Los Angeles call ads performance overview", width: 1024, height: 550 },
    blocks: [
      { type: "image", file: "Los-angelas-call-ads-performence-overview.jpg", alt: "Los Angeles call ads performance overview", width: 1024, height: 550 },
      { type: "h2", text: "The Challenge" },
      {
        type: "p",
        text: "As a law firm, you know how competitive the legal space is in Los Angeles. With countless attorneys bidding on the same keywords and clients overwhelmed by choices, it’s easy for your firm to get lost in the noise.",
      },
      {
        type: "callout",
        text: "Can a small, tightly targeted Google PPC Call-Only campaign bring in real, qualified leads for immigration and asylum law firms — without wasting money? So, we tested it.",
      },
      { type: "h2", text: "The Strategy: A Smart 7-Day Experiment" },
      {
        type: "p",
        text: "To find out what works, we ran a 7-day Google Call-Only Search Ads campaign targeting mobile users in Los Angeles. The campaign focused on immigration and asylum-related legal services and used a limited budget to test performance.",
      },
      {
        type: "facts",
        items: [
          { label: "Location", value: "Los Angeles, California" },
          { label: "Ad Type", value: "Google Search – Call Only (Mobile Click-to-Call)" },
          { label: "Budget", value: "$15/day" },
          { label: "Total Spend", value: "$134" },
          { label: "Duration", value: "13–26 July 2025" },
        ],
      },
      { type: "h2", text: "What We Targeted" },
      { type: "p", text: "We selected high-intent keywords that someone would search right before calling a lawyer:" },
      {
        type: "list",
        items: [
          "“asylum lawyer near me”",
          "“immigration attorney los angeles”",
          "“deportation help”",
          "“green card lawyer LA”",
          "“immigration law firm near me” (and more)",
        ],
      },
      {
        type: "p",
        text: "Using broad match for discovery and testing, we kept our eyes on real-time performance to identify what’s driving actual calls.",
      },
      { type: "h2", text: "The Results — In Just 7 Days" },
      {
        type: "table",
        head: ["Metric", "Value"],
        rows: [
          ["Clicks", "14"],
          ["Calls Received", "9"],
          ["Calls Over 30s (High Intent)", "6"],
          ["Average CPC", "$9.57"],
          ["Cost per Call", "~$14.88"],
          ["Conversions (Google Tracked)", "1 confirmed"],
          ["Total Spend", "$134"],
        ],
      },
      { type: "p", text: "6 out of 9 calls were more than 30 seconds long — indicating serious consultations and potential client onboarding." },
      { type: "h2", text: "Keyword Highlights" },
      {
        type: "table",
        head: ["Keyword", "Clicks", "Impressions", "Avg. CPC", "Conversions"],
        rows: [
          ["“asylum lawyer near me”", "10", "760", "$10.33", "1"],
          ["“immigration attorney los angeles”", "2", "89", "$10.94", "0"],
        ],
      },
      {
        type: "p",
        text: "These keywords drove most of the traffic — especially mobile users actively looking to speak to a lawyer right now.",
      },
      { type: "image", file: "SEarch-keyword-with-specific.jpg", alt: "Search keywords with specific performance", width: 1024, height: 599 },
      { type: "h3", text: "Call Insights" },
      { type: "p", text: "We reviewed the call log and found:" },
      {
        type: "list",
        items: [
          "Area codes: 323, 909, 818, etc. — all U.S. numbers",
          "Duration up to 154 seconds — serious leads",
          "100% calls received, no missed attempts",
          "Lawyers reported that at least 2–3 callers were serious leads and one may already be onboarded.",
        ],
      },
      { type: "image", file: "Call-Perfromence-in-the-google-ads.jpg", alt: "Call performance in Google Ads", width: 1024, height: 638 },
      { type: "h3", text: "Why This Worked" },
      {
        type: "list",
        items: [
          "Call-only format: no website visit needed — users call directly from Google.",
          "High-intent keywords: targeting people in crisis mode looking for help.",
          "Mobile focus: we captured people ready to dial a lawyer immediately.",
          "Simple budget: no need for $1,000+ to test — we did it with $134.",
        ],
      },
      { type: "h2", text: "Lessons for Law Firms" },
      { type: "p", text: "If you’re an immigration, asylum, or deportation lawyer, this test shows that:" },
      {
        type: "list",
        items: [
          "Google Call Ads work — and they don’t need to be expensive.",
          "You can start getting real phone leads in just a few days.",
          "People are searching for you — but only if you’re visible.",
        ],
      },
      { type: "h2", text: "What We Recommend Next" },
      {
        type: "list",
        ordered: true,
        items: [
          "Use phrase/exact match keywords: lock in on high-performing keywords and exclude low-intent searches.",
          "Schedule ads during business hours: maximize answered calls by showing ads only when your team is ready.",
          "Add negative keywords: filter out irrelevant searches like “free”, “ICE”, “student visa”, etc.",
          "Record and review calls: activate Google call recording to track lead quality and improve intake scripts.",
          "Retarget or follow up offline: use a CRM to track call outcomes, especially for unconverted but interested leads.",
        ],
      },
      { type: "h2", text: "Want Results Like This for Your Firm?" },
      {
        type: "p",
        text: "We’ve tested it. We’ve seen it work. Whether you’re based in LA, New York, Houston, or anywhere in the U.S., Google Call Ads can connect you directly to clients who are ready to talk. Let’s scale this for your practice.",
      },
    ],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}

/** Verified outcome of the Chambers Law Firm engagement, used on the homepage. */
export const featuredTestimonial = {
  youtubeId: "WJzkOR6Y-FE",
  client: "Chambers Law Firm",
  context: "Bankruptcy law · 6-month engagement",
  caseStudySlug: "bankruptcy-law-firm-99-percent-lead-conversion",
} as const;
