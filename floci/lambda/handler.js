/**
 * Tâche 112 – Fonction Lambda locale (Node.js)
 * Invoquée via LocalStack (Floci) : retourne un message de salutation.
 */
exports.handler = async (event) => {
  const name = (event && event.name) ? event.name : "DevSecOps";
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Bonjour ${name} depuis Lambda locale (LocalStack) !`,
      timestamp: new Date().toISOString(),
    }),
  };
};

