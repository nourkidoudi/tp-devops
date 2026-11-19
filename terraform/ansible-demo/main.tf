terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5"
    }
  }
}

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

# 1. "Infrastructure" creee par Terraform : un bucket S3 dans Floci,
#    qui materialise l'environnement a configurer.
resource "aws_s3_bucket" "ansible_target" {
  bucket        = "tf-ansible-demo-target"
  force_destroy = true

  tags = {
    Environment = "demo"
    ManagedBy   = "Terraform"
    Purpose     = "ansible-target"
  }
}

# 2. Terraform genere l'inventaire Ansible : c'est le pont
#    Terraform -> Ansible. En prod, on y mettrait l'IP de l'EC2 creee.
resource "local_file" "ansible_inventory" {
  filename = "${path.module}/../../ansible/inventory.ini"
  content  = <<-INV
    [targets]
    localhost ansible_connection=local ansible_python_interpreter=/usr/bin/python3

    [targets:vars]
    demo_bucket=${aws_s3_bucket.ansible_target.bucket}
  INV
}
