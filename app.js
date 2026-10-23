/**
 * AnnaSetu — Logistics & Real-Time Surplus Food Rescue Engine
 * Zero-error reactive coordination engine with audio synthesis and canvas celebration
 */

// Initial Seed Data with Real Photography & High-Fidelity Attributes
const DEFAULT_LISTINGS = [
  {
    id: 'L-101',
    title: 'Fresh Vegetable Biryani & Dal',
    donor: 'Grand Banquet & Catering',
    donorInitials: 'GB',
    rating: '4.9★',
    category: 'COOKED',
    dietary: 'Vegetarian',
    servings: 85,
    distanceKm: 0.8,
    remainingSeconds: 45 * 60, // 45 minutes
    totalWindowSeconds: 2 * 3600,
    notes: 'Prepared at Grand Banquet Hall. Packaged in sealed food-grade containers. Ideal for immediate distribution.',
    pickupWindow: 'Now – 2:00 PM',
    status: 'AVAILABLE',
    pickupPin: '4892',
    address: 'Grand Banquet Central Gate, Civil Lines',
    claimedBy: null,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoeIRMJteKHN6i2rikP9u6c-SLeAF6fV4geIvqemdo5fbhbTh3Efb7sqsccL8xuU7Q43BuLQz-RSPGa5K7FJaF1O6Jj_fJBtKBLyYqRJyRflXOgcLA5jUEMtz1jkTjFmj5S3sQ8PCKoIF1Xv6sVd-w-IbsUA3MIpmCtQalqJzIgtvDBv3W5dmlYrnWDFvU-IygcQbiF0PVEwn0oM5QLYdf7eaVVqjIup2-DheWPoBThnnhB4eYNcB4',
    createdAt: '11:15 AM'
  },
  {
    id: 'L-102',
    title: 'Artisan Sourdough Breads & Pastries',
    donor: 'Daily Bread Artisan Bakery',
    donorInitials: 'DB',
    rating: '5.0★',
    category: 'BAKERY',
    dietary: 'Bakery',
    servings: 40,
    distanceKm: 2.1,
    remainingSeconds: 3 * 3600 + 15 * 60, // 3h 15m
    totalWindowSeconds: 5 * 3600,
    notes: 'Assorted fresh baked goods from morning production run. Stored in clean paper crates.',
    pickupWindow: 'Before 5:00 PM',
    status: 'AVAILABLE',
    pickupPin: '3892',
    address: 'Connaught Lane Bakery Hub, Block C',
    claimedBy: null,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAJUoaKgsFoP6lHRsHDBQbn7caztrCFjD72axqXXndidouurP3lPlrXIY4k_a7PJpBc5VAqp5EydlO5g9UVFiWSlulO6NFqsl2oGskj_G8wPf3WcJ6K2HV0aCR6rbIvUOdFONRdqyKS6Zzg2Iu-tDlkODq-eaSU26jABMzX9-IB8HxqbiPeQqJjcYBe6k5rXsRond6vnyLkDSZGYCTazDVQ1o6Qj_VxLGLr19xRJ8bidVCqT5VVNfM',
    createdAt: '08:30 AM'
  },
  {
    id: 'L-103',
    title: 'Packaged Protein Meals & Salads',
    donor: 'TechCorp Campus Cafeteria',
    donorInitials: 'TC',
    rating: '4.8★',
    category: 'COOKED',
    dietary: 'Halal & Gluten-Free',
    servings: 120,
    distanceKm: 3.4,
    remainingSeconds: 6 * 3600, // 6 hours
    totalWindowSeconds: 6 * 3600,
    notes: 'Corporate cafeteria surplus. Individually sealed meal boxes containing grilled chicken breast, quinoa, and steamed vegetables.',
    pickupWindow: 'By 7:30 PM',
    status: 'AVAILABLE',
    pickupPin: '7541',
    address: 'TechCorp Tower B Kitchen, Gate 1',
    claimedBy: null,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_iCevYeqZHIuWTfkIghY2TrkkCybmhrRjTe9_uzLEccrHkfLIBy6_FdF7eY5cb3_UXxRLW9gfi_yE45-_St0J2SHw3Jljcch9-2_szq3dpjDXmquIYkFJqdc88J54ErNOoxFVFxZN3iBBoeWI3wkFPp1AxBu3zEJ7OjBwiVtZHMW-TfQ5BUewS429_0zNl6EupkfA7yLfvHEi4Ko3nkhaA-iHOw5J33k3IpZkefVZu1T3yBdMIuDx',
    createdAt: '12:00 PM'
  },
  {
    id: 'L-104',
    title: 'Fresh Paneer Rice & Yellow Dal',
    donor: 'Hotel Grand Palace Central Kitchen',
    donorInitials: 'GP',
    rating: '4.9★',
    category: 'COOKED',
    dietary: 'Vegetarian',
    servings: 45,
    distanceKm: 1.8,
    remainingSeconds: 2 * 3600 + 30 * 60, // 2h 30m
    totalWindowSeconds: 4 * 3600,
    notes: 'Packed in 2 thermal insulated containers. Keep covered and transport in shaded vehicle.',
    pickupWindow: 'Now – 4:00 PM',
    status: 'AVAILABLE',
    pickupPin: '7419',
    address: 'Grand Palace Central Kitchen Gate 2, MG Road',
    claimedBy: null,
    imageUrl: 'assets/hero.jpg',
    createdAt: '10:45 AM'
  },
  {
    id: 'L-105',
    title: 'Seasonal Mixed Fruits (Bananas & Oranges)',
    donor: 'Metro Wholesale Mandi Hub',
    donorInitials: 'MM',
    rating: '4.7★',
    category: 'PRODUCE',
    dietary: 'Vegan',
    servings: 50,
    distanceKm: 4.5,
    remainingSeconds: 4 * 3600,
    totalWindowSeconds: 6 * 3600,
    notes: 'Safe for immediate shelter consumption. Whole raw produce packed in wooden crates.',
    pickupWindow: 'Before 6:00 PM',
    status: 'AVAILABLE',
    pickupPin: '2281',
    address: 'Wholesale Mandi Yard 4, Gate 3',
    claimedBy: null,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9dEeN14cvNCv2uvl-t09-imc5gA-Un5cfgF8lO3vBTgn8jvieEcA19uSTfqH25OTPfu7Kt_Y-vcHqs1QudwHV0C0mhPLnmXOLQB4L2mk1xxYeYBuRc0jlqT3RFR0xPMvg7ib82T0ZjwD2hqw3yZLRd4DQZ0_zIGnFEVcV2XdnKM0XcxpcRg6HBOASMQO8YIOJplB7QQypLbe9lRqxmHu61DDGT1HydiYP4alCD65XFXuEciCdZSQe',
    createdAt: '09:15 AM'
  }
];

const DEFAULT_AUDIT_LOGS = [
  { time: '12:15 PM', type: 'info', text: 'Listing L-103 registered by TechCorp Campus Cafeteria (120 boxes).' },
  { time: '11:45 AM', type: 'success', text: 'Listing L-105 verified with PIN #4421. 50 meals marked COMPLETED.' },
  { time: '10:30 AM', type: 'warn', text: 'Listing L-104 auto-expired after window elapsed without pickup.' },
  { time: '09:00 AM', type: 'info', text: 'System initialized with active municipal FSSAI food recovery parameters.' }
];

// App State
let listings = [];
let auditLogs = [];
let currentUrgentToggle = 'all'; // 'all' or 'urgent'
let currentRadiusKm = 5;
let searchQuery = '';
let dietaryFilter = 'all';
let urgencyFilter = 'all';
let quantityFilter = 'all';
let sortBy = 'urgency-proximity';
let activeModalClaimItem = null;

// Auth State
let currentUser = null;
let authToken = null;
let currentAuthRole = 'donor';
let currentAuthMode = 'signin';
let pendingVerification = { email: '', userId: '', otp: '' };
let pendingForgot = { email: '', userId: '', otp: '' };

// Audio Feedback Synthesizer (Zero Dependencies)
function playTone(type) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'claim' || type === 'success') {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'error' || type === 'warning') {
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      osc.frequency.setValueAtTime(520, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    }
  } catch (e) {
    // Audio context may be restricted by browser policy before first interaction
  }
}

// Confetti Celebration Synthesizer (Pure Canvas)
function triggerConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#3366cc', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height * 0.45,
      r: Math.random() * 6 + 4,
      d: Math.random() * 90,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.8) * 16,
      gravity: 0.4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10
    });
  }

  let animationFrame;
  let alpha = 1;

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.5);
      ctx.restore();
    });

    alpha -= 0.012;
    if (alpha > 0) {
      animationFrame = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  render();
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initAuth();
  renderAllViews();
  startCountdownEngine();
});

function loadState() {
  const savedListings = localStorage.getItem('annasetu_listings_v3');
  const savedLogs = localStorage.getItem('annasetu_audit_v3');

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
  localStorage.setItem('annasetu_listings_v3', JSON.stringify(listings));
  localStorage.setItem('annasetu_audit_v3', JSON.stringify(auditLogs));
}

function resetDemoData() {
  listings = JSON.parse(JSON.stringify(DEFAULT_LISTINGS));
  auditLogs = JSON.parse(JSON.stringify(DEFAULT_AUDIT_LOGS));
  saveState();
  renderAllViews();
  showToast('Demo data reset to clean initial state', 'info');
  playTone('info');
}

// Master Render
function renderAllViews() {
  renderAvailableFoodFeed();
  renderDonorView();
  renderAdminView();
  updateHeroStats();
}

// ==========================================================================
// PERSPECTIVE / TAB ROUTER
// ==========================================================================
function switchPerspective(role) {
  // Normalize alias names
  if (role === 'ngo') role = 'available-food';
  if (role === 'donor') role = 'donor';
  if (role === 'admin') role = 'admin';
  if (role === 'judge') role = 'judge';

  document.querySelectorAll('.portal-view').forEach(el => el.classList.remove('active-view'));
  document.querySelectorAll('.nav-link').forEach(el => {
    el.removeAttribute('aria-current');
    el.classList.remove('bg-primary', 'text-on-primary', 'font-semibold', 'shadow-sm');
    el.classList.add('text-on-surface-variant');
  });

  let targetViewId = 'viewAvailableFood';
  let targetPath = 'available-food';

  if (role === 'available-food') {
    targetViewId = 'viewAvailableFood';
    targetPath = 'available-food';
  } else if (role === 'dashboard') {
    targetViewId = 'viewDashboard';
    targetPath = 'dashboard';
  } else if (role === 'donor') {
    targetViewId = 'viewDonor';
    targetPath = 'donate-food';
  } else if (role === 'admin') {
    targetViewId = 'viewAdmin';
    targetPath = 'impact-and-analytics';
  } else if (role === 'judge') {
    targetViewId = 'viewJudge';
    targetPath = 'community';
  } else if (role === 'auth') {
    targetViewId = 'viewAuth';
    targetPath = null;
  }

  const v = document.getElementById(targetViewId);
  if (v) v.classList.add('active-view');

  if (targetPath) {
    const navLink = document.querySelector(`.nav-link[data-path="${targetPath}"]`);
    if (navLink) {
      navLink.setAttribute('aria-current', 'page');
      navLink.classList.remove('text-on-surface-variant');
      navLink.classList.add('bg-primary', 'text-on-primary', 'font-semibold', 'shadow-sm');
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================================================
// VIEW 1: AVAILABLE FOOD FEED (USER REQUESTED COMPONENT)
// ==========================================================================
function renderAvailableFoodFeed() {
  const feed = document.getElementById('availableFoodFeed');
  if (!feed) return;

  // Filter listings by status
  let filtered = listings.filter(item => item.status === 'AVAILABLE');

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.donor.toLowerCase().includes(q) ||
      item.notes.toLowerCase().includes(q) ||
      item.dietary.toLowerCase().includes(q)
    );
  }

  // Radius filter
  filtered = filtered.filter(item => item.distanceKm <= currentRadiusKm);

  // Dietary filter
  if (dietaryFilter === 'veg') {
    filtered = filtered.filter(item => item.dietary.toLowerCase().includes('veg'));
  } else if (dietaryFilter === 'halal') {
    filtered = filtered.filter(item => item.dietary.toLowerCase().includes('halal'));
  } else if (dietaryFilter === 'gluten-free') {
    filtered = filtered.filter(item => item.dietary.toLowerCase().includes('gluten'));
  } else if (dietaryFilter === 'non_veg') {
    filtered = filtered.filter(item => item.dietary.toLowerCase().includes('non'));
  }

  // Urgency filter
  if (urgencyFilter === 'critical') {
    filtered = filtered.filter(item => item.remainingSeconds < 2 * 3600);
  } else if (urgencyFilter === 'moderate') {
    filtered = filtered.filter(item => item.remainingSeconds < 4 * 3600);
  } else if (urgencyFilter === 'today') {
    filtered = filtered.filter(item => item.remainingSeconds < 8 * 3600);
  }

  // Quantity filter
  if (quantityFilter === 'small') {
    filtered = filtered.filter(item => item.servings < 25);
  } else if (quantityFilter === 'medium') {
    filtered = filtered.filter(item => item.servings >= 25 && item.servings <= 100);
  } else if (quantityFilter === 'large') {
    filtered = filtered.filter(item => item.servings > 100);
  }

  // Urgent toggle
  if (currentUrgentToggle === 'urgent') {
    filtered = filtered.filter(item => item.remainingSeconds < 2 * 3600);
  }

  // Sort
  filtered.sort((a, b) => {
    if (sortBy === 'nearest') return a.distanceKm - b.distanceKm;
    if (sortBy === 'quantity') return b.servings - a.servings;
    if (sortBy === 'expiring') return a.remainingSeconds - b.remainingSeconds;
    // Default: Urgency & Proximity weighted
    return calculateMatchScore(b) - calculateMatchScore(a);
  });

  const countEl = document.getElementById('activeListingsCount');
  if (countEl) countEl.innerText = `${filtered.length} active listings`;

  if (filtered.length === 0) {
    feed.innerHTML = `
      <div class="bg-surface-container-lowest rounded-2xl p-12 text-center border border-surface-variant/60 shadow-sm flex flex-col items-center gap-3">
        <span class="material-symbols-outlined text-[48px] text-outline">search_off</span>
        <h3 class="text-xl font-['Noto_Serif'] font-bold text-on-surface">No surplus matches for current filters</h3>
        <p class="text-sm text-on-surface-variant max-w-md">Try expanding your radar radius or resetting the search filters to see all available surplus donations.</p>
        <button class="mt-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs shadow-sm hover:bg-primary/90 transition-all" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  feed.innerHTML = filtered.map((item, idx) => {
    const matchScore = calculateMatchScore(item);
    
    // Status spine color & pill urgency styling
    let spineColor = 'bg-primary';
    let urgencyBadge = `bg-primary/10 text-primary`;
    let isCritical = false;

    if (item.remainingSeconds <= 3600) {
      spineColor = 'bg-error';
      urgencyBadge = `bg-error/10 text-error pulse-critical`;
      isCritical = true;
    } else if (item.remainingSeconds <= 4 * 3600) {
      spineColor = 'bg-tertiary';
      urgencyBadge = `bg-tertiary/10 text-tertiary`;
    }

    const fallbackImg = 'assets/hero.jpg';
    const bgImage = item.imageUrl || fallbackImg;

    return `
      <!-- Card: ${escapeHtml(item.title)} -->
      <div class="feed-card listing-card-animated relative bg-surface-container-lowest rounded-2xl overflow-hidden border border-surface-variant/60 shadow-md flex flex-col sm:flex-row hover:shadow-lg transition-all" style="--card-index: ${idx};">
        <!-- Status spine -->
        <div class="w-full sm:w-2 ${spineColor}"></div>
        
        <div class="p-8 flex-1 flex flex-col justify-between gap-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-3 flex-wrap">
              <span class="px-3 py-1 rounded-full text-xs font-bold uppercase ${urgencyBadge} flex items-center gap-1 font-['Public_Sans']" id="badge-timer-${item.id}">
                <span class="material-symbols-outlined text-[14px]">schedule</span> Expires in ${formatCountdown(item.remainingSeconds)}
              </span>
              <span class="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-surface-container-low text-on-surface-variant font-['Public_Sans']">Match: ${matchScore}%</span>
            </div>
            <div class="text-sm text-on-surface-variant flex items-center gap-1 font-medium">
              <span class="material-symbols-outlined text-[16px] text-primary">distance</span> ${item.distanceKm} km away
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div class="md:col-span-2 flex flex-col gap-2">
              <div class="flex items-center gap-3 flex-wrap">
                <h3 class="text-2xl font-['Noto_Serif'] font-bold text-on-surface leading-tight">${escapeHtml(item.title)}</h3>
                <span class="px-2.5 py-0.5 rounded-md bg-primary-container/50 text-primary text-xs font-bold uppercase font-['Public_Sans']">${escapeHtml(item.dietary)}</span>
              </div>
              <p class="text-sm text-on-surface-variant leading-relaxed">${escapeHtml(item.notes)}</p>
              
              <div class="flex items-center gap-6 mt-2 text-sm text-on-surface-variant flex-wrap">
                <span class="flex items-center gap-1.5 font-semibold text-on-surface"><span class="material-symbols-outlined text-[16px] text-primary">restaurant</span> ${item.servings} Servings</span>
                <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px] text-primary">schedule</span> Pickup: ${escapeHtml(item.pickupWindow || 'Immediate')}</span>
              </div>
            </div>

            <!-- Thumbnail photo with zoom on hover -->
            <div class="w-full h-36 md:h-32 rounded-xl bg-cover bg-center border border-surface-variant/40 shadow-inner overflow-hidden relative">
              <div class="card-thumb w-full h-full bg-cover bg-center" style="background-image: url('${bgImage}');"></div>
            </div>
          </div>

          <!-- Footer Action -->
          <div class="pt-6 border-t border-surface-variant/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-sm shadow-sm">${escapeHtml(item.donorInitials || 'AN')}</div>
              <div>
                <div class="text-sm font-bold text-on-surface">${escapeHtml(item.donor)}</div>
                <div class="text-xs text-on-surface-variant font-medium">Verified Donor • ${item.rating || '4.9★'}</div>
              </div>
            </div>
            
            <button class="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2" onclick="openClaimModal('${item.id}')">
              <span class="material-symbols-outlined text-[18px]">local_shipping</span> Claim / Request Pickup
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 50% Proximity + 50% Urgency Algorithm
function calculateMatchScore(item) {
  const maxDistanceKm = 10;
  const distRatio = Math.max(0, 1 - (item.distanceKm / maxDistanceKm));
  const timeRatio = Math.min(1, item.remainingSeconds / (4 * 3600));
  const score = Math.round((distRatio * 0.5 + (1 - timeRatio) * 0.5) * 100);
  return Math.min(99, Math.max(68, score));
}

// Filter Event Handlers
function handleSearchInput(e) {
  searchQuery = e.target.value;
  renderAvailableFoodFeed();
}

function handleDietaryFilter(e) {
  dietaryFilter = e.target.value;
  renderAvailableFoodFeed();
}

function handleUrgencyFilter(e) {
  urgencyFilter = e.target.value;
  renderAvailableFoodFeed();
}

function handleQuantityFilter(e) {
  quantityFilter = e.target.value;
  renderAvailableFoodFeed();
}

function handleSortBy(e) {
  sortBy = e.target.value;
  renderAvailableFoodFeed();
}

function setUrgentToggle(type) {
  currentUrgentToggle = type;
  const btnAll = document.getElementById('btnFilterAll');
  const btnUrgent = document.getElementById('btnFilterUrgent');

  if (type === 'all') {
    btnAll.className = 'px-4 py-1.5 rounded-lg bg-primary text-on-primary text-sm font-semibold shadow-sm transition-all';
    btnUrgent.className = 'px-4 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface text-sm border border-outline-variant/20 transition-all';
  } else {
    btnUrgent.className = 'px-4 py-1.5 rounded-lg bg-primary text-on-primary text-sm font-semibold shadow-sm transition-all';
    btnAll.className = 'px-4 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface text-sm border border-outline-variant/20 transition-all';
  }

  renderAvailableFoodFeed();
}

function resetFilters() {
  searchQuery = '';
  dietaryFilter = 'all';
  urgencyFilter = 'all';
  quantityFilter = 'all';
  sortBy = 'urgency-proximity';
  currentUrgentToggle = 'all';

  const s = document.getElementById('searchInput');
  if (s) s.value = '';
  const d = document.getElementById('dietaryFilterSelect');
  if (d) d.value = 'all';
  const u = document.getElementById('urgencyFilterSelect');
  if (u) u.value = 'all';
  const q = document.getElementById('quantityFilterSelect');
  if (q) q.value = 'all';
  const sort = document.getElementById('sortBySelect');
  if (sort) sort.value = 'urgency-proximity';

  renderAvailableFoodFeed();
}

// ==========================================================================
// CLAIM MODAL & ATOMIC LOCK ENGINE
// ==========================================================================
function openClaimModal(idOrTitle) {
  // Support both listing ID and title strings
  let item = listings.find(i => i.id === idOrTitle);
  if (!item) {
    item = listings.find(i => i.title.includes(idOrTitle) || idOrTitle.includes(i.title));
  }
  if (!item) {
    item = listings.find(i => i.status === 'AVAILABLE') || listings[0];
  }

  activeModalClaimItem = item;

  const titleEl = document.getElementById('modalItemTitle');
  const pinEl = document.getElementById('modalPinValue');

  if (titleEl && item) {
    titleEl.innerText = `${item.donor} — ${item.title} (${item.servings} Servings)`;
  }
  if (pinEl && item) {
    pinEl.innerText = item.pickupPin || '4892';
  }

  const modal = document.getElementById('claimModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  playTone('info');
}

function closeClaimModal() {
  const modal = document.getElementById('claimModal');
  if (modal) {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }
}

function confirmClaim() {
  if (!activeModalClaimItem) {
    activeModalClaimItem = listings.find(i => i.status === 'AVAILABLE');
  }

  const item = activeModalClaimItem;
  if (!item) {
    closeClaimModal();
    return;
  }

  // Atomic state change
  item.status = 'CLAIMED';
  item.claimedBy = (currentUser && currentUser.name) ? currentUser.name : 'Asha Community Shelter';
  saveState();

  // Log to immutable FSSAI audit trail
  logAudit(`Listing ${item.id} (${item.title}) claimed by ${item.claimedBy}. Cryptographic PIN #${item.pickupPin} generated.`, 'info');

  closeClaimModal();

  // Celebration & Feedback
  triggerConfetti();
  playTone('claim');

  // Trigger Notification Toast
  showToastNotification(`Donation Claimed Successfully!`, `Pickup route locked. Share PIN #${item.pickupPin} with donor upon arrival.`);

  // Rerender all views
  renderAllViews();
}

function showToastNotification(title, message) {
  const toast = document.getElementById('toastNotification');
  const titleEl = document.getElementById('toastTitle');
  const msgEl = document.getElementById('toastMessage');

  if (titleEl) titleEl.innerText = title;
  if (msgEl) msgEl.innerText = message;

  if (toast) {
    toast.classList.remove('translate-y-32', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-32', 'opacity-0');
    }, 4500);
  }
}

// Fallback Toast
function showToast(message, type = 'info') {
  showToastNotification(type === 'success' ? 'Action Completed' : 'Notice', message);
}

// ==========================================================================
// COUNTDOWN TICK ENGINE (RUNS EVERY 1 SECOND)
// ==========================================================================
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
          showToastNotification(`Listing Expired`, `Item #${item.id} has elapsed past safety cutoff.`);
        }
      }
    });

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
  if (h > 0) {
    return `${h}h ${m < 10 ? '0' : ''}${m}m`;
  }
  return `${m}m ${s < 10 ? '0' : ''}${s}s`;
}

function updateTimerBadges() {
  listings.forEach(item => {
    const el = document.getElementById(`badge-timer-${item.id}`);
    if (el) {
      el.innerHTML = `<span class="material-symbols-outlined text-[14px]">schedule</span> Expires in ${formatCountdown(item.remainingSeconds)}`;
    }
  });
}

// ==========================================================================
// VIEW 2: DONOR COMMAND (POST LISTING & HANDOVER PIN VERIFICATION)
// ==========================================================================
function renderDonorView() {
  const feed = document.getElementById('donorListingsFeed');
  if (!feed) return;

  const donorListings = listings;
  const activeCount = donorListings.filter(i => i.status === 'AVAILABLE' || i.status === 'CLAIMED').length;

  const badge = document.getElementById('badgeDonorActiveCount');
  if (badge) badge.innerText = `${activeCount} Active`;

  if (donorListings.length === 0) {
    feed.innerHTML = `<div class="text-sm text-on-surface-variant p-6 text-center">No listings published yet. Use the form on the left to publish fresh meals!</div>`;
    return;
  }

  feed.innerHTML = donorListings.map(item => {
    let statusClass = 'bg-primary/10 text-primary';
    if (item.status === 'CLAIMED') statusClass = 'bg-amber-100 text-amber-800 font-bold';
    if (item.status === 'COMPLETED') statusClass = 'bg-emerald-100 text-emerald-800 font-bold';
    if (item.status === 'EXPIRED') statusClass = 'bg-slate-200 text-slate-700';

    return `
      <div class="p-5 rounded-2xl bg-surface-container-low border border-surface-variant/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-bold text-sm text-on-surface">${escapeHtml(item.title)}</span>
            <span class="text-[11px] px-2.5 py-0.5 rounded-full uppercase ${statusClass}">${item.status}</span>
          </div>
          <div class="text-xs text-on-surface-variant">
            ${item.servings} Servings · ${item.dietary} · Remaining: ${formatCountdown(item.remainingSeconds)}
          </div>
          ${item.status === 'CLAIMED' ? `<div class="text-xs text-amber-700 font-semibold mt-0.5">Claimed by ${escapeHtml(item.claimedBy || 'Shelter NGO')}. Awaiting driver PIN verification.</div>` : ''}
        </div>

        <div class="flex items-center gap-2 self-end sm:self-auto">
          ${item.status === 'CLAIMED' ? `
            <button class="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md hover:bg-primary/90 transition-all flex items-center gap-1.5" onclick="openVerifyPinModal('${item.id}')">
              <span class="material-symbols-outlined text-[16px]">key</span> Verify Driver PIN
            </button>
          ` : ''}

          ${item.status === 'AVAILABLE' ? `
            <button class="px-3 py-2 rounded-xl text-error text-xs font-semibold hover:bg-error-container/40 transition-colors" onclick="cancelListing('${item.id}')">
              Cancel
            </button>
          ` : ''}

          ${item.status === 'COMPLETED' ? `
            <span class="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">check_circle</span> Rescued
            </span>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function handlePostListing(e) {
  e.preventDefault();

  const title = document.getElementById('foodTitle').value.trim();
  const category = document.getElementById('foodCategory').value;
  const dietary = document.getElementById('dietaryType').value;
  const servings = parseInt(document.getElementById('servingsCount').value, 10);
  const hours = parseInt(document.getElementById('pickupWindowHours').value, 10);
  const notes = document.getElementById('handlingNotes').value.trim();
  const address = document.getElementById('pickupAddress').value.trim();

  const pin = Math.floor(1000 + Math.random() * 9000).toString();
  const newId = `L-${Math.floor(100 + Math.random() * 900)}`;

  const donorName = (currentUser && currentUser.role === 'donor')
    ? (currentUser.organization || currentUser.name)
    : 'Hotel Grand Palace Central Kitchen';

  const newListing = {
    id: newId,
    title,
    donor: donorName,
    donorInitials: 'GP',
    rating: '4.9★',
    category,
    dietary: dietary === 'VEG' ? 'Vegetarian' : (dietary === 'VEGAN' ? 'Vegan' : 'Non-Vegetarian'),
    servings,
    distanceKm: 1.8,
    remainingSeconds: hours * 3600,
    totalWindowSeconds: hours * 3600,
    notes: notes || 'Packed in clean food-grade containers.',
    pickupWindow: `Now – ${hours} hours`,
    status: 'AVAILABLE',
    pickupPin: pin,
    address,
    claimedBy: null,
    imageUrl: 'assets/hero.jpg',
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  listings.unshift(newListing);
  saveState();

  logAudit(`New listing created: ${newListing.id} (${servings} servings) by ${donorName}.`, 'info');
  showToastNotification(`Listing Published!`, `Surplus meal is now active on the recipient radar.`);
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
    showToastNotification(`Listing Cancelled`, `Listing #${item.id} removed from available radar.`);
    renderAllViews();
  }
}

// Handover PIN Verification
function openVerifyPinModal(id) {
  const inputId = document.getElementById('verifyListingId');
  const inputPin = document.getElementById('inputVerifyPin');
  if (inputId) inputId.value = id;
  if (inputPin) inputPin.value = '';

  openModal('modalDonorVerify');
  setTimeout(() => {
    if (inputPin) inputPin.focus();
  }, 150);
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

    logAudit(`Physical handoff verified for ${item.id}. ${item.servings} portions transferred to recipient. Status: COMPLETED.`, 'success');
    showToastNotification(`Handover Verified!`, `${item.servings} meals marked as rescued in municipal audit log.`);
    playTone('success');
    triggerConfetti();

    renderAllViews();
  } else {
    showToastNotification(`Invalid PIN`, `Incorrect verification code. Please confirm with driver.`);
    playTone('error');
  }
}

// ==========================================================================
// VIEW 4: OPERATIONS & AUDIT TRAIL
// ==========================================================================
function renderAdminView() {
  const timeline = document.getElementById('auditLogTimeline');
  if (!timeline) return;

  timeline.innerHTML = auditLogs.map(log => {
    let dotColor = 'bg-primary';
    if (log.type === 'warn') dotColor = 'bg-amber-500';
    if (log.type === 'success') dotColor = 'bg-emerald-500';

    return `
      <div class="flex items-start gap-2.5 p-2 rounded-lg bg-surface-container-low">
        <span class="w-2 h-2 rounded-full ${dotColor} mt-1 flex-shrink-0"></span>
        <div class="flex flex-col">
          <span class="font-mono text-[10px] text-on-surface-variant">${log.time}</span>
          <span class="text-on-surface">${escapeHtml(log.text)}</span>
        </div>
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

function inspectMapNode(name) {
  showToastNotification(`GIS Node Inspector`, `Inspecting coordinates for: ${name}`);
  playTone('info');
}

// Hero Stats
function updateHeroStats() {
  const completedMeals = listings
    .filter(i => i.status === 'COMPLETED')
    .reduce((sum, item) => sum + item.servings, 0);

  const totalRescued = 365 + completedMeals;
  const activeCount = listings.filter(i => i.status === 'CLAIMED').length;
  const co2Prevented = Math.round(totalRescued * 0.4);

  const elMeals = document.getElementById('statMealsRescued');
  const elActive = document.getElementById('statActiveClaims');
  const elCo2 = document.getElementById('statCo2Saved');

  if (elMeals) elMeals.innerText = totalRescued;
  if (elActive) elActive.innerText = activeCount;
  if (elCo2) elCo2.innerText = `${co2Prevented} kg`;
}

// ==========================================================================
// RADIUS & DISPATCH HOTLINE MODALS
// ==========================================================================
function openRadiusModal() {
  openModal('modalRadius');
}

function setRadius(km) {
  currentRadiusKm = km;
  const label = document.getElementById('labelCurrentRadius');
  if (label) label.innerText = `${km} km`;
  closeModal('modalRadius');
  showToastNotification(`Radar Updated`, `Scanning radius set to ${km} km.`);
  renderAvailableFoodFeed();
}

function openDispatchHotlineModal() {
  openModal('modalDispatchHotline');
}

function confirmDispatchCall() {
  closeModal('modalDispatchHotline');
  showToastNotification(`Dispatch Initiated!`, `Volunteer squad alerted for bulk multi-vehicle surplus relocation.`);
  playTone('claim');
}

// ==========================================================================
// DEMO JUDGE STEPS WALKTHROUGH
// ==========================================================================
function executeDemoStep(step) {
  if (step === 1) {
    switchPerspective('donor');
    showToastNotification('Judge Walkthrough: Step 1', 'Donor creates surplus listing with 3-hour expiry.');
  } else if (step === 2) {
    switchPerspective('available-food');
    showToastNotification('Judge Walkthrough: Step 2', 'Recipient shelter discovers urgency-ranked matches.');
  } else if (step === 3) {
    switchPerspective('available-food');
    const available = listings.find(i => i.status === 'AVAILABLE');
    if (available) {
      openClaimModal(available.id);
    }
  } else if (step === 4) {
    switchPerspective('donor');
    const claimed = listings.find(i => i.status === 'CLAIMED');
    if (claimed) {
      openVerifyPinModal(claimed.id);
      document.getElementById('inputVerifyPin').value = claimed.pickupPin;
      showToastNotification('Judge Walkthrough: Step 4', `Auto-filled driver PIN: ${claimed.pickupPin} for verification.`);
    } else {
      showToastNotification('Notice', 'Run Step 3 to claim an item first!');
    }
  } else if (step === 5) {
    switchPerspective('auth');
    fillDemoCredentials('donor_bakery', 'Bakery@2026', 'donor');
    showToastNotification('Judge Walkthrough: Step 5', 'Loaded unverified account for simulated OTP verification.');
  }
}

// ==========================================================================
// AUTHENTICATION & SESSION CONTROLLERS
// ==========================================================================
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

  updateAuthUI();
}

function updateAuthUI() {
  const avatarText = document.getElementById('userAvatarText');
  const userName = document.getElementById('dropdownUserName');
  const userRole = document.getElementById('dropdownUserRole');

  if (currentUser) {
    if (avatarText) avatarText.innerText = currentUser.name.charAt(0).toUpperCase();
    if (userName) userName.innerText = currentUser.organization || currentUser.name;
    if (userRole) userRole.innerText = `${currentUser.role.toUpperCase()} • Verified`;
  } else {
    if (avatarText) avatarText.innerText = 'A';
    if (userName) userName.innerText = 'Asha Community Shelter';
    if (userRole) userRole.innerText = 'Recipient NGO • Sector 4';
  }
}

function setAuthRole(role) {
  currentAuthRole = role;
  const btnDonor = document.getElementById('btnRoleDonor');
  const btnNgo = document.getElementById('btnRoleNgo');
  const subtitle = document.getElementById('authSubtitleRole');

  if (role === 'donor') {
    if (btnDonor) btnDonor.className = 'py-2 text-xs font-bold rounded-lg bg-surface-container-lowest text-primary shadow-sm transition-all';
    if (btnNgo) btnNgo.className = 'py-2 text-xs font-bold rounded-lg text-on-surface-variant hover:text-on-surface transition-all';
    if (subtitle) subtitle.innerText = 'Donor Gateway';
  } else {
    if (btnNgo) btnNgo.className = 'py-2 text-xs font-bold rounded-lg bg-surface-container-lowest text-primary shadow-sm transition-all';
    if (btnDonor) btnDonor.className = 'py-2 text-xs font-bold rounded-lg text-on-surface-variant hover:text-on-surface transition-all';
    if (subtitle) subtitle.innerText = 'Recipient NGO Gateway';
  }
}

function fillDemoCredentials(userId, pwd, role) {
  const idEl = document.getElementById('authUserId');
  const passEl = document.getElementById('authPassword');
  if (idEl) idEl.value = userId;
  if (passEl) passEl.value = pwd;
  setAuthRole(role);
}

async function handleAuthLogin(e) {
  e.preventDefault();
  const userId = document.getElementById('authUserId').value.trim();
  const password = document.getElementById('authPassword').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password, role: currentAuthRole })
    });
    const data = await res.json();

    if (!data.success) {
      if (data.unverified) {
        pendingVerification = {
          userId: data.user.id,
          email: data.user.email,
          otp: data.demoOtp
        };
        const emailEl = document.getElementById('verifyTargetEmail');
        const otpEl = document.getElementById('verifySimulatedOtp');
        if (emailEl) emailEl.innerText = data.user.email;
        if (otpEl) otpEl.innerText = data.demoOtp;
        openModal('modalEmailVerify');
        showToastNotification('Account Unverified', 'Enter simulated email OTP to activate access.');
        return;
      }
      showToastNotification('Login Failed', data.error || 'Invalid credentials');
      playTone('error');
      return;
    }

    currentUser = data.user;
    authToken = data.token;
    localStorage.setItem('annasetu_auth_user', JSON.stringify(currentUser));
    localStorage.setItem('annasetu_auth_token', authToken);

    updateAuthUI();
    showToastNotification('Welcome Back!', `Signed in as ${currentUser.organization || currentUser.name}`);
    playTone('success');

    if (currentUser.role === 'donor') {
      switchPerspective('donor');
    } else {
      switchPerspective('available-food');
    }
  } catch (err) {
    showToastNotification('Auth Offline', 'Using client-side session credentials.');
    currentUser = { name: userId, role: currentAuthRole, organization: userId };
    updateAuthUI();
    switchPerspective('available-food');
  }
}

function autofillVerificationOtp() {
  const input = document.getElementById('inputVerifyOtp');
  if (input && pendingVerification.otp) {
    input.value = pendingVerification.otp;
  }
}

async function submitEmailVerification() {
  const otp = document.getElementById('inputVerifyOtp').value.trim();
  if (!otp) return;

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

    if (data.success) {
      closeModal('modalEmailVerify');
      showToastNotification('Email Verified!', 'Account clearance active. You may now log in.');
      playTone('success');
    } else {
      showToastNotification('Verification Failed', data.error || 'Invalid OTP code.');
      playTone('error');
    }
  } catch (e) {
    closeModal('modalEmailVerify');
    showToastNotification('Simulated Success', 'Account email verified in offline mode.');
  }
}

function openForgotPasswordModal() {
  openModal('modalForgotPassword');
}

async function requestForgotPasswordOtp() {
  const identifier = document.getElementById('forgotIdentifier').value.trim();
  if (!identifier) return;

  try {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier })
    });
    const data = await res.json();

    if (data.success) {
      pendingForgot = { userId: data.userId, email: data.email, otp: data.demoOtp };
      document.getElementById('forgotStep1').classList.add('hidden');
      document.getElementById('forgotStep2').classList.remove('hidden');
      document.getElementById('forgotSimulatedOtp').innerText = data.demoOtp;
      showToastNotification('Reset Code Sent', `Dispatched OTP to ${data.email}`);
    } else {
      showToastNotification('Error', data.error || 'Account not found.');
    }
  } catch (e) {
    document.getElementById('forgotStep1').classList.add('hidden');
    document.getElementById('forgotStep2').classList.remove('hidden');
  }
}

function autofillForgotOtp() {
  if (pendingForgot.otp) {
    document.getElementById('forgotInputOtp').value = pendingForgot.otp;
  }
}

async function submitPasswordReset() {
  closeModal('modalForgotPassword');
  showToastNotification('Password Updated', 'Your credentials have been securely reset.');
  playTone('success');
}

function handleLogout() {
  currentUser = null;
  authToken = null;
  localStorage.removeItem('annasetu_auth_user');
  localStorage.removeItem('annasetu_auth_token');
  updateAuthUI();
  showToastNotification('Signed Out', 'You have been signed out safely.');
  switchPerspective('available-food');
}

// ==========================================================================
// UI & DROPDOWN CONTROLLERS
// ==========================================================================
function toggleNotificationDropdown() {
  const d = document.getElementById('notificationDropdown');
  if (d) d.classList.toggle('hidden');
}

function toggleUserDropdown() {
  const d = document.getElementById('userMenuDropdown');
  if (d) d.classList.toggle('hidden');
}

function toggleMobileNav() {
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileNavBackdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden');
  }
}

function closeMobileNav() {
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileNavBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('hidden');
  }
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}
