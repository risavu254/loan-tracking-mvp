// ============ Firebase Security Configuration ============
// This file contains security rules and configuration for the loan application system

// Firestore Security Rules (to be added to Firebase Console)
const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Loan Applications Collection
    match /loanApplications/{document} {
      // Allow read/write only with proper authentication and validation
      allow read: if request.auth != null && 
        (request.auth.token.role == 'admin' || 
         request.auth.token.role == 'manager' ||
         resource.data.userId == request.auth.uid);
      
      allow create: if request.auth != null && 
        validateLoanData(request.resource.data) &&
        request.resource.data.submissionDate == request.time &&
        request.resource.data.status == 'pending';
      
      allow update: if request.auth != null && 
        (request.auth.token.role == 'admin' || 
         request.auth.token.role == 'manager') &&
        validateLoanData(request.resource.data);
      
      allow delete: if request.auth != null && 
        request.auth.token.role == 'admin';
    }
    
    // Users Collection
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
  }
}

// Custom validation function
function validateLoanData(data) {
  return data.keys().hasAll(['clientFname', 'clientLname', 'clientID', 'loanAmount']) &&
         data.clientFname is string &&
         data.clientFname.size() > 0 &&
         data.clientFname.size() < 100 &&
         data.loanAmount is number &&
         data.loanAmount > 0 &&
         data.loanAmount < 10000000;
}
`;

// ============ Data Encryption & Security ============
class LoanDataSecurity {
  constructor() {
    this.encryptionKey = null;
  }
  
  // Encrypt sensitive data before submission
  async encryptSensitiveData(data) {
    const sensitiveFields = ['clientID', 'clientPhone', 'guarID', 'guarPhone'];
    const encryptedData = { ...data };
    
    for (const field of sensitiveFields) {
      if (data[field]) {
        // In production, use proper encryption library
        encryptedData[field] = btoa(data[field]); // Base64 encoding for demo
      }
    }
    
    return encryptedData;
  }
  
  // Decrypt sensitive data for authorized users
  async decryptSensitiveData(data) {
    const sensitiveFields = ['clientID', 'clientPhone', 'guarID', 'guarPhone'];
    const decryptedData = { ...data };
    
    for (const field of sensitiveFields) {
      if (data[field]) {
        try {
          decryptedData[field] = atob(data[field]); // Base64 decoding for demo
        } catch (error) {
          console.warn(`Could not decrypt ${field}:`, error);
        }
      }
    }
    
    return decryptedData;
  }
  
  // Validate data integrity
  validateDataIntegrity(data) {
    const requiredFields = [
      'clientFname', 'clientLname', 'clientID', 'clientPhone',
      'loanAmount', 'loanPurpose', 'loanTerm', 'interestRate'
    ];
    
    for (const field of requiredFields) {
      if (!data[field] || data[field].toString().trim() === '') {
        return false;
      }
    }
    
    return true;
  }
  
  // Rate limiting for submissions
  async checkRateLimit(userId) {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    try {
      const submissions = await db.collection('loanApplications')
        .where('userId', '==', userId)
        .where('submissionDate', '>', oneHourAgo)
        .get();
      
      return submissions.size < 5; // Max 5 submissions per hour
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return true; // Allow submission if check fails
    }
  }
}

// ============ Anti-Malware Protection ============
class MalwareProtection {
  constructor() {
    this.suspiciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
      /eval\s*\(/gi,
      /document\.write/gi,
      /window\.location/gi,
      /innerHTML/gi
    ];
  }
  
  // Scan input for malicious content
  scanForMalware(input) {
    if (typeof input !== 'string') return { isClean: true, threats: [] };
    
    const threats = [];
    
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(input)) {
        threats.push(`Malicious pattern detected: ${pattern.source}`);
      }
    }
    
    return {
      isClean: threats.length === 0,
      threats: threats
    };
  }
  
  // Sanitize input
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    let sanitized = input;
    
    // Remove malicious patterns
    for (const pattern of this.suspiciousPatterns) {
      sanitized = sanitized.replace(pattern, '');
    }
    
    // Remove HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');
    
    // Remove extra whitespace
    sanitized = sanitized.trim();
    
    return sanitized;
  }
  
  // Validate file uploads
  validateFileUpload(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Invalid file type' };
    }
    
    if (file.size > maxSize) {
      return { isValid: false, error: 'File too large' };
    }
    
    return { isValid: true };
  }
}

// Export security classes
window.LoanDataSecurity = LoanDataSecurity;
window.MalwareProtection = MalwareProtection; 