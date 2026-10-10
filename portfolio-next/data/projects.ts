import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "vm-devsecops-securisee",
    category: "DevSecOps",
    title: "VM DevSecOps sécurisée",
    status: "Réalisé",
    summary: "Ubuntu Server 26.04, accès SSH par clé, pare-feu, Docker et Jenkins en service, documenté dans un dépôt Git.",
    description: [
      "Mise en place d'une machine virtuelle Ubuntu Server 26.04 avec un accès distant sécurisé, puis ajout des outils DevOps de base.",
      "Le portfolio est servi par Nginx dans un conteneur, déployé avec Docker Compose, et le dépôt est publié sur GitHub par SSH. Chaque étape est documentée avec des captures dans le README.",
    ],
    highlights: [
      "Connexion SSH par clé, mot de passe et root désactivés",
      "Pare-feu UFW limité aux ports utiles",
      "Docker et Docker Compose, image Nginx sans droits root",
      "Jenkins installé comme service",
      "Vagrant pour créer une VM de façon reproductible",
    ],
    tags: ["Linux", "SSH", "Docker", "Jenkins"],
    link: "https://github.com/nourkidoudi/tp-devops",
  },
  {
    slug: "smart-city-web-platform",
    category: "Web",
    title: "Smart City Web Platform",
    status: "Projet de fin d'études",
    summary: "Plateforme pour les services urbains et l'engagement citoyen : chatbot IA, scan de QR codes et gestion multi-rôles.",
    description: [
      "Plateforme web full stack réalisée chez Desert Navigation (Tozeur) pour rassembler des services urbains intégrés et favoriser l'engagement des citoyens.",
      "Le frontend est développé avec React.js, le backend avec Node.js, avec des API RESTful et une base de données.",
    ],
    highlights: [
      "Chatbot IA",
      "Scan de QR codes",
      "Gestion de plusieurs rôles d'utilisateurs",
      "API RESTful et base de données",
    ],
    tags: ["React.js", "Node.js", "API REST"],
  },
  {
    slug: "infrawatch",
    category: "Monitoring",
    title: "InfraWatch",
    status: "Réalisé",
    summary: "Plateforme de supervision d'infrastructure IT en temps réel.",
    description: [
      "InfraWatch est une plateforme de supervision qui suit l'état d'une infrastructure IT en temps réel.",
    ],
    highlights: ["Supervision en temps réel", "Vue d'ensemble de l'infrastructure"],
    tags: ["Supervision", "Temps réel"],
  },
  {
    slug: "monitoring-tozeur-nefta",
    category: "Monitoring",
    title: "Monitoring Tozeur–Nefta (proposé)",
    status: "Projet proposé",
    summary: "Tableau de bord live des serveurs et services, avec alertes automatiques et statistiques de performance.",
    description: [
      "Projet proposé dans le cadre du stage à l'aéroport de Tozeur–Nefta : une plateforme de monitoring en temps réel des serveurs et des services.",
      "La pile technique envisagée est Prometheus et Grafana, déployés avec Docker sur Linux.",
    ],
    highlights: ["Tableau de bord en direct", "Alertes automatiques", "Statistiques de performance"],
    tags: ["Prometheus", "Grafana", "Docker", "Linux"],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
