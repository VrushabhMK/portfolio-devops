# Terraform configuration for AWS infrastructure
# Portfolio website deployment on AWS

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend for state storage (uncomment and configure for production)
  # backend "s3" {
  #   bucket = "portfolio-terraform-state"
  #   key    = "infrastructure/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Portfolio-DevOps"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
