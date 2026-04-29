import { InteractiveGalleryShell } from "@/components/interactive-gallery/InteractiveGalleryShell";
import { getInteractiveGalleryProjects } from "@/lib/interactive-gallery/projectAdapter";

export default function InteractiveGalleryPage() {
  const projects = getInteractiveGalleryProjects();

  return <InteractiveGalleryShell projects={projects} />;
}
