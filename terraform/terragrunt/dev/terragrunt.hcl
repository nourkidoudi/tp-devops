include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "../../modules/portfolio-infra"
}

inputs = {
  environment           = "dev"
  sqs_retention_seconds = 86400
  enable_pitr           = false
}
