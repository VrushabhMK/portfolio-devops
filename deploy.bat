@echo off
cd /d "%~dp0"
echo ===================================================
echo     AUTO DEPLOYING PORTFOLIO TO AWS EC2
echo ===================================================
echo.

set /p commit_msg="Enter commit message [demo: change name to VMK]: "
if "%commit_msg%"=="" set commit_msg=demo: change name to VMK

echo.
echo [1/2] Adding and committing changes...
git add . 2>nul
git commit -m "%commit_msg%" 2>nul

echo.
echo [2/2] Pushing code to GitHub (Triggers Jenkins Webhook)...
git push origin main

echo.
echo ===================================================
echo GitHub push complete! Jenkins CI/CD pipeline started.
echo ===================================================
echo.

set /p run_manual="Do you want to run manual direct deployment too? (y/N): "
if /i "%run_manual%"=="y" (
    echo.
    echo [Manual] Archiving repository...
    git archive --format=zip HEAD -o ../portfolio.zip

    echo [Manual] Uploading archive to EC2 (3.24.101.251)...
    scp -i D:\ML\portfolio.pem -o StrictHostKeyChecking=no ../portfolio.zip ec2-user@3.24.101.251:/home/ec2-user/portfolio.zip

    echo [Manual] Uploading start script to EC2...
    scp -i D:\ML\portfolio.pem -o StrictHostKeyChecking=no start-services.sh ec2-user@3.24.101.251:/tmp/start-services.sh

    echo [Manual] Fixing line endings and restarting services on EC2...
    ssh -i D:\ML\portfolio.pem -o StrictHostKeyChecking=no ec2-user@3.24.101.251 "sed -i 's/\r//' /tmp/start-services.sh && bash /tmp/start-services.sh"
    
    echo.
    echo ===================================================
    echo DIRECT MANUAL DEPLOYMENT COMPLETE!
    echo ===================================================
) else (
    echo.
    echo ===================================================
    echo CI/CD PIPELINE TRIGGERED SUCCESSFUL!
    echo ===================================================
    echo 1. Jenkins Build:   http://3.24.101.251/jenkins/job/portfolio-devops/
    echo 2. Grafana Metrics: http://3.24.101.251/grafana/
    echo 3. Live Site:        http://3.24.101.251
    echo ===================================================
)
echo.
pause
