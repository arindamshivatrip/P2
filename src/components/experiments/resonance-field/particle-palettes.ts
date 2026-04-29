export type ParticlePalette = {
  name: string;
  coreA: string;
  coreB: string;
  dustA: string;
  dustB: string;
  spark: string;
  ring: string;
  accent: string;
  hot: string;
  trail: string;
};

export const PARTICLE_PALETTES: ParticlePalette[] = [
  {
    name: "Ultraviolet Club",
    coreA: "#8B5CF6",
    coreB: "#22D3EE",
    dustA: "#3c496f",
    dustB: "#8B5CF6",
    spark: "#B8F0FF",
    ring: "#22D3EE",
    accent: "#EC4899",
    hot: "#F472B6",
    trail: "#B8F0FF"
  },
  {
    name: "Spring Bloom",
    coreA: "#F9A8D4",
    coreB: "#7DD3FC",
    dustA: "#4D7C68",
    dustB: "#FDE68A",
    spark: "#ECFCCB",
    ring: "#86EFAC",
    accent: "#FB7185",
    hot: "#FDBA74",
    trail: "#CCFBF1"
  },
  {
    name: "Rainbow Prism",
    coreA: "#A78BFA",
    coreB: "#34D399",
    dustA: "#1E3A8A",
    dustB: "#F472B6",
    spark: "#FDE047",
    ring: "#38BDF8",
    accent: "#FB7185",
    hot: "#F97316",
    trail: "#F0FDFA"
  },
  {
    name: "Flame / Ember",
    coreA: "#991B1B",
    coreB: "#F97316",
    dustA: "#3B0A0A",
    dustB: "#B45309",
    spark: "#FEF3C7",
    ring: "#F59E0B",
    accent: "#EF4444",
    hot: "#F472B6",
    trail: "#FED7AA"
  },
  {
    name: "Ice / Ocean",
    coreA: "#1D4ED8",
    coreB: "#22D3EE",
    dustA: "#0F172A",
    dustB: "#0284C7",
    spark: "#E0F2FE",
    ring: "#67E8F9",
    accent: "#A5B4FC",
    hot: "#B8F0FF",
    trail: "#ECFEFF"
  }
];
