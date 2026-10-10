import StateDot from "./StateDot";
import { tools } from "@/data/tools";
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

export default function Tools() {
  return (
    <section id="devsecops">
      <h2>DevSecOps Skills</h2>
      <p className="intro">
        {"Les outils que j'ai réellement utilisés dans ce projet, puis ceux que je prépare pour la suite."}
      </p>
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
    </section>
  );
}
