const { test, describe } = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const app = require("../server");

describe("58 - Tests automatisés des routes de l'API Express", () => {
  test("GET /api/health retourne un statut 200 et status ok", async () => {
    const res = await request(app).get("/api/health");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, "ok");
    assert.strictEqual(res.body.service, "devsecops-api");
    assert.ok(typeof res.body.uptime === "number");
  });

  test("GET /api/profile retourne les informations du profil", async () => {
    const res = await request(app).get("/api/profile");
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.name, "Le profil doit avoir un nom");
    assert.ok(Array.isArray(res.body.experience), "Les expériences doivent être un tableau");
  });

  test("GET /api/projects retourne la liste des projets", async () => {
    const res = await request(app).get("/api/projects");
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body), "Les projets doivent être un tableau");
    assert.ok(res.body.length > 0, "La liste des projets ne doit pas être vide");
  });

  test("GET /api/skills retourne les étapes et outils DevSecOps", async () => {
    const res = await request(app).get("/api/skills");
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body.stages), "stages doit être un tableau");
    assert.ok(Array.isArray(res.body.tools), "tools doit être un tableau");
  });

  test("GET /api/unknown-route retourne une 404 Route introuvable", async () => {
    const res = await request(app).get("/api/unknown-route");
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.error, "Route introuvable");
  });
});
