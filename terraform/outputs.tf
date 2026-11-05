output "s3_bucket_name" {
  description = "Nom du bucket S3 créé"
  value       = aws_s3_bucket.portfolio_bucket.id
}

output "sqs_queue_url" {
  description = "URL de la file SQS créée"
  value       = aws_sqs_queue.portfolio_queue.url
}

output "dynamodb_table_name" {
  description = "Nom de la table DynamoDB créée"
  value       = aws_dynamodb_table.portfolio_contacts.name
}