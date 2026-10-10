import type { Stage } from "./types";

export const stages: Stage[] = [
  { slug: "plan", name: "Plan", state: "done", tools: ["Scrum", "UML"], text: "Gestion de projet agile et modélisation des besoins." },
  { slug: "code", name: "Code", state: "done", tools: ["Git / GitHub", "JavaScript", "React.js", "Node.js", "Java", "Python"], text: "Développement full stack et gestion de versions." },
  { slug: "build", name: "Build", state: "part", tools: ["Docker"], text: "Docker installé et testé sur une VM Ubuntu Server." },
  { slug: "integrate", name: "Integrate", state: "part", tools: ["Jenkins", "GitHub Actions"], text: "Jenkins installé comme service ; pipelines CI/CD en cours d'apprentissage." },
  { slug: "secure", name: "Secure", state: "part", tools: ["SSH par clé", "Pare-feu UFW", "Root désactivé"], text: "Accès distant durci sur la VM : mot de passe SSH désactivé, seuls les ports utiles ouverts." },
  { slug: "deploy", name: "Deploy", state: "wip", tools: ["Kubernetes", "AWS", "Azure"], text: "Orchestration de conteneurs et cloud : découverte progressive." },
  { slug: "monitor", name: "Monitor", state: "wip", tools: ["Prometheus", "Grafana"], text: "Supervision et alertes : sujet de mon projet de stage à l'aéroport de Tozeur–Nefta." },
];
