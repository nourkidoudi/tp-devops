"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/data/types";

export default function ProjectList({ projects }: { projects: Project[] }) {
  const categories = ["Tous", ...Array.from(new Set(projects.map((p) => p.category)))];
  const [filter, setFilter] = useState("Tous");
  const visible = projects.filter((p) => filter === "Tous" || p.category === filter);

  return (
    <>
      <div className="filters" role="group" aria-label="Filtrer les projets">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <ul className="projects">
        {visible.map((p) => (
          <li key={p.slug} data-cat={p.category}>
            <h3>{p.title}</h3>
            <p className="cat">
              {p.category} · {p.status}
            </p>
            <p>{p.summary}</p>
            <ul className="tags">
              {p.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="more">
              <Link href={`/projects/${p.slug}`}>Voir le détail</Link>
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
