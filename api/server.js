// API Express du DevSecOps Portfolio.
// Elle se lance seule, sans le frontend : `npm start`.
const express = require("express");
const cors = require("cors");

const { profile } = require("./data/profile");
const { projects } = require("./data/projects");
const { stages } = require("./data/stages");
const { tools } = require("./data/tools");
const { experience } = require("./data/experience");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Étape 30 : l'API répond, elle fonctionne
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "devsecops-api",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Étape 31 : informations principales du portfolio
app.get("/api/profile", (req, res) => {
  res.json({ ...profile, experience });
});

// Étape 32 : liste des projets
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

// Un projet par son slug (utilisé par la page /projects/[slug] du frontend)
app.get("/api/projects/:slug", (req, res) => {
  const project = projects.find((p) => p.slug === req.params.slug);
  if (!project) {
    return res.status(404).json({ error: "Projet introuvable" });
  }
  res.json(project);
});

// Étape 33 : liste des compétences (étapes du pipeline + outils DevSecOps)
app.get("/api/skills", (req, res) => {
  res.json({ stages, tools });
});

// Route inconnue
app.use((req, res) => {
  res.status(404).json({ error: "Route introuvable" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API démarrée sur le port ${PORT}`);
});
