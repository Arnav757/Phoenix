// Phoenix Group — Our Team page content.
// Source: phoenixindia.net (scraped 2026-07-14). Executive Leadership is the
// only roster on the current site. Photos downloaded from
// phoenixindia.net/images/Team/{suresh,gopikrishna}.jpg.

export const teamIntro = {
  kicker: "05 — Leadership",
  title: "Our team",
  summary:
    "It's the people who make Phoenix what it is. They are the face of our company and they represent everything we stand for. From a wealth of experience to unbridled eagerness to learn, our team is full of enterprising minds who are committed to one single goal — creating a masterpiece for our clients.",
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo?: string;
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "suresh-chukkapalli",
    name: "Suresh Chukkapalli",
    role: "Chairman Emeritus",
    bio: "The Founder and Chairman of the Phoenix Group, a technocrat and a visionary who took a bold leap from being an automobile entrepreneur to independently handling industries like steel, power, cement and real estate. His passion for the big enterprise can be gauged by the progress of Phoenix over the years. Mr. Suresh envisions an even brighter future for Phoenix with his in-depth experience and exposure leading the enterprise to greater heights. He is the source of inspiration and the driving force behind Phoenix.",
    photo: "/phoenix/team/suresh-chukkapalli.jpg",
  },
  {
    id: "gopi-krishna-patibanda",
    name: "Gopi Krishna Patibanda",
    role: "Chairman & Managing Director",
    bio: "From offering solutions to keeping up the motivation of people around, Mr. Gopi Krishna Patibanda is a man of vision. He builds and upholds the trust between the company and its clients, investors and associates. He believes in bringing together the new ideas of the younger members of the company with the wisdom and experience of the older employees. As Chairman and Managing Director, Mr. Patibanda has undertaken the mission of taking the Phoenix Group to greater success and growth.",
    photo: "/phoenix/team/gopi-krishna-patibanda.jpg",
  },
];

// [PLACEHOLDER] — Board of Directors roster pending client confirmation.
// Shown in the coverflow carousel below Executive Leadership. Add real
// entries here as they're confirmed; `photo` is optional — cards without one
// render a brand-gradient placeholder instead.
export const DIRECTORS: TeamMember[] = [
  { id: "director-1", name: "[PLACEHOLDER NAME]", role: "Director", bio: "" },
  { id: "director-2", name: "[PLACEHOLDER NAME]", role: "Director", bio: "" },
  { id: "director-3", name: "[PLACEHOLDER NAME]", role: "Director", bio: "" },
  { id: "director-4", name: "[PLACEHOLDER NAME]", role: "Director", bio: "" },
  { id: "director-5", name: "[PLACEHOLDER NAME]", role: "Director", bio: "" },
  { id: "director-6", name: "[PLACEHOLDER NAME]", role: "Director", bio: "" },
  { id: "director-7", name: "[PLACEHOLDER NAME]", role: "Director", bio: "" },
  { id: "director-8", name: "[PLACEHOLDER NAME]", role: "Director", bio: "" },
];
