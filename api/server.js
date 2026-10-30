// API Express du DevSecOps Portfolio.
// Elle se lance seule, sans le frontend : `npm start`.
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { z } = require("zod");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const { profile } = require("./data/profile");
const { projects } = require("./data/projects");
const { stages } = require("./data/stages");
const { tools } = require("./data/tools");
const { experience } = require("./data/experience");

const app = express(); // nosemgrep: javascript.express.security.audit.express-check-csurf-middleware-usage.express-check-csurf-middleware-usage
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",");

// Erreur HTTP "attendue" : renvoyée telle quelle au client
class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// Étape 50 : headers HTTP de sécurité
app.use(helmet());

// Le frontend est devant l'API (proxy) : on lit l'IP réelle pour le rate limiting
app.set("trust proxy", 1);

app.use(cors({ origin: CORS_ORIGIN, methods: ["GET", "POST"] }));

// Corps JSON limité à 10 ko (anti-abus)
app.use(express.json({ limit: "10kb" }));

// Étape 51 : rate limiting
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Trop de requêtes, réessayez plus tard" },
});
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Trop de messages envoyés, réessayez dans quelques minutes" },
});
app.use("/api", apiLimiter);

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

// Étape 48 : validation stricte avec Zod (champs inconnus refusés)
const contactSchema = z.strictObject({
  name: z
    .string({ error: "Le nom est requis" })
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(80, "Le nom ne doit pas dépasser 80 caractères"),
  email: z
    .email({ error: "Email invalide" })
    .max(120, "L'email ne doit pas dépasser 120 caractères"),
  message: z
    .string({ error: "Le message est requis" })
    .trim()
    .min(5, "Le message doit contenir au moins 5 caractères")
    .max(1000, "Le message ne doit pas dépasser 1000 caractères"),
});

// Étape 46 / 54 : le formulaire de contact envoie ses données ici, elles sont stockées dans PostgreSQL
app.post("/api/contact", contactLimiter, async (req, res) => {
  const result = contactSchema.safeParse(req.body);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      field: i.path.join(".") || "body",
      message: i.message,
    }));
    throw new HttpError(400, "Données invalides", details);
  }

  const saved = await prisma.contactMessage.create({ data: result.data });

  res.status(201).json({ success: true, message: "Message reçu, merci !", id: saved.id });
});

// Route inconnue
app.use((req, res, next) => {
  next(new HttpError(404, "Route introuvable"));
});

// Étape 49 : gestion centralisée des erreurs (doit rester le DERNIER middleware)
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof HttpError) {
    const body = { error: err.message };
    if (err.details) body.details = err.details;
    return res.status(err.status).json(body);
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "JSON mal formé" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "Requête trop volumineuse" });
  }

  // Erreur inattendue : on logue côté serveur, on ne révèle rien au client
  console.error(err);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`API démarrée sur le port ${PORT}`);
  });
}

module.exports = app;

// Ferme proprement la connexion à la base à l'arrêt du conteneur
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});