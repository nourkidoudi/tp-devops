import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? `${project.title} – Projects` : "Projet introuvable" };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <article className="page detail" data-cat={project.category}>
      <p>
        <Link className="back" href="/projects">
          ← Tous les projets
        </Link>
      </p>
      <p className="cat">
        {project.category} · {project.status}
      </p>
      <h1>{project.title}</h1>
      <p className="lead">{project.summary}</p>

      {project.description.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      <h2>Points clés</h2>
      <ul className="checks">
        {project.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>

      <h2>Technologies</h2>
      <ul className="tags">
        {project.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      {project.link && (
        <p className="more-link">
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            Voir sur GitHub
          </a>
        </p>
      )}
    </article>
  );
}
