variable "aws_region" {
  description = "Region AWS pour Floci"
  type        = string
  default     = "us-east-1"
}

variable "floci_endpoint" {
  description = "Endpoint local de Floci"
  type        = string
  default     = "http://localhost:4566"
}

variable "environment" {
  description = "Nom de l'environnement"
  type        = string
  default     = "dev"
}