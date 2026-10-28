const { test, describe, after } = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const { PrismaClient } = require("@prisma/client");
const app = require("../server");

const prisma = new PrismaClient();

describe("60 - Test d'intégration chaîne complète (Frontend -> API -> PostgreSQL)", () => {
  let createdMessageId = null;

  after(async () => {
    // Nettoyage de la donnée de test créée
    if (createdMessageId) {
      await prisma.contactMessage.delete({ where: { id: createdMessageId } }).catch(() => {});
    }
    await prisma.$disconnect();
  });

  test("La requête envoyée par le frontend est validée par l'API et enregistrée dans PostgreSQL", async () => {
    // 1. Données simulées envoyées depuis le formulaire frontend Next.js
    const frontendPayload = {
      name: "Test Intégration DevSecOps",
      email: "integration.test@portfolio.dev",
      message: "Vérification de la chaîne complète Frontend -> Express API -> PostgreSQL.",
    };

    // 2. Appel de la route API Express
    const response = await request(app)
      .post("/api/contact")
      .set("Content-Type", "application/json")
      .send(frontendPayload);

    // Vérification de la réponse API (201 Created)
    assert.strictEqual(response.status, 201, "L'API doit répondre avec le code HTTP 201");
    assert.strictEqual(response.body.success, true);
    assert.ok(response.body.id, "L'API doit renvoyer l'ID de la ligne PostgreSQL créée");

    createdMessageId = response.body.id;

    // 3. Vérification directe dans la base de données PostgreSQL via Prisma
    const recordInDatabase = await prisma.contactMessage.findUnique({
      where: { id: createdMessageId },
    });

    assert.ok(recordInDatabase, "La ligne doit exister dans la table PostgreSQL contact_messages");
    assert.strictEqual(recordInDatabase.name, frontendPayload.name);
    assert.strictEqual(recordInDatabase.email, frontendPayload.email);
    assert.strictEqual(recordInDatabase.message, frontendPayload.message);
    assert.ok(recordInDatabase.createdAt instanceof Date, "La date de création doit être initialisée");
  });
});
