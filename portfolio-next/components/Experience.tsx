import { experience } from "@/data/experience";

export default function Experience() {
  return (
    <section id="experience">
      <h2>Experience</h2>
      <ol className="timeline">
        {experience.map((e) => (
          <li key={`${e.when}-${e.where}`}>
            <div className="when">{e.when}</div>
            <h3>{e.role}</h3>
            <p className="where">{e.where}</p>
            <p>{e.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
