import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getRelatedProjects, projects, type ProjectStatus } from "@/lib/projects";
import { ProjectPageClient } from "./project-page-client";

const STATUSES: ProjectStatus[] = ["upcoming", "completed"];

export function generateStaticParams() {
  return projects.map((p) => ({ status: p.status, slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ status: string; slug: string }>;
}): Promise<Metadata> {
  const { status, slug } = await params;
  if (!STATUSES.includes(status as ProjectStatus)) return {};
  const project = getProjectBySlug(status as ProjectStatus, slug);
  if (!project) return {};
  return {
    title: `${project.title} | Phoenix Group`,
    description: project.overview,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ status: string; slug: string }>;
}) {
  const { status, slug } = await params;
  if (!STATUSES.includes(status as ProjectStatus)) notFound();

  const project = getProjectBySlug(status as ProjectStatus, slug);
  if (!project) notFound();

  const related = getRelatedProjects(project);

  return <ProjectPageClient project={project} related={related} />;
}
