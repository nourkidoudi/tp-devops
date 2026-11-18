#!/usr/bin/env bash
# Cree le bucket et la table de verrou utilises par le backend S3 de Terraform
set -euo pipefail
export AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test AWS_DEFAULT_REGION=us-east-1
EP=http://localhost:4566

aws --endpoint-url $EP s3api head-bucket --bucket tf-state-bucket 2>/dev/null \
  || aws --endpoint-url $EP s3 mb s3://tf-state-bucket

aws --endpoint-url $EP dynamodb describe-table --table-name tf-state-locks >/dev/null 2>&1 \
  || aws --endpoint-url $EP dynamodb create-table \
       --table-name tf-state-locks \
       --attribute-definitions AttributeName=LockID,AttributeType=S \
       --key-schema AttributeName=LockID,KeyType=HASH \
       --billing-mode PAY_PER_REQUEST

echo "Backend pret : tf-state-bucket + tf-state-locks"
