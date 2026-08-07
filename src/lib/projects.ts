// Phoenix Group — Portfolio data model.
// Source: phoenixindia.net/commercial and phoenixindia.net/sez-projects
// (scraped 2026-08-07), plus the existing Equinox/Aquila content already
// built out for the site. This is the single source of truth the whole
// /portfolio route tree (gateway, index pages, project pages) reads from —
// add a project by appending an entry here, no route/layout changes needed.
//
// phoenixindia.net/commercial is headed "Completed Projects" on the source
// site — every project scraped from it, including Equinox, is "completed"
// here too. phoenixindia.net/sez-projects is the real "Upcoming Projects"
// source page. Commercial and SEZ are not exposed as user-facing
// categories on this site. Only Equinox and Aquila have deep
// content (gallery/specs/video) for now; the rest carry the real name,
// location, description, building configuration and amenities available
// on the source site — optional sections (masterplan, floor plans,
// sustainability, construction progress) simply don't render until that
// data is supplied.

export type ProjectStatus = "upcoming" | "completed";

export interface ProjectSpec {
  label: string;
  value: string;
}

export interface Project {
  title: string;
  slug: string;
  status: ProjectStatus;
  location: string;
  overview: string;
  heroImage: string;
  heroVideo?: string;
  gallery?: string[];
  specifications: ProjectSpec[];
  amenities?: string[];
  /** e.g. "2024" for completed, "Under construction" / a year for upcoming */
  timeline?: string;
  masterplanImage?: string;
  floorPlans?: { label: string; image: string }[];
  sustainability?: string;
  constructionProgress?: string;
}

export const projects: Project[] = [
  // ── Upcoming ──────────────────────────────────────────────────────
  {
    title: "Phoenix Equinox",
    slug: "equinox",
    status: "completed",
    location: "Hitech City, Hyderabad",
    overview:
      "Equinox is a landmark project adjacent to IKEA, spread over 6.5 acres, with 20 floors. These towers offer picturesque views of the city and are easily accessible from the Hitech City metro station.",
    heroImage: "/phoenix/images/equinox.png",
    heroVideo: "/phoenix/videos/construction-equinox.mp4",
    specifications: [
      { label: "Site", value: "6.5 acres" },
      { label: "Towers", value: "4" },
      { label: "Floors", value: "20" },
      { label: "Parking floors", value: "9" },
      { label: "Type of space", value: "SEZ" },
      { label: "Built-up area", value: "2.7 mil sq ft" },
    ],
    amenities: ["Club house", "Sports arena"],
    timeline: "Completed",
  },
  {
    title: "Phoenix Business Hub",
    slug: "business-hub",
    status: "upcoming",
    location: "Financial District, Hyderabad",
    overview:
      "Business Hub, a landmark project of the future, spread over 17 acres, is the largest upcoming and privately owned SEZ campus in the heart of the financial district.",
    heroImage: "/phoenix/portfolio/business-hub.jpg",
    specifications: [{ label: "Site", value: "17 acres" }, { label: "Type of space", value: "SEZ" }],
    amenities: ["Club house", "Sports arena"],
    timeline: "Upcoming",
  },
  {
    title: "Phoenix H10 Campus",
    slug: "h10-campus",
    status: "upcoming",
    location: "Hitech City, Hyderabad",
    overview:
      "H-10 campus, spread across 14 acres, is an expansion of the well-established Avance Business Hub — designed as an IT/ITeS SEZ office space in the heart of the Hitech City corridor.",
    heroImage: "/phoenix/portfolio/h10-campus.jpg",
    specifications: [{ label: "Site", value: "14 acres" }, { label: "Type of space", value: "SEZ" }],
    amenities: ["Club house", "Sports arena"],
    timeline: "Upcoming",
  },
  {
    title: "Phoenix Eterna",
    slug: "eterna",
    status: "upcoming",
    location: "Hitech City, Hyderabad",
    overview:
      "Eterna is a multi-tower campus planned in a premium pocket of Hitech City, flanked by IKEA and Deloitte and overlooking the undeveloped skyline of the corridor.",
    heroImage: "/phoenix/portfolio/eterna.jpg",
    specifications: [{ label: "Type of space", value: "SEZ" }],
    amenities: ["Club house", "Sports arena"],
    timeline: "Upcoming",
  },
  {
    // TODO: hero render supplied — location, overview and specifications
    // still need to be confirmed before this goes live.
    title: "Phoenix Triton",
    slug: "triton",
    status: "upcoming",
    location: "Hyderabad",
    overview: "Details for Phoenix Triton to be confirmed.",
    heroImage: "/phoenix/portfolio/triton.jpg",
    specifications: [],
    timeline: "Upcoming",
  },
  {
    title: "Phoenix 285 FD",
    slug: "285-financial-district",
    status: "upcoming",
    location: "Financial District, Hyderabad",
    overview:
      "285 Financial District, a large SEZ campus, is spread over a sprawling 23 acres — designed to dominate the skyline of Hyderabad's financial district.",
    heroImage: "/phoenix/portfolio/285-financial-district.jpg",
    specifications: [{ label: "Site", value: "23 acres" }, { label: "Type of space", value: "SEZ" }],
    amenities: ["Club house", "Sports arena"],
    timeline: "Upcoming",
  },
  {
    title: "Phoenix Avance Business Hub",
    slug: "avance-business-hub",
    status: "completed",
    location: "Hitech City, Hyderabad",
    overview:
      "Phoenix Avance Business Hub is a commercial project offering well-designed, affordable office spaces across 10 business towers in the heart of Hitech City.",
    heroImage: "/phoenix/portfolio/avance-business-hub.jpg",
    specifications: [
      { label: "Towers", value: "10" },
      { label: "Floors", value: "12" },
      { label: "Parking floors", value: "7" },
      { label: "Type of space", value: "SEZ" },
      { label: "Built-up area", value: "5.5 mil sq ft" },
    ],
    amenities: ["Club house", "Outdoor cafe"],
    timeline: "Completed",
  },
  {
    title: "Phoenix Lithop",
    slug: "lithop",
    status: "completed",
    location: "Jubilee Hills, Hyderabad",
    overview:
      "Phoenix Lithop is a commercial project designed to simplify everyday life. Spread over 0.56 million sq ft, Lithop features 14 floors of office space.",
    heroImage: "/phoenix/portfolio/lithop.jpg",
    specifications: [
      { label: "Towers", value: "1" },
      { label: "Floors", value: "14" },
      { label: "Parking floors", value: "9" },
      { label: "Type of space", value: "Commercial" },
      { label: "Built-up area", value: "0.5 mil sq ft" },
    ],
    amenities: ["Club house", "Sports arena"],
    timeline: "Completed",
  },
  {
    title: "Phoenix Primea",
    slug: "primea",
    status: "completed",
    location: "Financial District, Hyderabad",
    overview:
      "Phoenix Primea is a state-of-the-art commercial project of 0.22 mil sq ft located in Nanakramguda, with 3 business towers comprising 6 floors of office space.",
    heroImage: "/phoenix/portfolio/primea.jpg",
    specifications: [
      { label: "Towers", value: "3" },
      { label: "Office floors", value: "5" },
      { label: "Parking floors", value: "3" },
      { label: "Type of space", value: "Non-SEZ" },
      { label: "Built-up area", value: "2,25,000 sq ft" },
    ],
    timeline: "Completed",
  },
  {
    title: "Phoenix Centaurus",
    slug: "centaurus",
    status: "completed",
    location: "Financial District, Hyderabad",
    overview:
      "Centaurus is a state-of-the-art project centrally located in Hyderabad's financial district — a large tower spread across 2 million sq ft.",
    heroImage: "/phoenix/portfolio/centaurus.jpg",
    specifications: [
      { label: "Towers", value: "1" },
      { label: "Office floors", value: "17" },
      { label: "Parking floors", value: "9" },
      { label: "Type of space", value: "SEZ" },
      { label: "Built-up area", value: "2.1 mil sq ft" },
    ],
    amenities: ["Food court", "Creche", "Gym", "Retail"],
    timeline: "Completed",
    sustainability:
      "IGBC precertified — see the Awards & Certifications page for the full certification record.",
  },
  {
    title: "Phoenix Trivium",
    slug: "trivium",
    status: "completed",
    location: "Hafeezpet, Hyderabad",
    overview:
      "Phoenix Trivium is a commercial project of 0.9 mil sq ft located in the growing micro-market of Hafeezpet, intelligently designed to enhance efficiency.",
    heroImage: "/phoenix/portfolio/trivium.jpg",
    specifications: [
      { label: "Towers", value: "3" },
      { label: "Floors", value: "12" },
      { label: "Parking floors", value: "5" },
      { label: "Type of space", value: "Commercial" },
      { label: "Built-up area", value: "0.9 mil sq ft" },
    ],
    timeline: "Completed",
  },
  {
    title: "Phoenix Golf Edge Commercial",
    slug: "golf-edge-commercial",
    status: "completed",
    location: "Financial District, Hyderabad",
    overview:
      "Phoenix Golf Edge Commercial is a project spread across 0.3 mil sq ft, consisting of 1 tower of 24 floors and 3 basement floors, located in Gachibowli.",
    heroImage: "/phoenix/portfolio/golf-edge-commercial.jpg",
    specifications: [
      { label: "Towers", value: "1" },
      { label: "Floors", value: "24" },
      { label: "Parking floors", value: "3 basements" },
      { label: "Type of space", value: "Commercial" },
      { label: "Built-up area", value: "0.3 mil sq ft" },
    ],
    timeline: "Completed",
  },
  {
    title: "Phoenix Ivy",
    slug: "ivy",
    status: "completed",
    location: "Jubilee Hills, Hyderabad",
    overview:
      "Phoenix Ivy is a commercial project located in the bustling and vibrant area of Filmnagar, Jubilee Hills, set on 0.25 mil sq ft.",
    heroImage: "/phoenix/portfolio/ivy.jpg",
    specifications: [
      { label: "Towers", value: "1" },
      { label: "Floors", value: "10" },
      { label: "Parking floors", value: "7" },
      { label: "Type of space", value: "Commercial" },
      { label: "Built-up area", value: "0.25 mil sq ft" },
    ],
    timeline: "Completed",
  },
  {
    title: "H-09, Avance Business Hub",
    slug: "h09-avance-business-hub",
    status: "completed",
    location: "Hitech City, Hyderabad",
    overview:
      "H-09, an addition to the Avance Business Hub, is an IT/ITeS SEZ office space in the bustling IT corridor of Hitech City, conveniently located within the existing campus.",
    heroImage: "/phoenix/portfolio/h09-avance-business-hub.jpg",
    specifications: [
      { label: "Towers", value: "1" },
      { label: "Floors", value: "12" },
      { label: "Parking floors", value: "7" },
      { label: "Type of space", value: "SEZ" },
      { label: "Built-up area", value: "1.14 mil sq ft" },
    ],
    amenities: ["Outdoor cafe"],
    timeline: "Completed",
  },

  // ── Completed ─────────────────────────────────────────────────────
  {
    title: "Phoenix Aquila",
    slug: "aquila",
    status: "completed",
    location: "Financial District, Hyderabad",
    overview:
      "Aquila means “Eagle” in Latin — a project that embodies the spirit and swiftness of this iconic bird, expressed through the sleek design language and architecture of the building. It stands elegant in the midst of Hyderabad's Financial District with world-class amenities.",
    heroImage: "/phoenix/images/aquila.png",
    heroVideo: "/phoenix/videos/construction-aquila.mp4",
    specifications: [
      { label: "Built-up area", value: "1.8 mil sq ft" },
      { label: "Towers", value: "2" },
      { label: "Floors", value: "16" },
      { label: "Parking floors", value: "10" },
      { label: "Type of space", value: "SEZ" },
    ],
    amenities: ["Food court", "Sports zone", "Creche", "Gym", "Salon"],
    timeline: "Completed",
  },
];

export function getProjectsByStatus(status: ProjectStatus): Project[] {
  return projects.filter((p) => p.status === status);
}

export function getProjectBySlug(status: ProjectStatus, slug: string): Project | undefined {
  return projects.find((p) => p.status === status && p.slug === slug);
}

export function getRelatedProjects(project: Project, count = 3): Project[] {
  return projects
    .filter((p) => p.status === project.status && p.slug !== project.slug)
    .slice(0, count);
}
