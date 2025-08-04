// ✅ Environment Configuration
// This file handles environment variables for the application

const config = {
  // Firebase Configuration
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "loan-tracking-system-7c607.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "loan-tracking-system-7c607",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "loan-tracking-system-7c607.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "985241134995",
    appId: process.env.FIREBASE_APP_ID || "1:985241134995:web:9e9625498f3ab39edfea66"
  },
  
  // Application Settings
  app: {
    name: "DigiMashinani Loan System",
    version: "2.1.0",
    environment: process.env.NODE_ENV || "development"
  },
  
  // Security Settings
  security: {
    sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
    maxLoginAttempts: 5,
    passwordMinLength: 8
  }
};

// Export for use in other files
window.appConfig = config; 