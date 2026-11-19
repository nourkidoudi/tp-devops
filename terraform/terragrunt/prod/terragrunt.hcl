include "root" {
  path = find_in_parent_folders()
}

terraform {
  source = "../../modules/portfolio-infra"
}

inputs = {
  environment           = "prod"
  sqs_retention_seconds = 1209600
  enable_pitr           = true
}
