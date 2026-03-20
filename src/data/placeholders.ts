export type ProjectPlaceholder = {
  id: string;
  title: string;
  lens: string;
  summary: string;
};

export const featuredPlaceholders: ProjectPlaceholder[] = [
  {
    id: "featured-1",
    title: "Featured Work Placeholder",
    lens: "Product / Engineering",
    summary: "Reserved for a future flagship case study with richer storytelling."
  },
  {
    id: "featured-2",
    title: "Experiment Placeholder",
    lens: "Creative Technology",
    summary: "Reserved for motion-forward experiments and interaction studies."
  }
];
