export const serviceOptions: string[] = [
  "Free AI lead audit",
  "Meta Ads (Facebook & Instagram)",
  "AI intake assistant",
  "AI search (AEO/GEO)",
  "Google Business Profile",
  "Law Firm SEO",
  "Bankruptcy lawyer SEO",
  "Immigration lawyer SEO",
  "Law firm PPC",
  "Website Design",
  "Social Media Marketing",
  "Video Marketing",
];

export type ContactField = "firstName" | "lastName" | "email" | "firmWebsite" | "phone" | "city" | "service" | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<ContactField, string>>;
  values?: Partial<Record<ContactField, string>>;
};
