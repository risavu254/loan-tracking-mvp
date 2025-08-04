// ✅ Fast Authentication Utility
// This file optimizes dashboard loading speed

// ✅ Quick Session Check
function quickSessionCheck() {
  const session = sessionStorage.getItem('dashboard_session');
  const timestamp = sessionStorage.getItem('auth_timestamp');
  
  if (session && timestamp) {
    const sessionAge = Date.now() - parseInt(timestamp);
    const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours
    
    if (sessionAge < SESSION_DURATION) {
      return {
        valid: true,
        user: JSON.parse(session)
      };
    }
  }
  
  return { valid: false };
}

// ✅ Fast Route Protection
async function fastProtectRoute() {
  // Quick session check first
  const sessionCheck = quickSessionCheck();
  
  if (sessionCheck.valid) {
    // Valid session - proceed immediately
    return true;
  }
  
  // No valid session - redirect to login
  window.location.href = 'kamkoba-login.html';
  return false;
}

// ✅ Optimized Dashboard Initialization
function initializeDashboard() {
  // Hide loading screen immediately
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    loadingScreen.style.display = 'none';
  }
  
  // Show dashboard content immediately
  const dashboardContent = document.querySelector('.dashboard-content');
  if (dashboardContent) {
    dashboardContent.style.display = 'block';
  }
}

// ✅ Export for use in dashboard files
window.fastAuth = {
  quickSessionCheck,
  fastProtectRoute,
  initializeDashboard
};

// ✅ Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize dashboard immediately
  initializeDashboard();
  
  // Quick authentication check
  fastProtectRoute();
}); 