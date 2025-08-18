# Contact Information Update Guide

## 📧 How to Change Contact Information in DigiMashinani Field Tracker

This guide provides step-by-step instructions for updating all contact information throughout the project to match your organization's details.

---

## 🎯 Current Status

✅ **Already Updated** (during cleanup):
- `public/security.txt` - Security contact email
- `public/privacy-policy.html` - Privacy policy contact email

---

## 📝 Step-by-Step Contact Update Process

### **Step 1: Identify Your Contact Information**

Before making changes, gather the following information:

```
Primary Domain: ___________________ (e.g., risavutech.com)
Security Email: ___________________ (e.g., risavutech@gmail.com)
Privacy Email: ____________________ (e.g., risavutech@gmail.com)
Support Email: ____________________ (e.g., risavutech@gmail.com)
Company Name: _____________________ (e.g., Risavu Tech)
```

---

### **Step 2: Update Security Contact Files**

**Files to Update:**
- `public/security.txt`
- `public/.well-known/security.txt`
- `public/security-policy.html`

**How to Update security.txt:**
1. Open both `public/security.txt` and `public/.well-known/security.txt`
2. Replace `security@digimashinani.com` with your security email
3. Replace all instances of `your-domain.com` with your actual domain
4. Update expiration date if needed (format: YYYY-MM-DDTHH:MM:SS.000Z)

**Example Updates:**
```
Contact: mailto:security@yourcompany.com
Contact: https://yourcompany.com/security-contact
Canonical: https://yourcompany.com/.well-known/security.txt
```

**Security Policy Updates:**
1. Open `public/security-policy.html`
2. Update all email addresses (security@, support@, privacy@)
3. Replace `your-domain.com` with your actual domain
4. Update company name references

---

### **Step 3: Update Privacy Policy Contact**

**File:** `public/privacy-policy.html`

**Location:** Line 46

**How to Update:**
1. Open `public/privacy-policy.html`
2. Find the "Contact Us" section
3. Replace `privacy@digimashinani.com` with your privacy email

**Current:**
```html
<p>For privacy-related questions, contact us at: <a href="mailto:privacy@digimashinani.com">privacy@digimashinani.com</a></p>
```

**Update to:**
```html
<p>For privacy-related questions, contact us at: <a href="mailto:privacy@yourcompany.com">privacy@yourcompany.com</a></p>
```

---

### **Step 4: Update Firebase Configuration Domain**

**File:** `public/js/firebase-config.js`

**What to Update:**
1. Open `public/js/firebase-config.js`
2. Find the `AUTHORIZED_DOMAINS` array (around line 6)
3. Replace the domains with your actual domains

**Current:**
```javascript
const AUTHORIZED_DOMAINS = [
  'loan-tracking-system-7c607.web.app',
  'loan-tracking-system-7c607.firebaseapp.com',
  'loan-tracking-mvp.netlify.app',
  'localhost',
  '127.0.0.1'
];
```

**Update to:**
```javascript
const AUTHORIZED_DOMAINS = [
  'your-project.web.app',              // Your Firebase domain
  'your-project.firebaseapp.com',      // Your Firebase domain
  'yourcompany.com',                   // Your custom domain
  'www.yourcompany.com',               // Your www domain
  'localhost',                         // Keep for development
  '127.0.0.1'                         // Keep for development
];
```

---

### **Step 5: Update Company Information in Privacy Policy**

**File:** `public/privacy-policy.html`

**What to Update:**
1. Company name references
2. Business description
3. Contact information

**Sections to Update:**

**Company Name (Line 18):**
```html
<!-- Current -->
<h2>About DigiMashinani</h2>
<p>DigiMashinani is a legitimate loan tracking...</p>

<!-- Update to -->
<h2>About [Your Company Name]</h2>
<p>[Your Company Name] is a legitimate loan tracking...</p>
```

---

### **Step 6: Update Footer Information**

**File:** `public/dash3.html`

**Location:** Lines 1037-1044 (Footer section)

**Current:**
```html
<p class="mb-2">© 2024 DigiMashinani - Loan Tracking System</p>
```

**Update to:**
```html
<p class="mb-2">© 2024 [Your Company Name] - Loan Tracking System</p>
```

---

### **Step 7: Update README.md Contact Information**

**File:** `README.md`

**Sections to Update:**

1. **Support & Contact section** (around line 200):
```markdown
### Security Issues
- **Email**: security@yourcompany.com

### General Support
- **Email**: support@yourcompany.com
```

2. **Technology Stack description** (if you want to customize):
```markdown
**A secure loan management and field tracking system for [Your Company] officers**
```

---

## 🔧 Advanced Configuration

### **Update Canonical URLs**

If you have a custom domain, update canonical URLs in:

1. **security.txt**: Update the Canonical line
2. **HTML meta tags**: Add canonical tags if needed

### **Email Setup**

Make sure these email addresses are actually set up:
- `security@yourcompany.com` - For security vulnerability reports
- `privacy@yourcompany.com` - For privacy-related inquiries
- `support@yourcompany.com` - For general support

---

## ✅ Verification Checklist

After making all updates, verify:

- [ ] Security.txt has correct contact email and domain
- [ ] Privacy policy has correct contact email
- [ ] Firebase authorized domains include your domain
- [ ] Company name is updated throughout
- [ ] Footer copyright is updated
- [ ] README.md contact information is updated
- [ ] All email addresses are functional

---

## 🚨 Important Notes

### **Firebase Console Updates**

After updating domains in code, also update in Firebase Console:
1. Go to Firebase Console → Authentication → Settings
2. Add your domain to "Authorized domains"
3. Remove old/unused domains

### **DNS Configuration**

If using a custom domain:
1. Set up DNS records pointing to your hosting provider
2. Configure SSL certificate
3. Test domain accessibility

### **Email Configuration**

Set up email addresses before deployment:
1. Create email accounts for security, privacy, and support
2. Set up email forwarding if needed
3. Test email delivery

---

## 📞 Need Help?

If you encounter issues while updating contact information:

1. **Check file paths** - Ensure you're editing the correct files
2. **Verify syntax** - Make sure HTML/JavaScript syntax is correct
3. **Test locally** - Test changes on localhost before deployment
4. **Check logs** - Review browser console for errors

---

**Remember**: Always test your changes locally before deploying to production! 