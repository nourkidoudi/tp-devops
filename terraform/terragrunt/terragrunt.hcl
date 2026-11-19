# Racine Terragrunt : factorise le backend S3 (Floci) et le provider AWS.
# Chaque environnement hérite via `include "root"`.

remote_state {
  backend = "s3"
  config = {
    bucket         = "tf-state-bucket"
    key            = "terragrunt/${path_relative_to_include()}/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "tf-state-locks"
    endpoints = {
      s3       = "http://localhost:4566"
      dynamodb = "http://localhost:4566"
    }
    access_key                  = "test"
    secret_key                  = "test"
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    force_path_style            = true
  }
}

# Génère un bloc backend vide dans le module téléchargé.
# Nécessaire pour que Terragrunt applique remote_state.
generate "backend" {
  path      = "backend.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<BACKEND
terraform {
  backend "s3" {}
}
BACKEND
}

generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<PROVIDER
provider "aws" {
  region                      = "us-east-1"
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_region_validation      = true
  skip_requesting_account_id  = true

  endpoints {
    s3       = "http://localhost:4566"
    sqs      = "http://localhost:4566"
    dynamodb = "http://localhost:4566"
  }
}
PROVIDER
}
