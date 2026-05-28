terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "portfolio-devops-artifacts-968138089440"
    key    = "terraform/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Portfolio-DevOps"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = "968138089440"
    }
  }
}
