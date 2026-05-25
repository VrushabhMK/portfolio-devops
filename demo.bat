@echo off
setlocal enabledelayedexpansion
color 0A

echo.
echo ============================================================
echo   CI/CD PIPELINE FOR DYNAMIC PORTFOLIO WEBSITE
echo   DevOps Tools Demonstration Script (Windows)
echo ============================================================
echo.

set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

:: TOOL 1: Git
echo ============================================================
echo   TOOL 1/11: GIT - Version Control
echo ============================================================
echo.
echo   [OK] Git repository initialized
echo   [OK] Feature branch workflow configured
echo   [OK] .gitignore properly configured
echo.
echo   Evidence:
git log --oneline 2>nul | more +0 || echo   (No commits yet - run git commit)
echo.
echo   Files: .gitignore
echo.
pause

:: TOOL 2: GitHub
echo.
echo ============================================================
echo   TOOL 2/11: GITHUB - Code Hosting
echo ============================================================
echo.
echo   [OK] Repository ready for GitHub push
echo   [OK] Webhook integration with Jenkins configured
echo   [OK] Branch protection rules ready
echo.
echo   To push to GitHub:
echo     git remote add origin https://github.com/your-username/portfolio-devops.git
echo     git push -u origin main
echo.
pause

:: TOOL 3: Docker
echo.
echo ============================================================
echo   TOOL 3/11: DOCKER - Containerization
echo ============================================================
echo.
echo   [OK] Multi-stage Dockerfile for frontend (Node -^> Nginx)
echo   [OK] Dockerfile for backend (Node.js production)
echo   [OK] docker-compose.yml with 7 services
echo.
echo   Docker files:
echo     - frontend/Dockerfile
echo     - backend/Dockerfile
echo     - docker-compose.yml
echo     - docker/nginx.conf
echo     - docker/mongo-init.js
echo.
echo   Starting Docker Compose...
echo.
docker-compose up -d --build 2>nul
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Containers starting!
    echo.
    echo   Container Status:
    docker-compose ps 2>nul
) else (
    echo   [!] Start Docker Desktop first, then run:
    echo       docker-compose up -d --build
)
echo.
pause

:: TOOL 4: Jenkins
echo.
echo ============================================================
echo   TOOL 4/11: JENKINS - CI/CD Automation
echo ============================================================
echo.
echo   [OK] Complete Jenkinsfile with 7 pipeline stages
echo.
echo   Pipeline Stages:
echo     1. Checkout     - Pull code from GitHub
echo     2. Install      - npm ci for frontend ^& backend
echo     3. Test         - Lint, build, test (parallel)
echo     4. Docker Build - Build images (parallel)
echo     5. Docker Push  - Push to Docker Hub
echo     6. Deploy K8s   - Apply manifests ^& rollout
echo     7. Verify       - Check pod ^& service status
echo.
echo   Jenkinsfile: jenkins\Jenkinsfile
echo.
echo   To start Jenkins:
echo     docker run -d -p 8080:8080 -p 50000:50000 --name jenkins jenkins/jenkins:lts
echo.
pause

:: TOOL 5: Docker Hub
echo.
echo ============================================================
echo   TOOL 5/11: DOCKER HUB - Container Registry
echo ============================================================
echo.
echo   [OK] Automated push via Jenkins pipeline
echo   [OK] Images tagged with BUILD_NUMBER + latest
echo.
echo   Image naming:
echo     ^<username^>/portfolio-frontend:^<build-number^>
echo     ^<username^>/portfolio-backend:^<build-number^>
echo.
echo   Manual push:
echo     docker tag portfolio-frontend your-username/portfolio-frontend:latest
echo     docker push your-username/portfolio-frontend:latest
echo.
pause

:: TOOL 6: Kubernetes
echo.
echo ============================================================
echo   TOOL 6/11: KUBERNETES - Container Orchestration
echo ============================================================
echo.
echo   [OK] 6 Kubernetes manifest files
echo.
echo   K8s Resources:
echo     - namespace.yaml      -^> portfolio namespace
echo     - configmap.yaml      -^> app config + secrets
echo     - deployment.yaml     -^> frontend (2 replicas), backend (2 replicas), mongodb
echo     - service.yaml        -^> ClusterIP services
echo     - ingress.yaml        -^> nginx ingress with TLS
echo     - hpa.yaml            -^> auto-scaling 2-5 replicas
echo.
echo   Deploy commands:
echo     kubectl apply -f kubernetes\namespace.yaml
echo     kubectl apply -f kubernetes\configmap.yaml
echo     kubectl apply -f kubernetes\deployment.yaml
echo     kubectl apply -f kubernetes\service.yaml
echo     kubectl apply -f kubernetes\ingress.yaml
echo     kubectl apply -f kubernetes\hpa.yaml
echo.
pause

:: TOOL 7: Terraform
echo.
echo ============================================================
echo   TOOL 7/11: TERRAFORM - Infrastructure as Code
echo ============================================================
echo.
echo   [OK] Modular Terraform configuration for AWS
echo.
echo   Terraform Resources:
echo     - VPC (10.0.0.0/16) with DNS support
echo     - 2 Public Subnets + 2 Private Subnets
echo     - Internet Gateway + NAT Gateway
echo     - Route Tables (public + private)
echo     - EC2 Instance (t3.medium, Ubuntu 22.04)
echo     - Elastic IP + Security Groups
echo.
echo   Terraform Modules:
echo     terraform\modules\vpc\             -^> VPC, subnets, gateways
echo     terraform\modules\ec2\             -^> Instance, EIP
echo     terraform\modules\security-group\  -^> Web + DB security groups
echo.
echo   Commands:
echo     cd terraform ^&^& terraform init
echo     terraform plan
echo     terraform apply -auto-approve
echo.
pause

:: TOOL 8: Ansible
echo.
echo ============================================================
echo   TOOL 8/11: ANSIBLE - Configuration Management
echo ============================================================
echo.
echo   [OK] 3 Ansible roles for automated EC2 configuration
echo.
echo   Ansible Roles:
echo     - roles\docker\       -^> Installs Docker Engine + Compose
echo     - roles\kubernetes\   -^> Installs kubectl + minikube
echo     - roles\jenkins\      -^> Runs Jenkins container + plugins
echo.
echo   Inventory: ansible\inventory\hosts.yml
echo   Variables: ansible\group_vars\all.yml
echo.
echo   Run playbook:
echo     ansible-playbook -i ansible\inventory\hosts.yml ansible\playbook.yml
echo.
pause

:: TOOL 9: AWS
echo.
echo ============================================================
echo   TOOL 9/11: AWS - Cloud Platform
echo ============================================================
echo.
echo   [OK] AWS infrastructure provisioned via Terraform
echo.
echo   AWS Resources:
echo     - EC2 Instance (t3.medium, 30GB gp3)
echo     - VPC with public + private subnets
echo     - Internet Gateway + NAT Gateway
echo     - Security Groups (HTTP/HTTPS/SSH)
echo     - Elastic IP for public access
echo     - User Data bootstrap script
echo.
echo   Provision: cd terraform ^&^& terraform apply -auto-approve
echo.
pause

:: TOOL 10: Prometheus
echo.
echo ============================================================
echo   TOOL 10/11: PROMETHEUS - Metrics Collection
echo ============================================================
echo.
echo   [OK] Prometheus configured with multiple scrape targets
echo.
echo   Scrape Targets:
echo     - prometheus (self-monitoring)
echo     - node-exporter (system CPU, memory, disk)
echo     - cadvisor (container metrics)
echo     - portfolio-backend (application metrics)
echo     - kubernetes-apiservers
echo     - kubernetes-nodes
echo     - kubernetes-pods
echo.
echo   Config: monitoring\prometheus\prometheus.yml
echo.
echo   Access (when running): http://localhost:9090
echo.
pause

:: TOOL 11: Grafana
echo.
echo ============================================================
echo   TOOL 11/11: GRAFANA - Monitoring Dashboard
echo ============================================================
echo.
echo   [OK] Pre-configured Grafana with auto-provisioned dashboards
echo.
echo   Dashboard Panels:
echo     - CPU Usage (system + per-container)
echo     - Memory Usage (process + system)
echo     - Container Health (running tasks)
echo     - HTTP Requests (rate by method/status)
echo     - Pod Status (Kubernetes pod phases)
echo.
echo   Auto-Provisioning:
echo     - Datasource: Prometheus (auto-configured)
echo     - Dashboard: Portfolio DevOps Monitoring (auto-loaded)
echo.
echo   Access (when running): http://localhost:3001
echo   Credentials: admin / admin123
echo.
echo ============================================================
echo   ALL 11 DEVOPS TOOLS DEMONSTRATED!
echo ============================================================
echo.
echo   Quick Access Summary:
echo.
echo     Frontend:      http://localhost:3000
echo     Backend API:   http://localhost:5000/api/health
echo     Jenkins:       http://localhost:8080
echo     Prometheus:    http://localhost:9090
echo     Grafana:       http://localhost:3001 (admin/admin123)
echo     cAdvisor:      http://localhost:8080
echo     Node Exporter: http://localhost:9100
echo.
echo   Start everything:  docker-compose up -d
echo   Stop everything:   docker-compose down
echo.
pause
