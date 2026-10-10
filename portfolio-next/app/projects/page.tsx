import type { Metadata } from "next";
import ProjectList from "@/components/ProjectList";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects – Nour Kidoudi",
};

export default function ProjectsPage() {
  return (
    <section className="page">
      <h1>Projects</h1>
      <p className="lead">Tous mes projets. Cliquez sur « Voir le détail » pour ouvrir la page d&apos;un projet.</p>
      <ProjectList projects={projects} />
    </section>
  );
}
