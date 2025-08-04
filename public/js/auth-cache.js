// ✅ Authentication Cache Management
// This ensures fast, reliable authentication checks

// ✅ Cache Keys
const AUTH_CACHE_KEY = 'auth_cache_version';
const AUTH_CACHE_VERSION = '1.0.0';

// ✅ Cache Management
function clearAuthCache() {
  sessionStorage.removeItem('dashboard_session');
  sessionStorage.removeItem('auth_timestamp');
  sessionStorage.removeItem(AUTH_CACHE_KEY);
}

function setAuthCache(user) {
  sessionStorage.setItem('dashboard_session', JSON.stringify(user));
  sessionStorage.setItem('auth_timestamp', Date.now().toString());
  sessionStorage.setItem(AUTH_CACHE_KEY, AUTH_CACHE_VERSION);
}

function getAuthCache() {
  const cacheVersion = sessionStorage.getItem(AUTH_CACHE_KEY);
  if (cacheVersion !== AUTH_CACHE_VERSION) {
    clearAuthCache();
    return null;
  }
  
  const session = sessionStorage.getItem('dashboard_session');
  const timestamp = sessionStorage.getItem('auth_timestamp');
  
  if (session && timestamp) {
    const sessionAge = Date.now() - parseInt(timestamp);
    const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours
    
    if (sessionAge < SESSION_DURATION) {
      return JSON.parse(session);
    }
  }
  
  return null;
}

// ✅ Fast Authentication Check
function fastAuthCheck() {
  const cachedUser = getAuthCache();
  
  if (cachedUser) {
    return { valid: true, user: cachedUser };
  }
  
  return { valid: false };
}

// ✅ Export functions
window.authCache = {
  clearAuthCache,
  setAuthCache,
  getAuthCache,
  fastAuthCheck
};

// ✅ Auto-clear old cache on page load
document.addEventListener('DOMContentLoaded', () => {
  const cacheVersion = sessionStorage.getItem(AUTH_CACHE_KEY);
  if (cacheVersion && cacheVersion !== AUTH_CACHE_VERSION) {
    clearAuthCache();
  }
}); 