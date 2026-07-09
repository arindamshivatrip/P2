import type { Metadata } from "next";
import { ExperimentsHeader } from "@/components/experiments/experiments-header";
import { ExperimentsLab } from "@/components/experiments/experiments-lab";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Experiments",
  description:
    "Smaller prototypes and explorations across XR, mobile, AI-assisted tools, creative coding, and interaction design.",
  path: "/experiments"
});

export default function ExperimentsPage() {
  return (
    <>
      <ExperimentsHeader />
      <ExperimentsLab />
    </>
  );
}
