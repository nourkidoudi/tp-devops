#!/usr/bin/env bash
# floci/setup.sh
# Tâches 108-113 : configuration complète des services LocalStack (Floci)
# Usage : ./floci/setup.sh
set -euo pipefail

ENDPOINT="http://localhost:4566"
PROFILE="floci"
AWS="aws --profile $PROFILE --endpoint-url $ENDPOINT"
REGION="us-east-1"

echo "=== Floci / LocalStack – Setup des services AWS locaux ==="

# ─── 108 : Bucket S3 ─────────────────────────────────────────────────────────
echo ""
echo "[108] Création du bucket S3 'tp-devops-bucket'..."
$AWS s3 mb s3://tp-devops-bucket --region $REGION
echo "[108] Liste des buckets :"
$AWS s3 ls

# ─── 109 : Upload / Download S3 ───────────────────────────────────────────────
echo ""
echo "[109] Upload d'un fichier dans S3..."
echo "Fichier de test DevSecOps – $(date)" > /tmp/test-upload.txt
$AWS s3 cp /tmp/test-upload.txt s3://tp-devops-bucket/test-upload.txt
echo "[109] Récupération du fichier depuis S3..."
$AWS s3 cp s3://tp-devops-bucket/test-upload.txt /tmp/test-download.txt
echo "[109] Contenu récupéré :"
cat /tmp/test-download.txt

# ─── 110 : File SQS ───────────────────────────────────────────────────────────
echo ""
echo "[110] Création de la file SQS 'tp-devops-queue'..."
QUEUE_URL=$($AWS sqs create-queue --queue-name tp-devops-queue --query QueueUrl --output text)
echo "[110] Queue URL : $QUEUE_URL"
echo "[110] Envoi d'un message de test..."
$AWS sqs send-message \
  --queue-url "$QUEUE_URL" \
  --message-body '{"type":"contact","name":"Test DevSecOps","email":"test@portfolio.dev","message":"Bonjour depuis SQS local !"}'
echo "[110] Lecture du message..."
$AWS sqs receive-message --queue-url "$QUEUE_URL" --max-number-of-messages 1

# ─── 111 : DynamoDB ───────────────────────────────────────────────────────────
echo ""
echo "[111] Création de la table DynamoDB 'tp-devops-table'..."
$AWS dynamodb create-table \
  --table-name tp-devops-table \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region $REGION
echo "[111] Ajout d'un item..."
$AWS dynamodb put-item \
  --table-name tp-devops-table \
  --item '{"id":{"S":"1"},"name":{"S":"Nour Kidoudi"},"role":{"S":"DevSecOps Engineer"},"stack":{"S":"Node.js / Next.js / PostgreSQL"}}'
echo "[111] Lecture de l'item :"
$AWS dynamodb get-item \
  --table-name tp-devops-table \
  --key '{"id":{"S":"1"}}'

# ─── 112 : Lambda ─────────────────────────────────────────────────────────────
echo ""
echo "[112] Création de la fonction Lambda 'tp-devops-hello'..."
cd "$(dirname "$0")/lambda"
zip -q handler.zip handler.js
$AWS lambda create-function \
  --function-name tp-devops-hello \
  --runtime nodejs18.x \
  --handler handler.handler \
  --zip-file fileb://handler.zip \
  --role arn:aws:iam::000000000000:role/lambda-role \
  --region $REGION 2>/dev/null || \
  $AWS lambda update-function-code \
    --function-name tp-devops-hello \
    --zip-file fileb://handler.zip \
    --region $REGION
echo "[112] Invocation de la Lambda..."
$AWS lambda invoke \
  --function-name tp-devops-hello \
  --payload '{"name":"Floci"}' \
  --region $REGION \
  /tmp/lambda-output.json
echo "[112] Résultat :"
cat /tmp/lambda-output.json
cd - > /dev/null

# ─── 113 : Secrets Manager ────────────────────────────────────────────────────
echo ""
echo "[113] Création d'un secret dans Secrets Manager..."
$AWS secretsmanager create-secret \
  --name tp-devops/db-password \
  --secret-string '{"password":"S3cr3tD3v0ps!","username":"devsecops"}' \
  --region $REGION 2>/dev/null || \
  $AWS secretsmanager put-secret-value \
    --secret-id tp-devops/db-password \
    --secret-string '{"password":"S3cr3tD3v0ps!","username":"devsecops"}' \
    --region $REGION
echo "[113] Lecture du secret :"
$AWS secretsmanager get-secret-value \
  --secret-id tp-devops/db-password \
  --region $REGION \
  --query SecretString --output text

echo ""
echo "=== Setup terminé avec succès ! ==="

