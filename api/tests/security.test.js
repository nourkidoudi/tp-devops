const { test, describe } = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const app = require("../server");

describe("59 - Tests de sécurité (validation, injections, requêtes malformées)", () => {
  describe("Validation des entrées (Zod)", () => {
    test("Refuse une requête sans nom (400 Bad Request)", async () => {
      const res = await request(app)
        .post("/api/contact")
        .send({ email: "test@example.com", message: "Bonjour le monde" });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.error, "Données invalides");
      assert.ok(res.body.details.some((d) => d.field === "name"));
    });

    test("Refuse un nom trop court (< 2 caractères)", async () => {
      const res = await request(app)
        .post("/api/contact")
        .send({ name: "A", email: "test@example.com", message: "Bonjour le monde" });
      assert.strictEqual(res.status, 400);
      assert.ok(res.body.details.some((d) => d.message.includes("au moins 2 caractères")));
    });

    test("Refuse une adresse email malformée", async () => {
      const res = await request(app)
        .post("/api/contact")
        .send({ name: "Nour", email: "invalid-email-string", message: "Bonjour le monde" });
      assert.strictEqual(res.status, 400);
      assert.ok(res.body.details.some((d) => d.field === "email"));
    });

    test("Refuse un message trop court (< 5 caractères)", async () => {
      const res = await request(app)
        .post("/api/contact")
        .send({ name: "Nour", email: "nour@example.com", message: "hi" });
      assert.strictEqual(res.status, 400);
      assert.ok(res.body.details.some((d) => d.field === "message"));
    });
  });

  describe("Tentatives d'injection et champs non autorisés", () => {
    test("Refuse l'injection de champs non autorisés (Mass Assignment / role: admin)", async () => {
      const res = await request(app)
        .post("/api/contact")
        .send({
          name: "Attaquant",
          email: "attacker@example.com",
          message: "Tentative d'escalade",
          role: "admin",
          isAdmin: true,
        });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.error, "Données invalides");
      assert.ok(
        res.body.details.some(
          (d) =>
            d.field === "role" ||
            d.message.toLowerCase().includes("role") ||
            d.message.toLowerCase().includes("unrecognized")
        )
      );
    });

    test("Traite sans risque les chaînes contenant des injections SQL (Prisma paramétré)", async () => {
      const sqlInjectionPayload = {
        name: "'; DROP TABLE contact_messages; --",
        email: "sqli@example.com",
        message: "' OR '1'='1' UNION SELECT * FROM users --",
      };
      const res = await request(app)
        .post("/api/contact")
        .send(sqlInjectionPayload);

      // La requête est soit acceptée comme chaîne textuelle brute paramétrée (201), sans casser la table SQL
      assert.ok(res.status === 201 || res.status === 429); // 429 si rate-limited
      if (res.status === 201) {
        assert.ok(res.body.id, "Le message doit être persisté sans exécuter le code SQL");
      }
    });

    test("Traite sans risque les tentatives d'injection XSS (<script>alert(1)</script>)", async () => {
      const xssPayload = {
        name: "<script>alert('XSS')</script>",
        email: "xss@example.com",
        message: "<img src=x onerror=alert(document.cookie)>",
      };
      const res = await request(app)
        .post("/api/contact")
        .send(xssPayload);

      assert.ok(res.status === 201 || res.status === 429);
      if (res.status === 201) {
        assert.strictEqual(res.body.success, true);
      }
    });
  });

  describe("Requêtes malformées et limites de taille", () => {
    test("Rejette un corps JSON mal formé (400 Bad Request)", async () => {
      const res = await request(app)
        .post("/api/contact")
        .set("Content-Type", "application/json")
        .send('{"name": "Incomplet", "email": ');
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.error, "JSON mal formé");
    });

    test("Rejette une charge utile dépassant la limite de 10 ko (413 Payload Too Large)", async () => {
      const hugeMessage = "A".repeat(15 * 1024); // 15 Ko > 10 Ko
      const res = await request(app)
        .post("/api/contact")
        .set("Content-Type", "application/json")
        .send(JSON.stringify({ name: "Nour", email: "nour@example.com", message: hugeMessage }));
      assert.strictEqual(res.status, 413);
      assert.strictEqual(res.body.error, "Requête trop volumineuse");
    });
  });
});
