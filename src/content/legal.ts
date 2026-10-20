/**
 * Privacy policy and terms of use.
 *
 * These describe what the site actually does (checked against the code in October 2026):
 * the contact form is emailed to the team and not stored in a database, there are no
 * analytics or advertising cookies, fonts are self-hosted, and the YouTube player loads
 * only when a visitor presses play.
 *
 * TODO(owner): have both texts reviewed by your lawyer before launch, and add your
 * registered business address and governing-law state (see docs/PRODUCTION_CHECKLIST.md).
 * Update this file whenever analytics, chat widgets, booking tools or a CRM are added.
 */

import { contact, site } from "./site";

export type LegalSection = { heading: string; paragraphs?: string[]; items?: string[] };

export const LEGAL_UPDATED = "2026-10-20";

const email = contact.email ?? "";

export const privacyPolicy: LegalSection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      `${site.name} (“we”, “us”) is a digital marketing agency for law firms. This policy explains what personal information ${site.url.replace("https://", "")} collects, why, and what you can ask us to do with it.`,
    ],
  },
  {
    heading: "What we collect",
    paragraphs: ["We only collect what you choose to send us through the contact form:"],
    items: [
      "Your first and last name",
      "Your email address and, if you add it, your phone number",
      "The city and service you select, if any",
      "The message you write",
    ],
  },
  {
    heading: "How we use it",
    paragraphs: [
      "Your enquiry is sent to our team by email so we can reply, prepare the audit or proposal you asked for, and keep a record of our conversation with you. We don’t sell your information, and we don’t add you to a mailing list without asking.",
      "Please don’t include confidential details about a legal matter in the form. We are a marketing agency, not a law firm, and sending us a message doesn’t create an attorney–client relationship.",
    ],
  },
  {
    heading: "Where it is stored and for how long",
    paragraphs: [
      "The website doesn’t store form submissions in a database. Each enquiry is delivered to our business email inbox and kept there for as long as we need it to work with you, after which you can ask us to delete it.",
      "To stop spam, the website briefly keeps the IP address a message was sent from in memory for about ten minutes. Like most web servers, our hosting provider also keeps standard access logs (IP address, browser type, pages requested) for security and troubleshooting.",
    ],
  },
  {
    heading: "Cookies, analytics and third parties",
    paragraphs: [
      "The website doesn’t use analytics, advertising or tracking cookies, and its fonts and images are served from our own server.",
      "Client video testimonials are hosted on YouTube. Nothing is loaded from YouTube until you press play; the player then loads from YouTube’s privacy-enhanced domain (youtube-nocookie.com) and YouTube’s own privacy policy applies.",
    ],
  },
  {
    heading: "Your choices",
    paragraphs: [
      `You can ask us to tell you what information we hold about you, correct it, or delete it. Email ${email} and we’ll respond within 30 days.`,
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: ["If we change how the website handles personal information, we’ll update this page and the date at the top."],
  },
];

export const terms: LegalSection[] = [
  {
    heading: "Using this website",
    paragraphs: [
      `These terms apply to your use of ${site.url.replace("https://", "")}. By using the site you agree to them. If you don’t agree, please don’t use the site.`,
    ],
  },
  {
    heading: "Information only",
    paragraphs: [
      `The content on this site is general information about marketing for law firms. It isn’t legal, financial or professional advice, and ${site.name} is not a law firm.`,
      "Case studies describe results for specific clients in specific markets and periods. They are not a promise or guarantee that your firm will get the same results.",
    ],
  },
  {
    heading: "Services and pricing",
    paragraphs: [
      "Prices on this site are a starting guide. The scope, fees and terms of any engagement are set out in a written agreement between your firm and us, which takes precedence over anything on this site.",
    ],
  },
  {
    heading: "Intellectual property",
    paragraphs: [
      `The text, design, graphics and code of this site belong to ${site.name} or are used with permission. You may share links to our pages, but please don’t copy or republish the content without written permission.`,
    ],
  },
  {
    heading: "Acceptable use",
    items: [
      "Don’t use the contact form to send spam, malware or unlawful content.",
      "Don’t try to disrupt, overload or gain unauthorized access to the site or its server.",
      "Don’t submit someone else’s personal information without their permission.",
    ],
  },
  {
    heading: "Links to other websites",
    paragraphs: ["Links to other sites are provided for convenience. We aren’t responsible for their content or privacy practices."],
  },
  {
    heading: "Limitation of liability",
    paragraphs: [
      `The site is provided “as is”. To the extent the law allows, ${site.name} isn’t liable for any loss arising from your use of the site or reliance on its content.`,
    ],
  },
  {
    heading: "Contact",
    paragraphs: [`Questions about these terms: ${email}.`],
  },
];
