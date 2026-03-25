import Link from "next/link";
import { BodyText } from "@/components/typography/body-text";
import { getProjectCoverSrc } from "@/data/projects";
import type { Project } from "@/types/project";
import { getFallbackCoverImage } from "@/components/work/tile-media";

type ProjectTileImmersiveProps = {
  project: Project;
  hasCoverAsset?: boolean;
};

export function ProjectTileImmersive({ project, hasCoverAsset = false }: ProjectTileImmersiveProps) {
  const cover = getProjectCoverSrc(project);
  const fallbackCover = getFallbackCoverImage(project, "immersive");
  const hasRealCover = hasCoverAsset && !cover.includes("placeholder");
  const statusLabel = project.status;

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block h-full overflow-hidden rounded-[1rem] bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(38,31,24,0.15)]"
    >
      <article className="relative flex min-h-[280px] flex-col justify-end p-6 md:min-h-[340px]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.02]"
          style={{
            backgroundImage: hasRealCover
              ? `linear-gradient(rgba(20,18,16,.25), rgba(20,18,16,.35)), url(${cover})`
              : fallbackCover
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        <div className="relative z-10">
          <span className="font-body text-[0.66rem] uppercase tracking-[0.13em] text-[#f5f4ed]/80">
            {statusLabel} Â· {project.meta.year}
          </span>
          <h3 className="mt-3 max-w-[18ch] font-display text-5xl leading-[0.94] tracking-tight text-[#f5f4ed]">
            {project.title}
          </h3>
          <BodyText className="mt-4 max-w-xl text-[#f5f4ed]/85">{project.oneLiner}</BodyText>
        </div>
      </article>
    </Link>
  );
}
