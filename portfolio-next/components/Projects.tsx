import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import ProjectList from "./ProjectList";
import ApiError from "./ApiError";
import { getProjects } from "@/lib/api";

// Les projets viennent de l'API Express (GET /api/projects)
async function ProjectsData() {
  await connection();
  try {
    const projects = await getProjects();
    return <ProjectList projects={projects} />;
  } catch {
    return <ApiError what="les projets" />;
  }
}

export default function Projects() {
  return (
    <section id="projects">
      <h2>Projects</h2>
      <Suspense fallback={<p>Chargement des projets…</p>}>
        <ProjectsData />
      </Suspense>
      <p className="more-link">
        <Link href="/projects">Voir tous les projets</Link>
      </p>
    </section>
  );
}
