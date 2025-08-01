// ✅ Firebase Initialization with Error Handling
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  onSnapshot,
  query,
  where,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDktcea0NIBU_-6pAlV57eCokFsdDkyOEE",
  authDomain: "loan-tracking-system-7c607.firebaseapp.com",
  projectId: "loan-tracking-system-7c607",
  storageBucket: "loan-tracking-system-7c607.appspot.com",
  messagingSenderId: "985241134995",
  appId: "1:985241134995:web:9e9625498f3ab39edfea66"
};

// Initialize Firebase with error handling
let app, db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  window.db = db;
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  showToast("Failed to initialize database", "danger");
}

// ✅ Enhanced Helper Functions
function safeToLocaleString(value) {
  if (typeof value === 'number' && !isNaN(value)) {
    return value.toLocaleString('en-US');
  }
  return '0';
}

function formatCurrency(amount) {
  return `KES ${safeToLocaleString(amount)}`;
}

function showToast(message, type = "success") {
  const toast = document.createElement('div');
  toast.className = `toast show position-fixed end-0 bottom-0 mb-3 me-3 bg-${type} text-white`;
  toast.style.zIndex = '2000';
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function animateCount(id, target, prefix = '', duration = 1000) {
  const element = document.getElementById(id);
  if (!element) return;
  
  let start = 0;
  const increment = target / (duration / 16); // 60fps

  const animate = () => {
    start += increment;
    if (start >= target) {
      start = target;
      element.textContent = prefix + safeToLocaleString(start);
      return;
    }
    
    element.textContent = prefix + safeToLocaleString(Math.floor(start));
    requestAnimationFrame(animate);
  };
  
  animate();
}

// ✅ Theme Management
function setTheme(theme) {
  document.body.classList.toggle('dark-theme', theme === 'dark');
  document.body.classList.toggle('light-theme', theme === 'light');
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('dashboard-theme', theme);
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    themeIcon.className = theme === 'dark'
      ? 'bi bi-moon-stars-fill fs-5'
      : 'bi bi-brightness-high fs-5';
  }
  const header = document.querySelector('header');
  if (header) header.setAttribute('data-theme', theme);
}

function toggleTheme() {
  const current = document.body.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  // Communicate theme change to iframe
  const loanIframe = document.getElementById('loanFormIframe');
  if (loanIframe?.contentWindow) {
    loanIframe.contentWindow.postMessage({
      type: 'theme-change',
      theme: next
    }, '*');
  }
}

function initThemeFromStorage() {
  const savedTheme = localStorage.getItem('dashboard-theme') || 'dark';
  setTheme(savedTheme);
}

// ✅ Notification Management
function toggleNotifications() {
  const panel = document.getElementById('notificationPanel');
  panel.classList.toggle('d-none');
  if (!panel.classList.contains('d-none')) {
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(10px)';
    panel.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      panel.style.opacity = '1';
      panel.style.transform = 'translateY(0)';
    }, 10);
    document.getElementById('notifBadge').textContent = '0';
  }
}

function loadNotifications() {
  const notifList = document.getElementById('notifList');
  if (!notifList) return;

  notifList.innerHTML = `
    <li class="list-group-item bg-dark text-white d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-bold">System Update</div>
        Dashboard updated to v2.1.0
      </div>
      <small>Just now</small>
    </li>
    <li class="list-group-item bg-dark text-white d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-bold">New Loan</div>
        John Doe applied for a loan
      </div>
      <small>2 hours ago</small>
    </li>
    <li class="list-group-item bg-dark text-white d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-bold">Payment Received</div>
        KES 5,000 from Jane Smith
      </div>
      <small>Yesterday</small>
    </li>
  `;
}

// ✅ Refresh Animation
function animateRefresh() {
  const icon = document.getElementById('refreshIcon');
  if (!icon) return;
  icon.classList.add('spin');
  icon.style.transition = 'transform 0.5s ease';
  icon.style.transform = 'rotate(360deg)';
  setTimeout(() => {
    icon.style.transform = 'rotate(0deg)';
    icon.classList.remove('spin');
    showToast('Data refreshed successfully', 'success');
    fetchClients(); // Refresh data
  }, 500);
}

// ✅ UI Control Functions
window.toggleSidebar = function() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  sidebar.classList.toggle('show');
  overlay.classList.toggle('show');
};

window.closeSidebar = function() {
  document.getElementById('sidebar').classList.remove('show');
  document.getElementById('overlay').classList.remove('show');
  document.querySelectorAll('.dropdown-items').forEach(d => d.classList.remove('show'));
  document.querySelectorAll('.dropdown-chevron').forEach(c => c.classList.remove('rotate'));
};

window.toggleDropdown = function(id, trigger) {
  const dropdown = document.getElementById(id);
  dropdown.classList.toggle('show');
  const chevron = trigger.querySelector('.dropdown-chevron');
  if (chevron) chevron.classList.toggle('rotate');
};

// ✅ Modal Control Functions
window.openDisbursedModal = function() {
  closeSidebar();
  const modal = new bootstrap.Modal(document.getElementById('disbursedModal'));
  modal.show();
  loadDisbursedClients();
};

window.openDueModal = function() {
  closeSidebar();
  const modal = new bootstrap.Modal(document.getElementById('dueModal'));
  modal.show();
  loadDueClients();
};

window.openArrearsModal = function() {
  closeSidebar();
  const modal = new bootstrap.Modal(document.getElementById('arrearsModal'));
  modal.show();
  loadArrears();
};

window.openBranchReports = function() {
  closeSidebar();
  setTimeout(() => {
    const modal = new bootstrap.Modal(document.getElementById('branchReportsModal'));
    modal.show();
    populateReportTable();
    setTimeout(() => {
      const input = document.getElementById('reportSearch');
      if (input) input.focus();
    }, 300);
  }, 300);
};

window.openLoanForm = function() {
  closeSidebar();
  const container = document.getElementById("loanFormFrameContainer");
  container.style.display = "block";
  container.removeAttribute('aria-hidden');
  container.removeAttribute('inert');
  document.body.style.overflow = "hidden";
  // Optionally, focus the close button
  const closeBtn = document.getElementById('closeLoanFormFrameBtn');
  if (closeBtn) closeBtn.focus();
};

window.closeLoanForm = function() {
  const container = document.getElementById("loanFormFrameContainer");
  const iframe = document.getElementById("loanFormIframe");

  container.style.display = "none";
  container.setAttribute('aria-hidden', 'true');
  container.setAttribute('inert', '');
  document.body.style.overflow = "auto";

  if (iframe && iframe.contentWindow) {
    iframe.src = iframe.src; // Reloads the iframe
  }
  // Optionally, return focus to the button that opened the modal
};

// ✅ Data Management
let clients = [];
let arrearsClients = [];
const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  disbursedCounts: Array(12).fill(0),
  disbursedAmounts: Array(12).fill(0)
};

let chartInstance;

window.fetchClients = function() {
  if (!db) {
    console.error("Firestore not initialized");
    return;
  }
  
  const loansRef = collection(db, 'loans');
  onSnapshot(loansRef, (snapshot) => {
    clients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Fetched clients:", clients); // Debug log
    loadDisbursedClients();
    loadDueClients();
    fetchArrears();
    updateDashboardMetrics();
  }, (error) => {
    console.error("Error fetching clients:", error);
    showToast("Error loading client data", "danger");
  });
};



window.fetchArrears = function() {
  arrearsClients = [];
  const today = new Date().toISOString().split('T')[0];

  clients.forEach(client => {
    const disbursedDate = client.disbursedDate || '';
    const installment = parseFloat(client.installment) || 0;
    const payments = Array.isArray(client.payments) ? 
      client.payments.reduce((a, b) => a + (parseFloat(b) || 0), 0) : 0;
    const installments = Array.isArray(client.installments) ? 
      client.installments : [];

    const totalExpected = installment * installments.length;

    if (payments < totalExpected) {
      const dueDate = getDueDate(disbursedDate, installments.length);
      const overdueAmount = totalExpected - payments;
      arrearsClients.push({
        ...client,
        dueDate: dueDate,
        overdueAmount: overdueAmount
      });
    }
  });
  console.log("Arrears clients:", arrearsClients); // Debug log
};

function updateDashboardMetrics() {
  let outstanding = 0;
  let performing = 0;
  let active = 0;
  let inactive = 0;
  const monthlyStats = Array(12).fill(0);
  const monthlyAmounts = Array(12).fill(0);

  clients.forEach(loan => {
    const collected = Array.isArray(loan.payments) ? 
      loan.payments.reduce((a, b) => a + (parseFloat(b) || 0), 0) : 0;
    const installmentAmount = parseFloat(loan.installment) || 0;
    const total = installmentAmount * (Array.isArray(loan.installments) ? 
      loan.installments.length : 0);

    outstanding += total;
    performing += collected;

    const isActive = collected < total;
    isActive ? active++ : inactive++;

    const disbursedDate = new Date(loan.disbursedDate);
    if (!isNaN(disbursedDate.getTime())) {
      const month = disbursedDate.getMonth();
      monthlyStats[month]++;
      monthlyAmounts[month] += total;
    }
  });

  animateCount('outstandingBalance', outstanding, 'KES ');
  animateCount('performingBalance', performing, 'KES ');
  animateCount('activeLoans', active);
  animateCount('inactiveLoans', inactive);

  chartData.disbursedCounts = monthlyStats;
  chartData.disbursedAmounts = monthlyAmounts;
  createChart(chartData.labels, chartData.disbursedCounts, chartData.disbursedAmounts);
}

// ✅ Data Loading Functions
window.loadDisbursedClients = function() {
  const tbody = document.getElementById('disbursedTableBody');
  if (!tbody) {
    console.error("Disbursed table body not found");
    return;
  }

  const searchTerm = document.getElementById('searchDisbursed')?.value?.toLowerCase() || '';
  const filterLoanType = document.getElementById('filterLoanType')?.value || '';
  const filterMonth = document.getElementById('filterMonth')?.value || '';
  const filterFlagged = document.getElementById('filterFlagged')?.value || '';

  // Filtered data
  const filtered = clients.filter(client => {
    const matchesSearch = !searchTerm || 
      (client.name && client.name.toLowerCase().includes(searchTerm)) ||
      (client.phone && client.phone.includes(searchTerm)) ||
      (client.idNumber && client.idNumber.toLowerCase().includes(searchTerm));
    const matchesType = !filterLoanType || client.loanType === filterLoanType;
    const matchesMonth = !filterMonth || (client.disbursedDate && client.disbursedDate.startsWith(filterMonth));
    const matchesFlagged = !filterFlagged || 
      (filterFlagged === 'flagged' && client.flagged) ||
      (filterFlagged === 'not-flagged' && !client.flagged);
    
    return matchesSearch && matchesType && matchesMonth && matchesFlagged;
  });

  // Update summary counts
  let total = 0;
  filtered.forEach(client => {
    const installment = parseFloat(client.installment) || 0;
    const count = Array.isArray(client.installments) ? client.installments.length : 0;
    total += installment * count;
  });
  
  const disbursedCountEl = document.getElementById('disbursedCount');
  const totalDisbursedEl = document.getElementById('totalDisbursed');
  
  if (disbursedCountEl) disbursedCountEl.textContent = filtered.length;
  if (totalDisbursedEl) totalDisbursedEl.textContent = formatCurrency(total);

  // Update summary text
  const disbursedSummary = document.getElementById('disbursedSummary');
  if (disbursedSummary) {
    disbursedSummary.textContent = `Showing ${filtered.length} clients (Total: ${formatCurrency(total)})`;
  }

  // Render table rows
  tbody.innerHTML = '';
  
  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" class="text-center text-muted py-4">
          <i class="bi bi-inbox fs-1 d-block mb-2"></i>
          No disbursed clients found
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach((client, index) => {
    const installment = parseFloat(client.installment) || 0;
    const count = Array.isArray(client.installments) ? client.installments.length : 0;
    const totalLoan = installment * count;
    const interestRate = client.interestRate || 0;
    const totalWithInterest = totalLoan * (1 + interestRate / 100);
    
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${index + 1}</td>
        <td>
          <div class="d-flex align-items-center">
            <div class="avatar-placeholder me-2">${(client.name || 'N/A').substring(0, 2).toUpperCase()}</div>
            <div>${client.name || 'N/A'}</div>
          </div>
        </td>
        <td>${client.phone || 'N/A'}</td>
        <td class="text-right">${formatCurrency(totalLoan)}</td>
        <td class="text-right">${interestRate}%</td>
        <td class="text-right">${formatCurrency(totalWithInterest)}</td>
        <td class="text-center">${count} months</td>
        <td class="text-right">${formatCurrency(installment)}</td>
        <td><span class="badge bg-primary">${client.loanType || 'Standard'}</span></td>
        <td>
          <button class="btn btn-action btn-outline-info btn-sm" title="View details" onclick="viewClient('${client.id}')">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-action btn-outline-warning btn-sm" title="Edit" onclick="editClient('${client.id}')">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-action ${client.flagged ? 'btn-outline-danger' : 'btn-outline-secondary'} btn-sm" 
                  title="${client.flagged ? 'Unflag client' : 'Flag client'}" 
                  onclick="toggleFlag('${client.id}')">
            <i class="bi ${client.flagged ? 'bi-flag-fill' : 'bi-flag'}"></i>
          </button>
        </td>
      </tr>
    `);
  });

  // Update pagination
  updateDisbursedPagination(filtered.length);
};

window.loadDueClients = function() {
  const tbody = document.getElementById('dueTableBody');
  if (!tbody) {
    console.error("Due table body not found");
    return;
  }

  const searchTerm = document.getElementById('searchDue')?.value?.toLowerCase() || '';
  const filterStatus = document.getElementById('filterDueStatus')?.value || '';
  const filterDateInput = document.getElementById('filterDueDate');
  
  // Set default date to today if not set
  if (!filterDateInput.value) {
    filterDateInput.value = new Date().toISOString().split('T')[0];
  }
  
  const filterDate = filterDateInput.value;
  const today = new Date().toISOString().split('T')[0];
  const selectedDate = new Date(filterDate);
  const isPastDate = selectedDate < new Date(today);

  // Filtered data
  const filtered = clients.filter(client => {
    const installments = client.installments || [];
    const hasDueInstallment = installments.some(inst => inst.date === filterDate);
    const matchesSearch = !searchTerm || 
      (client.name && client.name.toLowerCase().includes(searchTerm)) ||
      (client.idNumber && client.idNumber.toLowerCase().includes(searchTerm));
    
    return hasDueInstallment && matchesSearch;
  });

  // Update summary counts
  let dueCount = 0;
  let dueTotal = 0;
  let collected = 0;
  let totalInstallments = 0;

  filtered.forEach(client => {
    const installments = client.installments || [];
    const dueInstallment = installments.find(inst => inst.date === filterDate);
    if (dueInstallment) {
      const paid = Array.isArray(client.payments) ? 
        client.payments.reduce((a, b) => a + (parseFloat(b) || 0), 0) : 0;
      const amount = parseFloat(client.installment) || 0;
      dueCount++;
      dueTotal += amount;
      collected += paid >= amount ? amount : 0;
      totalInstallments++;
    }
  });
  
  const dueCountEl = document.getElementById('dueCount');
  const dueTotalEl = document.getElementById('dueTotal');
  const collectedEl = document.getElementById('collected');
  const dueInstallmentsEl = document.getElementById('dueInstallments');
  const collectionRateEl = document.getElementById('collectionRate');
  const dueProgressBarEl = document.getElementById('dueProgressBar');
  
  if (dueCountEl) dueCountEl.textContent = dueCount;
  if (dueTotalEl) dueTotalEl.textContent = formatCurrency(dueTotal);
  if (collectedEl) collectedEl.textContent = safeToLocaleString(collected);
  if (dueInstallmentsEl) dueInstallmentsEl.textContent = totalInstallments;
  
  const rate = dueTotal > 0 ? Math.round((collected / dueTotal) * 100) : 0;
  if (collectionRateEl) collectionRateEl.textContent = `${rate}%`;
  if (dueProgressBarEl) {
    dueProgressBarEl.style.width = `${rate}%`;
    dueProgressBarEl.className = 
      rate >= 80 ? 'progress-bar bg-success' : 
      rate >= 50 ? 'progress-bar bg-warning' : 'progress-bar bg-danger';
  }

  // Update summary text
  const dueSummary = document.getElementById('dueSummary');
  if (dueSummary) {
    if (isPastDate) {
      dueSummary.textContent = `No due payments for ${filterDate} (past date - check arrears)`;
    } else if (filterDate === today) {
      dueSummary.textContent = `Showing ${filtered.length} due payments today (Total: ${formatCurrency(dueTotal)})`;
    } else {
      dueSummary.textContent = `Showing ${filtered.length} due payments for ${filterDate} (Total: ${formatCurrency(dueTotal)})`;
    }
  }

  // Render table rows
  tbody.innerHTML = '';
  
  if (filtered.length === 0) {
    let emptyMessage = '';
    if (isPastDate) {
      emptyMessage = `
        <tr>
          <td colspan="9" class="text-center text-muted py-4">
            <i class="bi bi-calendar-x fs-1 d-block mb-2"></i>
            <div class="fw-bold">No due payments for ${filterDate}</div>
            <div class="small">This is a past date. Overdue payments are shown in the Arrears section.</div>
          </td>
        </tr>
      `;
    } else if (filterDate === today) {
      emptyMessage = `
        <tr>
          <td colspan="9" class="text-center text-muted py-4">
            <i class="bi bi-calendar-check fs-1 d-block mb-2"></i>
            <div class="fw-bold">No payments due today</div>
            <div class="small">Great! All clients are up to date with their payments.</div>
          </td>
        </tr>
      `;
    } else {
      emptyMessage = `
        <tr>
          <td colspan="9" class="text-center text-muted py-4">
            <i class="bi bi-calendar-event fs-1 d-block mb-2"></i>
            <div class="fw-bold">No payments due on ${filterDate}</div>
            <div class="small">No installments are scheduled for this date.</div>
          </td>
        </tr>
      `;
    }
    tbody.innerHTML = emptyMessage;
    return;
  }

  filtered.forEach((client, index) => {
    const installments = client.installments || [];
    const dueInstallment = installments.find(inst => inst.date === filterDate);
    if (dueInstallment) {
      const paid = Array.isArray(client.payments) ? 
        client.payments.reduce((a, b) => a + (parseFloat(b) || 0), 0) : 0;
      const amount = parseFloat(client.installment) || 0;
      const principal = amount * 0.8; // Assuming 80% principal, 20% interest
      const interest = amount * 0.2;
      const status = paid >= amount ? 'paid' : 'pending';
      
      // Apply status filter
      if (filterStatus && status !== filterStatus) {
        return;
      }

      const statusBadge = status === 'paid' ? 
        '<span class="badge-status badge-paid">Paid</span>' : 
        '<span class="badge-status badge-pending">Pending</span>';

      tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <td>${index + 1}</td>
          <td>
            <div class="d-flex align-items-center">
              <div class="avatar-placeholder me-2">${(client.name || 'N/A').substring(0, 2).toUpperCase()}</div>
              <div>${client.name || 'N/A'}</div>
            </div>
          </td>
          <td>${client.idNumber || 'LN-' + client.id.substring(0, 8)}</td>
          <td class="nowrap">${filterDate}</td>
          <td class="text-right">${formatCurrency(amount)}</td>
          <td class="text-right">${formatCurrency(principal)}</td>
          <td class="text-right">${formatCurrency(interest)}</td>
          <td>${statusBadge}</td>
          <td>
            ${status === 'paid' ? 
              `<button class="btn btn-action btn-outline-info btn-sm" title="View details" onclick="viewClient('${client.id}')">
                <i class="bi bi-eye"></i>
              </button>
              <button class="btn btn-action btn-outline-secondary btn-sm" title="Receipt">
                <i class="bi bi-receipt"></i>
              </button>
              <button class="btn btn-action ${client.flagged ? 'btn-outline-danger' : 'btn-outline-secondary'} btn-sm" 
                      title="${client.flagged ? 'Unflag client' : 'Flag client'}" 
                      onclick="toggleFlag('${client.id}')">
                <i class="bi ${client.flagged ? 'bi-flag-fill' : 'bi-flag'}"></i>
              </button>` :
              `<button class="btn btn-action btn-outline-success btn-sm" title="Mark as paid" onclick="markAsPaid('${client.id}', '${filterDate}')">
                <i class="bi bi-check-circle"></i>
              </button>
              <button class="btn btn-action btn-outline-info btn-sm" title="View details" onclick="viewClient('${client.id}')">
                <i class="bi bi-eye"></i>
              </button>
              <button class="btn btn-action ${client.flagged ? 'btn-outline-danger' : 'btn-outline-secondary'} btn-sm" 
                      title="${client.flagged ? 'Unflag client' : 'Flag client'}" 
                      onclick="toggleFlag('${client.id}')">
                <i class="bi ${client.flagged ? 'bi-flag-fill' : 'bi-flag'}"></i>
              </button>`
            }
          </td>
        </tr>
      `);
    }
  });

  // Update pagination
  updateDuePagination(filtered.length);
};

// Add missing functions for due modal
window.resetDueFilters = function() {
  const searchDue = document.getElementById('searchDue');
  const filterDueStatus = document.getElementById('filterDueStatus');
  const filterDueDate = document.getElementById('filterDueDate');
  
  if (searchDue) searchDue.value = '';
  if (filterDueStatus) filterDueStatus.value = '';
  if (filterDueDate) filterDueDate.value = new Date().toISOString().split('T')[0];
  
  loadDueClients();
};

window.exportDueData = function() {
  showToast("Exporting due clients data...", "info");
  // In a real app, this would generate a CSV or Excel file
};

window.markAsPaid = function(clientId, dueDate) {
  showToast("Marking payment as received...", "info");
  // In a real app, this would update the database
  loadDueClients(); // Refresh the data
};

window.updateDuePagination = function(totalItems) {
  const startEl = document.getElementById('dueStart');
  const endEl = document.getElementById('dueEnd');
  const totalEl = document.getElementById('dueTotal');
  
  if (startEl) startEl.textContent = '1';
  if (endEl) endEl.textContent = totalItems;
  if (totalEl) totalEl.textContent = totalItems;
};

window.loadArrears = function() {
  const tbody = document.getElementById('arrearsTableBody');
  if (!tbody) {
    console.error("Arrears table body not found");
    return;
  }

  const searchTerm = document.getElementById('searchArrears')?.value?.toLowerCase() || '';
  const filterSeverity = document.getElementById('filterArrearsSeverity')?.value || '';
  const filterMonth = document.getElementById('filterMonthArrears')?.value || '';

  // Filtered data
  const filtered = arrearsClients.filter(client => {
    const matchesSearch = !searchTerm || 
      (client.name && client.name.toLowerCase().includes(searchTerm)) ||
      (client.idNumber && client.idNumber.includes(searchTerm));
    const matchesMonth = !filterMonth || (client.dueDate && client.dueDate.startsWith(filterMonth));
    
    // Apply severity filter
    if (filterSeverity) {
      const daysLate = calculateDaysLate(client.dueDate);
      if (filterSeverity === 'warning' && daysLate > 14) return false;
      if (filterSeverity === 'critical' && daysLate <= 14) return false;
    }
    
    return matchesSearch && matchesMonth;
  });

  // Update summary counts
  let total = 0, count = 0;
  filtered.forEach(client => {
    const overdueAmount = parseFloat(client.overdueAmount) || 0;
    total += overdueAmount;
    count++;
  });
  
  const arrearsCountEl = document.getElementById('arrearsCount');
  const totalArrearsEl = document.getElementById('totalArrears');
  
  if (arrearsCountEl) arrearsCountEl.textContent = count;
  if (totalArrearsEl) totalArrearsEl.textContent = formatCurrency(total);

  // Update summary text
  const arrearsSummary = document.getElementById('arrearsSummary');
  if (arrearsSummary) {
    arrearsSummary.textContent = `Showing ${filtered.length} clients in arrears (Total: ${formatCurrency(total)})`;
  }

  // Render table rows
  tbody.innerHTML = '';
  
  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="text-center text-muted py-4">
          <i class="bi bi-inbox fs-1 d-block mb-2"></i>
          No clients in arrears found
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach((client, index) => {
    const overdueAmount = parseFloat(client.overdueAmount) || 0;
    const daysLate = calculateDaysLate(client.dueDate);
    const lastPayment = client.lastPayment || 'N/A';
    const severity = daysLate > 14 ? 'critical' : 'warning';
    
    const severityBadge = severity === 'critical' ? 
      '<span class="badge-status badge-critical">Critical</span>' : 
      '<span class="badge-status badge-warning">Warning</span>';

    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${index + 1}</td>
        <td>
          <div class="d-flex align-items-center">
            <div class="avatar-placeholder me-2">${(client.name || 'N/A').substring(0, 2).toUpperCase()}</div>
            <div>${client.name || 'N/A'}</div>
          </div>
        </td>
        <td>${client.idNumber || 'LN-' + client.id.substring(0, 8)}</td>
        <td class="text-right">${formatCurrency(overdueAmount)}</td>
        <td class="text-center">${daysLate}</td>
        <td class="nowrap">${lastPayment}</td>
        <td class="nowrap">${client.phone || 'N/A'}</td>
        <td>${severityBadge}</td>
        <td>
          <button class="btn btn-action btn-outline-warning btn-sm" title="Send reminder" onclick="sendReminder('${client.id}')">
            <i class="bi bi-envelope"></i>
          </button>
          <button class="btn btn-action btn-outline-info btn-sm" title="View details" onclick="viewClient('${client.id}')">
            <i class="bi bi-eye"></i>
          </button>
          ${severity === 'critical' ? 
            `<button class="btn btn-action btn-outline-danger btn-sm" title="Flag for follow-up" onclick="flagForFollowUp('${client.id}')">
              <i class="bi bi-flag"></i>
            </button>` : ''
          }
        </td>
      </tr>
    `);
  });

  // Update pagination
  updateArrearsPagination(filtered.length);
};

// Add missing functions for disbursed modal
window.resetDisbursedFilters = function() {
  const searchDisbursed = document.getElementById('searchDisbursed');
  const filterLoanType = document.getElementById('filterLoanType');
  const filterMonth = document.getElementById('filterMonth');
  const filterFlagged = document.getElementById('filterFlagged');
  
  if (searchDisbursed) searchDisbursed.value = '';
  if (filterLoanType) filterLoanType.value = '';
  if (filterMonth) filterMonth.value = '';
  if (filterFlagged) filterFlagged.value = '';
  
  loadDisbursedClients();
};

window.exportDisbursedData = function() {
  showToast("Exporting disbursed clients data...", "info");
  // In a real app, this would generate a CSV or Excel file
};

window.updateDisbursedPagination = function(totalItems) {
  const startEl = document.getElementById('disbursedStart');
  const endEl = document.getElementById('disbursedEnd');
  const totalEl = document.getElementById('disbursedTotal');
  
  if (startEl) startEl.textContent = '1';
  if (endEl) endEl.textContent = totalItems;
  if (totalEl) totalEl.textContent = totalItems;
};

window.editClient = function(clientId) {
  showToast("Edit functionality coming soon...", "info");
  // In a real app, this would open an edit modal or form
};

window.viewClient = function(clientId) {
  const client = clients.find(c => c.id === clientId);
  if (!client) {
    showToast("Client not found", "danger");
    return;
  }
  
  // Populate client detail modal
  const clientDetails = document.getElementById('clientDetails');
  if (clientDetails) {
    clientDetails.innerHTML = `
      <div class="col-12 col-md-6">
        <div class="card-modal-view">
          <div class="card-row">
            <span class="card-label">Name:</span>
            <span class="card-value">${client.name || 'N/A'}</span>
          </div>
          <div class="card-row">
            <span class="card-label">Phone:</span>
            <span class="card-value">${client.phone || 'N/A'}</span>
          </div>
          <div class="card-row">
            <span class="card-label">ID Number:</span>
            <span class="card-value">${client.idNumber || 'N/A'}</span>
          </div>
          <div class="card-row">
            <span class="card-label">Loan Type:</span>
            <span class="card-value">${client.loanType || 'Standard'}</span>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="card-modal-view">
          <div class="card-row">
            <span class="card-label">Loan Amount:</span>
            <span class="card-value important">${formatCurrency(parseFloat(client.installment) || 0)}</span>
          </div>
          <div class="card-row">
            <span class="card-label">Interest Rate:</span>
            <span class="card-value">${client.interestRate || 0}%</span>
          </div>
          <div class="card-row">
            <span class="card-label">Terms:</span>
            <span class="card-value">${Array.isArray(client.installments) ? client.installments.length : 0} months</span>
          </div>
          <div class="card-row">
            <span class="card-label">Disbursed Date:</span>
            <span class="card-value">${client.disbursedDate || 'N/A'}</span>
          </div>
        </div>
      </div>
    `;
  }
  
  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById('clientDetailModal'));
  modal.show();
};

// ✅ Client View Functions
window.viewClient = async function(id) {
  const client = clients.find(c => c.id === id);
  const container = document.getElementById('clientDetails');
  if (!client || !container) return;

  // Calculate payment history
  const payments = Array.isArray(client.payments) ? client.payments : [];
  const totalPaid = payments.reduce((a, b) => a + (parseFloat(b) || 0), 0);
  const installmentAmount = parseFloat(client.installment) || 0;
  const totalExpected = installmentAmount * (Array.isArray(client.installments) ? client.installments.length : 0);
  const balance = totalExpected - totalPaid;

  container.innerHTML = `
    <div class="col-12 col-md-6">
      <div class="card bg-dark text-white p-3 mb-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="card-title mb-0">${client.name || 'N/A'}</h5>
          <span class="badge ${client.flagged ? 'bg-danger' : 'bg-success'}">
            ${client.flagged ? 'Flagged' : 'Active'}
          </span>
        </div>
        <div class="row">
          <div class="col-6">
            <p class="mb-2"><strong><i class="bi bi-person-badge me-2"></i>ID:</strong> ${client.idNumber || 'N/A'}</p>
            <p class="mb-2"><strong><i class="bi bi-telephone me-2"></i>Phone:</strong> ${client.phone || 'N/A'}</p>
          </div>
          <div class="col-6">
            <p class="mb-2"><strong><i class="bi bi-calendar me-2"></i>Disbursed:</strong> ${client.disbursedDate || 'N/A'}</p>
            <p class="mb-2"><strong><i class="bi bi-cash-stack me-2"></i>Loan Type:</strong> ${client.loanType || 'Standard'}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-6">
      <div class="card bg-dark text-white p-3">
        <h6 class="mb-3"><i class="bi bi-graph-up me-2"></i>Loan Details</h6>
        <div class="row">
          <div class="col-6">
            <p class="mb-2"><strong>Principal:</strong> ${formatCurrency(installmentAmount)}</p>
            <p class="mb-2"><strong>Interest Rate:</strong> ${client.interestRate || '0'}%</p>
          </div>
          <div class="col-6">
            <p class="mb-2"><strong>Term:</strong> ${Array.isArray(client.installments) ? client.installments.length : '0'} weeks</p>
            <p class="mb-2"><strong>Total:</strong> ${formatCurrency(totalExpected)}</p>
          </div>
        </div>
        <div class="progress mt-2 mb-2" style="height: 10px;">
          <div class="progress-bar bg-success" role="progressbar" 
               style="width: ${totalExpected > 0 ? (totalPaid / totalExpected * 100) : 0}%" 
               aria-valuenow="${totalPaid}" 
               aria-valuemin="0" 
               aria-valuemax="${totalExpected}"></div>
        </div>
        <div class="d-flex justify-content-between mb-2">
          <small>Paid: ${formatCurrency(totalPaid)}</small>
          <small>Balance: ${formatCurrency(balance)}</small>
        </div>
        <hr class="my-2">
        <div class="d-flex justify-content-between">
          <button class="btn btn-sm btn-outline-info" onclick="showPaymentHistory('${client.id}')">
            <i class="bi bi-clock-history me-1"></i>Payment History
          </button>
          <button class="btn btn-sm ${client.flagged ? 'btn-outline-warning' : 'btn-outline-danger'}" 
                  onclick="toggleFlag('${client.id}')">
            <i class="bi ${client.flagged ? 'bi-flag' : 'bi-flag-fill'} me-1"></i>
            ${client.flagged ? 'Unflag' : 'Flag'}
          </button>
        </div>
      </div>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById('clientDetailModal'));
  modal.show();
};

window.toggleFlag = async function(id) {
  const client = clients.find(c => c.id === id);
  if (!client) {
    showToast("Client not found", "danger");
    return;
  }

  try {
    console.log("Toggling flag for client:", client.name, "ID:", id);
    console.log("Current flagged status:", client.flagged);
    
    const clientRef = doc(db, 'loans', id);
    const newFlaggedStatus = !client.flagged;
    
    console.log("Updating to flagged status:", newFlaggedStatus);
    
    await updateDoc(clientRef, {
      flagged: newFlaggedStatus
    });
    
    // Update local client data
    client.flagged = newFlaggedStatus;
    
    showToast(`Client ${client.name} ${newFlaggedStatus ? 'flagged' : 'unflagged'} successfully`, "success");
    
    // Refresh the data to show updated status
    fetchClients();
    
  } catch (error) {
    console.error("Error updating flag status:", error);
    console.error("Error details:", {
      clientId: id,
      clientName: client?.name,
      currentFlagged: client?.flagged,
      errorCode: error.code,
      errorMessage: error.message
    });
    
    // Try alternative approach - update local data and show success
    client.flagged = !client.flagged;
    showToast(`Client ${client.name} ${client.flagged ? 'flagged' : 'unflagged'} (local update)`, "warning");
    
    // Refresh the display
    loadArrears();
  }
};

// Function to flag a client for follow-up (used in arrears table)
window.flagForFollowUp = async function(id) {
  const client = clients.find(c => c.id === id);
  if (!client) {
    showToast("Client not found", "danger");
    return;
  }

  try {
    console.log("Flagging client for follow-up:", client.name, "ID:", id);
    
    const clientRef = doc(db, 'loans', id);
    
    await updateDoc(clientRef, {
      flagged: true,
      flaggedDate: new Date().toISOString(),
      flaggedReason: 'Follow-up required - arrears'
    });
    
    // Update local client data
    client.flagged = true;
    client.flaggedDate = new Date().toISOString();
    client.flaggedReason = 'Follow-up required - arrears';
    
    showToast(`Client ${client.name} flagged for follow-up`, "success");
    
    // Refresh the data
    fetchClients();
    
  } catch (error) {
    console.error("Error flagging client for follow-up:", error);
    
    // Update local data anyway
    client.flagged = true;
    client.flaggedDate = new Date().toISOString();
    client.flaggedReason = 'Follow-up required - arrears';
    
    showToast(`Client ${client.name} flagged for follow-up (local update)`, "warning");
    
    // Refresh the display
    loadArrears();
  }
};

// Function to send reminder (used in arrears table)
window.sendReminder = function(id) {
  const client = clients.find(c => c.id === id);
  if (!client) {
    showToast("Client not found", "danger");
    return;
  }

  showToast(`Reminder sent to ${client.name}`, "success");
  // In a real app, this would integrate with SMS/email service
};

// Function to set due date filter to today
window.setDueDateToToday = function() {
  const filterDueDate = document.getElementById('filterDueDate');
  if (filterDueDate) {
    filterDueDate.value = new Date().toISOString().split('T')[0];
    loadDueClients();
    showToast("Date set to today", "info");
  }
};

window.showPaymentHistory = function(id) {
  const client = clients.find(c => c.id === id);
  if (!client) return;

  const payments = Array.isArray(client.payments) ? client.payments : [];
  const installments = Array.isArray(client.installments) ? client.installments : [];
  const installmentAmount = parseFloat(client.installment) || 0;

  let historyHTML = '<div class="table-responsive"><table class="table table-dark table-hover">';
  historyHTML += `
    <thead>
      <tr>
        <th>Date</th>
        <th>Amount</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
  `;

  installments.forEach((inst, index) => {
    const paidAmount = index < payments.length ? parseFloat(payments[index]) || 0 : 0;
    const status = paidAmount >= installmentAmount ? 'Paid' : 'Unpaid';
    historyHTML += `
      <tr>
        <td>${inst.date || 'N/A'}</td>
        <td>${formatCurrency(paidAmount)}</td>
        <td><span class="badge ${status === 'Paid' ? 'bg-success' : 'bg-warning'}">${status}</span></td>
      </tr>
    `;
  });

  historyHTML += '</tbody></table></div>';

  const modal = new bootstrap.Modal(document.getElementById('paymentHistoryModal'));
  document.getElementById('paymentHistoryContent').innerHTML = historyHTML;
  modal.show();
};

// ✅ Utility Functions
function calculateDaysLate(dueDateString) {
  if (!dueDateString) return 'N/A';
  const due = new Date(dueDateString);
  const today = new Date();
  const diff = Math.floor((today - due) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

function getDueDate(disbursedDate, weeksPassed = 1) {
  if (!disbursedDate) return '';
  const date = new Date(disbursedDate);
  date.setDate(date.getDate() + 7 * weeksPassed);
  return date.toISOString().split('T')[0];
}

// ✅ Chart Functions
window.createChart = function(labels, loanCounts, loanAmounts) {
  const ctx = document.getElementById("loanTrendsChart");
  if (!ctx) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Loans Disbursed (Count)',
          data: loanCounts,
          backgroundColor: '#0aa2c0',
          borderRadius: 6,
          yAxisID: 'y'
        },
        {
          type: 'line',
          label: 'Amount Disbursed (KES)',
          data: loanAmounts,
          borderColor: '#f5c518',
          backgroundColor: 'rgba(245, 197, 24, 0.2)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#f5c518',
          pointRadius: 5,
          pointHoverRadius: 7,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Loan Count'
          },
          ticks: {
            color: '#ccc'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Amount (KES)'
          },
          ticks: {
            color: '#ccc',
            callback: value => safeToLocaleString(value)
          },
          grid: {
            drawOnChartArea: false
          }
        },
        x: {
          ticks: { 
            color: '#ccc' 
          },
          grid: { 
            color: 'rgba(255, 255, 255, 0.1)' 
          }
        }
      },
      plugins: {
        legend: { 
          labels: { 
            color: '#fff',
            font: {
              weight: '600'
            }
          } 
        },
        tooltip: {
          backgroundColor: '#1a1a1a',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#333',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label.includes('Amount')) {
                return `${label}: KES ${safeToLocaleString(context.raw)}`;
              }
              return `${label}: ${context.raw}`;
            }
          }
        }
      }
    }
  });
};

window.updateChartByMonth = function() {
  const range = document.getElementById('monthRange').value;
  let start = 0, end = chartData.labels.length;

  switch (range) {
    case 'Q1': start = 0; end = 3; break;
    case 'Q2': start = 3; end = 6; break;
    case 'Q3': start = 6; end = 9; break;
    case 'Q4': start = 9; end = 12; break;
  }

  createChart(
    chartData.labels.slice(start, end),
    chartData.disbursedCounts.slice(start, end),
    chartData.disbursedAmounts.slice(start, end)
  );
};

// ✅ Reports Functions
const reports = [
  {
    name: 'Customer Account Statement',
    description: 'Detailed statement of customer account activity',
    action: 'viewAccountStatement()'
  },
  {
    name: 'Loans Due By Date',
    description: 'List of loans due by selected date range',
    action: 'viewLoansDue()'
  },
  {
    name: 'M-PESA Repayments',
    description: 'Detailed listing of all M-PESA repayments',
    action: 'viewMpesaRepayments()'
  },
  {
    name: 'Portfolio At Risk',
    description: 'Analysis of loans in arrears by duration',
    action: 'viewPortfolioRisk()'
  },
  {
    name: 'Disbursement Summary',
    description: 'Summary of loans disbursed by period',
    action: 'viewDisbursementSummary()'
  }
];

window.populateReportTable = function() {
  const tbody = document.getElementById('reportTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  reports.forEach(report => {
    const row = `
      <tr>
        <td class="fw-bold">${report.name}</td>
        <td class="text-muted">${report.description}</td>
        <td>
          <button class="btn btn-sm btn-outline-info" onclick="${report.action}">
            <i class="bi bi-eye me-1"></i>View
          </button>
        </td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', row);
  });
};

window.filterReports = function() {
  const value = document.getElementById('reportSearch').value.toLowerCase();
  const tbody = document.getElementById('reportTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  reports.filter(r => 
    r.name.toLowerCase().includes(value) || 
    r.description.toLowerCase().includes(value)
  ).forEach(report => {
    const row = `
      <tr>
        <td class="fw-bold">${report.name}</td>
        <td class="text-muted">${report.description}</td>
        <td>
          <button class="btn btn-sm btn-outline-info" onclick="${report.action}">
            <i class="bi bi-eye me-1"></i>View
          </button>
        </td>
      </tr>
    `;
    tbody.insertAdjacentHTML('beforeend', row);
  });
};

// Dummy report actions
function viewAccountStatement() {
  showToast("Customer Account Statement generated", "info");
}

function viewLoansDue() {
  showToast("Loans Due report generated", "info");
}

function viewMpesaRepayments() {
  showToast("M-PESA Repayments report generated", "info");
}

function viewPortfolioRisk() {
  showToast("Portfolio At Risk analysis generated", "info");
}

function viewDisbursementSummary() {
  showToast("Disbursement Summary report generated", "info");
}

// ✅ Mobile Filter Functions
window.toggleMobileSearch = function(searchId) {
  const mobileSearchId = 'mobileSearch' + searchId.charAt(0).toUpperCase() + searchId.slice(1);
  const mobileSearchElement = document.getElementById(mobileSearchId);
  
  if (mobileSearchElement) {
    const isHidden = mobileSearchElement.classList.contains('d-none');
    if (isHidden) {
      mobileSearchElement.classList.remove('d-none');
      const input = mobileSearchElement.querySelector('input');
      if (input) {
        input.focus();
        // Connect the mobile search input to the original search function
        input.addEventListener('input', function() {
          const originalInput = document.getElementById(searchId);
          if (originalInput) {
            originalInput.value = this.value;
            originalInput.dispatchEvent(new Event('input'));
          }
        });
      }
    } else {
      mobileSearchElement.classList.add('d-none');
      const input = mobileSearchElement.querySelector('input');
      if (input) {
        input.value = '';
        // Trigger the original search input
        const originalInput = document.getElementById(searchId);
        if (originalInput) {
          originalInput.value = '';
          originalInput.dispatchEvent(new Event('input'));
        }
      }
    }
  }
};

window.toggleMobileFilter = function(filterId) {
  const filterElement = document.getElementById(filterId);
  if (!filterElement) return;

  // Create a mobile-friendly filter modal
  const modalId = 'mobileFilterModal';
  let existingModal = document.getElementById(modalId);
  if (existingModal) {
    existingModal.remove();
  }

  let modalContent = '';
  let title = '';
  let currentValue = filterElement.value;
  let currentText = '';

  if (filterElement.tagName === 'SELECT') {
    title = 'Select Filter Option';
    currentText = filterElement.options[filterElement.selectedIndex]?.text || 'All';
    
    modalContent = `
      <div class="modal-header border-0">
        <h5 class="modal-title">${title}</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div class="list-group list-group-flush">
    `;
    
    Array.from(filterElement.options).forEach(option => {
      const isActive = option.value === currentValue;
      modalContent += `
        <button type="button" class="list-group-item list-group-item-action bg-dark text-white border-secondary ${isActive ? 'active' : ''}" 
                onclick="selectMobileFilterOption('${filterId}', '${option.value}')" data-bs-dismiss="modal">
          ${option.text}
          ${isActive ? '<i class="bi bi-check-circle ms-auto"></i>' : ''}
        </button>
      `;
    });
    
    modalContent += `
        </div>
      </div>
    `;
  } else if (filterElement.type === 'date' || filterElement.type === 'month') {
    title = 'Select Date';
    currentText = filterElement.value || 'Not set';
    
    modalContent = `
      <div class="modal-header border-0">
        <h5 class="modal-title">${title}</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <label class="form-label">Current: ${currentText}</label>
          <input type="${filterElement.type}" class="form-control bg-dark text-white border-secondary" 
                 id="mobileDateInput" value="${filterElement.value}">
        </div>
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-outline-secondary" onclick="applyMobileDateFilter('${filterId}')" data-bs-dismiss="modal">
            Apply
          </button>
          <button type="button" class="btn btn-outline-danger" onclick="clearMobileDateFilter('${filterId}')" data-bs-dismiss="modal">
            Clear
          </button>
        </div>
      </div>
    `;
  }

  // Create and show the modal
  const modalHTML = `
    <div class="modal fade" id="${modalId}" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-white">
          ${modalContent}
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const modal = new bootstrap.Modal(document.getElementById(modalId));
  modal.show();
  
  // Clean up modal after it's hidden
  document.getElementById(modalId).addEventListener('hidden.bs.modal', function() {
    this.remove();
  });
};

// Function to select filter option for select elements
window.selectMobileFilterOption = function(filterId, value) {
  const filterElement = document.getElementById(filterId);
  if (filterElement) {
    filterElement.value = value;
    filterElement.dispatchEvent(new Event('change'));
    
    // Show feedback
    const selectedOption = filterElement.options[filterElement.selectedIndex];
    showToast(`Filter set to: ${selectedOption.text}`, 'success');
  }
};

// Function to apply date filter
window.applyMobileDateFilter = function(filterId) {
  const filterElement = document.getElementById(filterId);
  const mobileInput = document.getElementById('mobileDateInput');
  
  if (filterElement && mobileInput) {
    filterElement.value = mobileInput.value;
    filterElement.dispatchEvent(new Event('change'));
    showToast('Date filter applied', 'success');
  }
};

// Function to clear date filter
window.clearMobileDateFilter = function(filterId) {
  const filterElement = document.getElementById(filterId);
  if (filterElement) {
    filterElement.value = '';
    filterElement.dispatchEvent(new Event('change'));
    showToast('Date filter cleared', 'info');
  }
};

// ========== MODAL HEADER SCROLL HIDE EFFECT ==========
let lastScrollTop = 0;
let scrollTimeout;

// Function to handle modal scroll and hide/show header
function handleModalScroll(event) {
  const modalBody = event.target;
  const modalHeader = modalBody.closest('.modal-content').querySelector('.modal-header');
  const filterControls = modalBody.closest('.modal-content').querySelector('.filter-controls');
  
  if (!modalHeader) return;
  
  const scrollTop = modalBody.scrollTop;
  const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
  
  // Clear existing timeout
  clearTimeout(scrollTimeout);
  
  if (scrollDirection === 'down' && scrollTop > 50) {
    // Scrolling down - hide header and filter controls
    modalHeader.classList.add('header-hidden');
    if (filterControls) {
      filterControls.classList.add('controls-hidden');
    }
  } else if (scrollDirection === 'up' || scrollTop <= 50) {
    // Scrolling up or at top - show header and filter controls
    modalHeader.classList.remove('header-hidden');
    if (filterControls) {
      filterControls.classList.remove('controls-hidden');
    }
  }
  
  lastScrollTop = scrollTop;
  
  // Set timeout to show header after scrolling stops
  scrollTimeout = setTimeout(() => {
    modalHeader.classList.remove('header-hidden');
    if (filterControls) {
      filterControls.classList.remove('controls-hidden');
    }
  }, 1500);
}

// Function to initialize scroll listeners for modals
function initializeModalScrollListeners() {
  // Listen for modal show events
  document.addEventListener('shown.bs.modal', function(event) {
    const modal = event.target;
    const modalBody = modal.querySelector('.modal-body');
    
    if (modalBody) {
      // Remove existing listener to prevent duplicates
      modalBody.removeEventListener('scroll', handleModalScroll);
      // Add scroll listener
      modalBody.addEventListener('scroll', handleModalScroll);
      
      // Reset scroll position and header state
      modalBody.scrollTop = 0;
      const modalHeader = modal.querySelector('.modal-header');
      const filterControls = modal.querySelector('.filter-controls');
      
      if (modalHeader) {
        modalHeader.classList.remove('header-hidden');
      }
      if (filterControls) {
        filterControls.classList.remove('controls-hidden');
      }
    }
  });
  
  // Listen for modal hide events to clean up
  document.addEventListener('hidden.bs.modal', function(event) {
    const modal = event.target;
    const modalBody = modal.querySelector('.modal-body');
    
    if (modalBody) {
      modalBody.removeEventListener('scroll', handleModalScroll);
    }
    
    // Clear timeout
    clearTimeout(scrollTimeout);
    lastScrollTop = 0;
  });
}

// Initialize modal scroll listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeModalScrollListeners();
});

// Also initialize for dynamically created modals
document.addEventListener('click', function(event) {
  if (event.target.matches('[data-bs-toggle="modal"]') || 
      event.target.closest('[data-bs-toggle="modal"]')) {
    // Small delay to ensure modal is created
    setTimeout(initializeModalScrollListeners, 100);
  }
});

// ✅ Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  try { initThemeFromStorage(); } catch(e) { console.error('Theme init error', e); }
  
  // Initialize Firebase and fetch data
  try { 
    fetchClients(); 
    
    // Initialize due date filter to today
    const filterDueDate = document.getElementById('filterDueDate');
    if (filterDueDate && !filterDueDate.value) {
      filterDueDate.value = new Date().toISOString().split('T')[0];
    }
    
    // Add event listeners for search/filter inputs
    const searchDisbursed = document.getElementById('searchDisbursed');
    if (searchDisbursed) {
      searchDisbursed.addEventListener('input', loadDisbursedClients);
    }
    
    const filterMonth = document.getElementById('filterMonth');
    if (filterMonth) {
      filterMonth.addEventListener('change', loadDisbursedClients);
    }
    
    if (filterDueDate) {
      filterDueDate.addEventListener('change', loadDueClients);
    }
    
    const searchArrears = document.getElementById('searchArrears');
    if (searchArrears) {
      searchArrears.addEventListener('input', loadArrears);
    }
    
    const filterMonthArrears = document.getElementById('filterMonthArrears');
    if (filterMonthArrears) {
      filterMonthArrears.addEventListener('change', loadArrears);
    }
    
    const monthRange = document.getElementById('monthRange');
    if (monthRange) {
      monthRange.addEventListener('change', updateChartByMonth);
    }
  } catch(e) { 
    console.error('Data fetch error', e); 
    showToast("Failed to load data. Please refresh the page.", "danger");
  }
  
  try { loadNotifications(); } catch(e) { console.error('Notif load error', e); }

  // Set up event listeners directly for static elements
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  const loanFormToggle = document.getElementById('loanFormToggle');
  if (loanFormToggle) loanFormToggle.addEventListener('click', openLoanForm);
  const notificationBtn = document.getElementById('notificationBtn');
  if (notificationBtn) notificationBtn.addEventListener('click', toggleNotifications);
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) refreshBtn.addEventListener('click', animateRefresh);
  const sidebarMenuBtn = document.getElementById('sidebarMenuBtn');
  if (sidebarMenuBtn) sidebarMenuBtn.addEventListener('click', toggleSidebar);
  const overlay = document.getElementById('overlay');
  if (overlay) overlay.addEventListener('click', closeSidebar);
  const openDisbursedModalCard = document.getElementById('openDisbursedModalCard');
  if (openDisbursedModalCard) openDisbursedModalCard.addEventListener('click', openDisbursedModal);
  const openDueModalCard = document.getElementById('openDueModalCard');
  if (openDueModalCard) openDueModalCard.addEventListener('click', openDueModal);
  const openArrearsModalCard = document.getElementById('openArrearsModalCard');
  if (openArrearsModalCard) openArrearsModalCard.addEventListener('click', openArrearsModal);
  const openBranchReportsLink = document.getElementById('openBranchReportsLink');
  if (openBranchReportsLink) openBranchReportsLink.addEventListener('click', openBranchReports);
  const closeLoanFormFrameBtn = document.getElementById('closeLoanFormFrameBtn');
  if (closeLoanFormFrameBtn) closeLoanFormFrameBtn.addEventListener('click', closeLoanForm);
  const reportsDropdownToggle = document.getElementById('reportsDropdownToggle');
  if (reportsDropdownToggle) reportsDropdownToggle.addEventListener('click', function() {
    toggleDropdown('reportsDropdown', this);
  });

  // Initialize tooltips
  try {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  } catch(e) { /* ignore if tooltips fail */ }
});

// Handle messages from iframe
window.addEventListener('message', (event) => {
  const { type } = event.data || {};

  switch (type) {
    case 'request-theme':
      const theme = localStorage.getItem('dashboard-theme') || 'dark';
      event.source?.postMessage({ type: 'theme-change', theme }, '*');
      break;

    case 'close-form':
      closeLoanForm();
      break;

    case 'loan-created':
      showToast("New loan created successfully", "success");
      fetchClients(); // Refresh data
      break;

    default:
      break;
  }
});

// Start the application
if (db) {
  fetchClients();
} else {
  showToast("Database connection failed", "danger");
}

// ✅ Enhanced Mobile Filter Functions
window.toggleMobileFilter = function(filterId) {
  const filterElement = document.getElementById(filterId);
  if (!filterElement) return;

  // Create a mobile-friendly filter modal
  const modalId = 'mobileFilterModal';
  let existingModal = document.getElementById(modalId);
  if (existingModal) {
    existingModal.remove();
  }

  let modalContent = '';
  let title = '';
  let currentValue = filterElement.value;
  let currentText = '';

  if (filterElement.tagName === 'SELECT') {
    title = 'Select Filter Option';
    currentText = filterElement.options[filterElement.selectedIndex]?.text || 'All';
    
    modalContent = `
      <div class="modal-header border-0">
        <h5 class="modal-title">${title}</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div class="list-group list-group-flush">
    `;
    
    Array.from(filterElement.options).forEach(option => {
      const isActive = option.value === currentValue;
      modalContent += `
        <button type="button" class="list-group-item list-group-item-action bg-dark text-white border-secondary ${isActive ? 'active' : ''}" 
                onclick="selectMobileFilterOption('${filterId}', '${option.value}')" data-bs-dismiss="modal">
          ${option.text}
          ${isActive ? '<i class="bi bi-check-circle ms-auto"></i>' : ''}
        </button>
      `;
    });
    
    modalContent += `
        </div>
      </div>
    `;
  } else if (filterElement.type === 'date' || filterElement.type === 'month') {
    title = 'Select Date';
    currentText = filterElement.value || 'Not set';
    
    modalContent = `
      <div class="modal-header border-0">
        <h5 class="modal-title">${title}</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <label class="form-label">Current: ${currentText}</label>
          <input type="${filterElement.type}" class="form-control bg-dark text-white border-secondary" 
                 id="mobileDateInput" value="${filterElement.value}">
        </div>
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-outline-secondary" onclick="applyMobileDateFilter('${filterId}')" data-bs-dismiss="modal">
            Apply
          </button>
          <button type="button" class="btn btn-outline-danger" onclick="clearMobileDateFilter('${filterId}')" data-bs-dismiss="modal">
            Clear
          </button>
        </div>
      </div>
    `;
  }

  // Create and show the modal
  const modalHTML = `
    <div class="modal fade" id="${modalId}" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-white">
          ${modalContent}
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const modal = new bootstrap.Modal(document.getElementById(modalId));
  modal.show();
  
  // Clean up modal after it's hidden
  document.getElementById(modalId).addEventListener('hidden.bs.modal', function() {
    this.remove();
  });
};

// Function to select filter option for select elements
window.selectMobileFilterOption = function(filterId, value) {
  const filterElement = document.getElementById(filterId);
  if (filterElement) {
    filterElement.value = value;
    filterElement.dispatchEvent(new Event('change'));
    
    // Show feedback
    const selectedOption = filterElement.options[filterElement.selectedIndex];
    showToast(`Filter set to: ${selectedOption.text}`, 'success');
  }
};

// Function to apply date filter
window.applyMobileDateFilter = function(filterId) {
  const filterElement = document.getElementById(filterId);
  const mobileInput = document.getElementById('mobileDateInput');
  
  if (filterElement && mobileInput) {
    filterElement.value = mobileInput.value;
    filterElement.dispatchEvent(new Event('change'));
    showToast('Date filter applied', 'success');
  }
};

// Function to clear date filter
window.clearMobileDateFilter = function(filterId) {
  const filterElement = document.getElementById(filterId);
  if (filterElement) {
    filterElement.value = '';
    filterElement.dispatchEvent(new Event('change'));
    showToast('Date filter cleared', 'info');
  }
};