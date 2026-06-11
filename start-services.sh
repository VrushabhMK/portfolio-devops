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
        if (\$request_method = GET) {
            add_header Content-Type text/html;
            return 200 "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>GitHub Webhook Receiver</title><link href='https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap' rel='stylesheet'><style>body{margin:0;padding:0;font-family:'Outfit',sans-serif;background:radial-gradient(circle at center,#1e1b4b,#0f172a);color:#f8fafc;display:flex;justify-content:center;align-items:center;height:100vh;overflow:hidden}.card{background:rgba(30,41,59,0.7);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:40px;max-width:500px;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,0.4);animation:fadeIn 0.8s ease-out}h1{background:linear-gradient(135deg,#38bdf8,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-top:0;font-size:28px}p{color:#94a3b8;font-size:16px;line-height:1.6}.code{background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.05);padding:12px;border-radius:12px;font-family:monospace;color:#38bdf8;font-size:14px;word-break:break-all;margin:20px 0}.badge{background:rgba(34,197,94,0.2);color:#4ade80;border:1px solid rgba(74,222,128,0.3);padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600;display:inline-block;margin-bottom:20px}@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}</style></head><body><div class='card'><div class='badge'>Receiver Online</div><h1>GitHub Webhook Receiver</h1><p>This endpoint is active and listening for automated push events from GitHub to trigger the CI/CD pipeline.</p><p>To use this, configure the URL below as a Webhook in your GitHub Repository settings (Settings &rarr; Webhooks):</p><div class='code'>http://${PUBLIC_IP}/github-webhook/</div><p style='font-size:12px;color:#64748b;'>Note: Accessing this endpoint directly in the browser via GET requests does not trigger builds.</p></div></body></html>";
        }
        proxy_pass http://127.0.0.1:8080/jenkins/github-webhook/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }

    location /grafana/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }

    location /prometheus/ {
        proxy_pass http://127.0.0.1:9090;
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
# Stop and remove existing standalone containers to avoid name conflicts
docker stop portfolio-frontend portfolio-backend portfolio-mongodb 2>/dev/null || true
docker rm portfolio-frontend portfolio-backend portfolio-mongodb 2>/dev/null || true
# Build and start services in detached mode
docker compose up -d --build

echo "=== Verification ==="
docker compose ps
echo "Deployment successful! Open http://${PUBLIC_IP} to access the website."
