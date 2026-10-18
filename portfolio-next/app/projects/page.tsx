import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import ProjectList from "@/components/ProjectList";
import ApiError from "@/components/ApiError";
import { getProjects } from "@/lib/api";

export const metadata: Metadata = {
  title: "Projects – Nour Kidoudi",
};

async function AllProjects() {
  await connection();
  try {
    const projects = await getProjects();
    return <ProjectList projects={projects} />;
  } catch {
    return <ApiError what="les projets" />;
  }
}

export default function ProjectsPage() {
  return (
    <section className="page">
      <h1>Projects</h1>
      <p className="lead">Tous mes projets. Cliquez sur « Voir le détail » pour ouvrir la page d&apos;un projet.</p>
      <Suspense fallback={<p>Chargement des projets…</p>}>
        <AllProjects />
      </Suspense>
    </section>
  );
}
