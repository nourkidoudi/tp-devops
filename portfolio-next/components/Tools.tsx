import { Suspense } from "react";
import { connection } from "next/server";
import StateDot from "./StateDot";
import ApiError from "./ApiError";
import { getSkills } from "@/lib/api";
import type { Tool } from "@/data/types";

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <li className={tool.used ? "tool" : "tool next"}>
      <span className="mono">{tool.mono}</span>
      <h4>{tool.name}</h4>
      <span className="role">{tool.role}</span>
      <span className="badge">
        <StateDot state={tool.state} />
        {tool.label}
      </span>
      <p>{tool.text}</p>
    </li>
  );
}

// Les outils viennent de l'API Express (GET /api/skills)
async function ToolsData() {
  await connection();
  try {
    const { tools } = await getSkills();
    return (
      <>
        <h3 className="group">Utilisés dans ce projet</h3>
        <ul className="tools">
          {tools.filter((t) => t.used).map((t) => (
            <ToolCard key={t.name} tool={t} />
          ))}
        </ul>
        <h3 className="group">Prochaines étapes</h3>
        <ul className="tools">
          {tools.filter((t) => !t.used).map((t) => (
            <ToolCard key={t.name} tool={t} />
          ))}
        </ul>
      </>
    );
  } catch {
    return <ApiError what="les outils" />;
  }
}

export default function Tools() {
  return (
    <section id="devsecops">
      <h2>DevSecOps Skills</h2>
      <p className="intro">
        {"Les outils que j'ai réellement utilisés dans ce projet, puis ceux que je prépare pour la suite."}
      </p>
      <Suspense fallback={<p>Chargement des outils…</p>}>
        <ToolsData />
      </Suspense>
    </section>
  );
}
