# DigiMashinani Field Tracker

**A secure loan management and field tracking system for DigiMashinani officers - Built by Risavu Tech**

## 🏗️ Technology Stack

- **Frontend**: HTML5, CSS3, Bootstrap 5.3.0
- **JavaScript**: Vanilla JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Hosting, Firestore)
- **Icons**: Bootstrap Icons
- **Charts**: Chart.js
- **Deployment**: Firebase Hosting / Netlify

## 📋 Project Overview

DigiMashinani Field Tracker is a professional loan management system designed for microfinance institutions and loan officers. It provides:

- **Secure Authentication**: Firebase-powered login system
- **Loan Portfolio Management**: Track disbursed loans, due payments, and arrears
- **Real-time Analytics**: Visual dashboards with loan performance metrics
- **Mobile-Responsive Design**: Works seamlessly on desktop and mobile devices
- **Field Officer Tools**: Manage client information and payment tracking

## 🚀 Quick Start

### Prerequisites
- Firebase account
- Modern web browser
- Text editor (VS Code recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd digimashinani-field-tracker
   ```

2. **Set up Firebase**
   - Create a new Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication with Email/Password
   - Enable Firestore Database
   - Enable Hosting

3. **Configure Firebase**
   - Update `public/js/firebase-config.js` with your Firebase configuration
   - Add your domain to Firebase authorized domains

4. **Deploy**
   ```bash
   # Using Firebase (Linux/Mac)
   ./scripts/deploy.sh
   
   # Using Firebase (Windows)
   scripts\deploy-firebase.bat
   
   # Manual Firebase deployment
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   
   # Or using Netlify
   # Drag and drop the 'public' folder to Netlify
   ```

## 🔧 Configuration

### Firebase Setup

1. **Authentication Configuration**
   - Go to Firebase Console > Authentication > Settings
   - Add your domain to Authorized Domains:
     - `yourdomain.com`
     - `your-app.netlify.app` (if using Netlify)

2. **Update Firebase Config**
   Edit `public/js/firebase-config.js`:
   ```javascript
   window.FIREBASE_API_KEY = "your-api-key";
   window.FIREBASE_AUTH_DOMAIN = "your-project.firebaseapp.com";
   window.FIREBASE_PROJECT_ID = "your-project-id";
   // ... other config values
   ```

3. **Authorized Domains**
   Update the AUTHORIZED_DOMAINS array in `firebase-config.js`:
   ```javascript
   const AUTHORIZED_DOMAINS = [
     'your-project.web.app',
     'your-project.firebaseapp.com',
     'your-custom-domain.com',
     'localhost',
     '127.0.0.1'
   ];
   ```

## 📁 Project Structure

```
digimashinani-field-tracker/
├── public/
│   ├── assets/              # Static assets
│   ├── css/
│   │   ├── kilolo-dash-2.css    # Main dashboard styles
│   │   └── loan-form.css        # Loan form specific styles
│   ├── js/
│   │   ├── firebase-config.js   # Firebase configuration
│   │   ├── auth-middleware.js   # Authentication handling
│   │   ├── fast-auth.js        # Quick authentication utilities
│   │   ├── auth-cache.js       # Authentication caching
│   │   ├── lolo-6.js          # Main dashboard functionality
│   │   └── k3-fom.js          # Loan form functionality
│   ├── index.html             # Entry point with auth redirect
│   ├── login.html             # Login page
│   ├── dash3.html             # Main dashboard
│   ├── k3-fom.html           # Loan application form
│   ├── privacy-policy.html    # Privacy policy page
│   ├── _redirects            # Netlify redirects
│   └── security.txt          # Security contact information
├── scripts/
│   ├── deploy-firebase.bat    # Firebase deployment (Windows)
│   ├── deploy-windows.bat     # Alternative Windows deployment
│   └── deploy.sh             # Firebase deployment (Linux/Mac)
├── build.js                 # Build configuration generator
├── firebase.json             # Firebase hosting configuration
├── netlify.toml             # Netlify configuration
├── CONTACT_UPDATE_GUIDE.md   # Guide for updating contact information
└── README.md                # This documentation
```

## 🔐 Security Features

### Authentication
- **Firebase Authentication**: Industry-standard authentication system
- **Session Management**: 8-hour session timeout with inactivity logout
- **Domain Authorization**: Restricts usage to authorized domains only
- **Secure Redirects**: Automatic redirect protection

### Data Protection
- **HTTPS Only**: All communications encrypted
- **Client-side Validation**: Input sanitization and validation
- **Session Storage**: Secure session management
- **No Exposed Secrets**: All sensitive data properly secured

### Security Headers
```json
{
  "headers": [
    {
      "key": "Cache-Control",
      "value": "no-cache, no-store, must-revalidate"
    }
  ]
}
```

## 🎨 Features

### Dashboard Analytics
- **Outstanding Loan Balance**: Real-time loan portfolio value
- **Loan Activity Status**: Active vs inactive loan tracking
- **Performance Metrics**: Loan performance indicators
- **Visual Charts**: Interactive charts and graphs

### Client Management
- **Disbursed Clients**: Track all disbursed loans
- **Due Payments**: Monitor upcoming payment deadlines
- **Arrears Management**: Handle overdue payments
- **Client Profiles**: Detailed client information

### Loan Processing
- **Loan Application Form**: Complete loan application workflow
- **Document Management**: Handle loan documentation
- **Approval Workflow**: Streamlined approval process
- **Payment Tracking**: Monitor payment schedules

## 🔄 Authentication Flow

1. **Entry Point**: `index.html` checks authentication status
2. **Login**: Redirects unauthenticated users to `login.html`
3. **Dashboard**: Authenticated users access `dash3.html`
4. **Session Management**: Automatic session refresh and timeout
5. **Logout**: Secure logout with session cleanup

## 📱 Mobile Responsiveness

- **Bootstrap 5**: Mobile-first responsive framework
- **Adaptive UI**: Optimized for all screen sizes
- **Touch-Friendly**: Mobile-optimized interactions
- **Progressive Enhancement**: Works on all devices

## 🛠️ Development

### Local Development
1. Start a local server (required for Firebase):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server public -p 8000
   
   # Using Live Server (VS Code extension)
   # Right-click index.html > "Open with Live Server"
   ```

2. Open `http://localhost:8000` in your browser

### Code Structure
- **Modular JavaScript**: Separated concerns with dedicated JS files
- **CSS Organization**: Component-based styling
- **HTML Semantics**: Proper semantic markup
- **Accessibility**: ARIA labels and keyboard navigation

## 🚀 Deployment

### Firebase Hosting
```bash
firebase init hosting
firebase deploy
```

### Netlify
1. Drag the `public` folder to Netlify
2. Configure custom domain (optional)
3. Set up redirects using `_redirects` file

### Custom Domain Setup
1. **DNS Configuration**: Point domain to hosting provider
2. **SSL Certificate**: Automatic SSL with Firebase/Netlify
3. **Firebase Auth**: Add domain to authorized domains list

## 📊 Analytics & Monitoring

### Performance Metrics
- **Loan Portfolio Value**: Real-time tracking
- **Collection Rates**: Payment collection efficiency
- **Client Activity**: User engagement metrics
- **System Performance**: Load times and responsiveness

### Error Monitoring
- **Console Logging**: Comprehensive error logging
- **Authentication Errors**: Detailed auth error handling
- **Network Issues**: Connection failure handling

## 🔒 Privacy & Compliance

### Data Handling
- **Minimal Data Collection**: Only necessary information
- **Secure Storage**: Firebase security rules
- **Data Encryption**: All data encrypted in transit and at rest
- **User Control**: Users control their data

### Privacy Policy
- **Transparent Practices**: Clear data usage policies
- **Contact Information**: Privacy officer contact details
- **User Rights**: Data access and deletion rights
- **Regular Updates**: Policy updates as needed

## 🆘 Support & Contact

### Security Issues
- **Email**: risavutech@gmail.com
- **Response Time**: 24-48 hours
- **Vulnerability Reporting**: Responsible disclosure

### General Support
- **Email**: risavutech@gmail.com
- **Documentation**: This README file
- **Issue Tracking**: GitHub Issues (if applicable)

## 📝 License

This project is licensed under the [License Type] - see the LICENSE file for details.

## 🔄 Updates & Maintenance

### Regular Updates
- **Security Patches**: Monthly security reviews
- **Feature Updates**: Quarterly feature releases
- **Performance Optimization**: Ongoing performance improvements
- **Browser Compatibility**: Regular compatibility testing

### Version History
- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Enhanced authentication and security features
- **v1.2.0**: Mobile responsiveness improvements
- **Current**: Latest stable version

---

**DigiMashinani Field Tracker** - Built by Risavu Tech. Empowering microfinance institutions with secure, efficient loan management tools. 