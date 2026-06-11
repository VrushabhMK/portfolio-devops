# GitHub → Jenkins Webhook Setup

This guide explains how to connect your GitHub repository to Jenkins so every `git push` automatically triggers a pipeline build.

## Prerequisites

- Jenkins is running at `http://3.24.101.251/jenkins/` (via Nginx reverse proxy on port 80)
- GitHub repo: `https://github.com/VrushabhMK/portfolio-devops`
- The **GitHub Integration Plugin** and **GitHub plugin** are installed in Jenkins

---

## Step 1: Install Required Jenkins Plugins

1. Open Jenkins at `http://3.24.101.251/jenkins/`
2. Go to **Manage Jenkins → Plugins → Available plugins**
3. Search and install (if not already installed):
   - ✅ **GitHub plugin**
   - ✅ **GitHub Integration Plugin**
   - ✅ **Pipeline**
   - ✅ **Git plugin**
4. Restart Jenkins after install

---

## Step 2: Configure Jenkins GitHub Server

1. Go to **Manage Jenkins → System**
2. Scroll to **GitHub** section
3. Click **Add GitHub Server**
4. Set:
   - **Name:** `github`
   - **API URL:** `https://api.github.com`
   - **Credentials:** Add a GitHub Personal Access Token (PAT) with `repo` and `admin:repo_hook` scopes
5. Click **Test connection** — you should see `Credentials verified for user VrushabhMK`
6. ✅ Check **Manage hooks** (this auto-creates the webhook)
7. Click **Save**

---

## Step 3: Create Jenkins Pipeline Job

1. Click **New Item → Pipeline**
2. Name it: `portfolio-devops`
3. Under **Build Triggers**, check:
   - ✅ **GitHub hook trigger for GITScm polling**
4. Under **Pipeline → Definition**, select **Pipeline script from SCM**:
   - SCM: **Git**
   - Repository URL: `https://github.com/VrushabhMK/portfolio-devops.git`
   - Branch: `*/main`
   - Script Path: `jenkins/Jenkinsfile`
5. Click **Save**

---

## Step 4: Add GitHub Webhook (Manual)

If Jenkins couldn't auto-create the hook, add it manually:

1. Go to your GitHub repo: `https://github.com/VrushabhMK/portfolio-devops`
2. Click **Settings → Webhooks → Add webhook**
3. Set:
   - **Payload URL:** `http://3.24.101.251/github-webhook/`
   - **Content type:** `application/json`
   - **Secret:** *(leave empty or add a secret string — store it in Jenkins as `github-webhook-secret`)*
   - **Which events?** Select **Just the push event**
4. Click **Add webhook**
5. GitHub will send a test ping — look for a green ✅ checkmark

---

## Step 5: Add Jenkins Credentials

Go to **Manage Jenkins → Credentials → (global)** and add:

| ID | Type | Details |
|---|---|---|
| `docker-hub-credentials` | Username with password | DockerHub user: `vrushabh131204`, token/password |
| `ec2-ssh-key` | SSH Username with private key | User: `ec2-user`, paste contents of `portfolio.pem` |
| `jwt-secret` | Secret text | Any secure random string e.g. `portfolio-devops-jwt-secret-968138089440` |

---

## Step 6: Test the Pipeline

1. Make any change to the repo and push:
   ```bash
   git add .
   git commit -m "test: trigger Jenkins webhook"
   git push origin main
   ```
2. In Jenkins, watch the `portfolio-devops` pipeline trigger automatically
3. All stages should pass and the site will be live at `http://3.24.101.251`

---

## Webhook Endpoint Reference

| URL | Purpose |
|---|---|
| `http://3.24.101.251/` | Portfolio Website |
| `http://3.24.101.251/api/health` | Backend Health Check |
| `http://3.24.101.251/jenkins/` | Jenkins CI/CD |
| `http://3.24.101.251/github-webhook/` | GitHub Webhook Receiver |
| `http://3.24.101.251/grafana/` | Grafana Monitoring |
| `http://3.24.101.251/prometheus/` | Prometheus Metrics |
| `http://3.24.101.251/cadvisor/` | cAdvisor Container Metrics |

---

## Troubleshooting

**Webhook 302/404 from GitHub?**
- Ensure Nginx is running: `sudo systemctl status nginx`
- Check the proxy config: `cat /etc/nginx/conf.d/portfolio.conf`
- Ensure Jenkins is running with prefix `/jenkins`: `docker ps | grep jenkins`

**Jenkins not triggering?**
- Go to the Jenkins job → **GitHub Hook Log** to see incoming pings
- Check Jenkins system log: **Manage Jenkins → System Log**

**SSH deploy fails?**
- Make sure the `ec2-ssh-key` credential has the exact content of `portfolio.pem`
- The EC2 security group must allow SSH (port 22) from the Jenkins server IP
