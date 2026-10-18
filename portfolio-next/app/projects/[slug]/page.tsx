import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import ApiError from "@/components/ApiError";
import { getProject } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export const metadata: Metadata = {
  title: "Projet – Nour Kidoudi",
};

async function ProjectDetail({ params }: Props) {
  await connection();
  const { slug } = await params;

  let project;
  try {
    project = await getProject(slug);
  } catch {
    return <ApiError what="ce projet" />;
  }
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

export default function ProjectPage({ params }: Props) {
  return (
    <Suspense fallback={<p className="page">Chargement du projet…</p>}>
      <ProjectDetail params={params} />
    </Suspense>
  );
}
