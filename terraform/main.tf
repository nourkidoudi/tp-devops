# 1. Bucket S3 géré par Terraform
resource "aws_s3_bucket" "portfolio_bucket" {
  bucket = "tf-portfolio-bucket-${var.environment}"

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# 2. File SQS gérée par Terraform
resource "aws_sqs_queue" "portfolio_queue" {
  name                      = "tf-portfolio-queue-${var.environment}"
  message_retention_seconds = 86400

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# 3. Table DynamoDB gérée par Terraform
resource "aws_dynamodb_table" "portfolio_contacts" {
  name         = "tf-portfolio-contacts-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}