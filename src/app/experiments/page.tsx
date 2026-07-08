import type { Metadata } from "next";
import { ExperimentsHeader } from "@/components/experiments/experiments-header";
import { ExperimentsLab } from "@/components/experiments/experiments-lab";

export const metadata: Metadata = {
  title: "Experiments — Arindam Tripathi",
  description: "Prototypes and technical studies in AI, interaction, and spatial systems."
};

export default function ExperimentsPage() {
  return (
    <>
      <ExperimentsHeader />
      <ExperimentsLab />
    </>
  );
}
