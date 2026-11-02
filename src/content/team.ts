import { founder } from "@/content/home";

export type TeamMember = {
  name: string;
  role: string;
  bio?: string;
  /** Square portrait in /public/images/team/. Initials show until set. */
  photo?: { src: string; width: number; height: number };
  /** Profiles (LinkedIn, Upwork), opened in a new tab. */
  links: { label: string; href: string }[];
};

const teamPhoto = (file: string, size = 600) => ({ src: `/images/team/${file}`, width: size, height: size });

// Real people only. Add each new member here with their portrait in public/images/team/.
export const team: TeamMember[] = [
  {
    name: founder.name,
    role: "Founder",
    bio: "Built the system inside a multi-office US immigration firm: the ads, the content, the Google profiles and the monthly reports.",
    photo: founder.photo,
    links: founder.links,
  },
  {
    name: "Md Arafat Hossain Asif",
    role: "Co-Founder · Developer & Designer",
    photo: teamPhoto("arafat-hossain-asif.jpg", 400),
    links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/mdarafathossain-asif/" }],
  },
];

/**
 * Team members whose names are not confirmed yet. Shown only by `next dev`, never in a
 * production build.
 * TODO(owner): add each person's real name, then move their entry into `team` above.
 */
export const demoTeam: TeamMember[] = [
  { name: "Team Member", role: "SEO & AI Search Specialist", photo: teamPhoto("member-1.jpg"), links: [] },
  { name: "Team Member", role: "Meta Ads Specialist", photo: teamPhoto("member-2.jpg"), links: [] },
  { name: "Team Member", role: "Client Success Manager", photo: teamPhoto("member-3.jpg"), links: [] },
];
