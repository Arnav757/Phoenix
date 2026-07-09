// Phoenix Group — global partner network.
// Source: phoenixindia.net/partners (logos + categories, scraped 2026-07-08).
// HQ cities/coordinates and websites are public knowledge for these firms.
// "since" is optional and omitted where Phoenix hasn't published it.
// Adding a partner = append to PARTNERS; every view renders from this file.

import { city, REGIONS, type NetworkEntity, type Office, type Region } from "./network-types";

export type { Office, Region };
export { REGIONS };

// Hero copy for the Partners tab — unchanged from the original page copy,
// just relocated here so the page component can switch cleanly between
// Partner/Client hero content by tab.
export const partnersIntro = {
  summary:
    "Behind every successful development is a network of trusted global partners. From steel manufacturers and façade specialists to engineering consultants and technology leaders, our collaborations bring world-class expertise to every project.",
};

export type Partner = NetworkEntity & {
  logo: string; // partners always have a logo today
  category: PartnerCategory;
};

export const CATEGORIES = [
  "Capital Partners",
  "General Contractor",
  "Structural Steel",
  "Building Materials",
  "Principal Architects",
  "Project Management",
  "Integrated FM Services",
] as const;
export type PartnerCategory = (typeof CATEGORIES)[number];

export const PARTNERS: Partner[] = [
  {
    id: "chapman-taylor",
    name: "Chapman Taylor",
    logo: "/phoenix/partners/chapman-taylor.png",
    category: "Principal Architects",
    website: "https://www.chapmantaylor.com",
    hq: city("London", "United Kingdom", 51.5074, -0.1278),
    offices: [
      city("Madrid", "Spain", 40.4168, -3.7038),
      city("Düsseldorf", "Germany", 51.2277, 6.7735),
      city("Shanghai", "China", 31.2304, 121.4737),
      city("Dubai", "UAE", 25.2048, 55.2708),
      city("New Delhi", "India", 28.6139, 77.209),
    ],
    summary:
      "International architecture and masterplanning practice with studios across Europe, Asia and the Middle East. As principal architects, Chapman Taylor shapes the design language of Phoenix developments to global standards.",
    countries: ["United Kingdom", "Spain", "Germany", "China", "UAE", "India"],
    region: "Europe",
    featured: true,
  },
  {
    id: "gic",
    name: "GIC",
    logo: "/phoenix/partners/gic.png",
    category: "Capital Partners",
    website: "https://www.gic.com.sg",
    hq: city("Singapore", "Singapore", 1.3521, 103.8198),
    offices: [
      city("Mumbai", "India", 19.076, 72.8777),
      city("London", "United Kingdom", 51.5074, -0.1278),
      city("New York", "USA", 40.7128, -74.006),
    ],
    summary:
      "Singapore's sovereign wealth fund and one of the world's largest institutional investors in real estate. GIC's capital partnership backs the scale and long-term horizon of Phoenix's commercial portfolio.",
    countries: ["Singapore", "India", "United Kingdom", "USA"],
    region: "Asia Pacific",
    featured: true,
  },
  {
    id: "capitaland",
    name: "CapitaLand",
    logo: "/phoenix/partners/capitaland.png",
    category: "Capital Partners",
    website: "https://www.capitaland.com",
    hq: city("Singapore", "Singapore", 1.2839, 103.8515),
    offices: [
      city("Bengaluru", "India", 12.9716, 77.5946),
      city("Shanghai", "China", 31.2304, 121.4737),
    ],
    summary:
      "One of Asia's largest diversified real-estate groups, headquartered in Singapore. CapitaLand partners with Phoenix on institutional-grade investment in Hyderabad's commercial real estate.",
    countries: ["Singapore", "India", "China"],
    region: "Asia Pacific",
  },
  {
    id: "pag",
    name: "PAG",
    logo: "/phoenix/partners/pag.png",
    category: "Capital Partners",
    website: "https://www.pag.com",
    hq: city("Hong Kong", "Hong Kong SAR", 22.3193, 114.1694),
    offices: [
      city("Mumbai", "India", 19.076, 72.8777),
      city("Tokyo", "Japan", 35.6762, 139.6503),
      city("London", "United Kingdom", 51.5074, -0.1278),
    ],
    summary:
      "Asia-Pacific-focused alternative investment firm managing capital across private equity, real assets and credit. PAG's real-assets platform supports Phoenix as a capital partner.",
    countries: ["Hong Kong SAR", "India", "Japan", "United Kingdom"],
    region: "Asia Pacific",
  },
  {
    id: "lnt",
    name: "Larsen & Toubro",
    logo: "/phoenix/partners/lnt.png",
    category: "Capital Partners",
    website: "https://www.larsentoubro.com",
    hq: city("Mumbai", "India", 19.076, 72.8777),
    offices: [city("Chennai", "India", 13.0827, 80.2707)],
    summary:
      "India's largest engineering and construction conglomerate. L&T's financial and engineering strength stands behind Phoenix's large-scale developments.",
    countries: ["India"],
    region: "Asia Pacific",
  },
  {
    id: "lnt-financial",
    name: "L&T Financial Services",
    logo: "/phoenix/partners/lnt-financial.png",
    category: "Capital Partners",
    website: "https://www.ltfs.com",
    hq: city("Mumbai", "India", 19.076, 72.8777),
    summary:
      "The financial-services arm of Larsen & Toubro, offering structured real-estate finance. L&T Financial Services supports Phoenix with project capital.",
    countries: ["India"],
    region: "Asia Pacific",
  },
  {
    id: "hdfc",
    name: "HDFC",
    logo: "/phoenix/partners/hdfc.png",
    category: "Capital Partners",
    website: "https://www.hdfc.com",
    hq: city("Mumbai", "India", 19.076, 72.8777),
    summary:
      "India's premier housing-finance institution. HDFC provides long-standing financial backing to Phoenix's real-estate developments.",
    countries: ["India"],
    region: "Asia Pacific",
    featured: true,
  },
  {
    id: "motilal-oswal",
    name: "Motilal Oswal",
    logo: "/phoenix/partners/motilal-oswal.png",
    category: "Capital Partners",
    website: "https://www.motilaloswal.com",
    hq: city("Mumbai", "India", 19.076, 72.8777),
    summary:
      "Diversified Indian financial-services group with a dedicated real-estate investment arm. Motilal Oswal partners with Phoenix on real-estate funding.",
    countries: ["India"],
    region: "Asia Pacific",
  },
  {
    id: "indusind",
    name: "IndusInd Bank",
    logo: "/phoenix/partners/indusind.png",
    category: "Capital Partners",
    website: "https://www.indusind.com",
    hq: city("Mumbai", "India", 19.076, 72.8777),
    summary:
      "New-generation Indian commercial bank. IndusInd Bank supports Phoenix with banking and project-finance facilities.",
    countries: ["India"],
    region: "Asia Pacific",
  },
  {
    id: "karnataka-bank",
    name: "Karnataka Bank",
    logo: "/phoenix/partners/karnataka-bank.png",
    category: "Capital Partners",
    website: "https://www.karnatakabank.com",
    hq: city("Mangaluru", "India", 12.9141, 74.856),
    summary:
      "One of India's oldest private-sector banks. Karnataka Bank extends financial services that support Phoenix's development pipeline.",
    countries: ["India"],
    region: "Asia Pacific",
  },
  {
    id: "xander",
    name: "The Xander Group",
    logo: "/phoenix/partners/xander.png",
    category: "Capital Partners",
    website: "https://www.thexandergroup.com",
    hq: city("Singapore", "Singapore", 1.3521, 103.8198),
    offices: [city("New Delhi", "India", 28.6139, 77.209)],
    summary:
      "Emerging-markets institutional investment firm focused on real assets and infrastructure. Xander invests alongside Phoenix in Indian commercial real estate.",
    countries: ["Singapore", "India"],
    region: "Asia Pacific",
  },
  {
    id: "leighton",
    name: "Leighton",
    logo: "/phoenix/partners/leighton.webp",
    category: "General Contractor",
    website: "https://www.leightonasia.com",
    hq: city("Hong Kong", "Hong Kong SAR", 22.3193, 114.1694),
    offices: [
      city("Sydney", "Australia", -33.8688, 151.2093),
      city("Mumbai", "India", 19.076, 72.8777),
    ],
    summary:
      "International construction group delivering complex building and infrastructure projects across Asia. As general contractor, Leighton brings global construction discipline to Phoenix sites.",
    countries: ["Hong Kong SAR", "Australia", "India"],
    region: "Asia Pacific",
    featured: true,
  },
  {
    id: "jssl",
    name: "JSW Severfield (JSSL)",
    logo: "/phoenix/partners/jssl.png",
    category: "Structural Steel",
    website: "https://www.jswseverfield.com",
    hq: city("Mumbai", "India", 19.076, 72.8777),
    offices: [city("Bellary", "India", 15.1394, 76.9214)],
    summary:
      "India's largest structural-steel fabricator — a joint venture between JSW and UK-based Severfield. JSSL engineers and erects the steel frames within Phoenix developments.",
    countries: ["India", "United Kingdom"],
    region: "Asia Pacific",
    featured: true,
  },
  {
    id: "eversendai",
    name: "Eversendai",
    logo: "/phoenix/partners/eversendai.png",
    category: "Structural Steel",
    website: "https://www.eversendai.com",
    hq: city("Kuala Lumpur", "Malaysia", 3.139, 101.6869),
    offices: [
      city("Dubai", "UAE", 25.2048, 55.2708),
      city("Chennai", "India", 13.0827, 80.2707),
    ],
    summary:
      "Global structural-steel specialist behind some of the world's most iconic towers. Eversendai contributes advanced steel engineering to Phoenix projects.",
    countries: ["Malaysia", "UAE", "India"],
    region: "Asia Pacific",
  },
  {
    id: "pebs-pennar",
    name: "PEBS Pennar",
    logo: "/phoenix/partners/pebs-pennar.png",
    category: "Building Materials",
    website: "https://www.pebspennar.com",
    hq: city("Hyderabad", "India", 17.385, 78.4867),
    summary:
      "Leading Indian manufacturer of pre-engineered building systems, headquartered in Hyderabad. PEBS Pennar supplies engineered building materials to Phoenix developments.",
    countries: ["India"],
    region: "Asia Pacific",
  },
  {
    id: "kirby",
    name: "Kirby Building Systems",
    logo: "/phoenix/partners/kirby.png",
    category: "Building Materials",
    website: "https://www.kirbyinternational.com",
    hq: city("Kuwait City", "Kuwait", 29.3759, 47.9774),
    offices: [city("Hyderabad", "India", 17.385, 78.4867)],
    summary:
      "Pioneer of pre-engineered steel buildings with manufacturing across the Middle East and India. Kirby provides engineered building systems for Phoenix projects.",
    countries: ["Kuwait", "India"],
    region: "Middle East & Africa",
  },
  {
    id: "turner",
    name: "Turner",
    logo: "/phoenix/partners/turner.png",
    category: "Project Management",
    website: "https://www.turnerconstruction.com",
    hq: city("New York", "USA", 40.7128, -74.006),
    offices: [city("Mumbai", "India", 19.076, 72.8777)],
    summary:
      "North America's largest construction-management firm, operating internationally through Turner International. Turner brings world-class project-management rigour to Phoenix developments.",
    countries: ["USA", "India"],
    region: "Americas",
    featured: true,
  },
  {
    id: "efs",
    name: "EFS Facilities Services",
    logo: "/phoenix/partners/efs.png",
    category: "Integrated FM Services",
    website: "https://www.efsme.com",
    hq: city("Dubai", "UAE", 25.2048, 55.2708),
    offices: [city("New Delhi", "India", 28.6139, 77.209)],
    summary:
      "Regional leader in integrated facilities management across the Middle East, Africa and South Asia. EFS keeps Phoenix buildings operating to international standards after handover.",
    countries: ["UAE", "India"],
    region: "Middle East & Africa",
  },
];

// Deliberate storytelling order for the idle "featured" spotlight — spans
// distinct categories (Architects → Capital → Steel → Contractor →
// Project Management → Capital) rather than array/insertion order, so the
// idle cycle reads as a curated tour of the ecosystem, not a random walk.
export const FEATURED_ORDER = [
  "chapman-taylor", // Principal Architects
  "gic", // Capital Partners
  "jssl", // Structural Steel
  "leighton", // General Contractor
  "turner", // Project Management
  "hdfc", // Capital Partners
];

export const partnerCount = PARTNERS.length;
export const countryCount = new Set(PARTNERS.flatMap((p) => p.countries)).size;
export const countryList = [...new Set(PARTNERS.flatMap((p) => p.countries))].sort();
