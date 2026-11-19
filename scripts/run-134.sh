#!/usr/bin/env bash
# Orchestration Task 134 : Terraform cree l'infra, puis Ansible configure le serveur.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "=== [1/3] Terraform apply (creation infra Floci + inventaire Ansible) ==="
cd terraform/ansible-demo
terraform init -input=false
terraform apply -auto-approve -input=false
cd "$REPO_ROOT"

echo
echo "=== [2/3] Ansible : configuration du serveur (Docker) ==="
cd ansible
ansible-playbook playbook.yml
cd "$REPO_ROOT"

echo
echo "=== [3/3] Verification ==="
docker --version
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}'
echo
echo "Inventaire genere par Terraform :"
cat ansible/inventory.ini
echo
echo "OK - Task 134 terminee"
