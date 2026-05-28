# Portfolio DevOps - CI/CD Pipeline

**GitHub:** https://github.com/VrushabhMK/portfolio-devops
**AWS Account:** 968138089440 | **EC2:** i-00efc8195ddaca37a | **Region:** us-east-1
**Docker Hub:** vrushabhm/portfolio-frontend | vrushabhm/portfolio-backend

---

## Architecture

```
Developer -> Git Push -> GitHub -> Jenkins Webhook ->
  Install & Build -> Docker Build -> Docker Hub Push ->
  EC2 Deploy (Docker) -> Kubernetes (Minikube) ->
  Health Check -> S3 Artifact Store
```

## Service Access URLs

> Get your EC2 IP first (see Step 1 below), then replace EC2_IP

| Service | URL | Credentials |
|---------|-----|-------------|
| Portfolio Website | `http://EC2_IP:3000` | - |
| Backend API | `http://EC2_IP:5000/api/health` | - |
| Jenkins | `http://EC2_IP:8080` | admin / (see setup) |
| Grafana | `http://EC2_IP:3001` | admin / admin123 |
| Prometheus | `http://EC2_IP:9090` | - |
| S3 Builds | AWS Console -> S3 -> `portfolio-devops-artifacts-968138089440/builds/` | - |

---

## Step-by-Step Setup

### Step 1: Get EC2 Public IP

```bash
aws ec2 describe-instances \
  --instance-ids i-00efc8195ddaca37a \
  --region us-east-1 \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text
```

### Step 2: Create S3 Bucket (one-time)

```bash
aws s3 mb s3://portfolio-devops-artifacts-968138089440 --region us-east-1
aws s3api put-bucket-versioning \
  --bucket portfolio-devops-artifacts-968138089440 \
  --versioning-configuration Status=Enabled
```

### Step 3: Run Terraform

```bash
cd terraform
terraform init
terraform plan
terraform apply -auto-approve
# Outputs will show all service URLs
```

### Step 4: Run Ansible (configure EC2)

```bash
export EC2_PUBLIC_IP=<your-ec2-ip>
cd ansible
# Edit inventory/hosts.yml - set ansible_host to your EC2 IP
ansible-playbook -i inventory/hosts.yml playbook.yml \
  --private-key ~/.ssh/portfolio-key.pem
```

### Step 5: Configure Jenkins

SSH into EC2:
```bash
ssh -i ~/.ssh/portfolio-key.pem ubuntu@<EC2_IP>
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Open `http://EC2_IP:8080` and complete setup wizard.

Install plugins: GitHub plugin, SSH Agent plugin, NodeJS plugin, Pipeline

**Add Credentials** (Manage Jenkins -> Credentials -> Global -> Add):

| ID | Type | Value |
|----|------|-------|
| `docker-hub-credentials` | Username/Password | Docker Hub: vrushabhm / your-password |
| `ec2-ssh-key` | SSH Private Key | Paste contents of portfolio-key.pem |
| `jwt-secret` | Secret text | `portfolio-devops-jwt-secret-968138089440` |

**Configure NodeJS** (Manage Jenkins -> Tools -> NodeJS installations):
- Name: `NodeJS-20`, Version: `20.x`

**Create Pipeline Job:**
1. New Item -> Pipeline -> name: `portfolio-pipeline`
2. Build Triggers -> check **GitHub hook trigger for GITScm polling**
3. Pipeline -> Definition: **Pipeline script from SCM**
4. SCM: Git, URL: `https://github.com/VrushabhMK/portfolio-devops.git`
5. Script Path: `jenkins/Jenkinsfile`
6. Save -> Build Now

### Step 6: Configure GitHub Webhook (for auto-deploy)

GitHub repo -> Settings -> Webhooks -> Add webhook:
- Payload URL: `http://EC2_IP:8080/github-webhook/`
- Content type: `application/json`
- Events: **Just the push event**
- Active: checked

Now every `git push` to main auto-triggers the full pipeline.

---

## Local Development

```bash
git clone https://github.com/VrushabhMK/portfolio-devops.git
cd portfolio-devops
docker compose up -d

# Access:
# Frontend:   http://localhost:3000
# Backend:    http://localhost:5000/api/health
# Grafana:    http://localhost:3001  (admin/admin123)
# Prometheus: http://localhost:9090
```

---

## Automatic Deployment Flow

Every `git push` to `main`:
1. GitHub sends webhook to Jenkins at `http://EC2_IP:8080/github-webhook/`
2. Jenkins pulls code, installs deps, builds frontend + backend
3. Docker images built and pushed to Docker Hub:
   - `vrushabhm/portfolio-frontend:BUILD_NUMBER`
   - `vrushabhm/portfolio-backend:BUILD_NUMBER`
4. Jenkins SSHs into EC2 `i-00efc8195ddaca37a` and redeploys containers
5. Kubernetes manifests applied on minikube
6. Health check verifies deployment
7. Build info saved to S3: `s3://portfolio-devops-artifacts-968138089440/builds/`

---

## Where Data Is Stored

| Data | Storage | How to Access |
|------|---------|---------------|
| Contact form submissions | MongoDB container | `docker exec -it portfolio-mongodb mongosh -u admin -p password123 --authenticationDatabase admin` then `use portfolio; db.contacts.find()` |
| Projects | MongoDB `portfolio.projects` | Same as above |
| Skills | MongoDB `portfolio.skills` | Same as above |
| Resume PDF | AWS S3 | `aws s3 ls s3://portfolio-devops-artifacts-968138089440/resume/` |
| Build artifacts | AWS S3 | `aws s3 ls s3://portfolio-devops-artifacts-968138089440/builds/` |
| Terraform state | AWS S3 | `aws s3 ls s3://portfolio-devops-artifacts-968138089440/terraform/` |
| Container metrics | Prometheus + Grafana | `http://EC2_IP:3001` |

---

## View Build History in S3

```bash
# List all builds
aws s3 ls s3://portfolio-devops-artifacts-968138089440/builds/ --region us-east-1

# View latest build info
aws s3 cp s3://portfolio-devops-artifacts-968138089440/builds/latest.json - --region us-east-1
```

---

## Kubernetes Commands (on EC2)

```bash
kubectl get pods -n portfolio
kubectl get svc -n portfolio
kubectl get deployments -n portfolio
kubectl logs -f deployment/backend -n portfolio
kubectl describe pod -n portfolio
```

---

## Monitoring

- **Grafana:** `http://EC2_IP:3001` -> Login: admin/admin123 -> Dashboard: "Portfolio DevOps"
- **Prometheus:** `http://EC2_IP:9090` -> Status -> Targets
- **Metrics:** CPU, memory, container health, pod status, API uptime, heap usage

---

## DevOps Tools Summary

| Tool | Purpose | Where to See |
|------|---------|--------------|
| Git + GitHub | Source control + webhooks | https://github.com/VrushabhMK/portfolio-devops |
| Docker | Containerization | `docker ps` on EC2 |
| Docker Hub | Image registry | https://hub.docker.com/u/vrushabhm |
| Jenkins | CI/CD automation | `http://EC2_IP:8080` |
| Kubernetes (minikube) | Orchestration | `kubectl get pods -n portfolio` |
| Terraform | AWS infra as code | `terraform output` |
| Ansible | EC2 config management | `ansible-playbook` |
| AWS EC2 | Cloud hosting | Instance: i-00efc8195ddaca37a |
| AWS S3 | Artifact + state storage | `portfolio-devops-artifacts-968138089440` |
| Prometheus + Grafana | Monitoring | `http://EC2_IP:3001` |
