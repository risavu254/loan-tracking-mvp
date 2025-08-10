// ✅ Authentication Middleware for Dashboard Security
// Uses enhanced Firebase configuration with domain handling

// ✅ Import Firebase functions
import { 
  getAuth, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// ✅ Firebase Configuration
const firebaseConfig = window.FIREBASE_CONFIG;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Authentication State Management
let currentUser = null;
let isAuthenticated = false;
let authInitialized = false;

// ✅ Session Storage Keys
const SESSION_KEY = 'dashboard_session';
const AUTH_TIMESTAMP = 'auth_timestamp';
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

// ✅ Fast Authentication Check Function
function checkAuthentication() {
  return new Promise((resolve) => {
    // Very short timeout - 1.5 seconds max
    const timeout = setTimeout(() => {
      console.warn('Authentication check timed out, redirecting to login');
      clearSession();
      window.location.href = 'login.html?message=timeout';
      resolve(false);
    }, 1500); // 1.5 second timeout

    // First, check session storage immediately
    const session = sessionStorage.getItem(SESSION_KEY);
    const timestamp = sessionStorage.getItem(AUTH_TIMESTAMP);
    
    if (session && timestamp) {
      const sessionAge = Date.now() - parseInt(timestamp);
      if (sessionAge < SESSION_DURATION) {
        // Session is valid - use it immediately
        currentUser = JSON.parse(session);
        isAuthenticated = true;
        authInitialized = true;
        clearTimeout(timeout);
        resolve(true);
        return;
      } else {
        // Session expired, clear it
        clearSession();
      }
    }

    // Use enhanced auth state check if available
    if (window.firebaseConfig) {
      window.firebaseConfig.enhancedAuthStateCheck().then((result) => {
        clearTimeout(timeout);
        
        if (result.authenticated) {
          currentUser = result.user;
          isAuthenticated = true;
          authInitialized = true;
          
          // Store session
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
          sessionStorage.setItem(AUTH_TIMESTAMP, Date.now().toString());
          if (result.mode === 'local') {
            sessionStorage.setItem('local_dev_mode', 'true');
          }
          
          resolve(true);
        } else {
          currentUser = null;
          isAuthenticated = false;
          authInitialized = true;
          clearSession();
          resolve(false);
        }
      }).catch((error) => {
        console.error('Enhanced auth check error:', error);
        clearTimeout(timeout);
        clearSession();
        resolve(false);
      });
    } else {
      // Fallback to basic session check
      clearTimeout(timeout);
      resolve(false);
    }
  });
}

// ✅ Session Management
function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(AUTH_TIMESTAMP);
  currentUser = null;
  isAuthenticated = false;
}

function getCurrentUser() {
  return currentUser;
}

function isUserAuthenticated() {
  return isAuthenticated;
}

// ✅ Login Function
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    currentUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email,
      photoURL: user.photoURL
    };
    isAuthenticated = true;
    
    // Store session
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    sessionStorage.setItem(AUTH_TIMESTAMP, Date.now().toString());
    
    return { success: true, user: currentUser };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: error.message,
      code: error.code 
    };
  }
}

// ✅ Logout Function
async function logoutUser() {
  try {
    // Use enhanced logout if available
    if (window.firebaseConfig) {
      return await window.firebaseConfig.enhancedLogout();
    } else {
      // Fallback logout
      clearSession();
      return { success: true };
    }
  } catch (error) {
    console.error('Logout error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// ✅ Fast Route Protection
function protectRoute() {
  return new Promise(async (resolve) => {
    try {
      // Hide loading screen immediately - no authentication checking needed
      const loadingScreen = document.getElementById('loadingScreen');
      if (loadingScreen) {
        loadingScreen.style.display = 'none';
      }

      // Quick session check first
      const session = sessionStorage.getItem(SESSION_KEY);
      const timestamp = sessionStorage.getItem(AUTH_TIMESTAMP);
      
      if (session && timestamp) {
        const sessionAge = Date.now() - parseInt(timestamp);
        if (sessionAge < SESSION_DURATION) {
          // Valid session - proceed immediately
          currentUser = JSON.parse(session);
          isAuthenticated = true;
          resolve(true);
          return;
        }
      }

      // If no valid session, redirect to login immediately (no checking)
      window.location.href = 'login.html';
      resolve(false);
    } catch (error) {
      console.error('Route protection error:', error);
      // Fallback: redirect to login
      window.location.href = 'login.html?message=error';
      resolve(false);
    }
  });
}

// ✅ Auto-logout on inactivity
function setupInactivityLogout() {
  let inactivityTimer;
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  function resetTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      if (isAuthenticated) {
        logoutUser().then(() => {
          window.location.href = 'login.html?message=inactivity';
        });
      }
    }, INACTIVITY_TIMEOUT);
  }

  // Reset timer on user activity
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
  events.forEach(event => {
    document.addEventListener(event, resetTimer, true);
  });

  // Start the timer
  resetTimer();
}

// ✅ Session refresh on page focus
function setupSessionRefresh() {
  window.addEventListener('focus', async () => {
    if (isAuthenticated) {
      const timestamp = sessionStorage.getItem(AUTH_TIMESTAMP);
      if (timestamp) {
        const sessionAge = Date.now() - parseInt(timestamp);
        if (sessionAge < SESSION_DURATION) {
          // Refresh timestamp
          sessionStorage.setItem(AUTH_TIMESTAMP, Date.now().toString());
        } else {
          // Session expired, logout
          await logoutUser();
          window.location.href = 'login.html?message=expired';
        }
      }
    }
  });
}

// ✅ Export functions for use in other files
window.authMiddleware = {
  checkAuthentication,
  protectRoute,
  loginUser,
  logoutUser,
  getCurrentUser,
  isUserAuthenticated,
  setupInactivityLogout,
  setupSessionRefresh,
  clearSession
};

// ✅ Initialize authentication when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  // Hide loading screen immediately
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    loadingScreen.style.display = 'none';
  }

  // Check if we're on a protected page
  const currentPage = window.location.pathname.split('/').pop();
  const protectedPages = ['dash3.html'];
  
  if (protectedPages.includes(currentPage)) {
    try {
      const isProtected = await protectRoute();
      if (isProtected) {
        // Setup inactivity logout and session refresh
        setupInactivityLogout();
        setupSessionRefresh();
        
        // Add logout button to dashboard if it exists
        const headerButtons = document.querySelector('.header-buttons');
        if (headerButtons && !document.getElementById('logoutBtn')) {
          const logoutBtn = document.createElement('button');
          logoutBtn.id = 'logoutBtn';
          logoutBtn.className = 'btn text-white';
          logoutBtn.title = 'Logout';
          logoutBtn.innerHTML = '<i class="bi bi-box-arrow-right fs-5"></i>';
          logoutBtn.onclick = async () => {
            const result = await logoutUser();
            if (result.success) {
              window.location.href = 'login.html';
            }
          };
          headerButtons.appendChild(logoutBtn);
        }
      }
    } catch (error) {
      console.error('Authentication initialization error:', error);
      // Fallback: redirect to login
      window.location.href = 'login.html?message=init_error';
    }
  }
});

// ✅ Handle authentication state changes (only for production)
const currentDomain = window.location.hostname;
const isLocalDev = currentDomain === 'localhost' || currentDomain === '127.0.0.1';

if (!isLocalDev) {
  onAuthStateChanged(auth, (user) => {
    if (!user && isAuthenticated) {
      // User was logged out (e.g., from another tab)
      clearSession();
      if (!window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html?message=logged_out';
      }
    }
  });
}

// ✅ Force hide loading screen after 2 seconds as fallback
setTimeout(() => {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    loadingScreen.style.display = 'none';
  }
}, 2000); 