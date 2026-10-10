import type { Tool } from "./types";

export const tools: Tool[] = [
  { name: "Git", mono: "Git", role: "Versioning", used: true, state: "done", label: "Pratiqué", text: "Dépôt GitHub, commits et push via clé SSH : historique du CV et du portfolio." },
  { name: "Docker", mono: "Dk", role: "Conteneurs", used: true, state: "part", label: "Bases", text: "Installé sur la VM Ubuntu, image Nginx pour servir le portfolio, déploiement avec Docker Compose." },
  { name: "Jenkins", mono: "Jk", role: "CI/CD", used: true, state: "part", label: "Bases", text: "Installé comme service sur la VM, tableau de bord accessible depuis la machine physique." },
  { name: "Kubernetes", mono: "K8", role: "Orchestration", used: false, state: "wip", label: "À découvrir", text: "Déployer et faire évoluer des conteneurs sur un cluster." },
  { name: "Ansible", mono: "An", role: "Configuration as code", used: false, state: "wip", label: "À découvrir", text: "Automatiser la configuration de la VM (SSH, pare-feu, Docker) au lieu de la faire à la main." },
  { name: "Terraform", mono: "Tf", role: "Infrastructure as Code", used: false, state: "wip", label: "À découvrir", text: "Décrire et créer l'infrastructure cloud (AWS, Azure) par le code." },
  { name: "Argo CD", mono: "Ar", role: "GitOps", used: false, state: "wip", label: "À découvrir", text: "Déployer automatiquement sur Kubernetes à partir d'un dépôt Git." },
];
