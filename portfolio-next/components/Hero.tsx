import StateDot from "./StateDot";
import { stages } from "@/data/stages";
import { STATE_LABEL, type SkillState } from "@/data/types";

const legend: SkillState[] = ["done", "part", "wip"];

export default function Hero() {
  return (
    <section id="top" className="hero">
      <h1>Du code à la production, en sécurité.</h1>
      <p className="lead">
        {"Je suis Nour, étudiante en Master DevOps & Cloud Computing. Voici où j'en suis sur chaque étape d'un pipeline DevSecOps."}
      </p>
      <ol className="pipeline" aria-label="Pipeline DevSecOps">
        {stages.map((s) => (
          <li key={s.slug}>
            <a href={`#stage-${s.slug}`}>
              <StateDot state={s.state} />
              {s.name}
            </a>
          </li>
        ))}
      </ol>
      <ul className="legend">
        {legend.map((state) => (
          <li key={state}>
            <StateDot state={state} />
            {STATE_LABEL[state]}
          </li>
        ))}
      </ul>
    </section>
  );
}
