const fs = require('fs');
const path = require('path');

// Read environment variables
const env = process.env;

// Firebase configuration values
const firebaseConfig = {
  FIREBASE_API_KEY: env.FIREBASE_API_KEY || 'YOUR_API_KEY_HERE',
  FIREBASE_AUTH_DOMAIN: env.FIREBASE_AUTH_DOMAIN || 'loan-tracking-system-7c607.firebaseapp.com',
  FIREBASE_PROJECT_ID: env.FIREBASE_PROJECT_ID || 'loan-tracking-system-7c607',
  FIREBASE_STORAGE_BUCKET: env.FIREBASE_STORAGE_BUCKET || 'loan-tracking-system-7c607.appspot.com',
  FIREBASE_MESSAGING_SENDER_ID: env.FIREBASE_MESSAGING_SENDER_ID || '985241134995',
  FIREBASE_APP_ID: env.FIREBASE_APP_ID || '1:985241134995:web:9e9625498f3ab39edfea66'
};

// Create a config file that will be included in HTML
const configContent = `
// Auto-generated configuration file
window.FIREBASE_API_KEY = "${firebaseConfig.FIREBASE_API_KEY}";
window.FIREBASE_AUTH_DOMAIN = "${firebaseConfig.FIREBASE_AUTH_DOMAIN}";
window.FIREBASE_PROJECT_ID = "${firebaseConfig.FIREBASE_PROJECT_ID}";
window.FIREBASE_STORAGE_BUCKET = "${firebaseConfig.FIREBASE_STORAGE_BUCKET}";
window.FIREBASE_MESSAGING_SENDER_ID = "${firebaseConfig.FIREBASE_MESSAGING_SENDER_ID}";
window.FIREBASE_APP_ID = "${firebaseConfig.FIREBASE_APP_ID}";
`;

// Write the config file
fs.writeFileSync(path.join(__dirname, 'public/js/firebase-config.js'), configContent);

console.log('✅ Firebase configuration generated successfully');
console.log('📁 Config file: public/js/firebase-config.js'); 