variable "environment" {
  description = "Nom de l'environnement (dev, staging, prod)"
  type        = string
}

variable "sqs_retention_seconds" {
  description = "Durée de rétention des messages SQS (en secondes)"
  type        = number
  default     = 86400
}

variable "enable_pitr" {
  description = "Activer la récupération à un instant donné (PITR) sur DynamoDB"
  type        = bool
  default     = false
}

