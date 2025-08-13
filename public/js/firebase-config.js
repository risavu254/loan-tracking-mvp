// Firebase configuration for production deployment
// ✅ SECURE: Domain-authorized configuration for loan-tracking-mvp.netlify.app
// CACHE BUST: Updated for Netlify deployment with domain validation

// Authorized domains for this Firebase project
const AUTHORIZED_DOMAINS = [
  'loan-tracking-system-7c607.web.app',
  'loan-tracking-system-7c607.firebaseapp.com',
  'loan-tracking-mvp.netlify.app', // ✅ ADDED: Your Netlify domain
  'localhost',
  '127.0.0.1'
];

// Netlify preview URL pattern
const NETLIFY_PREVIEW_PATTERN = /^[a-f0-9]{12}--[a-zA-Z0-9-]+\.netlify\.app$/;

// Current domain validation
const currentDomain = window.location.hostname;
const isAuthorizedDomain = AUTHORIZED_DOMAINS.includes(currentDomain) || NETLIFY_PREVIEW_PATTERN.test(currentDomain);

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
  console.warn("🔧 For Netlify preview URLs, add the specific preview domain or use wildcard pattern");
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

// Provide lowercase alias for legacy code paths
window.firebaseConfig = window.FIREBASE_CONFIG;

// Domain-specific configuration
if (currentDomain === 'loan-tracking-system-7c607.web.app' || currentDomain === 'loan-tracking-system-7c607.firebaseapp.com') {
  console.log("🚀 Production domain detected - using optimized configuration");
  console.log("✅ Firebase hosting domain - all features enabled");
  // Add any production-specific configurations here
} else if (NETLIFY_PREVIEW_PATTERN.test(currentDomain)) {
  console.log("🔧 Netlify preview domain detected:", currentDomain);
  console.log("⚠️ IMPORTANT: Add this preview domain to Firebase Console authorized domains");
  console.log("📝 Or add wildcard pattern: *.netlify.app");
}

// ✅ Enhanced Sign-In Function (Missing Function Fix)
window.FIREBASE_CONFIG.enhancedSignIn = async function(email, password) {
  try {
    // Check domain authorization first
    const currentDomain = window.location.hostname;
    console.log("🔍 Attempting authentication for domain:", currentDomain);
    console.log("🔧 Firebase Auth Domain:", window.FIREBASE_AUTH_DOMAIN);
    
    // Import Firebase Auth functions
    const { initializeApp, getApp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
    const { getAuth, signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js");
    
    // Initialize Firebase if not already done
    let app;
    try {
      app = initializeApp(window.FIREBASE_CONFIG);
      console.log("✅ Firebase initialized successfully");
    } catch (error) {
      if (error.code !== 'app/duplicate-app') {
        console.error("❌ Firebase initialization error:", error);
        throw error;
      }
      // App already initialized, get existing app
      app = getApp();
      console.log("✅ Using existing Firebase app");
    }
    
    const auth = getAuth(app);
    console.log("🔐 Auth object created, attempting sign in...");
    
    // Attempt sign in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Authentication successful");
    
    // Before: Storing full Firebase user object
    // sessionStorage.setItem('dashboard_session', JSON.stringify(userCredential.user));

    // After: Storing simplified session data
    const sessionData = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName || userCredential.user.email.split('@')[0]
    };
    sessionStorage.setItem('dashboard_session', JSON.stringify(sessionData));

    return {
      success: true,
      user: userCredential.user,
      mode: currentDomain === 'localhost' || currentDomain === '127.0.0.1' ? 'local' : 'production'
    };
    
  } catch (error) {
    console.error("❌ Authentication error:", error);
    console.error("🔍 Error details:", {
      code: error.code,
      message: error.message,
      domain: window.location.hostname,
      authDomain: window.FIREBASE_AUTH_DOMAIN
    });
    
    // Handle specific error types
    let errorMessage = "Authentication failed";
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = "User not found. Please check your email.";
        break;
      case 'auth/wrong-password':
        errorMessage = "Incorrect password. Please try again.";
        break;
      case 'auth/invalid-email':
        errorMessage = "Invalid email address.";
        break;
      case 'auth/too-many-requests':
        errorMessage = "Too many failed attempts. Please try again later.";
        break;
      case 'auth/network-request-failed':
        errorMessage = "Network error. Please check your connection.";
        break;
      case 'auth/unauthorized-domain':
        if (NETLIFY_PREVIEW_PATTERN.test(currentDomain)) {
          errorMessage = `Domain not authorized. Please add '${currentDomain}' to Firebase Console authorized domains.`;
          console.error("🚨 NETLIFY PREVIEW DOMAIN AUTHORIZATION ERROR:");
          console.error("📝 Go to Firebase Console > Authentication > Settings > Authorized Domains");
          console.error("📝 Add: " + currentDomain);
          console.error("📝 Or add wildcard pattern: *.netlify.app");
        } else {
          errorMessage = "Domain not authorized. Please add this domain to Firebase Console authorized domains.";
          console.error("🚨 DOMAIN AUTHORIZATION ERROR:");
          console.error("📝 Go to Firebase Console > Authentication > Settings > Authorized Domains");
          console.error("📝 Add: " + currentDomain);
        }
        break;
      default:
        errorMessage = error.message || "Authentication failed";
    }
    
    return {
      success: false,
      error: errorMessage,
      code: error.code
    };
  }
};

// ✅ Enhanced Auth State Check Function
window.FIREBASE_CONFIG.enhancedAuthStateCheck = async function() {
  try {
    const { initializeApp, getApp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
    const { getAuth, onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js");
    
    // Initialize Firebase if not already done
    let app;
    try {
      app = initializeApp(window.FIREBASE_CONFIG);
    } catch (error) {
      if (error.code !== 'app/duplicate-app') {
        throw error;
      }
      app = getApp();
    }
    
    const auth = getAuth(app);
    
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve({
          authenticated: !!user,
          user: user,
          mode: currentDomain === 'localhost' || currentDomain === '127.0.0.1' ? 'local' : 'production'
        });
      });
      
      // Timeout after 3 seconds
      setTimeout(() => {
        unsubscribe();
        resolve({
          authenticated: false,
          user: null,
          mode: 'timeout'
        });
      }, 3000);
    });
    
  } catch (error) {
    console.error("Auth state check error:", error);
    return {
      authenticated: false,
      user: null,
      mode: 'error'
    };
  }
};

// ✅ Enhanced Logout Function
window.FIREBASE_CONFIG.enhancedLogout = async function() {
  try {
    const { initializeApp, getApp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
    const { getAuth, signOut } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js");

    let app;
    try {
      app = initializeApp(window.FIREBASE_CONFIG);
    } catch (error) {
      app = getApp();
    }

    const auth = getAuth(app);
    await signOut(auth);

    // Clear any local session storage the app uses
    try {
      sessionStorage.removeItem('dashboard_session');
      sessionStorage.removeItem('auth_timestamp');
    } catch (_) {}

    return { success: true };
  } catch (error) {
    console.error('Enhanced logout error:', error);
    return { success: false, error: error.message };
  }
};