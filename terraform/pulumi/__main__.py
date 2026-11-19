"""Pulumi Floci demo - bucket S3 local."""

import pulumi
import pulumi_aws as aws

# Provider AWS pointant sur Floci (émulateur local)
floci = aws.Provider(
    "floci",
    region="us-east-1",
    access_key="test",
    secret_key="test",
    skip_credentials_validation=True,
    skip_metadata_api_check=True,
    skip_region_validation=True,
    skip_requesting_account_id=True,
    s3_use_path_style=True,
    endpoints=[
        aws.ProviderEndpointArgs(
            s3="http://localhost:4566",
            sqs="http://localhost:4566",
            dynamodb="http://localhost:4566",
        )
    ],
)

# Bucket S3 dans Floci
bucket = aws.s3.Bucket(
    "portfolio-pulumi-bucket",
    bucket="tf-portfolio-pulumi-demo",
    force_destroy=True,
    opts=pulumi.ResourceOptions(provider=floci),
)

pulumi.export("bucket_name", bucket.bucket)
pulumi.export("bucket_id", bucket.id)
