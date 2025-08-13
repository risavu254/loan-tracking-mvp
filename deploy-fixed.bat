@echo off
echo ========================================
echo Firebase Hosting Deployment Script
echo ========================================
echo.

echo [1/5] Checking Firebase CLI...
firebase --version
if %errorlevel% neq 0 (
    echo ERROR: Firebase CLI not found. Please install it first.
    echo Run: npm install -g firebase-tools
    pause
    exit /b 1
)

echo.
echo [2/5] Checking Firebase login status...
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo Please login to Firebase...
    firebase login
)

echo.
echo [3/5] Testing local development server...
echo Starting local server on http://localhost:5000
echo Press Ctrl+C to stop the server when done testing
echo.
firebase serve --only hosting

echo.
echo [4/5] Deploying to Firebase Hosting...
firebase deploy --only hosting

echo.
echo [5/5] Deployment complete!
echo.
echo Your app should be available at:
echo https://loan-tracking-system-7c607.web.app
echo.
echo If you see "Loading..." forever:
echo 1. Open browser developer tools (F12)
echo 2. Check Console tab for errors
echo 3. Clear browser cache and cookies
echo 4. Try incognito mode
echo.
echo For more help, see DEPLOYMENT_FIX_GUIDE.md
echo.
pause 