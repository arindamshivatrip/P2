import type { Metadata } from "next";
import { ExperimentsGrid } from "@/components/experiments/experiments-grid";
import { ExperimentsHeader } from "@/components/experiments/experiments-header";

export const metadata: Metadata = {
  title: "Experiments — Arindam Tripathi",
  description: "Prototypes and technical studies in AI, interaction, and spatial systems."
};

export default function ExperimentsPage() {
  return (
    <>
      <ExperimentsHeader />
      <ExperimentsGrid />
    </>
  );
}
