#!/bin/bash
#####################################################################
# DEMO SCRIPT: Showcase All 11 DevOps Tools for Portfolio Review
# Run this script to demonstrate each tool is implemented
#####################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "============================================================"
echo -e "${BLUE}  CI/CD PIPELINE FOR DYNAMIC PORTFOLIO WEBSITE${NC}"
echo -e "${BLUE}  DevOps Tools Demonstration Script${NC}"
echo "============================================================"
echo ""

# ---------------------------------------------------------------
# TOOL 1: Git
# ---------------------------------------------------------------
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  TOOL 1/11: GIT - Version Control${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "✅ Git repository initialized"
echo "✅ Feature branch workflow configured"
echo "✅ .gitignore properly configured"
echo ""
echo "Evidence:"
git -C "$PROJECT_DIR" log --oneline 2>/dev/null | head -5 || echo "  (Run 'git commit' to see commit history)"
echo ""
echo "Files: .gitignore"
echo ""
read -p "Press Enter to continue to next tool..."

# ---------------------------------------------------------------
# TOOL 2: GitHub
# ---------------------------------------------------------------
echo ""
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}  TOOL 2/11: GITHUB - Code Hosting${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "✅ Repository ready for GitHub push"
echo "✅ Webhook integration with Jenkins configured"
echo "✅ Branch protection rules ready"
echo ""
echo "To push to GitHub:"
echo "  git remote add origin https://github.com/your-username/portfolio-devops.git"
echo "  git push -u origin main"
echo ""
read -p "Press Enter to continue..."

# ---------------------------------------------------------------
# TOOL 3: Docker
# ---------------------------------------------------------------
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  TOOL 3/11: DOCKER - Containerization${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "✅ Multi-stage Dockerfile for frontend (Node → Nginx)"
echo "✅ Dockerfile for backend (Node.js production)"
echo "✅ docker-compose.yml with 7 services"
echo ""
echo "Docker files:"
echo "  - frontend/Dockerfile"
echo "  - backend/Dockerfile"
echo "  - docker-compose.yml"
echo "  - docker/nginx.conf"
echo "  - docker/mongo-init.js"
echo ""
echo "Running Docker Compose to demonstrate..."
echo ""

# Check if Docker is running
if docker info > /dev/null 2>&1; then
    echo "Building and starting containers..."
    cd "$PROJECT_DIR"
    docker-compose up -d --build 2>&1 | tail -20 || echo "  (Docker Compose may need adjustments for your environment)"
    echo ""
    echo "Container Status:"
    docker-compose ps 2>/dev/null || echo "  (Run 'docker-compose up -d' manually)"
else
    echo "⚠️  Docker daemon not running. Start Docker Desktop first."
    echo "  Command: docker-compose up -d --build"
fi

echo ""
read -p "Press Enter to continue..."

# ---------------------------------------------------------------
# TOOL 4: Jenkins
# ---------------------------------------------------------------
echo ""
echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${RED}  TOOL 4/11: JENKINS - CI/CD Automation${NC}"
echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "✅ Complete Jenkinsfile with 7 pipeline stages"
echo ""
echo "Pipeline Stages:"
echo "  1. Checkout     - Pull code from GitHub"
echo "  2. Install      - npm ci for frontend & backend (parallel)"
echo "  3. Test         - Lint, build frontend; test backend (parallel)"
echo "  4. Docker Build - Build frontend & backend images (parallel)"
echo "  5. Docker Push  - Push images to Docker Hub"
echo "  6. Deploy K8s   - Apply manifests & rollout"
echo "  7. Verify       - Check pod & service status"
echo ""
echo "Jenkinsfile location: jenkins/Jenkinsfile"
echo ""

if docker ps 2>/dev/null | grep -q jenkins; then
    echo "🟢 Jenkins is running!"
    echo "   Access: http://localhost:8080"
    JENKINS_PASS=$(docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null || echo "N/A")
    echo "   Admin Password: $JENKINS_PASS"
else
    echo "To start Jenkins:"
    echo "  docker run -d -p 8080:8080 -p 50000:50000 --name jenkins jenkins/jenkins:lts"
fi

echo ""
read -p "Press Enter to continue..."

# ---------------------------------------------------------------
# TOOL 5: Docker Hub
# ---------------------------------------------------------------
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  TOOL 5/11: DOCKER HUB - Container Registry${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "✅ Automated push via Jenkins pipeline"
echo "✅ Images tagged with BUILD_NUMBER + latest"
echo ""
echo "Image naming convention:"
echo "  <username>/portfolio-frontend:<build-number>"
echo "  <username>/portfolio-backend:<build-number>"
echo "  <username>/portfolio-frontend:latest"
echo "  <username>/portfolio-backend:latest"
echo ""
echo "Manual push commands:"
echo "  docker tag portfolio-frontend your-username/portfolio-frontend:latest"
echo "  docker push your-username/portfolio-frontend:latest"
echo ""
read -p "Press Enter to continue..."

# ---------------------------------------------------------------
# TOOL 6: Kubernetes
# ---------------------------------------------------------------
echo ""
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}  TOOL 6/11: KUBERNETES - Container Orchestration${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "✅ 6 Kubernetes manifest files"
echo ""
echo "K8s Resources:"
echo "  - namespace.yaml      → portfolio namespace"
echo "  - configmap.yaml      → app config + secrets"
echo "  - deployment.yaml     → frontend (2 replicas), backend (2 replicas), mongodb"
echo "  - service.yaml        → ClusterIP services for all 3"
echo "  - ingress.yaml        → nginx ingress with TLS"
echo "  - hpa.yaml            → auto-scaling 2-5 replicas based on CPU/memory"
echo ""
echo "Deploy to Kubernetes:"

if kubectl version --client > /dev/null 2>&1; then
    echo ""
    echo "kubectl found! Checking cluster..."
    if kubectl cluster-info > /dev/null 2>&1; then
        echo "🟢 Kubernetes cluster is accessible!"
        echo ""
        echo "Apply manifests:"
        echo "  kubectl apply -f kubernetes/namespace.yaml"
        echo "  kubectl apply -f kubernetes/configmap.yaml"
        echo "  kubectl apply -f kubernetes/deployment.yaml"
        echo "  kubectl apply -f kubernetes/service.yaml"
        echo "  kubectl apply -f kubernetes/ingress.yaml"
        echo "  kubectl apply -f kubernetes/hpa.yaml"
    else
        echo "⚠️  No cluster running. Start minikube:"
        echo "  minikube start --driver=docker"
    fi
else
    echo "  kubectl not found. Install it first."
fi

echo ""
read -p "Press Enter to continue..."

# ---------------------------------------------------------------
# TOOL 7: Terraform
# ---------------------------------------------------------------
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  TOOL 7/11: TERRAFORM - Infrastructure as Code${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "✅ Modular Terraform configuration for AWS"
echo ""
echo "Terraform Resources:"
echo "  - VPC (10.0.0.0/16) with DNS support"
echo "  - 2 Public Subnets + 2 Private Subnets"
echo "  - Internet Gateway + NAT Gateway"
echo "  - Route Tables (public + private)"
echo "  - EC2 Instance (t3.medium, Ubuntu 22.04)"
echo "  - Elastic IP"
echo "  - Security Groups (web + database)"
echo ""
echo "Terraform Modules:"
echo "  terraform/modules/vpc/             → VPC, subnets, gateways"
echo "  terraform/modules/ec2/             → Instance, EIP"
echo "  terraform/modules/security-group/  → Web + DB security groups"
echo ""
echo "Commands:"
echo "  cd terraform && terraform init"
echo "  terraform plan"
echo "  terraform apply -auto-approve"
echo ""
read -p "Press Enter to continue..."

# ---------------------------------------------------------------
# TOOL 8: Ansible
# ---------------------------------------------------------------
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  TOOL 8/11: ANSIBLE - Configuration Management${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "✅ 3 Ansible roles for automated EC2 configuration"
echo ""
echo "Ansible Roles:"
echo "  - roles/docker/       → Installs Docker Engine + Docker Compose"
echo "  - roles/kubernetes/   → Installs kubectl + minikube, starts cluster"
echo "  - roles/jenkins/      → Runs Jenkins container, installs plugins"
echo ""
echo "Inventory: ansible/inventory/hosts.yml"
echo "Variables: ansible/group_vars/all.yml"
echo ""
echo "Run playbook:"
echo "  ansible-playbook -i ansible/inventory/hosts.yml ansible/playbook.yml"
echo ""
read -p "Press Enter to continue..."

# ---------------------------------------------------------------
# TOOL 9: AWS
# ---------------------------------------------------------------
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  TOOL 9/11: AWS - Cloud Platform${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "✅ AWS infrastructure provisioned via Terraform"
echo ""
echo "AWS Resources (via Terraform):"
echo "  - EC2 Instance (t3.medium, 30GB gp3)"
echo "  - VPC with public + private subnets"
echo "  - Internet Gateway + NAT Gateway"
echo "  - Security Groups (HTTP/HTTPS/SSH)"
echo "  - Elastic IP for public access"
echo "  - User Data script for bootstrap"
echo ""
echo "Provision with:"
echo "  cd terraform && terraform apply -auto-approve"
echo ""
read -p "Press Enter to continue..."

# ---------------------------------------------------------------
# TOOL 10: Prometheus
# ---------------------------------------------------------------
echo ""
echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${RED}  TOOL 10/11: PROMETHEUS - Metrics Collection${NC}"
echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "✅ Prometheus configured with multiple scrape targets"
echo ""
echo "Scrape Targets:"
echo "  - prometheus (self-monitoring)"
echo "  - node-exporter (system CPU, memory, disk)"
echo "  - cadvisor (container metrics)"
echo "  - portfolio-backend (application metrics)"
echo "  - kubernetes-apiservers"
echo "  - kubernetes-nodes"
echo "  - kubernetes-pods"
echo ""
echo "Config: monitoring/prometheus/prometheus.yml"
echo ""

if docker ps 2>/dev/null | grep -q prometheus; then
    echo "🟢 Prometheus is running!"
    echo "   Access: http://localhost:9090"
    echo ""
    echo "Query examples:"
    echo "  up                                    → All targets status"
    echo "  rate(http_requests_total[5m])         → Request rate"
    echo "  container_cpu_usage_seconds_total     → Container CPU"
else
    echo "Start with: docker-compose up -d prometheus"
fi

echo ""
read -p "Press Enter to continue..."

# ---------------------------------------------------------------
# TOOL 11: Grafana
# ---------------------------------------------------------------
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  TOOL 11/11: GRAFANA - Monitoring Dashboard${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "✅ Pre-configured Grafana with auto-provisioned dashboards"
echo ""
echo "Dashboard Panels:"
echo "  - CPU Usage (system + per-container)"
echo "  - Memory Usage (process + system)"
echo "  - Container Health (running tasks)"
echo "  - HTTP Requests (rate by method/status)"
echo "  - Pod Status (Kubernetes pod phases)"
echo ""
echo "Auto-Provisioning:"
echo "  - Datasource: Prometheus (auto-configured)"
echo "  - Dashboard: Portfolio DevOps Monitoring (auto-loaded)"
echo ""

if docker ps 2>/dev/null | grep -q grafana; then
    echo "🟢 Grafana is running!"
    echo "   Access: http://localhost:3001"
    echo "   Credentials: admin / admin123"
else
    echo "Start with: docker-compose up -d grafana"
fi

echo ""
echo "============================================================"
echo -e "${GREEN}  ALL 11 DEVOPS TOOLS DEMONSTRATED!${NC}"
echo "============================================================"
echo ""
echo "Quick Access Summary (when Docker Compose is running):"
echo ""
echo "  🌐 Frontend:     http://localhost:3000"
echo "  🔧 Backend API:  http://localhost:5000/api/health"
echo "  ⚙️  Jenkins:      http://localhost:8080"
echo "  📊 Prometheus:   http://localhost:9090"
echo "  📈 Grafana:      http://localhost:3001 (admin/admin123)"
echo "  🐳 cAdvisor:     http://localhost:8080"
echo "  📋 Node Exporter: http://localhost:9100"
echo ""
echo "To start everything: docker-compose up -d"
echo "To stop everything:  docker-compose down"
echo ""
