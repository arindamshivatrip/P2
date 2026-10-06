// Content for /mobile_card — the page an NFC tap or QR scan opens at events.
// Kept short on purpose: someone reads it standing in a hallway.

export const CARD_URL = "https://arindamtripathi.com/mobile_card";

export const cardIdentity = {
  name: "Arindam Tripathi",
  formalName: "Arindam Shiva Tripathi",
  avatar: "/images/card/avatar.jpg",
  badge: "Google Trusted Developer, Android XR",
  line: "MS HCI, University of Maryland",
  availability: "Open to full-time roles in XR, UX engineering & human-AI interaction"
};

export const cardContact = {
  email: "aritrip@umd.edu",
  backupEmail: "arindamtrip@gmail.com",
  linkedin: "https://www.linkedin.com/in/arindamtrip/",
  github: "https://github.com/arindamshivatrip",
  site: "https://arindamtripathi.com",
  cv: "/files/arindam-tripathi-main-cv.pdf",
  vcard: "/mobile_card/contact.vcf"
};

export type CardFeature = {
  slug: string;
  title: string;
  kicker: string;
  blurb: string;
  // Short muted loop (<300 KB) with a poster. Without one the tile uses the
  // project's animated logo tile, then a typographic gradient, so it never
  // shows a broken frame.
  clip?: string;
  poster?: string;
  // Big text on the gradient fallback; the title already sits under the tile.
  mark: string;
  gradient: string;
};

export const cardFeatures: CardFeature[] = [
  {
    slug: "aura-desk-android-xr",
    title: "Aura Desk",
    kicker: "Android XR glasses · 2026",
    mark: "Android XR",
    blurb: "Turns a desk into an ambient surface: glanceable widgets plus hands-free, on-device AI.",
    gradient: "linear-gradient(135deg, #0b1533 0%, #241a4a 55%, #ff8a4c 120%)"
  },
  {
    slug: "reframed-passthrough-ar",
    title: "Reframed",
    kicker: "Quest 3 passthrough AR · Thesis",
    mark: "Passthrough AR",
    blurb: "Printed paintings step off the wall into the room. On-device CV, shown at NextNOW Fest.",
    clip: "/images/card/reframed-loop.mp4",
    poster: "/images/card/reframed-poster.jpg",
    gradient: "linear-gradient(135deg, #12203f 0%, #5a3a5c 60%, #ff9d5c 120%)"
  },
  {
    slug: "loreal-ml-planning-suite",
    title: "L'Oréal ML Planning Suite",
    kicker: "AI decision support · 2023–25",
    mark: "200+ users · 10+ markets",
    blurb: "ML-backed promotion planning used by 200+ people across 10+ APAC markets.",
    clip: "/images/card/loreal-loop.mp4",
    poster: "/images/card/loreal-poster.jpg",
    gradient: "linear-gradient(135deg, #0f1e47 0%, #2a2550 55%, #ff8a4c 120%)"
  }
];
