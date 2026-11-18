terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "tf-state-bucket"
    key            = "environments/prod/terraform.tfstate"
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

  environment           = "prod"
  sqs_retention_seconds = 1209600 # 14 jours en prod
  enable_pitr           = true    # Backup continu active en prod
}

output "prod_s3_bucket" {
  value = module.portfolio.s3_bucket_name
}

