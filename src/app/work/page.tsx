import { WorkCta } from "@/components/work/work-cta";
import { WorkFilters } from "@/components/work/work-filters";
import { WorkGrid } from "@/components/work/work-grid";
import { WorkHeader } from "@/components/work/work-header";

type WorkPageProps = {
  searchParams?: Promise<{ focus?: string }>;
};

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const params = (await searchParams) ?? {};
  const focus = params.focus ?? "all";

  return (
    <>
      <WorkHeader />
      <WorkFilters activeFilter={focus} />
      <WorkGrid activeFilter={focus} section="work" />
      <WorkCta />
    </>
  );
}
