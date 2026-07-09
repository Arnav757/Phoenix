import { notFound } from "next/navigation";
import Link from "next/link";
import { projects, company } from "@/lib/content";
import { ConstructionReveal } from "@/components/construction-reveal";
import { ProjectDetails } from "./project-details";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  return (
    <main className="mx-auto min-h-svh max-w-7xl px-6 py-10">
      <header className="flex items-center justify-between">
        <Link
          href="/#portfolio"
          className="tech-label text-muted-foreground transition-colors hover:text-primary"
        >
          ← {company.name} / Portfolio
        </Link>
        <span className="tech-label text-primary">
          DWG {project.id.toUpperCase()} · {project.status}
        </span>
      </header>

      <div className="mt-10 grid items-start gap-12 lg:grid-cols-2">
        {/* construction simulation plays immediately on open */}
        <ConstructionReveal
          video={project.video}
          image={project.image}
          name={project.name}
        />
        {/* details reveal alongside the build */}
        <ProjectDetails project={project} />
      </div>
    </main>
  );
}
