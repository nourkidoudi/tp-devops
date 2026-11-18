terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend S3 distant avec verrouillage DynamoDB dans Floci
  backend "s3" {
    bucket         = "tf-state-bucket"
    key            = "environments/dev/terraform.tfstate"
    region         = "us-east-1"
    endpoints = {
      s3       = "http://localhost:4566"
      dynamodb = "http://localhost:4566"
    }
    dynamodb_table = "tf-state-locks"

    access_key                  = "test"
    secret_key                  = "test"
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_requesting_account_id  = true
    use_path_style              = true
  }
}

provider "aws" {
  region                      = "us-east-1"
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
  s3_use_path_style           = true

  endpoints {
    s3       = "http://localhost:4566"
    sqs      = "http://localhost:4566"
    dynamodb = "http://localhost:4566"
  }
}

module "portfolio" {
  source = "../../modules/portfolio-infra"

  environment           = "dev"
  sqs_retention_seconds = 86400 # 1 jour en dev
  enable_pitr           = false
}

output "dev_s3_bucket" {
  value = module.portfolio.s3_bucket_name
}

output "dev_sqs_queue" {
  value = module.portfolio.sqs_queue_url
}

output "dev_dynamodb_table" {
  value = module.portfolio.dynamodb_table_name
}

