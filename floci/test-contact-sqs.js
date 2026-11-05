const request = require("supertest");
const { SQSClient, ReceiveMessageCommand } = require("@aws-sdk/client-sqs");

process.env.SQS_ENDPOINT = "http://localhost:4566";
process.env.SQS_QUEUE_URL = "http://localhost:4566/000000000000/portfolio-queue";
process.env.AWS_REGION = "us-east-1";
process.env.AWS_ACCESS_KEY_ID = "test";
process.env.AWS_SECRET_ACCESS_KEY = "test";

const app = require("../api/server");

async function main() {
  console.log("=== Test de communication Express -> Floci SQS ===");
  
  const payload = {
    name: "Nour Kidoudi",
    email: "contact@nourkidoudi.dev",
    message: "Message de contact envoye via Express et notifie dans SQS Floci !"
  };

  console.log("1. Envoi d'une requete POST /api/contact...");
  const res = await request(app)
    .post("/api/contact")
    .send(payload)
    .set("Accept", "application/json");

  console.log("Reponse HTTP API :", res.status, res.body);

  if (res.status !== 201) {
    console.error("Echec : attendu 201, obtenu", res.status);
    process.exit(1);
  }

  console.log("2. Lecture du message dans la file SQS locale (Floci)...");
  const sqsClient = new SQSClient({
    region: "us-east-1",
    endpoint: "http://localhost:4566",
    credentials: { accessKeyId: "test", secretAccessKey: "test" }
  });

  // Attend un peu pour la reception
  await new Promise(r => setTimeout(r, 1000));

  const recv = await sqsClient.send(new ReceiveMessageCommand({
    QueueUrl: process.env.SQS_QUEUE_URL,
    MaxNumberOfMessages: 5,
    WaitTimeSeconds: 2
  }));

  if (recv.Messages && recv.Messages.length > 0) {
    console.log("Succes ! Message(s) recupere(s) depuis SQS :");
    recv.Messages.forEach((msg, idx) => {
      console.log(`[Message ${idx + 1}] ID: ${msg.MessageId}`);
      console.log(`Corps: ${msg.Body}`);
    });
  } else {
    console.log("Aucun message trouve dans la file.");
  }

  process.exit(0);
}

main().catch(err => {
  console.error("Erreur:", err);
  process.exit(1);
});

