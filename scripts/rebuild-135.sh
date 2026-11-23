#!/usr/bin/env bash
# Task 135 : reconstruire l'environnement uniquement avec les scripts.
# Suppose que l'infra a ete detruite au prealable (voir README).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "=== Rebuild 135 : demarrage ==="
date -u +"START %Y-%m-%dT%H:%M:%SZ"

echo
echo "=== [1/2] Terraform apply (creation infra Floci + inventaire) ==="
terraform -chdir=terraform/ansible-demo init -input=false
terraform -chdir=terraform/ansible-demo apply -auto-approve -input=false

echo
echo "=== [2/2] Ansible : configuration serveur (Docker) ==="
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml

echo
echo "=== Verification ==="
aws --profile floci --endpoint-url http://localhost:4566 s3 ls | grep ansible || echo "ATTENTION: bucket absent"
docker --version

date -u +"END   %Y-%m-%dT%H:%M:%SZ"
echo "=== Rebuild 135 : termine ==="
