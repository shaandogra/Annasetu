/**
 * AnnaSetu — Core Logistics & Real-Time Coordination Engine
 * Modern Vanilla JavaScript with LocalStorage State & Audio Synthesis
 */

// Initial Seed Data (Resilient fallback for 24-hour hackathon demo)
const DEFAULT_LISTINGS = [
  {
    id: 'L-101',
    title: '40 Portions Paneer Rice & Fresh Dal',
    donor: 'Hotel Grand Palace',
    category: 'COOKED',
    dietary: 'VEG',
    servings: 40,
    distanceKm: 1.8,
    remainingSeconds: 3 * 3600, // 3 hours
    totalWindowSeconds: 3 * 3600,
    notes: 'Packed in 2 thermal insulated containers. Keep covered.',
    status: 'AVAILABLE', // AVAILABLE, CLAIMED, COMPLETED, EXPIRED
    pickupPin: '7419',
    address: 'Grand Palace Central Kitchen Gate 2, MG Road',
    claimedBy: null,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'L-102',
    title: '25 Fresh Bread Loaves & Vegetable Buns',
    donor: 'City Artisan Bakery',
    category: 'BAKERY',
    dietary: 'VEG',
    servings: 25,
    distanceKm: 3.2,
    remainingSeconds: 6 * 3600, // 6 hours
    totalWindowSeconds: 6 * 3600,
    notes: 'Room temperature storage. Baked fresh this morning.',
    status: 'AVAILABLE',
    pickupPin: '3892',
    address: 'Connaught Lane Bakery Hub, Block C',
    claimedBy: null,
    createdAt: new Date(Date.now() - 40 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'L-103',
    title: '30 Boxed Nutritious Thali Meals',
    donor: 'TechPark Cafeteria',
    category: 'COOKED',
    dietary: 'NON_VEG',
    servings: 30,
    distanceKm: 4.1,
    remainingSeconds: 45 * 60, // 45 mins
    totalWindowSeconds: 2 * 3600,
    notes: 'Prepared 12:00 PM. Includes chicken curry, rice, and salad.',
    status: 'CLAIMED',
    pickupPin: '9154',
    address: 'TechPark Tower B Kitchen, Gate 1',
    claimedBy: 'Seva Children Home',
    createdAt: new Date(Date.now() - 75 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'L-104',
    title: '15 kg Seasonal Mixed Fruits (Bananas & Oranges)',
    donor: 'Metro Wholesale Mandi',
    category: 'PRODUCE',
    dietary: 'VEGAN',
    servings: 45,
    distanceKm: 5.5,
    remainingSeconds: 0,
    totalWindowSeconds: 4 * 3600,
    notes: 'Safe for consumption. Over-ripe skin.',
    status: 'EXPIRED',
    pickupPin: '1122',
    address: 'Wholesale Mandi Yard 4',
    claimedBy: null,
    createdAt: new Date(Date.now() - 5 * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'L-105',
    title: '50 Hot Samosas & Fresh Mint Chutney',
    donor: 'Royal Banquet Hall',
    category: 'COOKED',
    dietary: 'VEG',
    servings: 50,
    distanceKm: 2.2,
    remainingSeconds: 0,
    totalWindowSeconds: 2 * 3600,
    notes: 'Successfully delivered to shelter.',
    status: 'COMPLETED',
    pickupPin: '4421',
    address: 'Civil Lines Banquet Suite',
    claimedBy: 'Asha Community Shelter',
    createdAt: new Date(Date.now() - 3 * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

const DEFAULT_AUDIT_LOGS = [
  { time: '12:15 PM', type: 'info', text: 'Listing L-103 reserved by Seva Children Home. Handover PIN #9154 generated.' },
  { time: '11:45 AM', type: 'success', text: 'Listing L-105 verified with PIN #4421. 50 meals marked COMPLETED.' },
  { time: '10:30 AM', type: 'warn', text: 'Listing L-104 auto-expired after 4-hour window elapsed without pickup.' },
  { time: '09:00 AM', type: 'info', text: 'System initialized with active municipal FSSAI food recovery parameters.' }
];

// App State
let listings = [];
let auditLogs = [];
let activeNgoFilter = 'all';

// Authentication & Session State
let currentUser = null;
let authToken = null;
let currentAuthRole = 'donor'; // 'donor' or 'ngo'
let currentAuthMode = 'signin'; // 'signin' or 'register'
let pendingVerification = { email: '', userId: '', otp: '' };
let pendingForgot = { email: '', userId: '', otp: '' };

// Audio Feedback Synthesizer (Zero external dependencies)
function playTone(type) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'success') {
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } else if (type === 'claim') {
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } else if (type === 'error') {
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      osc.frequency.setValueAtTime(180, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    }
  } catch (e) {
    // AudioContext blocked or unsupported, silent fallback
  }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initAuth();
  renderAllViews();
  startCountdownEngine();
});

// State Persistence
function loadState() {
  const savedListings = localStorage.getItem('annasetu_listings');
  const savedLogs = localStorage.getItem('annasetu_audit');

  if (savedListings && savedLogs) {
    try {
      listings = JSON.parse(savedListings);
      auditLogs = JSON.parse(savedLogs);
    } catch (e) {
      resetDemoData();
    }
  } else {
    resetDemoData();
  }
}

function saveState() {
  localStorage.setItem('annasetu_listings', JSON.stringify(listings));
  localStorage.setItem('annasetu_audit', JSON.stringify(auditLogs));
}

function resetDemoData() {
  listings = JSON.parse(JSON.stringify(DEFAULT_LISTINGS));
  auditLogs = JSON.parse(JSON.stringify(DEFAULT_AUDIT_LOGS));
  saveState();
  renderAllViews();
  showToast('Demo data reset to clean initial state', 'info');
  playTone('info');
}

// Perspective Switcher
function switchPerspective(role) {
  document.querySelectorAll('.portal-view').forEach(el => el.classList.remove('active-view'));
  document.querySelectorAll('.role-tab-btn').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.mobile-nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.bottom-nav-item').forEach(el => el.classList.remove('active'));

  if (role === 'auth') {
    const v = document.getElementById('viewAuth');
    const t = document.getElementById('tabAuth');
    const mobT = document.getElementById('mobTabAuth');
    const bNav = document.getElementById('bNavAuth');
    if (v) v.classList.add('active-view');
    if (t) t.classList.add('active');
    if (mobT) mobT.classList.add('active');
    if (bNav) bNav.classList.add('active');
  } else if (role === 'donor') {
    const v = document.getElementById('viewDonor');
    const t = document.getElementById('tabDonor');
    const mobT = document.getElementById('mobTabDonor');
    const bNav = document.getElementById('bNavDonor');
    if (v) v.classList.add('active-view');
    if (t) t.classList.add('active');
    if (mobT) mobT.classList.add('active');
    if (bNav) bNav.classList.add('active');
  } else if (role === 'ngo') {
    const v = document.getElementById('viewNgo');
    const t = document.getElementById('tabNgo');
    const mobT = document.getElementById('mobTabNgo');
    const bNav = document.getElementById('bNavNgo');
    if (v) v.classList.add('active-view');
    if (t) t.classList.add('active');
    if (mobT) mobT.classList.add('active');
    if (bNav) bNav.classList.add('active');
  } else if (role === 'admin') {
    const v = document.getElementById('viewAdmin');
    const t = document.getElementById('tabAdmin');
    const mobT = document.getElementById('mobTabAdmin');
    const bNav = document.getElementById('bNavAdmin');
    if (v) v.classList.add('active-view');
    if (t) t.classList.add('active');
    if (mobT) mobT.classList.add('active');
    if (bNav) bNav.classList.add('active');
  } else if (role === 'judge') {
    const v = document.getElementById('viewJudge');
    const t = document.getElementById('tabJudge');
    const mobT = document.getElementById('mobTabJudge');
    if (v) v.classList.add('active-view');
    if (t) t.classList.add('active');
    if (mobT) mobT.classList.add('active');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Master Render Function
function renderAllViews() {
  renderDonorView();
  renderNgoView();
  renderAdminView();
  updateHeroStats();
}

// Real-Time Countdown Tick Engine (Runs every 1 second)
function startCountdownEngine() {
  setInterval(() => {
    let stateChanged = false;

    listings.forEach(item => {
      if (item.status === 'AVAILABLE' || item.status === 'CLAIMED') {
        if (item.remainingSeconds > 0) {
          item.remainingSeconds -= 1;
        } else if (item.status === 'AVAILABLE') {
          // Auto-Expiry Safeguard
          item.status = 'EXPIRED';
          stateChanged = true;
          logAudit(`Listing ${item.id} (${item.title}) expired past pickup deadline.`, 'warn');
          showToast(`Listing ${item.id} has expired!`, 'warning');
        }
      }
    });

    // Update displayed timers on DOM without full rerender
    updateTimerBadges();

    if (stateChanged) {
      saveState();
      renderAllViews();
    }
  }, 1000);
}

function formatCountdown(seconds) {
  if (seconds <= 0) return '00:00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? h + 'h ' : ''}${m}m ${s < 10 ? '0' : ''}${s}s`;
}

function updateTimerBadges() {
  listings.forEach(item => {
    const el = document.getElementById(`timer-${item.id}`);
    if (el) {
      if (item.status === 'AVAILABLE') {
        el.innerHTML = `⏱️ Expires in ${formatCountdown(item.remainingSeconds)}`;
      } else if (item.status === 'CLAIMED') {
        el.innerHTML = `⏳ Pickup window: ${formatCountdown(item.remainingSeconds)}`;
      }
    }
  });
}

// Render Donor Portal
function renderDonorView() {
  const feed = document.getElementById('donorListingsFeed');
  if (!feed) return;

  const donorListings = listings.filter(item => item.donor === 'Hotel Grand Palace');
  const activeCount = donorListings.filter(item => item.status === 'AVAILABLE' || item.status === 'CLAIMED').length;
  
  const countBadge = document.getElementById('badgeDonorActiveCount');
  if (countBadge) countBadge.innerText = `${activeCount} Active`;

  if (donorListings.length === 0) {
    feed.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem;">No listings posted yet. Use the form on the left to publish fresh surplus!</div>`;
    return;
  }

  feed.innerHTML = donorListings.map(item => {
    const statusClass = `status-${item.status.toLowerCase()}`;
    const badgeClass = `badge-${item.status.toLowerCase()}`;
    
    return `
      <div class="listing-card glass-panel ${statusClass}">
        <div class="listing-main-info">
          <div class="listing-header-line">
            <span class="listing-title">${escapeHtml(item.title)}</span>
            <span class="badge ${badgeClass}">${item.status}</span>
            <span class="badge" style="background: rgba(255,255,255,0.06); color: #cbd5e1;">${item.category}</span>
            <span class="badge" style="background: rgba(16,185,129,0.1); color: #6ee7b7;">${item.dietary}</span>
          </div>

          <div class="listing-meta-row">
            <div class="meta-item">🍽️ <strong>${item.servings}</strong> Servings</div>
            <div class="meta-item">📍 ${escapeHtml(item.address)}</div>
            <div class="meta-item">🕒 Posted: ${item.createdAt}</div>
          </div>

          <div class="listing-notes">
            <strong>Notes:</strong> ${escapeHtml(item.notes || 'None')}
          </div>
        </div>

        <div class="listing-action-area">
          <div class="countdown-box" id="timer-${item.id}">
            ${item.status === 'AVAILABLE' ? `⏱️ Expires in ${formatCountdown(item.remainingSeconds)}` : ''}
            ${item.status === 'CLAIMED' ? `⏳ Pickup window: ${formatCountdown(item.remainingSeconds)}` : ''}
            ${item.status === 'COMPLETED' ? `✓ Handover Completed` : ''}
            ${item.status === 'EXPIRED' ? `⚠️ Time Window Elapsed` : ''}
          </div>

          ${item.status === 'CLAIMED' ? `
            <button class="btn-action claim-btn" onclick="openVerifyPinModal('${item.id}')">
              🔑 Enter Recipient PIN
            </button>
          ` : ''}

          ${item.status === 'AVAILABLE' ? `
            <button class="btn-action" onclick="cancelListing('${item.id}')" style="color: #fb7185;">
              Cancel Listing
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// Render Recipient NGO Portal (Asha Shelter)
function renderNgoView() {
  const feed = document.getElementById('ngoListingsFeed');
  if (!feed) return;

  // Filter listings based on tab filter
  let filtered = listings.filter(item => item.status === 'AVAILABLE');

  if (activeNgoFilter === 'cooked') {
    filtered = filtered.filter(item => item.category === 'COOKED');
  } else if (activeNgoFilter === 'veg') {
    filtered = filtered.filter(item => item.dietary === 'VEG');
  } else if (activeNgoFilter === 'urgent') {
    filtered = filtered.filter(item => item.remainingSeconds < 2 * 3600);
  }

  // Calculate Match Score based on distance & remaining urgency
  filtered.sort((a, b) => {
    const scoreA = calculateMatchScore(a);
    const scoreB = calculateMatchScore(b);
    return scoreB - scoreA;
  });

  if (filtered.length === 0) {
    feed.innerHTML = `
      <div class="glass-panel" style="text-align: center; padding: 3rem; color: var(--text-muted);">
        <h3>No Available Surplus Matches Right Now</h3>
        <p style="margin-top: 0.5rem; font-size: 0.9rem;">
          All active items are either already claimed or expired. Check back in a few moments or switch to Donor View to post a new meal!
        </p>
      </div>
    `;
    return;
  }

  feed.innerHTML = filtered.map(item => {
    const matchScore = calculateMatchScore(item);
    
    return `
      <div class="listing-card glass-panel" style="border-left: 4px solid var(--accent-blue);">
        <div class="listing-main-info">
          <div class="listing-header-line">
            <span class="listing-title">${escapeHtml(item.title)}</span>
            <span class="match-score-badge">★ ${matchScore}% Match Score</span>
            <span class="badge badge-available">Ready for Pickup</span>
          </div>

          <div class="listing-meta-row">
            <div class="meta-item">🏨 <strong>${escapeHtml(item.donor)}</strong> (${item.distanceKm} km away)</div>
            <div class="meta-item">🍽️ <strong>${item.servings}</strong> Portions</div>
            <div class="meta-item">🏷️ ${item.category} · ${item.dietary}</div>
          </div>

          <div class="listing-notes">
            <strong>Pickup Instructions:</strong> ${escapeHtml(item.notes)} | 📍 ${escapeHtml(item.address)}
          </div>
        </div>

        <div class="listing-action-area">
          <div class="countdown-box" id="timer-${item.id}" style="color: var(--accent-amber);">
            ⏱️ Expires in ${formatCountdown(item.remainingSeconds)}
          </div>

          <button class="btn-action claim-btn" onclick="claimFoodListing('${item.id}')">
            🤝 Claim This Food
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Match Score Algorithm: 50% Distance + 50% Time Urgency
function calculateMatchScore(item) {
  const maxDistanceKm = 10;
  const distRatio = Math.max(0, 1 - (item.distanceKm / maxDistanceKm));
  const timeRatio = Math.min(1, item.remainingSeconds / (4 * 3600));
  const score = Math.round((distRatio * 0.5 + (1 - timeRatio) * 0.5) * 100);
  return Math.min(99, Math.max(65, score));
}

function setNgoFilter(filter) {
  activeNgoFilter = filter;
  document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  renderNgoView();
}

// Atomic Claim Execution
function claimFoodListing(id) {
  const item = listings.find(i => i.id === id);
  if (!item) return;

  if (item.status !== 'AVAILABLE') {
    showToast('This surplus food has already been claimed or expired!', 'warning');
    playTone('error');
    return;
  }

  const claimantName = (currentUser && currentUser.role === 'ngo') 
    ? (currentUser.organization || currentUser.name) 
    : 'Asha Community Shelter';

  // Atomic state change
  item.status = 'CLAIMED';
  item.claimedBy = claimantName;
  saveState();

  // Log to immutable audit
  logAudit(`Listing ${item.id} claimed by ${claimantName}. PIN #${item.pickupPin} generated.`, 'info');

  // Trigger audio & toast
  playTone('claim');
  showToast(`Food reserved! Generated 4-Digit Handover PIN: ${item.pickupPin}`, 'success');

  // Show Claim Modal with PIN
  document.getElementById('modalPinValue').innerText = item.pickupPin;
  openModal('modalClaimConfirm');

  // Rerender
  renderAllViews();
}

// Handover PIN Verification
function openVerifyPinModal(id) {
  document.getElementById('verifyListingId').value = id;
  document.getElementById('inputVerifyPin').value = '';
  openModal('modalDonorVerify');
  setTimeout(() => document.getElementById('inputVerifyPin').focus(), 100);
}

function confirmHandoverPin() {
  const id = document.getElementById('verifyListingId').value;
  const enteredPin = document.getElementById('inputVerifyPin').value.trim();
  const item = listings.find(i => i.id === id);

  if (!item) return;

  if (enteredPin === item.pickupPin) {
    item.status = 'COMPLETED';
    saveState();
    closeModal('modalDonorVerify');
    
    logAudit(`Physical handoff verified for ${item.id}. ${item.servings} portions received by recipient. Status: COMPLETED.`, 'success');
    showToast(`Handoff verified! ${item.servings} meals marked as Rescued.`, 'success');
    playTone('success');

    renderAllViews();
  } else {
    showToast('Incorrect Handover PIN. Please re-check with driver.', 'warning');
    playTone('error');
    const input = document.getElementById('inputVerifyPin');
    input.style.borderColor = '#f43f5e';
    setTimeout(() => input.style.borderColor = '', 1500);
  }
}

// Form Submission: Post New Surplus Listing
function handlePostListing(e) {
  e.preventDefault();

  const title = document.getElementById('foodTitle').value.trim();
  const category = document.getElementById('foodCategory').value;
  const dietary = document.getElementById('dietaryType').value;
  const servings = parseInt(document.getElementById('servingsCount').value, 10);
  const hours = parseInt(document.getElementById('pickupWindowHours').value, 10);
  const notes = document.getElementById('handlingNotes').value.trim();
  const address = document.getElementById('pickupAddress').value.trim();

  // Generate unique 4-digit PIN
  const pin = Math.floor(1000 + Math.random() * 9000).toString();
  const newId = `L-${Math.floor(100 + Math.random() * 900)}`;

  const donorName = (currentUser && currentUser.role === 'donor')
    ? (currentUser.organization || currentUser.name)
    : 'Hotel Grand Palace';

  const newListing = {
    id: newId,
    title,
    donor: donorName,
    category,
    dietary,
    servings,
    distanceKm: 1.8,
    remainingSeconds: hours * 3600,
    totalWindowSeconds: hours * 3600,
    notes,
    status: 'AVAILABLE',
    pickupPin: pin,
    address,
    claimedBy: null,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  listings.unshift(newListing);
  saveState();

  logAudit(`New listing created: ${newListing.id} (${servings} servings) by ${donorName}.`, 'info');
  showToast(`Published listing #${newListing.id}! Available on NGO radar.`, 'success');
  playTone('success');

  // Reset form
  document.getElementById('formNewListing').reset();
  document.getElementById('servingsCount').value = '40';
  document.getElementById('pickupAddress').value = 'Grand Palace Central Kitchen Gate 2, MG Road';

  renderAllViews();
}

function cancelListing(id) {
  const item = listings.find(i => i.id === id);
  if (item && item.status === 'AVAILABLE') {
    item.status = 'EXPIRED';
    saveState();
    logAudit(`Listing ${item.id} cancelled by donor.`, 'warn');
    showToast(`Listing ${item.id} cancelled`, 'info');
    renderAllViews();
  }
}

// Coordinator & Audit View
function renderAdminView() {
  const timeline = document.getElementById('auditLogTimeline');
  if (!timeline) return;

  timeline.innerHTML = auditLogs.map(log => {
    let typeClass = '';
    if (log.type === 'warn') typeClass = 'audit-warn';
    if (log.type === 'success') typeClass = 'audit-success';

    return `
      <div class="audit-item ${typeClass}">
        <div class="audit-time">${log.time}</div>
        <div>${escapeHtml(log.text)}</div>
      </div>
    `;
  }).join('');
}

function logAudit(text, type = 'info') {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  auditLogs.unshift({ time, type, text });
  if (auditLogs.length > 25) auditLogs.pop();
  saveState();
  renderAdminView();
}

function inspectMapNode(nodeName) {
  showToast(`Inspecting Node: ${nodeName}`, 'info');
}

// Global Metrics Counter Calculation
function updateHeroStats() {
  const completedMeals = listings
    .filter(i => i.status === 'COMPLETED')
    .reduce((sum, item) => sum + item.servings, 0);

  const totalRescued = 300 + completedMeals;
  const activeCount = listings.filter(i => i.status === 'CLAIMED').length;
  const co2Prevented = Math.round(totalRescued * 0.4);

  const elMeals = document.getElementById('statMealsRescued');
  const elActive = document.getElementById('statActiveClaims');
  const elCo2 = document.getElementById('statCo2Saved');

  if (elMeals) elMeals.innerText = totalRescued;
  if (elActive) elActive.innerText = activeCount;
  if (elCo2) elCo2.innerText = `${co2Prevented} kg`;
}

// Interactive Pitch Demo Steps
function executeDemoStep(step) {
  if (step === 1) {
    switchPerspective('donor');
    showToast('Demo Step 1: Donor publishes 40 fresh surplus meals', 'info');
  } else if (step === 2) {
    switchPerspective('ngo');
    showToast('Demo Step 2: Recipient NGO discovers urgency-ranked surplus', 'info');
  } else if (step === 3) {
    switchPerspective('ngo');
    const available = listings.find(i => i.status === 'AVAILABLE');
    if (available) {
      claimFoodListing(available.id);
    } else {
      showToast('Creating sample meal first...', 'info');
      executeDemoStep(1);
    }
  } else if (step === 4) {
    switchPerspective('donor');
    const claimed = listings.find(i => i.status === 'CLAIMED');
    if (claimed) {
      openVerifyPinModal(claimed.id);
      document.getElementById('inputVerifyPin').value = claimed.pickupPin;
      showToast(`Prefilled valid pickup PIN: ${claimed.pickupPin} for live test`, 'info');
    } else {
      showToast('No active claimed item. Run Step 3 first!', 'warning');
    }
  } else if (step === 5) {
    switchPerspective('auth');
    fillDemoCredentials('donor_bakery', 'Bakery@2026', 'donor');
    showToast('Demo Step 5: Testing Unverified Email flow (Artisan Bakery)', 'info');
  }
}

// Modal Helpers
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

// Toast Notifications Engine
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Utility
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}

// ====================================================
// AUTHENTICATION & VERIFICATION CONTROLLERS
// ====================================================

function initAuth() {
  const savedUser = localStorage.getItem('annasetu_auth_user');
  const savedToken = localStorage.getItem('annasetu_auth_token');

  if (savedUser && savedToken) {
    try {
      currentUser = JSON.parse(savedUser);
      authToken = savedToken;
    } catch (e) {
      currentUser = null;
      authToken = null;
    }
  }

  renderHeaderAuth();
  updateAuthRoleUI();
}

function renderHeaderAuth() {
  const container = document.getElementById('headerAuthBadge');
  const mobileContainer = document.getElementById('mobileAuthCard');

  if (currentUser) {
    const isDonor = currentUser.role === 'donor';
    const roleIcon = isDonor ? '🏨' : '🤝';
    const roleName = isDonor ? 'Donor' : 'NGO';
    const pillClass = isDonor ? 'donor-pill' : 'ngo-pill';

    if (container) {
      container.innerHTML = `
        <div class="user-auth-pill ${pillClass}">
          <span class="user-status-dot"></span>
          <span>${roleIcon} ${escapeHtml(currentUser.organization || currentUser.name)} (${roleName})</span>
          <button type="button" class="btn-logout-sm" onclick="handleLogout()" title="Log out of current session">
            ⎋ Sign Out
          </button>
        </div>
      `;
    }

    if (mobileContainer) {
      mobileContainer.innerHTML = `
        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 0.85rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem;">
            <span style="font-size: 0.75rem; font-weight: 700; color: ${isDonor ? '#34d399' : '#93c5fd'};">${roleIcon} Verified ${roleName}</span>
            <span class="badge ${isDonor ? 'badge-available' : 'badge-completed'}" style="font-size: 0.65rem;">Active</span>
          </div>
          <div style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">${escapeHtml(currentUser.organization || currentUser.name)}</div>
          <button type="button" class="btn-logout-sm" onclick="handleLogout(); closeMobileNav();" style="width: 100%; text-align: center; padding: 0.45rem;">
            ⎋ Sign Out of Session
          </button>
        </div>
      `;
    }
  } else {
    if (container) {
      container.innerHTML = `
        <button type="button" class="btn-auth-header" onclick="switchPerspective('auth')">
          🔐 Sign In / Register
        </button>
      `;
    }

    if (mobileContainer) {
      mobileContainer.innerHTML = `
        <button type="button" class="btn-primary" onclick="switchPerspective('auth'); closeMobileNav();" style="width: 100%; justify-content: center; padding: 0.65rem; font-size: 0.85rem;">
          🔐 Sign In / Register Portal
        </button>
      `;
    }
  }
}

// Mobile Slide-Out Drawer Controls
function toggleMobileNav() {
  const drawer = document.getElementById('mobileNavDrawer');
  if (!drawer) return;
  const isOpen = drawer.classList.contains('open');
  if (isOpen) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
}

function openMobileNav() {
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileNavBackdrop');
  const btn = document.getElementById('btnHamburger');

  if (drawer) drawer.classList.add('open');
  if (backdrop) backdrop.classList.add('open');
  if (btn) btn.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileNavBackdrop');
  const btn = document.getElementById('btnHamburger');

  if (drawer) drawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  if (btn) btn.classList.remove('open');
  document.body.style.overflow = '';
}

function setAuthRole(role) {
  currentAuthRole = role === 'ngo' ? 'ngo' : 'donor';
  updateAuthRoleUI();
  clearAuthErrors();
}

function updateAuthRoleUI() {
  const mainCard = document.getElementById('authMainCard');
  const btnDonor = document.getElementById('btnRoleDonor');
  const btnNgo = document.getElementById('btnRoleNgo');
  const labelUserId = document.getElementById('labelAuthUserId');
  const inputUserId = document.getElementById('authUserId');
  const roleHint = document.getElementById('roleIndicatorHint');
  const btnSubmit = document.getElementById('btnSubmitAuth');

  if (!mainCard) return;

  if (currentAuthRole === 'donor') {
    mainCard.classList.remove('role-ngo-active');
    mainCard.classList.add('role-donor-active');

    if (btnDonor) btnDonor.classList.add('active');
    if (btnNgo) btnNgo.classList.remove('active');

    if (labelUserId) labelUserId.innerText = 'Donor User ID or Official Email';
    if (inputUserId) inputUserId.placeholder = 'e.g. donor_hotel or donor@grandpalace.com';
    if (roleHint) roleHint.innerText = 'Donor Access';
    const sub = document.getElementById('authSubtitleRole');
    if (sub) sub.innerText = 'Secure Food Donor Gateway';
    if (btnSubmit) {
      btnSubmit.innerHTML = '⚡ Sign In as Donor';
      btnSubmit.style.background = 'linear-gradient(135deg, #10b981 0%, #047857 100%)';
    }
  } else {
    mainCard.classList.remove('role-donor-active');
    mainCard.classList.add('role-ngo-active');

    if (btnDonor) btnDonor.classList.remove('active');
    if (btnNgo) btnNgo.classList.add('active');

    if (labelUserId) labelUserId.innerText = 'NGO User ID or Official Email';
    if (inputUserId) inputUserId.placeholder = 'e.g. ngo_asha or contact@ashashelter.org';
    if (roleHint) roleHint.innerText = 'Shelter NGO Access';
    const sub = document.getElementById('authSubtitleRole');
    if (sub) sub.innerText = 'Verified Recipient Shelter Gateway';
    if (btnSubmit) {
      btnSubmit.innerHTML = '⚡ Sign In as NGO';
      btnSubmit.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
    }
  }
}

function setAuthMode(mode) {
  currentAuthMode = mode === 'register' ? 'register' : 'signin';
  const tabSignIn = document.getElementById('tabModeSignIn');
  const tabRegister = document.getElementById('tabModeRegister');
  const formSignIn = document.getElementById('formSignIn');
  const formRegister = document.getElementById('formRegister');

  clearAuthErrors();

  if (currentAuthMode === 'signin') {
    if (tabSignIn) tabSignIn.classList.add('active');
    if (tabRegister) tabRegister.classList.remove('active');
    if (formSignIn) formSignIn.style.display = 'block';
    if (formRegister) formRegister.style.display = 'none';
  } else {
    if (tabSignIn) tabSignIn.classList.remove('active');
    if (tabRegister) tabRegister.classList.add('active');
    if (formSignIn) formSignIn.style.display = 'none';
    if (formRegister) formRegister.style.display = 'block';
  }
}

function togglePasswordVisibility(inputId) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.type = el.type === 'password' ? 'text' : 'password';
}

function showAuthError(title, message, actionHtml = '') {
  const alert = document.getElementById('authErrorAlert');
  const titleEl = document.getElementById('authErrorTitle');
  const msgEl = document.getElementById('authErrorMessage');
  const actionEl = document.getElementById('authErrorAction');

  if (!alert) return;

  if (titleEl) titleEl.innerText = title;
  if (msgEl) msgEl.innerText = message;
  if (actionEl) actionEl.innerHTML = actionHtml;

  alert.classList.remove('active');
  void alert.offsetWidth; // Restart CSS animation
  alert.classList.add('active');
  playTone('error');
}

function clearAuthErrors() {
  const alert = document.getElementById('authErrorAlert');
  if (alert) alert.classList.remove('active');
}

function fillDemoCredentials(userId, pass, role) {
  setAuthRole(role);
  setAuthMode('signin');
  const userInput = document.getElementById('authUserId');
  const passInput = document.getElementById('authPassword');
  if (userInput) userInput.value = userId;
  if (passInput) passInput.value = pass;
  clearAuthErrors();
  showToast(`Auto-filled credentials for ${userId}`, 'info');
  playTone('claim');
}

// Handler: Sign In
async function handleAuthLogin(e) {
  e.preventDefault();
  clearAuthErrors();

  const userId = document.getElementById('authUserId').value.trim();
  const password = document.getElementById('authPassword').value;
  const btnSubmit = document.getElementById('btnSubmitAuth');

  if (!userId || !password) {
    showAuthError('Missing Credentials', 'Please enter both your User ID / Email and Password.');
    return;
  }

  const origBtnText = btnSubmit.innerHTML;
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '⏳ Authenticating...';

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password, role: currentAuthRole })
    });
    const data = await res.json();

    if (!data.success) {
      if (data.requiresVerification) {
        pendingVerification = {
          userId: data.userId || userId,
          email: data.email || userId,
          otp: data.demoOtp || ''
        };
        showAuthError(
          'Email Verification Required',
          data.error,
          `<button type="button" class="action-link-btn" onclick="openEmailVerifyModal('${data.email}', '${data.userId}', '${data.demoOtp}')">
            ✉️ Verify Email Now & Unlock Portal →
          </button>`
        );
      } else {
        showAuthError('Authentication Failed', data.error || 'Invalid credentials.');
      }
      return;
    }

    // Success
    currentUser = data.user;
    authToken = data.token;
    localStorage.setItem('annasetu_auth_user', JSON.stringify(currentUser));
    localStorage.setItem('annasetu_auth_token', authToken);

    renderHeaderAuth();
    showToast(`Welcome back, ${currentUser.name}! Signed in as ${currentUser.role.toUpperCase()}.`, 'success');
    playTone('success');

    if (currentUser.role === 'donor') {
      switchPerspective('donor');
    } else {
      switchPerspective('ngo');
    }
  } catch (err) {
    showAuthError('Connection Error', 'Could not communicate with backend server: ' + err.message);
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = origBtnText;
  }
}

// Handler: Register New Account
async function handleAuthRegister(e) {
  e.preventDefault();
  clearAuthErrors();

  const orgName = document.getElementById('regOrgName').value.trim();
  const userId = document.getElementById('regUserId').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regPasswordConfirm').value;
  const address = document.getElementById('regAddress').value.trim();
  const btnSubmit = document.getElementById('btnSubmitRegister');

  if (password !== confirmPassword) {
    showAuthError('Password Mismatch', 'Passwords do not match. Please ensure both passwords match identically.');
    return;
  }

  const origBtnText = btnSubmit.innerHTML;
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '⏳ Creating Account...';

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        name: orgName,
        email,
        password,
        role: currentAuthRole,
        organization: orgName,
        phone,
        address
      })
    });
    const data = await res.json();

    if (!data.success) {
      showAuthError('Registration Failed', data.error || 'Could not register account.');
      return;
    }

    showToast('Account created! A verification code was sent to your email.', 'success');
    playTone('claim');

    openEmailVerifyModal(data.email, data.userId, data.demoOtp);
  } catch (err) {
    showAuthError('Server Error', 'Failed to submit registration: ' + err.message);
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = origBtnText;
  }
}

// ====================================================
// EMAIL VERIFICATION MODAL & FLOW
// ====================================================

function openEmailVerifyModal(email, userId, otp) {
  pendingVerification = { email, userId, otp };

  const targetEmailEl = document.getElementById('verifyTargetEmail');
  const simulatedCodeEl = document.getElementById('verifySimulatedOtp');
  const targetUserIdEl = document.getElementById('verifyTargetUserId');
  const inputOtpEl = document.getElementById('inputVerifyOtp');
  const errorBox = document.getElementById('verifyModalError');

  if (targetEmailEl) targetEmailEl.innerText = email || 'your email';
  if (simulatedCodeEl) simulatedCodeEl.innerText = otp || '••••••';
  if (targetUserIdEl) targetUserIdEl.value = userId || '';
  if (inputOtpEl) inputOtpEl.value = '';
  if (errorBox) errorBox.classList.remove('active');

  openModal('modalEmailVerify');
}

function autofillVerificationOtp() {
  if (pendingVerification.otp) {
    const input = document.getElementById('inputVerifyOtp');
    if (input) input.value = pendingVerification.otp;
    showToast(`Auto-filled verification code: ${pendingVerification.otp}`, 'info');
    playTone('claim');
  }
}

async function submitEmailVerification() {
  const otpInput = document.getElementById('inputVerifyOtp');
  const otp = otpInput ? otpInput.value.trim() : '';
  const errorBox = document.getElementById('verifyModalError');
  const errorMsg = document.getElementById('verifyModalErrorMessage');
  const btnSubmit = document.getElementById('btnSubmitVerifyOtp');

  if (!otp || otp.length !== 6) {
    if (errorBox && errorMsg) {
      errorMsg.innerText = 'Please enter a valid 6-digit code.';
      errorBox.classList.add('active');
    }
    playTone('error');
    return;
  }

  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '⏳ Verifying...';

  try {
    const res = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: pendingVerification.userId,
        email: pendingVerification.email,
        otp
      })
    });
    const data = await res.json();

    if (!data.success) {
      if (errorBox && errorMsg) {
        errorMsg.innerText = data.error || 'Verification failed.';
        errorBox.classList.add('active');
      }
      playTone('error');
      return;
    }

    closeModal('modalEmailVerify');
    showToast('🎉 Email successfully verified! Portal access granted.', 'success');
    playTone('success');

    if (data.user && data.token) {
      currentUser = data.user;
      authToken = data.token;
      localStorage.setItem('annasetu_auth_user', JSON.stringify(currentUser));
      localStorage.setItem('annasetu_auth_token', authToken);
      renderHeaderAuth();
      if (currentUser.role === 'donor') {
        switchPerspective('donor');
      } else {
        switchPerspective('ngo');
      }
    } else {
      setAuthMode('signin');
      switchPerspective('auth');
    }
  } catch (err) {
    if (errorBox && errorMsg) {
      errorMsg.innerText = 'Network error: ' + err.message;
      errorBox.classList.add('active');
    }
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = '✓ Verify Email & Unlock Portal';
  }
}

async function resendVerificationCode() {
  try {
    const res = await fetch('/api/auth/resend-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: pendingVerification.userId,
        email: pendingVerification.email
      })
    });
    const data = await res.json();
    if (data.success) {
      pendingVerification.otp = data.demoOtp;
      const simulatedEl = document.getElementById('verifySimulatedOtp');
      if (simulatedEl) simulatedEl.innerText = data.demoOtp;
      showToast(data.message, 'success');
      playTone('claim');
    } else {
      showToast(data.error || 'Could not resend code', 'warning');
    }
  } catch (e) {
    showToast('Error requesting new code', 'warning');
  }
}

// ====================================================
// FORGOT PASSWORD MODAL & FLOW
// ====================================================

function openForgotPasswordModal() {
  const step1 = document.getElementById('forgotStep1');
  const step2 = document.getElementById('forgotStep2');
  const stepSuccess = document.getElementById('forgotStepSuccess');
  const errorBox = document.getElementById('forgotModalError');
  const identifierInput = document.getElementById('forgotIdentifier');

  if (step1) step1.style.display = 'block';
  if (step2) step2.style.display = 'none';
  if (stepSuccess) stepSuccess.style.display = 'none';
  if (errorBox) errorBox.classList.remove('active');
  if (identifierInput) identifierInput.value = '';

  openModal('modalForgotPassword');
}

async function requestForgotPasswordOtp() {
  const identifierInput = document.getElementById('forgotIdentifier');
  const identifier = identifierInput ? identifierInput.value.trim() : '';
  const errorBox = document.getElementById('forgotModalError');
  const errorMsg = document.getElementById('forgotModalErrorMessage');
  const btn = document.getElementById('btnSendForgotOtp');

  if (!identifier) {
    if (errorBox && errorMsg) {
      errorMsg.innerText = 'Please enter your User ID or Email address.';
      errorBox.classList.add('active');
    }
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '⏳ Checking Account...';

  try {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier })
    });
    const data = await res.json();

    if (!data.success) {
      if (errorBox && errorMsg) {
        errorMsg.innerText = data.error || 'Account not found.';
        errorBox.classList.add('active');
      }
      playTone('error');
      return;
    }

    pendingForgot = {
      userId: data.userId,
      email: data.email,
      otp: data.demoOtp
    };

    if (errorBox) errorBox.classList.remove('active');
    document.getElementById('forgotStep1').style.display = 'none';
    document.getElementById('forgotStep2').style.display = 'block';

    const targetEmailEl = document.getElementById('forgotTargetEmail');
    const simulatedOtpEl = document.getElementById('forgotSimulatedOtp');
    if (targetEmailEl) targetEmailEl.innerText = data.email;
    if (simulatedOtpEl) simulatedOtpEl.innerText = data.demoOtp;

    showToast(`Password reset code dispatched to ${data.email}`, 'info');
    playTone('claim');
  } catch (err) {
    if (errorBox && errorMsg) {
      errorMsg.innerText = 'Server error: ' + err.message;
      errorBox.classList.add('active');
    }
  } finally {
    btn.disabled = false;
    btn.innerHTML = '⚡ Send 6-Digit Reset Code';
  }
}

function autofillForgotOtp() {
  if (pendingForgot.otp) {
    const input = document.getElementById('forgotInputOtp');
    if (input) input.value = pendingForgot.otp;
    showToast(`Auto-filled reset code: ${pendingForgot.otp}`, 'info');
    playTone('claim');
  }
}

async function submitPasswordReset() {
  const otpInput = document.getElementById('forgotInputOtp');
  const newPassInput = document.getElementById('forgotNewPassword');
  const confirmPassInput = document.getElementById('forgotConfirmPassword');
  const errorBox = document.getElementById('forgotModalError');
  const errorMsg = document.getElementById('forgotModalErrorMessage');
  const btn = document.getElementById('btnSubmitResetPassword');

  const otp = otpInput ? otpInput.value.trim() : '';
  const newPassword = newPassInput ? newPassInput.value : '';
  const confirmPassword = confirmPassInput ? confirmPassInput.value : '';

  if (!otp || !newPassword) {
    if (errorBox && errorMsg) {
      errorMsg.innerText = 'Please enter both the reset OTP and your new password.';
      errorBox.classList.add('active');
    }
    return;
  }

  if (newPassword !== confirmPassword) {
    if (errorBox && errorMsg) {
      errorMsg.innerText = 'New passwords do not match. Please re-enter carefully.';
      errorBox.classList.add('active');
    }
    return;
  }

  if (newPassword.length < 6) {
    if (errorBox && errorMsg) {
      errorMsg.innerText = 'Password must be at least 6 characters.';
      errorBox.classList.add('active');
    }
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '⏳ Updating Password...';

  try {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: pendingForgot.userId,
        email: pendingForgot.email,
        otp,
        newPassword
      })
    });
    const data = await res.json();

    if (!data.success) {
      if (errorBox && errorMsg) {
        errorMsg.innerText = data.error || 'Failed to reset password.';
        errorBox.classList.add('active');
      }
      playTone('error');
      return;
    }

    if (errorBox) errorBox.classList.remove('active');
    document.getElementById('forgotStep2').style.display = 'none';
    document.getElementById('forgotStepSuccess').style.display = 'block';
    showToast('Password successfully reset! You can now log in.', 'success');
    playTone('success');
  } catch (err) {
    if (errorBox && errorMsg) {
      errorMsg.innerText = 'Server error: ' + err.message;
      errorBox.classList.add('active');
    }
  } finally {
    btn.disabled = false;
    btn.innerHTML = '✓ Confirm & Update Password';
  }
}

// Handler: Sign Out
async function handleLogout() {
  try {
    if (authToken) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
    }
  } catch (e) {
    // ignore
  }

  currentUser = null;
  authToken = null;
  localStorage.removeItem('annasetu_auth_user');
  localStorage.removeItem('annasetu_auth_token');

  renderHeaderAuth();
  showToast('You have been signed out.', 'info');
  playTone('info');
  switchPerspective('auth');
}

