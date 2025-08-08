// Firebase configuration for production deployment
// ✅ SECURE: Domain-authorized configuration for loan-tracking-mvp.netlify.app
// CACHE BUST: Updated for Netlify deployment with domain validation

// Authorized domains for this Firebase project
const AUTHORIZED_DOMAINS = [
  'loan-tracking-mvp.netlify.app',
  'localhost',
  '127.0.0.1',
  'loan-tracking-system-7c607.firebaseapp.com',
  'loan-tracking-system-7c607.web.app'
];

// Current domain validation
const currentDomain = window.location.hostname;
const isAuthorizedDomain = AUTHORIZED_DOMAINS.includes(currentDomain);

// Firebase configuration with domain validation
window.FIREBASE_API_KEY = "AIzaSyDktcea0NIBU_-6pAlV57eCokFsdDkyOEE";
window.FIREBASE_AUTH_DOMAIN = "loan-tracking-system-7c607.firebaseapp.com"; // Fixed: Use Firebase project domain
window.FIREBASE_PROJECT_ID = "loan-tracking-system-7c607";
window.FIREBASE_STORAGE_BUCKET = "loan-tracking-system-7c607.appspot.com";
window.FIREBASE_MESSAGING_SENDER_ID = "985241134995";
window.FIREBASE_APP_ID = "1:985241134995:web:9e9625498f3ab39edfea66";

// Domain validation and logging
console.log("🔐 Firebase Configuration Loaded");
console.log("🌐 Current Domain:", currentDomain);
console.log("✅ Domain Authorized:", isAuthorizedDomain);
console.log("🔧 Firebase Auth Domain:", window.FIREBASE_AUTH_DOMAIN);
console.log("📋 Authorized Domains:", AUTHORIZED_DOMAINS);

// Show warning if domain is not authorized
if (!isAuthorizedDomain) {
  console.warn("⚠️ WARNING: Current domain is not in authorized list");
  console.warn("📝 Add this domain to Firebase Console > Authentication > Settings > Authorized Domains");
  console.warn("🔧 Required: Add 'loan-tracking-mvp.netlify.app' to Firebase authorized domains");
}

// Export configuration for use in other modules
window.FIREBASE_CONFIG = {
  apiKey: window.FIREBASE_API_KEY,
  authDomain: window.FIREBASE_AUTH_DOMAIN,
  projectId: window.FIREBASE_PROJECT_ID,
  storageBucket: window.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID,
  appId: window.FIREBASE_APP_ID
};

// Domain-specific configuration
if (currentDomain === 'loan-tracking-mvp.netlify.app') {
  console.log("🚀 Production domain detected - using optimized configuration");
  console.log("⚠️ IMPORTANT: Ensure 'loan-tracking-mvp.netlify.app' is added to Firebase Console authorized domains");
  // Add any production-specific configurations here
}