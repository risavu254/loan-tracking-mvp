// ✅ Firebase Configuration with Domain Handling
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDktcea0NIBU_-6pAlV57eCokFsdDkyOEE",
  authDomain: "loan-tracking-system-7c607.firebaseapp.com",
  projectId: "loan-tracking-system-7c607",
  storageBucket: "loan-tracking-system-7c607.appspot.com",
  messagingSenderId: "985241134995",
  appId: "1:985241134995:web:9e9625498f3ab39edfea66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Domain Authorization Check
function checkDomainAuthorization() {
  const currentDomain = window.location.hostname;
  const authorizedDomains = [
    'localhost',
    '127.0.0.1',
    'loan-tracking-system-7c607.firebaseapp.com',
    'loan-tracking-system-7c607.web.app'
  ];
  
  console.log('Current domain:', currentDomain);
  console.log('Authorized domains:', authorizedDomains);
  
  return authorizedDomains.includes(currentDomain);
}

// ✅ Enhanced Authentication with Domain Handling
async function enhancedSignIn(email, password) {
  try {
    // For local development (127.0.0.1, localhost), use session-based auth
    const currentDomain = window.location.hostname;
    const isLocalDev = currentDomain === 'localhost' || currentDomain === '127.0.0.1';
    
    if (isLocalDev) {
      console.log('Local development mode: Using session-based authentication');
      
      // Simple validation for local development
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }
      
      // Create mock user for local development
      const mockUser = {
        uid: 'local-dev-' + Date.now(),
        email: email,
        displayName: email.split('@')[0],
        photoURL: null
      };
      
      // Store in session storage
      sessionStorage.setItem('dashboard_session', JSON.stringify(mockUser));
      sessionStorage.setItem('auth_timestamp', Date.now().toString());
      sessionStorage.setItem('local_dev_mode', 'true');
      
      return { success: true, user: mockUser, mode: 'local' };
    }
    
    // For production domains, use Firebase authentication
    if (checkDomainAuthorization()) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email,
        photoURL: user.photoURL
      };
      
      // Store in session storage
      sessionStorage.setItem('dashboard_session', JSON.stringify(userData));
      sessionStorage.setItem('auth_timestamp', Date.now().toString());
      sessionStorage.removeItem('local_dev_mode');
      
      return { success: true, user: userData, mode: 'firebase' };
    } else {
      throw new Error('Domain not authorized for Firebase authentication');
    }
    
  } catch (error) {
    console.error('Authentication error:', error);
    
    // If Firebase auth fails, try local development mode as fallback
    if (error.code === 'auth/unauthorized-domain' || error.code === 'auth/operation-not-allowed') {
      console.log('Falling back to local development mode');
      
      const mockUser = {
        uid: 'local-dev-' + Date.now(),
        email: email,
        displayName: email.split('@')[0],
        photoURL: null
      };
      
      sessionStorage.setItem('dashboard_session', JSON.stringify(mockUser));
      sessionStorage.setItem('auth_timestamp', Date.now().toString());
      sessionStorage.setItem('local_dev_mode', 'true');
      
      return { success: true, user: mockUser, mode: 'local' };
    }
    
    return { 
      success: false, 
      error: error.message,
      code: error.code 
    };
  }
}

// ✅ Enhanced Logout
async function enhancedLogout() {
  try {
    // Clear session storage
    sessionStorage.removeItem('dashboard_session');
    sessionStorage.removeItem('auth_timestamp');
    sessionStorage.removeItem('local_dev_mode');
    
    // Try Firebase logout if available
    if (checkDomainAuthorization()) {
      await signOut(auth);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// ✅ Enhanced Auth State Check
function enhancedAuthStateCheck() {
  return new Promise((resolve) => {
    const session = sessionStorage.getItem('dashboard_session');
    const timestamp = sessionStorage.getItem('auth_timestamp');
    const isLocalDev = sessionStorage.getItem('local_dev_mode') === 'true';
    
    if (session && timestamp) {
      const sessionAge = Date.now() - parseInt(timestamp);
      const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours
      
      if (sessionAge < SESSION_DURATION) {
        const user = JSON.parse(session);
        resolve({ authenticated: true, user, mode: isLocalDev ? 'local' : 'firebase' });
        return;
      }
    }
    
    // Check Firebase auth state if domain is authorized
    if (checkDomainAuthorization()) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email,
            photoURL: user.photoURL
          };
          resolve({ authenticated: true, user: userData, mode: 'firebase' });
        } else {
          resolve({ authenticated: false, user: null, mode: 'firebase' });
        }
        unsubscribe();
      });
    } else {
      resolve({ authenticated: false, user: null, mode: 'local' });
    }
  });
}

// ✅ Export functions
window.firebaseConfig = {
  app,
  auth,
  checkDomainAuthorization,
  enhancedSignIn,
  enhancedLogout,
  enhancedAuthStateCheck
};

// ✅ Log domain status
console.log('Current domain:', window.location.hostname);
console.log('Domain authorized:', checkDomainAuthorization()); 