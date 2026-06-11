@echo off
cd /d "%~dp0"
echo ===================================================
echo     AUTO DEPLOYING PORTFOLIO TO AWS EC2
echo ===================================================
echo.

echo [1/4] Archiving codebase...
git add . 2>nul
git commit -m "automated deployment push" 2>nul
git archive --format=zip HEAD -o ../portfolio.zip

echo [2/4] Uploading archive to EC2 (54.79.77.37)...
scp -i D:\ML\portfolio.pem -o StrictHostKeyChecking=no ../portfolio.zip ec2-user@54.79.77.37:/home/ec2-user/portfolio.zip

echo [3/4] Uploading start script to EC2...
scp -i D:\ML\portfolio.pem -o StrictHostKeyChecking=no start-services.sh ec2-user@54.79.77.37:/tmp/start-services.sh

echo [4/4] Extracting and starting Docker Compose containers on EC2...
ssh -i D:\ML\portfolio.pem -o StrictHostKeyChecking=no ec2-user@54.79.77.37 "bash /tmp/start-services.sh"

echo.
echo ===================================================
echo DEPLOYMENT COMPLETE!
echo Access your live site at: http://54.79.77.37
echo ===================================================
echo.
pause
