import StateDot from "./StateDot";
import { stages } from "@/data/stages";
import { STATE_LABEL } from "@/data/types";

export default function Skills() {
  return (
    <section id="skills">
      <h2>Skills</h2>
      <ol className="skills">
        {stages.map((s) => (
          <li key={s.slug} id={`stage-${s.slug}`}>
            <h3>
              <StateDot state={s.state} />
              {s.name}
              <span className="state">{STATE_LABEL[s.state]}</span>
            </h3>
            <div>
              <ul className="tags">
                {s.tools.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p>{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
