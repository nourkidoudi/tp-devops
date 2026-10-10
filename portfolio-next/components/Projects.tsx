import Link from "next/link";
import ProjectList from "./ProjectList";
import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <section id="projects">
      <h2>Projects</h2>
      <ProjectList projects={projects} />
      <p className="more-link">
        <Link href="/projects">Voir tous les projets</Link>
      </p>
    </section>
  );
}
