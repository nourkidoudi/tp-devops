import type { Project, Stage, Tool } from "@/data/types";

// URL de l'API Express. Elle vient de la variable d'environnement API_URL
// (voir .env.example) ; la valeur par défaut sert au développement local.
const API_URL = process.env.API_URL ?? "http://localhost:3001";

async function get(path: string): Promise<Response> {
  // no-store : les données sont relues à chaque requête, jamais figées au build
  return fetch(`${API_URL}${path}`, { cache: "no-store" });
}

export async function getProjects(): Promise<Project[]> {
  const res = await get("/api/projects");
  if (!res.ok) throw new Error(`API /api/projects : erreur ${res.status}`);
  return res.json();
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const res = await get(`/api/projects/${encodeURIComponent(slug)}`);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`API /api/projects/${slug} : erreur ${res.status}`);
  return res.json();
}

export async function getSkills(): Promise<{ stages: Stage[]; tools: Tool[] }> {
  const res = await get("/api/skills");
  if (!res.ok) throw new Error(`API /api/skills : erreur ${res.status}`);
  return res.json();
}
