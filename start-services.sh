#!/bin/bash
set -e

PUBLIC_IP="3.24.101.251"
echo "=== Installing Unzip & Nginx ==="
sudo dnf install -y unzip nginx

echo "=== Extracting code archive ==="
rm -rf /home/ec2-user/portfolio
mkdir -p /home/ec2-user/portfolio
unzip -o /home/ec2-user/portfolio.zip -d /home/ec2-user/portfolio

echo "=== Writing environment file ==="
cat > /home/ec2-user/portfolio/.env << EOF
VITE_API_URL=http://${PUBLIC_IP}/api
FRONTEND_URL=http://${PUBLIC_IP}
MONGODB_URI=mongodb://admin:password123@mongodb:27017/portfolio?authSource=admin
JWT_SECRET=portfolio-devops-jwt-secret-968138089440
JWT_EXPIRE=7d
NODE_ENV=production
EOF

# Write configuration file in Nginx's conf.d folder for Amazon Linux 2023
sudo tee /etc/nginx/conf.d/portfolio.conf > /dev/null << NGINXEOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }

    location /jenkins/ {
        proxy_pass http://127.0.0.1:8080/jenkins/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 90;
    }

    location /github-webhook/ {
        proxy_pass http://127.0.0.1:8080/jenkins/github-webhook/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }

    location /grafana/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }

    location /prometheus/ {
        proxy_pass http://127.0.0.1:9090/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }

    location /cadvisor/ {
        proxy_pass http://127.0.0.1:8081;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }

    location /node-exporter {
        proxy_pass http://127.0.0.1:9100/metrics;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
NGINXEOF

# Enable Nginx starting on boot and run Nginx
echo "=== Restarting Nginx ==="
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "=== Starting Docker Compose Stack ==="
cd /home/ec2-user/portfolio
# Build and start services in detached mode
docker compose up -d --build

echo "=== Verification ==="
docker compose ps
echo "Deployment successful! Open http://${PUBLIC_IP} to access the website."
