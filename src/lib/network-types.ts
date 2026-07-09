// Shared shape for the Our Network page (Partners + Clients tabs).
// Both src/lib/partners.ts and src/lib/clients.ts extend NetworkEntity so the
// globe, panel and directory components can render either dataset unchanged.

export type Office = {
  city: string;
  country: string;
  lat: number;
  lng: number;
};

export const REGIONS = ["Asia Pacific", "Europe", "Americas", "Middle East & Africa"] as const;
export type Region = (typeof REGIONS)[number];

// Every collaboration route converges here — Phoenix's Hyderabad HQ.
export const HYDERABAD_HUB: Office = {
  city: "Hyderabad",
  country: "India",
  lat: 17.385,
  lng: 78.4867,
};

export type NetworkEntity = {
  id: string;
  name: string;
  logo?: string; // omitted = render name as text (used for clients today)
  category: string;
  website?: string;
  hq: Office;
  offices?: Office[];
  since?: number;
  summary: string;
  countries: string[];
  region: Region;
  featured?: boolean;
};

export const city = (city: string, country: string, lat: number, lng: number): Office => ({
  city,
  country,
  lat,
  lng,
});
