output "target_bucket" {
  description = "Bucket S3 Floci cree par Terraform (cible de la demo)"
  value       = aws_s3_bucket.ansible_target.bucket
}

output "inventory_path" {
  description = "Chemin de l'inventaire Ansible genere par Terraform"
  value       = local_file.ansible_inventory.filename
}
