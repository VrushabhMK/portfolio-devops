#!/bin/bash
# EC2 User Data - Portfolio DevOps
# Instance: i-00efc8195ddaca37a | Account: 968138089440

set -euxo pipefail
exec > /var/log/user-data.log 2>&1

echo "=== EC2 setup started at $(date) ==="

apt-get update -y
apt-get upgrade -y
apt-get install -y curl wget git unzip nginx python3-pip

# Docker
curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
sh /tmp/get-docker.sh
usermod -aG docker ubuntu
systemctl enable docker
systemctl start docker

# Docker Compose plugin
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
install minikube-linux-amd64 /usr/local/bin/minikube

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o /tmp/awscliv2.zip
unzip -o /tmp/awscliv2.zip -d /tmp
/tmp/aws/install

# Clone repo
mkdir -p /opt/portfolio
git clone https://github.com/VrushabhMK/portfolio-devops.git /opt/portfolio
chown -R ubuntu:ubuntu /opt/portfolio

# Jenkins in Docker
docker run -d \
  --name jenkins \
  --restart unless-stopped \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /usr/local/bin/docker:/usr/local/bin/docker \
  -v /usr/local/bin/kubectl:/usr/local/bin/kubectl \
  jenkins/jenkins:lts

# Start minikube
sleep 15
su - ubuntu -c "minikube start --driver=docker --memory=2048 --cpus=2" || true
su - ubuntu -c "kubectl apply -f /opt/portfolio/kubernetes/namespace.yaml" || true

# Start monitoring
cd /opt/portfolio
su - ubuntu -c "cd /opt/portfolio && docker compose up -d prometheus grafana node-exporter cadvisor" || true

# Nginx reverse proxy
cat > /etc/nginx/sites-available/portfolio << 'NGINX'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx
systemctl enable nginx

PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "=== Setup complete at $(date) ==="
echo "Jenkins initial password:"
sleep 30 && docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword || true
echo "Portfolio:  http://${PUBLIC_IP}:3000"
echo "API:        http://${PUBLIC_IP}:5000/api/health"
echo "Jenkins:    http://${PUBLIC_IP}:8080"
echo "Grafana:    http://${PUBLIC_IP}:3001"
echo "Prometheus: http://${PUBLIC_IP}:9090"
