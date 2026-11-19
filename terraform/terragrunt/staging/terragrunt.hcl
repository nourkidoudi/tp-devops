include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "../../modules/portfolio-infra"
}

inputs = {
  environment           = "staging"
  sqs_retention_seconds = 345600
  enable_pitr           = true
}
