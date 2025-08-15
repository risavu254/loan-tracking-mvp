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

// ✅ Export for use in dashboard files
window.fastAuth = {
  quickSessionCheck
}; 