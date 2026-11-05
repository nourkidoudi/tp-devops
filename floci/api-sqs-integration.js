/**
 * Tâche 114 – Intégration API Express ↔ LocalStack (Floci)
 * POST /api/contact envoie une notification dans SQS local.
 *
 * Usage :
 *   SQS_ENDPOINT=http://localhost:4566 \
 *   SQS_QUEUE_URL=http://localhost:4566/000000000000/tp-devops-queue \
 *   node floci/api-sqs-integration.js
 */
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: process.env.SQS_ENDPOINT || "http://localhost:4566",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
  },
});

const QUEUE_URL =
  process.env.SQS_QUEUE_URL ||
  "http://localhost:4566/000000000000/tp-devops-queue";

/**
 * Envoie une notification de contact dans la file SQS locale.
 * @param {{ name: string, email: string, message: string }} contact
 * @returns {Promise<string>} MessageId SQS
 */
async function notifyContactViaSQS(contact) {
  const payload = {
    type: "new_contact",
    timestamp: new Date().toISOString(),
    data: contact,
  };
  const cmd = new SendMessageCommand({
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify(payload),
    MessageAttributes: {
      EventType: { DataType: "String", StringValue: "contact_form" },
    },
  });
  const result = await sqsClient.send(cmd);
  return result.MessageId;
}

module.exports = { notifyContactViaSQS };

// Test rapide si exécuté directement
if (require.main === module) {
  notifyContactViaSQS({
    name: "Nour Kidoudi",
    email: "nour@portfolio.dev",
    message: "Test intégration API → SQS LocalStack",
  })
    .then((id) => console.log(`✅ Message SQS envoyé, MessageId : ${id}`))
    .catch((err) => {
      console.error("❌ Erreur SQS :", err.message);
      process.exit(1);
    });
}

