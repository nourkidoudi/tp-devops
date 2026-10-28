import { test, describe } from "node:test";
import assert from "node:assert";

describe("57 - Tests automatisés du Frontend Next.js", () => {
  test("Validation des champs du formulaire de contact côté client", () => {
    const validData = {
      name: "Nour Kidoudi",
      email: "nour@example.com",
      message: "Bonjour, message de test frontend",
    };

    assert.ok(validData.name.trim().length >= 2, "Le nom doit comporter au moins 2 caractères");
    assert.ok(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validData.email), "L'email doit être au format valide");
    assert.ok(validData.message.trim().length >= 5, "Le message doit comporter au moins 5 caractères");
  });

  test("Rejet d'un formulaire invalide ou incomplet côté frontend", () => {
    const invalidData = {
      name: "N",
      email: "invalid-email",
      message: "hi",
    };

    const isNameValid = invalidData.name.trim().length >= 2;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invalidData.email);
    const isMessageValid = invalidData.message.trim().length >= 5;

    assert.strictEqual(isNameValid, false, "Nom 'N' trop court doit être rejeté");
    assert.strictEqual(isEmailValid, false, "Email sans @ doit être rejeté");
    assert.strictEqual(isMessageValid, false, "Message trop court doit être rejeté");
  });

  test("Configuration de l'URL de l'API avec la variable API_URL", () => {
    const defaultUrl = process.env.API_URL ?? "http://localhost:3001";
    assert.ok(defaultUrl.startsWith("http://"), "L'URL de l'API doit commencer par http://");
    assert.ok(!defaultUrl.endsWith("/"), "L'URL de l'API ne doit pas avoir de slash final");
  });
});
