@echo off
echo ========================================
echo Firebase Hosting Deployment & Test
echo ========================================
echo.

echo [1/6] Checking Firebase CLI...
firebase --version
if %errorlevel% neq 0 (
    echo ERROR: Firebase CLI not found. Please install it first.
    echo Run: npm install -g firebase-tools
    pause
    exit /b 1
)

echo.
echo [2/6] Deploying to Firebase Hosting...
firebase deploy --only hosting

echo.
echo [3/6] Deployment complete!
echo.
echo [4/6] Testing URLs:
echo.
echo Main site: https://loan-tracking-system-7c607.web.app
echo Debug login: https://loan-tracking-system-7c607.web.app/debug-login.html
echo.
echo [5/6] Testing Instructions:
echo.
echo 1. Open the main site URL
echo 2. Should redirect to login page
echo 3. Login with your credentials
echo 4. Should redirect to dashboard (dash3.html)
echo 5. If issues, check debug-login.html for detailed logs
echo.
echo [6/6] Troubleshooting:
echo.
echo If login redirects back to login page:
echo 1. Open browser developer tools (F12)
echo 2. Check Console tab for error messages
echo 3. Check Application tab > Session Storage
echo 4. Clear browser cache and cookies
echo 5. Try incognito mode
echo.
echo For detailed debugging, visit: debug-login.html
echo.
pause 