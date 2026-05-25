# CI/CD Pipeline for Dynamic Portfolio Website Deployment Using DevOps Tools

A fully automated, cloud-hosted dynamic portfolio website with complete CI/CD automation, containerization, orchestration, infrastructure automation, monitoring, and DevOps best practices implemented end-to-end.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js, TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **DevOps** | Git, GitHub, Docker, Jenkins, Kubernetes, Terraform, Ansible |
| **Cloud** | AWS (EC2, VPC, Security Groups) |
| **Monitoring** | Prometheus, Grafana, cAdvisor, Node Exporter |
| **Database** | MongoDB Atlas / Containerized MongoDB |

## CI/CD Workflow

```
Developer → Git Push → GitHub → Jenkins Webhook → Docker Build → Docker Hub Push → Kubernetes Deploy → AWS Hosting
```

## Project Structure

```
portfolio-devops/
├── frontend/                # React.js frontend application
│   ├── src/
│   │   ├── components/      # React components (Hero, About, Skills, etc.)
│   │   ├── context/         # Theme context (dark/light mode)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # API client, utilities
│   │   ├── assets/          # Images, icons
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css        # Design system tokens
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── tsconfig.json
├── backend/                 # Node.js + Express.js API
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/       # Auth, validation
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API route definitions
│   │   └── server.js        # Entry point
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── kubernetes/              # Kubernetes manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── hpa.yaml
├── terraform/               # AWS infrastructure as code
│   ├── main.tf
│   ├── variables.tf
│   ├── infrastructure.tf
│   ├── user-data.sh
│   └── modules/
│       ├── vpc/
│       ├── ec2/
│       └── security-group/
├── ansible/                 # Configuration management
│   ├── playbook.yml
│   ├── inventory/
│   │   └── hosts.yml
│   ├── group_vars/
│   │   └── all.yml
│   └── roles/
│       ├── docker/
│       ├── kubernetes/
│       └── jenkins/
├── jenkins/                 # CI/CD pipeline
│   └── Jenkinsfile
├── docker/                  # Docker configurations
│   ├── nginx.conf
│   └── mongo-init.js
├── monitoring/              # Prometheus + Grafana
│   ├── prometheus/
│   │   └── prometheus.yml
│   └── grafana/
│       └── provisioning/
│           ├── datasources/
│           └── dashboards/
├── docker-compose.yml       # Multi-container orchestration
├── .gitignore
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- kubectl & Minikube (for K8s deployment)
- Terraform (for AWS provisioning)
- Ansible (for configuration management)

### 1. Local Development (Without Docker)

```bash
# Clone the repository
git clone https://github.com/your-username/portfolio-devops.git
cd portfolio-devops

# Start backend
cd backend
cp .env.example .env
npm install
npm run dev

# In a new terminal, start frontend
cd frontend
npm install
npm run dev
```

Access the application at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health

### 2. Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin/admin123)

### 3. Kubernetes Deployment

```bash
# Start Minikube
minikube start --driver=docker

# Enable required addons
minikube addons enable ingress
minikube addons enable metrics-server

# Apply Kubernetes manifests
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
kubectl apply -f kubernetes/ingress.yaml
kubectl apply -f kubernetes/hpa.yaml

# Check deployment status
kubectl get pods -n portfolio
kubectl get services -n portfolio

# Port forward for local access
kubectl port-forward svc/frontend-service 3000:80 -n portfolio
kubectl port-forward svc/backend-service 5000:5000 -n portfolio
```

### 4. AWS Deployment with Terraform

```bash
# Initialize Terraform
cd terraform
terraform init

# Review the plan
terraform plan

# Apply infrastructure
terraform apply -auto-approve

# Note the output EC2 public IP
terraform output ec2_public_ip
```

### 5. Configure EC2 with Ansible

```bash
# Update inventory with EC2 IP from Terraform output
cd ansible
# Edit inventory/hosts.yml with your EC2 IP

# Run the playbook
ansible-playbook -i inventory/hosts.yml playbook.yml
```

### 6. Setup Jenkins CI/CD

1. Access Jenkins at http://YOUR_EC2_IP:8080
2. Get initial admin password: `docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword`
3. Install suggested plugins
4. Add Docker Hub credentials in Jenkins Credentials
5. Create a Pipeline job pointing to your GitHub repo
6. The Jenkinsfile will handle the complete CI/CD pipeline

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Health check | No |
| GET | `/api/projects` | Get all projects | No |
| GET | `/api/projects/:id` | Get single project | No |
| POST | `/api/projects` | Create project | Admin |
| PUT | `/api/projects/:id` | Update project | Admin |
| DELETE | `/api/projects/:id` | Delete project | Admin |
| GET | `/api/skills` | Get all skills | No |
| POST | `/api/skills` | Create skill | Admin |
| GET | `/api/contacts` | Get all contacts | Admin |
| POST | `/api/contacts` | Submit contact form | No |
| POST | `/api/auth/register` | Register admin | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Get current user | Admin |

## Monitoring

### Prometheus Metrics
- CPU and memory usage
- Container health and resource utilization
- HTTP request rates and response times
- Kubernetes pod status

### Grafana Dashboards
- Pre-configured Portfolio DevOps Monitoring dashboard
- Real-time metrics visualization
- Alert configuration support

Access Grafana at `http://localhost:3001` with credentials `admin/admin123`.

## Features

- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Animated Sections**: Scroll-triggered animations with Framer Motion
- **Contact Form**: Real-time form validation with API submission
- **Skills Progress Bars**: Animated skill level indicators
- **Project Filtering**: Filter projects by category
- **Resume Download**: Downloadable PDF resume
- **SEO Optimized**: Proper meta tags, semantic HTML, accessibility
- **Loading Animation**: Professional loading screen with progress

## DevOps Tools Used

1. **Git** - Version control with feature branches
2. **GitHub** - Code hosting and collaboration
3. **Docker** - Containerization of frontend, backend, and MongoDB
4. **Jenkins** - Automated CI/CD pipeline
5. **Docker Hub** - Container image registry
6. **Kubernetes** - Container orchestration with auto-scaling
7. **Terraform** - AWS infrastructure provisioning
8. **Ansible** - Configuration management
9. **Prometheus** - Metrics collection
10. **Grafana** - Monitoring dashboards
11. **AWS** - Cloud hosting (EC2, VPC, Security Groups)

---

## How to Show DevOps Tools in Review

### Method 1: Visual DevOps Pipeline Section on Website

The portfolio website now includes a **DevOps Pipeline** section (between Projects and Certifications) that visually displays:
- Complete CI/CD workflow diagram with all 8 pipeline stages
- All 11 DevOps tools as interactive expandable cards
- Configuration files for each tool
- Infrastructure summary (Terraform + Ansible)
- Monitoring summary (Prometheus + Grafana)
- Access points table for all services

### Method 2: Run the Demo Script

A demo script walks through each of the 11 tools one-by-one with evidence:

```bash
# Windows
demo.bat

# Linux/Mac
chmod +x demo.sh && ./demo.sh
```

### Method 3: Live Tool-by-Tool Demonstration

Follow this checklist to demonstrate each tool live:

#### Step 1: Show the Website (Frontend)
```bash
cd frontend && npm run dev
# Open http://localhost:3000 → Scroll to DevOps Pipeline section
```

#### Step 2: Show Git & GitHub
```bash
git log --oneline          # Show commit history
git branch -a              # Show branches
cat .gitignore             # Show ignore rules
```

#### Step 3: Show Docker (Containerization)
```bash
# Make sure Docker Desktop is running
docker-compose up -d --build    # Build and start all containers
docker-compose ps               # Show running containers
docker images                   # Show built images
```
**Shows**: frontend, backend, mongodb, prometheus, grafana, node-exporter, cadvisor

#### Step 4: Show Docker Hub
```bash
docker login
docker tag portfolio-frontend your-username/portfolio-frontend:latest
docker push your-username/portfolio-frontend:latest
```

#### Step 5: Show Jenkins CI/CD
```bash
# Start Jenkins container
docker run -d -p 8080:8080 -p 50000:50000 --name jenkins jenkins/jenkins:lts
# Get admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
# Open http://localhost:8080 → Create Pipeline job → Point to repo
```
**Shows**: Jenkinsfile with 7 stages, parallel builds, auto-deploy

#### Step 6: Show Kubernetes
```bash
minikube start --driver=docker       # Start K8s cluster
kubectl apply -f kubernetes/         # Deploy all manifests
kubectl get pods -n portfolio         # Show running pods
kubectl get services -n portfolio     # Show services
kubectl get hpa -n portfolio          # Show auto-scaling
```
**Shows**: 2 replicas per service, HPA auto-scaling, ingress, health checks

#### Step 7: Show Terraform (Infrastructure)
```bash
cd terraform
terraform init                        # Initialize providers
terraform plan                        # Show planned AWS resources
# Shows: VPC, subnets, EC2, security groups, internet gateway, NAT
```

#### Step 8: Show Ansible (Configuration)
```bash
# Show playbook structure
cat ansible/playbook.yml              # Main playbook
cat ansible/roles/docker/tasks/main.yml
cat ansible/roles/kubernetes/tasks/main.yml
cat ansible/roles/jenkins/tasks/main.yml
```

#### Step 9: Show AWS Cloud
```bash
cd terraform
terraform apply -auto-approve         # Provision AWS
terraform output                      # Show EC2 public IP
```

#### Step 10: Show Prometheus Monitoring
```bash
# Open http://localhost:9090
# Run queries:
#   up                                    → All targets status
#   rate(http_requests_total[5m])         → Request rate
#   container_cpu_usage_seconds_total     → Container CPU
```

#### Step 11: Show Grafana Dashboards
```bash
# Open http://localhost:3001 (admin/admin123)
# Shows: CPU, Memory, Container Health, HTTP Requests, Pod Status
```

### Service Access Summary

| Service | URL | Credentials |
|---------|-----|-------------|
| Portfolio Frontend | http://localhost:3000 | - |
| Backend API | http://localhost:5000/api/health | - |
| Jenkins | http://localhost:8080 | See password in console |
| Prometheus | http://localhost:9090 | - |
| Grafana | http://localhost:3001 | admin / admin123 |
| cAdvisor | http://localhost:8080 | - |

---

## Deployment Commands Summary

```bash
# Docker
docker-compose up -d --build

# Kubernetes
kubectl apply -f kubernetes/

# Terraform
cd terraform && terraform apply -auto-approve

# Ansible
ansible-playbook -i ansible/inventory/hosts.yml ansible/playbook.yml

# Jenkins
# Create pipeline job with Jenkinsfile from repository
```

## License

MIT License
