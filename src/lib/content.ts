// Phoenix Group — site content
// Source: phoenixindia.net (scraped 2026-07-07). Items marked [PLACEHOLDER]
// have no source data on the current site and need client confirmation.

export const company = {
  name: "Phoenix",
  fullName: "Phoenix Group",
  // brand guidelines set the tagline in sentence case
  tagline: "Let's build the extraordinary.",
  intro:
    "Phoenix Group has been steadily building a robust portfolio of projects in Hyderabad over the last 20 years.",
  about1:
    "For us, it's the little details that matter and we place a lot of importance on innovation and efficient planning.",
  about2:
    "We collaborate with the titans of the industry around the world to continuously innovate and build value in our projects for enterprises and employees alike.",
  phone: "040-2222 5555 / 6666 / 7777",
  email: "info@phoenixindia.net",
  address:
    "Phoenix House, Plot No. 1335, Road No. 45, Jubilee Hills, Hyderabad - 500033",
  social: {
    facebook: "https://www.facebook.com/PhoenixIndia",
    linkedin: "https://www.linkedin.com/company/phoenix-group",
  },
};

export const stats = [
  { value: 2001, label: "Established in", format: "year" as const },
  { value: 40, suffix: " mil. sq ft", label: "of completed and upcoming projects" },
  { value: 40, suffix: "%", label: "share in the Hyderabad real estate market" },
  { value: 20, suffix: "+ years", label: "of steady delivery in Hyderabad" },
];

export const projects = [
  {
    id: "equinox",
    name: "Phoenix Equinox",
    status: "Completed",
    location: "Hitech City, Hyderabad",
    description:
      "Equinox is a landmark project adjacent to IKEA, spread over 6.5 acres, with 20 floors. These towers offer picturesque views of the city and are easily accessible from the Hitech City metro station.",
    image: "/phoenix/images/equinox.png",
    // final construction-simulation reveal (plays once on the project page)
    video: "/phoenix/videos/construction-equinox.mp4",
    specs: [
      { label: "Site", value: "6.5 acres" },
      { label: "Floors", value: "020" },
      { label: "District", value: "Hitech City" },
    ],
  },
  {
    id: "aquila",
    name: "Phoenix Aquila",
    status: "Completed",
    location: "Financial District, Hyderabad",
    description:
      "Aquila means “Eagle” in Latin — a project that embodies the spirit and swiftness of this iconic bird, expressed through the sleek design language and architecture of the building. It stands elegant in the midst of Hyderabad's Financial District with world-class amenities.",
    image: "/phoenix/images/aquila.png",
    video: "/phoenix/videos/construction-aquila.mp4",
    // factsheet figures from the brand guidelines (zero-padded per brand style)
    specs: [
      { label: "Area", value: "1.8 mil sq ft" },
      { label: "Towers", value: "002" },
      { label: "Floors", value: "016" },
      { label: "Basements", value: "003" },
    ],
  },
];

// [PLACEHOLDER] — current site has no services copy
export const services = [
  {
    num: "01",
    title: "Commercial Development",
    description:
      "Grade-A office campuses and IT parks, conceived and delivered end-to-end — from land acquisition to leasing.",
  },
  {
    num: "02",
    title: "Design & Engineering",
    description:
      "In-house planning with global design partners; efficient floor plates, sustainable systems and IGBC-certified engineering.",
  },
  {
    num: "03",
    title: "Construction Management",
    description:
      "Disciplined execution with rigorous quality, safety and schedule control across every stage of construction.",
  },
  {
    num: "04",
    title: "Asset & Tenant Services",
    description:
      "Long-term asset management, fit-out coordination and enterprise tenant support after handover.",
  },
];

// [PLACEHOLDER] — process phases drafted for review
export const process = [
  { num: "P1", title: "Understand", description: "Requirements, site studies and feasibility — every project starts on paper, with the details." },
  { num: "P2", title: "Design", description: "Master planning and engineering with world-class consultants; efficiency and sustainability from day one." },
  { num: "P3", title: "Build", description: "Phased construction with uncompromising quality control and transparent progress reporting." },
  { num: "P4", title: "Certify", description: "Green-building precertification and compliance — IGBC, CII and statutory clearances." },
  { num: "P5", title: "Deliver & Support", description: "On-time handover, leasing support and long-term asset care." },
];

export const certifications = [
  { name: "IGBC Precertification — Centaurus", body: "Indian Green Building Council" },
  { name: "IGBC Precertification — 285 FD Phase 1", body: "Indian Green Building Council" },
  { name: "CII Partnership", body: "Confederation of Indian Industry" },
];

// Awards & Certifications page — abstract facts we can attribute to
// phoenixindia.net verbatim. Detailed award titles/years are held in the
// source page as images without textual metadata; the atlas below points
// at those images directly rather than inventing captions.
export const awardsPage = {
  hero: {
    kicker: "Sheet 08 — Recognition",
    title: "Awards & certifications",
    lede:
      "Two decades of steady delivery in Hyderabad, precertified green from the first drawing, and recognised across the industry.",
  },
  introduction: {
    heading: "A record of trust",
    body:
      "For twenty years Phoenix has held itself to the standards of an engineering firm — disciplined execution, transparent process, precertified sustainability from day one. What follows is the drawing set: the recognition we've earned, the certifications we hold, and the quality regime that underwrites both.",
  },
  // Award images: 64 assets sourced from phoenixindia.net and self-hosted
  // under /public so they load fast, get Vercel's CDN, and don't break if
  // the source site rotates its media. The source page holds the specific
  // award titles/years only inside image content itself — presented here
  // as an atlas rather than re-captioned to avoid inventing attribution.
  awardsAtlas: {
    total: 64,
    urls: Array.from({ length: 64 }, (_, i) => `/phoenix/images/awards/_${i + 1}.webp`),
    caption:
      "64 industry awards received by Phoenix Group over two decades. Detailed award-by-award attribution is being consolidated.",
  },
  quality: {
    heading: "Quality & compliance",
    body:
      "Every project runs the same disciplined sequence from feasibility to handover — precertified green, independently audited, and delivered against a public schedule.",
    pillars: [
      {
        num: "Q1",
        title: "Engineering standards",
        body:
          "Structural, MEP and envelope engineering benchmarked against international codes; peer-reviewed at every phase.",
      },
      {
        num: "Q2",
        title: "Construction quality",
        body:
          "Material testing, third-party inspection and progress reporting at every milestone; nothing is signed off without evidence.",
      },
      {
        num: "Q3",
        title: "Green compliance",
        body:
          "IGBC precertification from concept, holding sustainability constraints inside the design brief — not bolted on at the end.",
      },
      {
        num: "Q4",
        title: "Professional excellence",
        body:
          "CII partnership and long-standing collaboration with global engineering, design and MEP consultants.",
      },
    ],
  },
};

export const foundation = {
  intro:
    "Phoenix Foundation has been lauded for its thoughtful and inventive approach to philanthropy and social causes. Phoenix wants to leave a lasting impact not only on the environment but on the society we are an integral part of.",
  initiatives: [
    { title: "Afforestation", detail: "Across 400 acres", icon: "/phoenix/images/afforestation.png" },
    { title: "Crematorium Upgrades", detail: "Vaikunta Mahaprasthanam", icon: "/phoenix/images/crematorium.png" },
    { title: "Refugee Rehab", detail: "In partnership with the UN", icon: "/phoenix/images/rehab.png" },
    { title: "Arts & Culture Habitat", detail: "The Arena", icon: "/phoenix/images/arts.png" },
  ],
};

// [PLACEHOLDER] — no testimonials on current site
export const testimonials = [
  {
    quote:
      "Phoenix delivered our campus ahead of schedule without compromising a single detail. Their engineering discipline is rare in this market.",
    author: "Facilities Head",
    org: "Global Technology Tenant",
  },
  {
    quote:
      "From first drawing to handover, the process was transparent and precise. The building performs exactly as promised.",
    author: "Director of Real Estate",
    org: "Multinational Enterprise",
  },
  {
    quote:
      "A developer that thinks like an engineering firm — the quality of execution across 40 million sq ft speaks for itself.",
    author: "Principal Architect",
    org: "Design Consultancy Partner",
  },
];

export const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "process", label: "Process" },
  { id: "experience", label: "Experience" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];
