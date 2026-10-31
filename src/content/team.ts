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

/** Brand-coloured silhouettes in public/images/team/demo/, used until real portraits arrive. */
const demoPhoto = (n: number) => ({ src: `/images/team/demo/demo-${n}.svg`, width: 400, height: 400 });

// Real people only. Add each new member here with their portrait in public/images/team/.
export const team: TeamMember[] = [
  {
    name: founder.name,
    role: "Founder",
    bio: "Built the system inside a multi-office US immigration firm: the ads, the content, the Google profiles and the monthly reports.",
    // TODO(owner): replace with the real portrait (also set founder.photo in home.ts).
    photo: founder.photo ?? demoPhoto(6),
    links: founder.links,
  },
  {
    name: "Md Arafat Hossain Asif",
    role: "Co-Founder",
    // TODO(owner): replace with the real portrait.
    photo: demoPhoto(7),
    links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/mdarafathossain-asif/" }],
  },
];

/**
 * Fictional placeholders to preview a fuller grid. Shown only by `next dev`, never in a
 * production build: replace them with real members in `team` above.
 */
export const demoTeam: TeamMember[] = [
  { name: "Demo Member", role: "Meta Ads Specialist", bio: "Placeholder card: dev preview only.", photo: demoPhoto(1), links: [] },
  { name: "Demo Member", role: "SEO & AI Search Lead", bio: "Placeholder card: dev preview only.", photo: demoPhoto(2), links: [] },
  { name: "Demo Member", role: "Content Writer", bio: "Placeholder card: dev preview only.", photo: demoPhoto(3), links: [] },
  { name: "Demo Member", role: "Client Success Manager", bio: "Placeholder card: dev preview only.", photo: demoPhoto(4), links: [] },
  { name: "Demo Member", role: "Video Editor", bio: "Placeholder card: dev preview only.", photo: demoPhoto(5), links: [] },
];
