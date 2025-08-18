@echo off
echo 🚀 Deploying to Firebase Hosting...
echo.

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Firebase CLI not found. Installing...
    npm install -g firebase-tools
    if errorlevel 1 (
        echo ❌ Failed to install Firebase CLI
        pause
        exit /b 1
    )
)

REM Login to Firebase (if not already logged in)
echo 🔐 Checking Firebase login status...
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo 🔐 Logging into Firebase...
    firebase login
    if errorlevel 1 (
        echo ❌ Firebase login failed
        pause
        exit /b 1
    )
)

REM Deploy to Firebase
echo 🚀 Deploying to Firebase Hosting...
firebase deploy --only hosting

if errorlevel 1 (
    echo ❌ Deployment failed
    pause
    exit /b 1
) else (
    echo ✅ Deployment successful!
    echo 🌐 Your app is now live on Firebase Hosting
    echo 📍 URL: https://loan-tracking-system-7c607.web.app
    echo 📍 URL: https://loan-tracking-system-7c607.firebaseapp.com
)

pause 