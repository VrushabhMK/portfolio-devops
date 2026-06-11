module "vpc" {
  source = "./modules/vpc"

  project_name         = var.project_name
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
}

module "security_group" {
  source = "./modules/security-group"

  project_name     = var.project_name
  vpc_id           = module.vpc.vpc_id
  allowed_ssh_cidr = var.allowed_ssh_cidr
}

module "ec2" {
  source = "./modules/ec2"

  project_name       = var.project_name
  instance_type      = var.instance_type
  key_name           = var.key_name
  subnet_id          = module.vpc.public_subnet_ids[0]
  security_group_ids = [module.security_group.web_sg_id]
  user_data          = file("${path.module}/user-data.sh")
}

# Storage resources (S3 removed - using MongoDB Atlas for uploads and local filesystem for builds)

# Extra security group rules for app ports
resource "aws_security_group_rule" "jenkins" {
  type              = "ingress"
  from_port         = 8080
  to_port           = 8080
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = module.security_group.web_sg_id
  description       = "Jenkins UI"
}

resource "aws_security_group_rule" "grafana" {
  type              = "ingress"
  from_port         = 3001
  to_port           = 3001
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = module.security_group.web_sg_id
  description       = "Grafana dashboard"
}

resource "aws_security_group_rule" "prometheus" {
  type              = "ingress"
  from_port         = 9090
  to_port           = 9090
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = module.security_group.web_sg_id
  description       = "Prometheus"
}

resource "aws_security_group_rule" "backend_api" {
  type              = "ingress"
  from_port         = 5000
  to_port           = 5000
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = module.security_group.web_sg_id
  description       = "Backend API"
}

resource "aws_security_group_rule" "frontend_app" {
  type              = "ingress"
  from_port         = 3000
  to_port           = 3000
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = module.security_group.web_sg_id
  description       = "Frontend app"
}

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "ec2_public_ip" {
  value       = module.ec2.public_ip
  description = "EC2 public IP - use this to access all services"
}

# S3 output removed

output "access_urls" {
  value = {
    portfolio  = "http://${module.ec2.public_ip}:3000"
    api        = "http://${module.ec2.public_ip}:5000/api/health"
    jenkins    = "http://${module.ec2.public_ip}:8080"
    grafana    = "http://${module.ec2.public_ip}:3001"
    prometheus = "http://${module.ec2.public_ip}:9090"
  }
  description = "All service access URLs"
}
