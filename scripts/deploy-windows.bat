@echo off
echo ========================================
echo Firebase Hosting Deployment Script
echo ========================================

echo.
echo Checking Firebase CLI...
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Firebase CLI not found!
    echo Please install Node.js and Firebase CLI first:
    echo 1. Install Node.js from https://nodejs.org/
    echo 2. Run: npm install -g firebase-tools
    echo 3. Run: firebase login
    pause
    exit /b 1
)

echo Firebase CLI found!

echo.
echo Checking login status...
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo Please login to Firebase first:
    firebase login
    if %errorlevel% neq 0 (
        echo Login failed!
        pause
        exit /b 1
    )
)

echo.
echo Deploying to Firebase Hosting...
firebase deploy --only hosting

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo DEPLOYMENT SUCCESSFUL!
    echo ========================================
    echo.
    echo Your site is now live at:
    echo https://loan-tracking-system-7c607.web.app
    echo https://loan-tracking-system-7c607.firebaseapp.com
    echo.
    echo Next steps:
    echo 1. Add these domains to Firebase Console > Authentication > Settings > Authorized domains
    echo 2. Test your application on the hosted domain
    echo 3. Update your code to use the hosted domain for production
    echo.
) else (
    echo.
    echo ========================================
    echo DEPLOYMENT FAILED!
    echo ========================================
    echo Please check the error messages above.
)

pause 