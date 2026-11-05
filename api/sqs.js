/**
 * Service SQS local (Floci / LocalStack)
 * Tâche 114 : notification asynchrone lors de l'envoi d'un message de contact.
 */
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqsEndpoint = process.env.SQS_ENDPOINT || "http://localhost:4566";
const queueUrl = process.env.SQS_QUEUE_URL || "http://localhost:4566/000000000000/portfolio-queue";

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: sqsEndpoint,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
  },
});

/**
 * Envoie une notification dans SQS
 * @param {{ name: string, email: string, message: string }} contact
 */
async function notifyContactViaSQS(contact) {
  const payload = {
    type: "new_contact",
    timestamp: new Date().toISOString(),
    data: contact,
  };

  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(payload),
    MessageAttributes: {
      EventType: { DataType: "String", StringValue: "contact_form" },
    },
  });

  const response = await sqsClient.send(command);
  return response.MessageId;
}

module.exports = { notifyContactViaSQS };

