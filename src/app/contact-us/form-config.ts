import { cities } from "@/content/home";

/** Options carried over from the original contact form, plus Law Firm SEO. */
export const cityOptions: string[] = [...cities];

export const serviceOptions: string[] = [
  "Law Firm SEO",
  "Bankruptcy lawyer SEO",
  "Immigration lawyer SEO",
  "Law firm PPC",
  "Website Design",
  "Social Media Marketing",
  "Video Marketing",
];

export type ContactField = "firstName" | "lastName" | "email" | "phone" | "city" | "service" | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<ContactField, string>>;
  values?: Partial<Record<ContactField, string>>;
};
