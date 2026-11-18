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
  sqs_managed_sse_enabled   = true
  sqs_managed_sse_enabled   = true

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
# Chiffrement du bucket (taches 129-130 : correctif de securite IaC)
resource "aws_s3_bucket_server_side_encryption_configuration" "bucket_crypto" {
  bucket = aws_s3_bucket.portfolio_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Blocage de tout acces public au bucket
resource "aws_s3_bucket_public_access_block" "bucket_pab" {
  bucket = aws_s3_bucket.portfolio_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Chiffrement du bucket (taches 129-130 : correctif de securite IaC)
resource "aws_s3_bucket_server_side_encryption_configuration" "bucket_crypto" {
  bucket = aws_s3_bucket.portfolio_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Blocage de tout acces public au bucket
resource "aws_s3_bucket_public_access_block" "bucket_pab" {
  bucket = aws_s3_bucket.portfolio_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
