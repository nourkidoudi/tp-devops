# MAUVAISE CONFIGURATION VOLONTAIRE (tache 130) : ne jamais fusionner dans main
resource "aws_s3_bucket" "mauvais" {
  bucket = "bucket-public-non-chiffre"
}

resource "aws_s3_bucket_acl" "public" {
  bucket = aws_s3_bucket.mauvais.id
  acl    = "public-read"
}

resource "aws_sqs_queue" "non_chiffree" {
  name = "file-sans-chiffrement"
}
