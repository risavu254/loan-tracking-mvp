// ============ Firebase Configuration & Security ============
// Firebase configuration (same as main app)
const firebaseConfig = {
  apiKey: window.FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
  authDomain: window.FIREBASE_AUTH_DOMAIN || "loan-tracking-system-7c607.firebaseapp.com",
  projectId: window.FIREBASE_PROJECT_ID || "loan-tracking-system-7c607",
  storageBucket: window.FIREBASE_STORAGE_BUCKET || "loan-tracking-system-7c607.appspot.com",
  messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID || "985241134995",
  appId: window.FIREBASE_APP_ID || "1:985241134995:web:9e9625498f3ab39edfea66"
};

// Initialize Firebase with domain handling
let db;
let auth;

try {
  // Check if we're in local development
  const currentDomain = window.location.hostname;
  const isLocalDev = currentDomain === 'localhost' || currentDomain === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('Local development mode: Using mock Firebase for form');
    // Create mock Firebase objects for local development
    db = {
      collection: () => ({
        add: async (data) => {
          console.log('Mock Firebase: Data would be saved:', data);
          return { id: 'mock-doc-' + Date.now() };
        }
      })
    };
    auth = {
      currentUser: { uid: 'local-dev-user' }
    };
  } else {
    // Use real Firebase for production
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    console.log('Firebase initialized successfully');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Fallback to mock objects
  db = {
    collection: () => ({
      add: async (data) => {
        console.log('Mock Firebase: Data would be saved:', data);
        return { id: 'mock-doc-' + Date.now() };
      }
    })
  };
  auth = {
    currentUser: { uid: 'local-dev-user' }
  };
}

// ============ Data Validation & Sanitization ============
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous characters and scripts
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe/gi, '')
    .replace(/<object/gi, '')
    .replace(/<embed/gi, '')
    .trim();
}

function validateLoanData(data) {
  const errors = [];
  
  // Required field validation
  const requiredFields = [
    'clientFname', 'clientLname', 'clientID', 'clientPhone',
    'loanAmount', 'loanPurpose', 'loanTerm', 'interestRate'
  ];
  
  requiredFields.forEach(field => {
    if (!data[field] || data[field].toString().trim() === '') {
      errors.push(`${field} is required`);
    }
  });
  
  // Data type validation
  if (data.loanAmount && (isNaN(data.loanAmount) || data.loanAmount <= 0)) {
    errors.push('Loan amount must be a positive number');
  }
  
  if (data.interestRate && (isNaN(data.interestRate) || data.interestRate < 0 || data.interestRate > 100)) {
    errors.push('Interest rate must be between 0 and 100');
  }
  
  // Phone number validation (Kenyan format)
  if (data.clientPhone && !/^(\+254|254|0)?[17]\d{8}$/.test(data.clientPhone.replace(/\s/g, ''))) {
    errors.push('Invalid phone number format');
  }
  
  // ID number validation (Kenyan format)
  if (data.clientID && !/^\d{8,10}$/.test(data.clientID)) {
    errors.push('Invalid ID number format');
  }
  
  return errors;
}

function sanitizeFormData(formData) {
  const sanitizedData = {};
  
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      sanitizedData[key] = sanitizeInput(value);
    } else {
      sanitizedData[key] = value;
    }
  }
  
  return sanitizedData;
}

// ============ Secure Firebase Submission ============
async function submitToFirebase(loanData) {
  try {
    // Validate data before submission
    const validationErrors = validateLoanData(loanData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
    }
    
    // Add metadata
    const submissionData = {
      ...loanData,
      submissionDate: new Date().toISOString(), // Use regular timestamp for mock
      status: 'pending',
      version: '1.0',
      userAgent: navigator.userAgent,
      ipAddress: await getClientIP()
    };
    
    // Check if we're using mock Firebase
    const currentDomain = window.location.hostname;
    const isLocalDev = currentDomain === 'localhost' || currentDomain === '127.0.0.1';
    
    if (isLocalDev) {
      // Use mock submission for local development
      const mockDocId = 'mock-doc-' + Date.now();
      console.log('Mock Firebase: Loan application submitted successfully:', mockDocId);
      console.log('Mock Firebase: Data saved:', submissionData);
      return mockDocId;
    } else {
      // Use real Firebase for production
      if (typeof firebase !== 'undefined' && firebase.firestore) {
        submissionData.submissionDate = firebase.firestore.FieldValue.serverTimestamp();
      }
      
      // Submit to Firestore with security rules
      const docRef = await db.collection('loanApplications').add(submissionData);
      
      console.log('Loan application submitted successfully:', docRef.id);
      return docRef.id;
    }
    
  } catch (error) {
    console.error('Firebase submission error:', error);
    throw error;
  }
}

async function getClientIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('Could not get client IP:', error);
    return 'unknown';
  }
}

// ============ Section Navigation ============
export function navTo(currentId, nextId) {
  const currentSection = document.getElementById(currentId);
  const nextSection = document.getElementById(nextId);
  
  if (currentSection) currentSection.classList.remove('active');
  if (nextSection) {
    nextSection.classList.add('active');
    nextSection.scrollIntoView({ behavior: 'smooth' });
    
    // Reinitialize signature pads when section becomes active
    setTimeout(() => {
      if (nextId === 'sectionRO') {
        initSingleSignaturePad('ro');
        initSingleSignaturePad('witness');
      } else if (nextId === 'sectionClient') {
        initSingleSignaturePad('client');
      } else if (nextId === 'sectionGuarantor') {
        initSingleSignaturePad('guar');
      }
    }, 100);
  }
  
  updateStepProgress(nextId);
  scrollToTop();
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepProgress(sectionId) {
  const stepMap = {
    sectionClient: 1,
    sectionGuarantor: 2,
    sectionLoan: 3,
    sectionRO: 4,
    sectionFinal: 5
  };
  
  const step = stepMap[sectionId] || 1;
  const progressBar = document.getElementById('stepProgress');
  
  if (progressBar) {
    progressBar.style.width = `${(step / 5) * 100}%`;
    progressBar.textContent = `Step ${step} of 5`;
  }
}
// ============ Dynamic Fields ============
export function addReferee() {
  const container = document.getElementById('refereesSection');
  if (!container) return;

  const refereeCount = container.querySelectorAll('.referee-wrapper').length;
  if (refereeCount >= 3) {
    alert('Maximum of 3 referees allowed');
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'referee-wrapper mb-2 p-2';
  wrapper.innerHTML = `
    <div class="row g-2 align-items-end">
      <div class="col-12 col-md-4">
        <input type="text" name="refereeName[]" class="form-control" placeholder="Full Name" required>
      </div>
      <div class="col-12 col-md-4">
        <input type="text" name="refereeRelation[]" class="form-control" placeholder="Relationship" required>
      </div>
      <div class="col-12 col-md-3">
        <input type="tel" name="refereePhone[]" class="form-control" placeholder="Phone Number" required>
      </div>
      <div class="col-12 col-md-1 d-flex align-items-end">
        <button type="button" class="btn btn-danger btn-sm w-100 py-1 px-0" onclick="removeReferee(this)">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>`;
  
  container.appendChild(wrapper);
}

export function removeReferee(btn) {
  const wrapper = btn.closest('.referee-wrapper');
  if (wrapper) {
    wrapper.remove();
  }
}

// Generic field adder with validation
function addTableRow(tableId, fields) {
  const tbody = document.getElementById(tableId);
  if (!tbody) return;

  const row = document.createElement('tr');
  row.innerHTML = fields.map(field => 
    `<td><input name="${field.name}" class="form-control form-control-sm" 
      placeholder="${field.placeholder}" ${field.required ? 'required' : ''} 
      ${field.type ? `type="${field.type}"` : ''}></td>`
  ).join('') + `
    <td class="text-center">
      <button type="button" class="btn btn-danger btn-sm py-0 px-1" onclick="removeRow(this)">
        <i class="bi bi-trash"></i>
      </button>
    </td>`;
  
  tbody.appendChild(row);
}

export function addClientSecurity() {
  addTableRow('clientSecuritiesBody', [
    { name: 'clientSecItem[]', placeholder: 'e.g. Title Deed', required: true },
    { name: 'clientSecDesc[]', placeholder: 'Detailed description', required: true },
    { name: 'clientSecValue[]', placeholder: 'Estimated value', required: true, type: 'number' }
  ]);
}

export function addGuarantorSecurity() {
  addTableRow('guarantorSecuritiesBody', [
    { name: 'guarSecItem[]', placeholder: 'e.g. Logbook', required: true },
    { name: 'guarSecDesc[]', placeholder: 'Description', required: true },
    { name: 'guarSecValue[]', placeholder: 'Value', required: true, type: 'number' }
  ]);
}

export function removeRow(btn) {
  const row = btn.closest('tr');
  if (row) {
    row.remove();
  }
}
  // ============ Camera & Gallery Upload ============
let currentPhotoRole = '';

export function openPhotoModal(role) {
  try {
    const modal = new bootstrap.Modal(document.getElementById('photoModal'));
    currentPhotoRole = role;
    modal.show();
  } catch (error) {
    console.error('Error opening photo modal:', error);
    alert('Unable to open photo options');
  }
}

export function triggerPhotoOption(source) {
  if (!currentPhotoRole) return;
  
  const inputId = `${currentPhotoRole}${source === 'camera' ? 'Camera' : 'Gallery'}Input`;
  const input = document.getElementById(inputId);
  
  if (input) {
    input.click();
  }
}

export function setupPhotoInputs() {
  ['client', 'guar'].forEach(role => {
    const preview = document.getElementById(`${role}Preview`);
    const previewContainer = document.getElementById(`${role}PreviewContainer`);
    const cameraInput = document.getElementById(`${role}CameraInput`);
    const galleryInput = document.getElementById(`${role}GalleryInput`);

    const handleFile = (file) => {
      if (!file || !file.type.match('image.*')) {
        alert('Please select a valid image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.src = e.target.result;
        previewContainer.style.display = 'block';
      };
      reader.onerror = () => alert('Error reading file');
      reader.readAsDataURL(file);
    };

    if (cameraInput) cameraInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    if (galleryInput) galleryInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
  });
}

export function clearPhoto(role) {
  const preview = document.getElementById(`${role}Preview`);
  const previewContainer = document.getElementById(`${role}PreviewContainer`);
  const cameraInput = document.getElementById(`${role}CameraInput`);
  const galleryInput = document.getElementById(`${role}GalleryInput`);
  
  if (preview) preview.src = '';
  if (previewContainer) previewContainer.style.display = 'none';
  if (cameraInput) cameraInput.value = '';
  if (galleryInput) galleryInput.value = '';
}
  // ============ Location Capture ============
export function pinLocation(role) {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
    return;
  }

  const roleName = role === 'client' ? 'Client' : 'Guarantor';
  
  alert(`Please allow location access for ${roleName}`);
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const coords = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      const timestamp = new Date(position.timestamp).toLocaleString();
      
      alert(`${roleName} location captured at ${timestamp}:\n${coords}`);
      
      // Store coordinates in hidden field or form data
      const coordField = document.getElementById(`${role}LocationCoords`);
      if (coordField) {
        coordField.value = coords;
      }
    },
    (error) => {
      const errorMessages = {
        1: 'Permission denied',
        2: 'Position unavailable',
        3: 'Request timed out'
      };
      alert(`Location error: ${errorMessages[error.code] || error.message}`);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

// ============ Form Control & Submission ============
export function setupSearchLogic() {
  const searchBtn = document.getElementById('searchClientBtn');
  const newAppBtn = document.getElementById('newApplicationBtn');
  const closeFormBtn = document.getElementById('closeFormBtn');
  const idSearchSection = document.getElementById('idSearchSection');
  const loanFormContainer = document.getElementById('loanFormContainer');

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const id = document.getElementById('clientIDCheck')?.value.trim();
      if (!id) {
        alert('Please enter an ID number');
        return;
      }
      
      // Validate ID format (example for Kenyan ID)
      if (!/^\d{8,10}$/.test(id)) {
        alert('Please enter a valid ID number (8-10 digits)');
        return;
      }
      
      // Simulate search with loading state
      searchBtn.disabled = true;
      searchBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Searching...';
      
      setTimeout(() => {
        searchBtn.disabled = false;
        searchBtn.textContent = 'Search';
        // In real implementation, fetch client data here
        alert(`Client with ID ${id} found. Loading details...`);
        idSearchSection.style.display = 'none';
        loanFormContainer.style.display = 'block';
        scrollToTop();
      }, 1500);
    });
  }

  if (newAppBtn) {
    newAppBtn.addEventListener('click', () => {
      idSearchSection.style.display = 'none';
      loanFormContainer.style.display = 'block';
      scrollToTop();
    });
  }

  if (closeFormBtn) {
    console.log('Close form button found, adding event listener');
    closeFormBtn.addEventListener('click', () => {
      console.log('Close form button clicked');
      if (confirm('Are you sure you want to close this form? Any unsaved changes will be lost.')) {
        loanFormContainer.style.display = 'none';
        idSearchSection.style.display = 'block';
        scrollToTop();
      }
    });
  } else {
    console.error('Close form button not found');
  }
}

export function submitLoanForm() {
  saveAllSignatures();
  const form = document.getElementById('loanForm');
  
  if (!form.checkValidity()) {
    form.reportValidity();
    alert('Please complete all required fields correctly.');
    return;
  }
  
  const submitBtn = form.querySelector('button[type="button"][onclick="submitLoanForm()"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Processing...';
  }
  
  // Prepare form data with sanitization
  const formData = new FormData(form);
  const sanitizedData = sanitizeFormData(formData);
  
  // Convert FormData to JSON object
  const jsonData = {};
  for (const [key, value] of formData.entries()) {
    if (jsonData[key]) {
      jsonData[key] = Array.isArray(jsonData[key]) 
        ? [...jsonData[key], value] 
        : [jsonData[key], value];
    } else {
      jsonData[key] = value;
    }
  }
  
  // Submit to Firebase with security measures
  submitToFirebase(jsonData)
    .then((docId) => {
      console.log('Form submitted successfully to Firebase:', docId);
      alert(`Loan application submitted successfully! Reference ID: ${docId}`);
      
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-check-circle me-1"></i> Submit';
      }
      
      // Reset form
      form.reset();
      Object.values(signaturePads).forEach(pad => pad.clear());
      localStorage.removeItem('loanDraft');
      
      // Return to search
      document.getElementById('loanFormContainer').style.display = 'none';
      document.getElementById('idSearchSection').style.display = 'block';
      
    })
    .catch((error) => {
      console.error('Submission failed:', error);
      alert(`Submission failed: ${error.message}`);
      
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-check-circle me-1"></i> Submit';
      }
    });
}
// ============ Signature Pads ============
const signaturePads = {};
const resizeObservers = {};

export function initSignaturePads() {
  console.log('Initializing signature pads...');
  console.log('SignaturePad available:', typeof SignaturePad !== 'undefined');
  
  // Initialize all signature pads
  initSingleSignaturePad('client');
  initSingleSignaturePad('guar');
  initSingleSignaturePad('ro');
  initSingleSignaturePad('witness');
}

function initSingleSignaturePad(type) {
  // Map type to correct canvas ID
  const canvasIdMap = {
    'client': 'signatureCanvasClient',
    'guar': 'signatureCanvasGuar',
    'ro': 'signatureCanvasRO',
    'witness': 'signatureCanvasWitness'
  };
  
  const canvasId = canvasIdMap[type];
  const canvas = document.getElementById(canvasId);
  
  if (!canvas) {
    console.warn(`Canvas not found: ${canvasId}`);
    return;
  }

  console.log(`Initializing signature pad for type: ${type}, canvas: ${canvasId}`);
  console.log('Canvas element:', canvas);
  console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

  // Save existing signature data before cleanup
  let existingSignatureData = null;
  if (signaturePads[type] && !signaturePads[type].isEmpty()) {
    existingSignatureData = signaturePads[type].toData();
  }

  // Clean up previous instance if exists
  if (signaturePads[type]) {
    signaturePads[type].off();
    delete signaturePads[type];
  }
  if (resizeObservers[type]) {
    resizeObservers[type].disconnect();
    delete resizeObservers[type];
  }

  // Get the container element
  const container = canvas.parentElement;
  
  // Function to properly size the canvas
  const resizeCanvas = () => {
    const ratio = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height || 100; // Default height if not set
    
    // Set canvas display size
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    // Set canvas drawing buffer size
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    
    // Scale context
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    
    // Redraw if signature exists
    if (signaturePads[type] && !signaturePads[type].isEmpty()) {
      const data = signaturePads[type].toData();
      signaturePads[type].fromData(data);
    }
  };

  // Initial resize
  resizeCanvas();

  // Initialize signature pad with proper options
  if (typeof SignaturePad === 'undefined') {
    console.error('SignaturePad library not loaded');
    return;
  }
  
  signaturePads[type] = new SignaturePad(canvas, {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    penColor: '#000000',
    minWidth: 0.5,
    maxWidth: 2.5,
    throttle: 16,
    velocityFilterWeight: 0.7,
    minDistance: 5
  });

  console.log(`Signature pad created for ${type}:`, signaturePads[type]);

  // Restore existing signature data if it exists
  if (existingSignatureData) {
    signaturePads[type].fromData(existingSignatureData);
  }

  // Prevent unwanted scrolling on touch devices
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
  }, { passive: false });

  // Prevent mouse wheel scrolling on canvas
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
  }, { passive: false });

  // Set up resize observer for responsive behavior
  resizeObservers[type] = new ResizeObserver(() => {
    setTimeout(resizeCanvas, 100); // Small delay to ensure DOM is stable
  });
  resizeObservers[type].observe(container);
}

export function clearSignature(type) {
  const pad = signaturePads[type];
  if (pad) {
    pad.clear();
    const hiddenInput = document.getElementById(`${type}SigData`);
    if (hiddenInput) hiddenInput.value = '';
  }
}

function saveAllSignatures() {
  Object.entries(signaturePads).forEach(([type, pad]) => {
    const hiddenInput = document.getElementById(`${type}SigData`);
    if (hiddenInput && !pad.isEmpty()) {
      hiddenInput.value = pad.toDataURL('image/png');
    }
  });
}


// ============ PDF Generation ============
export function downloadPDF() {
  saveAllSignatures();
  
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    // Load jsPDF dynamically if not available
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = generatePDF;
    document.head.appendChild(script);
    return;
  }
  
  generatePDF();
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('DigiMashinani Loan Application', 105, 15, { align: 'center' });
  
  // Add client info
  doc.setFontSize(12);
  doc.text('Client Information', 14, 25);
  
  const clientFields = [
    { label: 'Name', value: `${document.querySelector('[name="clientFname"]').value} ${document.querySelector('[name="clientLname"]').value}` },
    { label: 'ID Number', value: document.querySelector('[name="clientID"]').value },
    { label: 'Phone', value: document.querySelector('[name="clientPhone"]').value }
  ];
  
  clientFields.forEach((field, i) => {
    doc.text(`${field.label}: ${field.value}`, 15, 35 + (i * 7));
  });
  
  // Add signature placeholders
  doc.addPage();
  doc.text('Signatures', 105, 15, { align: 'center' });
  
  // Client signature
  const clientSig = document.getElementById('clientSigData').value;
  if (clientSig) {
    doc.text('Client Signature:', 20, 25);
    doc.addImage(clientSig, 'PNG', 20, 30, 80, 40);
  }
  
  // Save PDF
  doc.save('LoanApplication.pdf');
}


// Reinitialize when showing form sections
//function navTo(currentId, nextId) {
  // ... your existing navigation code ...
  //setTimeout(initSignaturePads, 50); // Small delay to ensure DOM update
//}
// ============ Draft Handling ============
export function saveDraft() {
  saveAllSignatures();
  
  const form = document.getElementById('loanForm');
  if (!form) return;
  
  const formData = new FormData(form);
  const draftData = {};
  
  for (const [key, value] of formData.entries()) {
    if (draftData[key]) {
      draftData[key] = Array.isArray(draftData[key]) 
        ? [...draftData[key], value]
        : [draftData[key], value];
    } else {
      draftData[key] = value;
    }
  }
  
  localStorage.setItem('loanDraft', JSON.stringify(draftData));
  alert('Draft saved successfully!');
}

export function loadDraft() {
  const draft = localStorage.getItem('loanDraft');
  if (!draft) {
    alert('No saved draft found');
    return;
  }
  
  if (!confirm('Load saved draft? This will overwrite current form data.')) {
    return;
  }
  
  try {
    const draftData = JSON.parse(draft);
    Object.entries(draftData).forEach(([name, value]) => {
      const elements = document.getElementsByName(name);
      
      if (elements.length === 0) return;
      
      if (Array.isArray(value)) {
        value.forEach((val, i) => {
          if (elements[i]) {
            elements[i].value = val;
            if (elements[i].type === 'checkbox' || elements[i].type === 'radio') {
              elements[i].checked = true;
            }
          }
        });
      } else {
        elements[0].value = value;
        if (elements[0].type === 'checkbox' || elements[0].type === 'radio') {
          elements[0].checked = true;
        }
      }
    });
    
    alert('Draft loaded successfully!');
  } catch (error) {
    console.error('Error loading draft:', error);
    alert('Error loading draft. Data may be corrupted.');
  }
}
// ============ Theme Management ============
export function initTheme() {
  // Set initial theme
  const savedTheme = localStorage.getItem('dashboard-theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);
  
  // Listen for theme changes from parent
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'theme-change') {
      setTheme(event.data.theme);
    }
  });
  
  // Request initial theme
  window.parent.postMessage({ type: 'request-theme' }, '*');
}

function setTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('dashboard-theme', theme);
  
  // Adjust signature pad colors based on theme
  const isDark = theme === 'dark';
  Object.values(signaturePads).forEach(pad => {
    if (pad) {
      pad.penColor = isDark ? '#ffffff' : '#000000';
      pad.backgroundColor = isDark ? 'rgba(0, 0, 0, 0)' : 'rgba(255, 255, 255, 0)';
    }
  });
}


export function refreshSignaturePads() {
  initSignaturePads();
}
// ============ Initialization ============
function initializeApplication() {
  initTheme();
  setupSearchLogic();
  setupPhotoInputs();
  initSignaturePads();
}

/*document.addEventListener("DOMContentLoaded", () => {
  // Handle Back to Dashboard button
  const backButton = document.getElementById("backToDashboardBtn");
  if (backButton) {
    backButton.addEventListener("click", () => {
      try {
        if (window.self !== window.top) {
          window.parent.postMessage({
            type: 'navigateToDashboard',
            source: 'loanForm'
          }, '*');
        } else {
          window.location.href = 'uprise-dash.html';
        }
      } catch (error) {
        console.error('Navigation error:', error);
        window.location.href = 'uprise-dash.html';
      }
    });
  }

  // Initialize app logic
  initializeApplication();

  // Initialize signature pads
  initSignaturePads();
});*/
document.addEventListener("DOMContentLoaded", () => {
  const backButton = document.getElementById("backToDashboardBtn");

  if (backButton) {
    console.log('Back button found, adding event listener');
    backButton.addEventListener("click", () => {
      console.log('Back button clicked');
      try {
        if (window.self !== window.top) {
          console.log('Sending postMessage to parent');
          window.parent.postMessage({
            type: 'navigateToDashboard',
            source: 'loanForm'
          }, '*');
        } else {
          console.log('Navigating to dash3.html');
          window.location.href = 'dash3.html';
        }
      } catch (error) {
        console.error('Navigation error:', error);
        window.location.href = 'dash3.html';
      }
    });
  } else {
    console.error('Back button not found');
  }

  // Initialize app logic
  initializeApplication();
});







// Make functions globally accessible
window.addReferee = addReferee;
window.removeReferee = removeReferee;
window.addClientSecurity = addClientSecurity;
window.addGuarantorSecurity = addGuarantorSecurity;
window.removeRow = removeRow;
window.navTo = navTo;
window.openPhotoModal = openPhotoModal;
window.clearPhoto = clearPhoto;
window.pinLocation = pinLocation;
window.clearSignature = clearSignature;
window.downloadPDF = downloadPDF;
window.saveDraft = saveDraft;
window.submitLoanForm = submitLoanForm;

// Firebase functions
window.submitToFirebase = submitToFirebase;
window.validateLoanData = validateLoanData;
window.sanitizeFormData = sanitizeFormData;

// Global function for back to dashboard navigation
window.goBackToDashboard = function() {
  console.log('goBackToDashboard function called');
  try {
    if (window.self !== window.top) {
      console.log('Sending postMessage to parent');
      window.parent.postMessage({
        type: 'navigateToDashboard',
        source: 'loanForm'
      }, '*');
    } else {
      console.log('Navigating to dash3.html');
      window.location.href = 'dash3.html';
    }
  } catch (error) {
    console.error('Navigation error:', error);
    window.location.href = 'dash3.html';
  }
};

// Ensure client signature pad works
window.initClientSignature = function() {
  console.log('Initializing client signature pad');
  try {
    if (typeof SignaturePad === 'undefined') {
      console.error('SignaturePad library not loaded');
      alert('Signature pad library not loaded. Please refresh the page.');
      return;
    }
    
    const canvas = document.getElementById('signatureCanvasClient');
    if (!canvas) {
      console.error('Client signature canvas not found');
      return;
    }
    
    console.log('Client canvas found, initializing signature pad');
    initSingleSignaturePad('client');
    
    // Test if signature pad is working
    setTimeout(() => {
      if (signaturePads['client']) {
        console.log('Client signature pad initialized successfully');
      } else {
        console.error('Failed to initialize client signature pad');
      }
    }, 100);
  } catch (error) {
    console.error('Error initializing client signature pad:', error);
  }
};

// Ensure close form button works
window.closeLoanForm = function() {
  console.log('Close loan form function called');
  const loanFormContainer = document.getElementById('loanFormContainer');
  const idSearchSection = document.getElementById('idSearchSection');
  
  if (confirm('Are you sure you want to close this form? Any unsaved changes will be lost.')) {
    if (loanFormContainer) loanFormContainer.style.display = 'none';
    if (idSearchSection) idSearchSection.style.display = 'block';
    scrollToTop();
  }
};

