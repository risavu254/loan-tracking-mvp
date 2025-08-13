#!/bin/bash

echo "🚀 Deploying to Firebase Hosting..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Deploy to Firebase
echo "📤 Deploying..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is now live on:"
    echo "   https://loan-tracking-system-7c607.web.app"
    echo "   https://loan-tracking-system-7c607.firebaseapp.com"
else
    echo "❌ Deployment failed"
    exit 1
fi 