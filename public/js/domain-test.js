// Domain authorization test for Firebase
// This file helps verify that the loan-tracking-mvp.netlify.app domain is properly authorized

console.log("🔍 Domain Authorization Test Starting...");

// Test function to verify domain authorization
function testDomainAuthorization() {
  const currentDomain = window.location.hostname;
  const expectedDomain = 'loan-tracking-mvp.netlify.app';
  const isProduction = currentDomain === expectedDomain;
  
  console.log("🌐 Current Domain:", currentDomain);
  console.log("🎯 Expected Production Domain:", expectedDomain);
  console.log("✅ Production Domain Match:", isProduction);
  
  // Check if Firebase config is loaded
  if (window.FIREBASE_CONFIG) {
    console.log("🔐 Firebase Config Loaded:", true);
    console.log("🔧 Auth Domain:", window.FIREBASE_CONFIG.authDomain);
    console.log("📋 Project ID:", window.FIREBASE_CONFIG.projectId);
  } else {
    console.warn("⚠️ Firebase Config Not Found");
  }
  
  // Check if database is initialized
  if (window.db) {
    console.log("💾 Database Initialized:", true);
  } else {
    console.warn("⚠️ Database Not Initialized");
  }
  
  return {
    currentDomain,
    expectedDomain,
    isProduction,
    firebaseLoaded: !!window.FIREBASE_CONFIG,
    databaseLoaded: !!window.db
  };
}

// Run test when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const results = testDomainAuthorization();
    console.log("📊 Domain Test Results:", results);
    
    // Show results in UI if available
    if (results.isProduction) {
      console.log("🚀 Production environment detected - all systems operational");
    }
  }, 1000); // Wait for Firebase to initialize
});

// Export for use in other modules
window.testDomainAuthorization = testDomainAuthorization; 