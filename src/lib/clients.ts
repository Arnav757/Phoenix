// Phoenix Group — client roster, occupiers/tenants of Phoenix developments.
// Source: "client list.jpeg" (client-supplied roster, categorized by sector).
// Per instruction: names only for now — no client logos are used on this tab
// until official logo files are supplied, so `logo` is omitted throughout.
// HQ cities/coordinates are public knowledge for these firms; entries flagged
// "approx." below are a best-effort placement pending confirmation.
// Adding a client = append to CLIENTS; every view (globe/legend/directory/
// panel) renders from this file, same pattern as partners.ts.

import { city, REGIONS, type NetworkEntity, type Region } from "./network-types";

// Hero copy for the Clients tab — kicker + quote are verbatim from the
// "Our Clients" section of phoenixindia.net/clients; the second line names
// the sectors actually listed there (IT & ITES, Health, Hospitality,
// Technology, Office Spaces, Finance, E-Commerce, Consulting, F&B) rather
// than inventing marketing copy.
export const clientsIntro = {
  quote:
    "Expertise, passion and foresight come together in the Phoenix team to steer the company towards new horizons.",
  summary:
    "Phoenix buildings are home to a diverse roster of occupiers — from global IT and technology leaders to healthcare, finance, hospitality and consumer brands — who choose Phoenix for the quality and reliability of its developments.",
};

export type Client = NetworkEntity & {
  category: ClientCategory;
};

export const CLIENT_CATEGORIES = [
  "Information Technology",
  "E-commerce",
  "Health",
  "Office Spaces",
  "Hospitality",
  "Logistics",
  "Finance",
  "Consulting",
  "Technology",
] as const;
export type ClientCategory = (typeof CLIENT_CATEGORIES)[number];

export { REGIONS };
export type { Region };

const asia = (c: string, lat: number, lng: number, cy = "India") => city(c, cy, lat, lng);

export const CLIENTS: Client[] = [
  // — Information Technology —
  {
    id: "opentext",
    name: "OpenText",
    category: "Information Technology",
    website: "https://www.opentext.com",
    hq: city("Waterloo", "Canada", 43.4643, -80.5204),
    summary: "Enterprise information-management software company.",
    countries: ["Canada", "India"],
    region: "Americas",
  },
  {
    id: "cognizant",
    name: "Cognizant",
    category: "Information Technology",
    website: "https://www.cognizant.com",
    hq: city("Teaneck", "USA", 40.8898, -73.9779),
    summary: "Global IT services and consulting firm.",
    countries: ["USA", "India"],
    region: "Americas",
    featured: true,
  },
  {
    id: "hcl",
    name: "HCL",
    category: "Information Technology",
    website: "https://www.hcltech.com",
    hq: asia("Noida", 28.5355, 77.391),
    summary: "Indian multinational IT services and consulting company.",
    countries: ["India"],
    region: "Asia Pacific",
  },
  {
    id: "genpact",
    name: "Genpact",
    category: "Information Technology",
    website: "https://www.genpact.com",
    hq: city("New York", "USA", 40.7128, -74.006),
    summary: "Global professional-services and IT/BPO firm.",
    countries: ["USA", "India"],
    region: "Americas",
  },
  {
    id: "warner-bros-discovery",
    name: "Warner Bros. Discovery",
    category: "Information Technology",
    website: "https://www.wbd.com",
    hq: city("New York", "USA", 40.7128, -74.006),
    summary: "Global media and entertainment company.",
    countries: ["USA", "India"],
    region: "Americas",
  },
  {
    id: "kony",
    name: "Kony",
    category: "Information Technology",
    hq: city("Orlando", "USA", 28.5383, -81.3792), // approx.
    summary: "Enterprise low-code application-development platform.",
    countries: ["USA", "India"],
    region: "Americas",
  },
  {
    id: "valuelabs",
    name: "ValueLabs",
    category: "Information Technology",
    website: "https://www.valuelabs.com",
    hq: asia("Hyderabad", 17.385, 78.4867),
    summary: "Digital transformation and IT services company.",
    countries: ["India", "USA"],
    region: "Asia Pacific",
  },
  {
    id: "otsi",
    name: "OTSI",
    category: "Information Technology",
    hq: city("Frisco", "USA", 33.1507, -96.8236), // approx.
    summary: "IT consulting and staffing services company.",
    countries: ["USA", "India"],
    region: "Americas",
  },
  {
    id: "mphasis",
    name: "Mphasis",
    category: "Information Technology",
    website: "https://www.mphasis.com",
    hq: asia("Bengaluru", 12.9716, 77.5946),
    summary: "IT services company specializing in cloud and cognitive solutions.",
    countries: ["India"],
    region: "Asia Pacific",
  },
  {
    id: "techwave",
    name: "Techwave",
    category: "Information Technology",
    website: "https://www.techwave.net",
    hq: city("Houston", "USA", 29.7604, -95.3698), // approx.
    summary: "Digital engineering and IT consulting company.",
    countries: ["USA", "India"],
    region: "Americas",
  },
  {
    id: "inspire",
    name: "Inspire",
    category: "Information Technology",
    hq: city("Hyderabad", "India", 17.385, 78.4867), // approx.
    summary: "Technology services occupier.",
    countries: ["India"],
    region: "Asia Pacific",
  },
  {
    id: "experian",
    name: "Experian",
    category: "Information Technology",
    website: "https://www.experian.com",
    hq: city("Dublin", "Ireland", 53.3498, -6.2603),
    summary: "Global information-services and credit-reporting company.",
    countries: ["Ireland", "India"],
    region: "Europe",
  },
  {
    id: "paltech",
    name: "Paltech",
    category: "Information Technology",
    hq: city("Hyderabad", "India", 17.385, 78.4867), // approx.
    summary: "IT services occupier.",
    countries: ["India"],
    region: "Asia Pacific",
  },
  {
    id: "forsys",
    name: "Forsys",
    category: "Information Technology",
    website: "https://www.forsysinc.com",
    hq: city("Reston", "USA", 38.9586, -77.3570), // approx.
    summary: "Revenue-lifecycle consulting and technology services firm.",
    countries: ["USA", "India"],
    region: "Americas",
  },
  {
    id: "apex",
    name: "Apex",
    category: "Information Technology",
    hq: city("Hyderabad", "India", 17.385, 78.4867), // approx.
    summary: "Technology services occupier.",
    countries: ["India"],
    region: "Asia Pacific",
  },
  {
    id: "msd",
    name: "MSD",
    category: "Information Technology",
    website: "https://www.msd.com",
    hq: city("Rahway", "USA", 40.6082, -74.2774),
    summary: "Global pharmaceutical and technology-driven research company.",
    countries: ["USA", "India"],
    region: "Americas",
  },

  // — E-commerce —
  {
    id: "amazon",
    name: "Amazon",
    category: "E-commerce",
    website: "https://www.amazon.com",
    hq: city("Seattle", "USA", 47.6062, -122.3321),
    summary: "Global e-commerce and cloud-computing company.",
    countries: ["USA", "India"],
    region: "Americas",
    featured: true,
  },
  {
    id: "sears",
    name: "Sears",
    category: "E-commerce",
    hq: city("Hoffman Estates", "USA", 42.0453, -88.1244),
    summary: "American retail and e-commerce company.",
    countries: ["USA", "India"],
    region: "Americas",
  },

  // — Health —
  {
    id: "carelon",
    name: "Carelon",
    category: "Health",
    website: "https://www.carelon.com",
    hq: city("Indianapolis", "USA", 39.7684, -86.1581),
    summary: "Healthcare services company (Elevance Health).",
    countries: ["USA", "India"],
    region: "Americas",
  },
  {
    id: "lilly",
    name: "Lilly",
    category: "Health",
    website: "https://www.lilly.com",
    hq: city("Indianapolis", "USA", 39.7684, -86.1581),
    summary: "Global pharmaceutical company.",
    countries: ["USA", "India"],
    region: "Americas",
  },
  {
    id: "mylan",
    name: "Mylan",
    category: "Health",
    hq: city("Pittsburgh", "USA", 40.4406, -79.9959), // approx. (now Viatris)
    summary: "Global generics and specialty pharmaceutical company.",
    countries: ["USA", "India"],
    region: "Americas",
  },
  {
    id: "quest-diagnostics",
    name: "Quest Diagnostics",
    category: "Health",
    website: "https://www.questdiagnostics.com",
    hq: city("Secaucus", "USA", 40.7895, -74.0565),
    summary: "Clinical laboratory and diagnostic-testing company.",
    countries: ["USA", "India"],
    region: "Americas",
  },
  {
    id: "modmed",
    name: "ModMed",
    category: "Health",
    website: "https://www.modmed.com",
    hq: city("Boca Raton", "USA", 26.3683, -80.1289),
    summary: "Healthcare technology and EHR software company.",
    countries: ["USA", "India"],
    region: "Americas",
  },
  {
    id: "optum",
    name: "Optum",
    category: "Health",
    website: "https://www.optum.com",
    hq: city("Eden Prairie", "USA", 44.8547, -93.4708),
    summary: "Health services and technology company (UnitedHealth Group).",
    countries: ["USA", "India"],
    region: "Americas",
    featured: true,
  },

  // — Office Spaces —
  {
    id: "the-executive-centre",
    name: "The Executive Centre",
    category: "Office Spaces",
    website: "https://www.executivecentre.com",
    hq: city("Hong Kong", "Hong Kong SAR", 22.3193, 114.1694),
    summary: "Premium flexible-workspace provider.",
    countries: ["Hong Kong SAR", "India"],
    region: "Asia Pacific",
  },
  {
    id: "regus",
    name: "Regus",
    category: "Office Spaces",
    website: "https://www.regus.com",
    hq: city("Luxembourg City", "Luxembourg", 49.6116, 6.1319),
    summary: "Global flexible-workspace provider (IWG).",
    countries: ["Luxembourg", "India"],
    region: "Europe",
  },

  // — Hospitality —
  {
    id: "fairfield",
    name: "Fairfield",
    category: "Hospitality",
    website: "https://www.marriott.com",
    hq: city("Bethesda", "USA", 38.9847, -77.0947),
    summary: "Hotel brand under Marriott International.",
    countries: ["USA", "India"],
    region: "Americas",
  },
  {
    id: "holiday-inn-express",
    name: "Holiday Inn Express",
    category: "Hospitality",
    website: "https://www.ihg.com",
    hq: city("Denham", "United Kingdom", 51.5567, -0.5057),
    summary: "Hotel brand under IHG Hotels & Resorts.",
    countries: ["United Kingdom", "India"],
    region: "Europe",
  },

  // — Logistics —
  {
    id: "fedex",
    name: "FedEx",
    category: "Logistics",
    website: "https://www.fedex.com",
    hq: city("Memphis", "USA", 35.1495, -90.049),
    summary: "Global courier and logistics company.",
    countries: ["USA", "India"],
    region: "Americas",
  },

  // — Finance —
  {
    id: "ebix",
    name: "Ebix",
    category: "Finance",
    website: "https://www.ebix.com",
    hq: city("Johns Creek", "USA", 34.0289, -84.1986),
    summary: "Insurance and financial-software company.",
    countries: ["USA", "India"],
    region: "Americas",
  },
  {
    id: "ubs",
    name: "UBS",
    category: "Finance",
    website: "https://www.ubs.com",
    hq: city("Zurich", "Switzerland", 47.3769, 8.5417),
    summary: "Global investment bank and financial-services firm.",
    countries: ["Switzerland", "India"],
    region: "Europe",
    featured: true,
  },
  {
    id: "endiya",
    name: "Endiya",
    category: "Finance",
    website: "https://www.endiyapartners.com",
    hq: asia("Hyderabad", 17.385, 78.4867),
    summary: "Early-stage venture-capital firm.",
    countries: ["India"],
    region: "Asia Pacific",
  },
  {
    id: "de-shaw",
    name: "D E Shaw & Co",
    category: "Finance",
    website: "https://www.deshaw.com",
    hq: city("New York", "USA", 40.7128, -74.006),
    summary: "Global investment and technology firm.",
    countries: ["USA", "India"],
    region: "Americas",
  },
  {
    id: "charles-schwab",
    name: "Charles Schwab",
    category: "Finance",
    website: "https://www.schwab.com",
    hq: city("Westlake", "USA", 32.9995, -97.0403),
    summary: "Financial-services and brokerage company.",
    countries: ["USA", "India"],
    region: "Americas",
  },

  // — Consulting —
  {
    id: "technipfmc",
    name: "TechnipFMC",
    category: "Consulting",
    website: "https://www.technipfmc.com",
    hq: city("London", "United Kingdom", 51.5074, -0.1278),
    summary: "Energy-industry engineering and technology company.",
    countries: ["United Kingdom", "India"],
    region: "Europe",
  },
  {
    id: "techolution",
    name: "Techolution",
    category: "Consulting",
    website: "https://www.techolution.com",
    hq: city("Jersey City", "USA", 40.7178, -74.0431), // approx.
    summary: "AI consulting and custom-technology solutions firm.",
    countries: ["USA", "India"],
    region: "Americas",
  },
  {
    id: "trimont",
    name: "Trimont",
    category: "Consulting",
    website: "https://www.trimont.com",
    hq: city("Atlanta", "USA", 33.749, -84.388),
    summary: "Commercial real-estate loan-servicing and advisory firm.",
    countries: ["USA", "India"],
    region: "Americas",
  },
  {
    id: "rsm",
    name: "RSM",
    category: "Consulting",
    website: "https://www.rsm.global",
    hq: city("Chicago", "USA", 41.8781, -87.6298), // approx.
    summary: "Global audit, tax and consulting network.",
    countries: ["USA", "India"],
    region: "Americas",
  },

  // — Technology —
  {
    id: "altmin",
    name: "Altmin",
    category: "Technology",
    hq: city("Rotherham", "United Kingdom", 53.4302, -1.3568), // approx.
    summary: "Battery-materials technology company.",
    countries: ["United Kingdom", "India"],
    region: "Europe",
  },
  {
    id: "freyr",
    name: "Freyr",
    category: "Technology",
    website: "https://www.freyrbattery.com",
    hq: city("Oslo", "Norway", 59.9139, 10.7522), // approx.
    summary: "Battery-cell manufacturing technology company.",
    countries: ["Norway", "India"],
    region: "Europe",
  },
  {
    id: "zf",
    name: "ZF",
    category: "Technology",
    website: "https://www.zf.com",
    hq: city("Friedrichshafen", "Germany", 47.6549, 9.4776),
    summary: "Automotive-technology and driveline-systems company.",
    countries: ["Germany", "India"],
    region: "Europe",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    category: "Technology",
    website: "https://www.microsoft.com",
    hq: city("Redmond", "USA", 47.674, -122.1215),
    summary: "Global technology company.",
    countries: ["USA", "India"],
    region: "Americas",
    featured: true,
  },
  {
    id: "micron",
    name: "Micron",
    category: "Technology",
    website: "https://www.micron.com",
    hq: city("Boise", "USA", 43.615, -116.2023),
    summary: "Semiconductor and memory-technology company.",
    countries: ["USA", "India"],
    region: "Americas",
  },
  {
    id: "maq-software",
    name: "MAQ Software",
    category: "Technology",
    website: "https://www.maqsoftware.com",
    hq: city("Redmond", "USA", 47.674, -122.1215), // approx.
    summary: "Data analytics and software-engineering company.",
    countries: ["USA", "India"],
    region: "Americas",
  },
];

// Deliberate storytelling order for the idle "featured" spotlight — spans
// distinct sectors (Technology → Finance → Health → E-commerce →
// Technology) rather than array/insertion order, so the idle cycle reads
// as a curated tour of the client roster, not a random walk.
export const FEATURED_ORDER = ["cognizant", "ubs", "optum", "amazon", "microsoft"];

export const clientCount = CLIENTS.length;
export const clientCountryCount = new Set(CLIENTS.flatMap((c) => c.countries)).size;
export const clientCountryList = [...new Set(CLIENTS.flatMap((c) => c.countries))].sort();
