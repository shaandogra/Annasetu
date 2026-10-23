const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// In-Memory Active Sessions Store: token -> { userId, createdAt }
const activeSessions = new Map();

// Ensure users store exists
function ensureDataStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    const defaultUsers = [
      {
        id: "donor_hotel",
        name: "Hotel Grand Palace Central Kitchen",
        email: "donor@grandpalace.com",
        password: "GrandPalace@2026",
        role: "donor",
        organization: "Hotel Grand Palace",
        phone: "+91 98765-43210",
        address: "Grand Palace Central Kitchen Gate 2, MG Road",
        fssaiNumber: "11521018000412",
        fssaiVerified: true,
        hygieneRating: "4.9/5 ★ FSSAI Green",
        gstin: "07AABCH1234F1Z9",
        gstinVerified: true,
        establishmentType: "5-Star Hotel & Central Banquet",
        verified: true,
        createdAt: new Date().toISOString()
      },
      {
        id: "ngo_asha",
        name: "Asha Community Shelter",
        email: "contact@ashashelter.org",
        password: "AshaShelter@2026",
        role: "ngo",
        organization: "Asha Community Shelter",
        phone: "+91 98123-45678",
        address: "Asha Community Shelter, Sector 4",
        verified: true,
        createdAt: new Date().toISOString()
      },
      {
        id: "donor_bakery",
        name: "City Artisan Bakery Hub",
        email: "bakery@freshbuns.org",
        password: "Bakery@2026",
        role: "donor",
        organization: "City Artisan Bakery",
        phone: "+91 98765-11223",
        address: "Connaught Lane Bakery Hub, Block C",
        fssaiNumber: "11522025000188",
        fssaiVerified: true,
        hygieneRating: "4.8/5 ★ Clean Bake",
        gstin: "07AABCB9981K1Z2",
        gstinVerified: true,
        establishmentType: "Artisan Bakery & Confectionery",
        verified: false,
        verifyOtp: "582914",
        otpExpiry: Date.now() + 24 * 3600 * 1000,
        createdAt: new Date().toISOString()
      },
      {
        id: "volunteer_rajesh",
        name: "Rajesh Kumar (Volunteer Courier)",
        email: "rajesh.courier@annasetu.org",
        password: "Volunteer@2026",
        role: "volunteer",
        organization: "Citizen Cargo Squad #4",
        phone: "+91 98450-12345",
        address: "Sector 4 Civic Dispatch Point",
        vehicle: "Electric Two-Wheeler / Thermal Backpack",
        aadhaar: "XXXX-XXXX-8821",
        aadhaarVerified: true,
        verified: true,
        createdAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2), 'utf-8');
  }
}

function readUsers() {
  ensureDataStore();
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading users file:', err);
    return [];
  }
}

function saveUsers(users) {
  ensureDataStore();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

// Helpers
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (e) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

function sanitizeUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    organization: u.organization || u.name,
    phone: u.phone || '',
    address: u.address || '',
    vehicle: u.vehicle || '',
    aadhaar: u.aadhaar || '',
    aadhaarVerified: !!u.aadhaarVerified,
    fssaiNumber: u.fssaiNumber || '',
    fssaiVerified: !!u.fssaiVerified,
    hygieneRating: u.hygieneRating || '4.9/5 ★',
    gstin: u.gstin || '',
    gstinVerified: !!u.gstinVerified,
    establishmentType: u.establishmentType || '',
    verified: !!u.verified
  };
}

// Route Handler
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    });
    res.end();
    return;
  }

  const [reqPath] = req.url.split('?');

  // ====================================================
  // BACKEND API ENDPOINTS
  // ====================================================

  // 1. LOGIN API
  if (reqPath === '/api/auth/login' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { userId, password, role } = body;

      if (!userId || !password) {
        return sendJson(res, 400, {
          success: false,
          error: 'User ID and Password are required.'
        });
      }

      const users = readUsers();
      const cleanInput = String(userId).trim().toLowerCase();

      // Find by ID or Email
      const user = users.find(u => 
        u.id.toLowerCase() === cleanInput || 
        (u.email && u.email.toLowerCase() === cleanInput)
      );

      if (!user) {
        return sendJson(res, 401, {
          success: false,
          error: 'No account found matching this User ID or Email. Please check spelling or register a new account.'
        });
      }

      // Check Password
      if (user.password !== password) {
        return sendJson(res, 401, {
          success: false,
          error: 'Incorrect password! Please verify your password or use "Forgot Password".'
        });
      }

      // Optional role validation notice
      if (role && user.role !== role) {
        return sendJson(res, 400, {
          success: false,
          error: `This account is registered as a ${user.role.toUpperCase()} portal user. Please switch to the ${user.role.toUpperCase()} tab to proceed.`
        });
      }

      // Check Email Verification status
      if (!user.verified) {
        // Generate or refresh 6-digit OTP
        const otp = user.verifyOtp || Math.floor(100000 + Math.random() * 900000).toString();
        user.verifyOtp = otp;
        user.otpExpiry = Date.now() + 15 * 60 * 1000;
        saveUsers(users);

        console.log(`\n========================================`);
        console.log(`[SIMULATED EMAIL DISPATCH - VERIFY EMAIL]`);
        console.log(`To: ${user.email}`);
        console.log(`Subject: AnnaSetu Email Verification Code`);
        console.log(`Your 6-Digit OTP: >>> ${otp} <<<`);
        console.log(`========================================\n`);

        return sendJson(res, 403, {
          success: false,
          requiresVerification: true,
          email: user.email,
          userId: user.id,
          demoOtp: otp,
          error: `Account email (${user.email}) is not verified yet. A 6-digit verification code has been dispatched. Please verify your email to unlock your portal.`
        });
      }

      // Success: Issue session token
      const token = 'ast_' + crypto.randomBytes(24).toString('hex');
      activeSessions.set(token, {
        userId: user.id,
        role: user.role,
        name: user.name,
        createdAt: Date.now()
      });

      return sendJson(res, 200, {
        success: true,
        message: `Welcome back, ${user.name}! Authenticated as ${user.role.toUpperCase()}.`,
        token,
        user: sanitizeUser(user)
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 2. REGISTRATION API
  if (reqPath === '/api/auth/register' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { userId, name, email, password, role, organization, phone, address } = body;

      if (!userId || !name || !email || !password || !role) {
        return sendJson(res, 400, {
          success: false,
          error: 'Please fill in all mandatory fields: User ID, Name, Email, Password, and Role.'
        });
      }

      if (password.length < 6) {
        return sendJson(res, 400, {
          success: false,
          error: 'Password must be at least 6 characters long.'
        });
      }

      const users = readUsers();
      const cleanId = String(userId).trim().toLowerCase();
      const cleanEmail = String(email).trim().toLowerCase();

      if (users.some(u => u.id.toLowerCase() === cleanId)) {
        return sendJson(res, 409, {
          success: false,
          error: 'This User ID is already taken. Please choose a different identifier.'
        });
      }

      if (users.some(u => u.email && u.email.toLowerCase() === cleanEmail)) {
        return sendJson(res, 409, {
          success: false,
          error: 'An account with this email address already exists. Please log in or use Forgot Password.'
        });
      }

      const verifyOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const newUser = {
        id: String(userId).trim(),
        name: String(name).trim(),
        email: cleanEmail,
        password: String(password),
        role: role === 'volunteer' ? 'volunteer' : (role === 'ngo' ? 'ngo' : 'donor'),
        organization: String(organization || name).trim(),
        phone: String(phone || '').trim(),
        address: String(address || '').trim(),
        vehicle: String(body.vehicle || '').trim(),
        aadhaar: String(body.aadhaar || '').trim(),
        aadhaarVerified: !!body.aadhaarVerified,
        fssaiNumber: String(body.fssaiNumber || '').trim(),
        fssaiVerified: !!body.fssaiVerified,
        hygieneRating: String(body.hygieneRating || '4.9/5 ★ FSSAI Green').trim(),
        gstin: String(body.gstin || '').trim().toUpperCase(),
        gstinVerified: !!body.gstinVerified,
        establishmentType: String(body.establishmentType || '').trim(),
        verified: false,
        verifyOtp,
        otpExpiry: Date.now() + 15 * 60 * 1000,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);

      console.log(`\n========================================`);
      console.log(`[SIMULATED EMAIL DISPATCH - WELCOME & VERIFY]`);
      console.log(`To: ${newUser.email}`);
      console.log(`Subject: Welcome to AnnaSetu — Verify Your Email`);
      console.log(`Your 6-Digit OTP: >>> ${verifyOtp} <<<`);
      console.log(`========================================\n`);

      return sendJson(res, 201, {
        success: true,
        message: `Account created successfully! We sent a 6-digit verification code to ${newUser.email}.`,
        requiresVerification: true,
        userId: newUser.id,
        email: newUser.email,
        demoOtp: verifyOtp
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 3. EMAIL VERIFICATION API
  if (reqPath === '/api/auth/verify-email' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { userId, email, otp } = body;

      if (!otp) {
        return sendJson(res, 400, {
          success: false,
          error: 'Please enter the 6-digit verification code.'
        });
      }

      const users = readUsers();
      const user = users.find(u => 
        (userId && u.id.toLowerCase() === String(userId).trim().toLowerCase()) ||
        (email && u.email.toLowerCase() === String(email).trim().toLowerCase())
      );

      if (!user) {
        return sendJson(res, 404, {
          success: false,
          error: 'User not found. Please register or check your credentials.'
        });
      }

      if (user.verified) {
        return sendJson(res, 200, {
          success: true,
          message: 'Email is already verified. You may log in directly.',
          user: sanitizeUser(user)
        });
      }

      if (!user.verifyOtp || user.verifyOtp.trim() !== String(otp).trim()) {
        return sendJson(res, 400, {
          success: false,
          error: 'Invalid verification code! Please check your email or click "Resend Code".'
        });
      }

      if (user.otpExpiry && Date.now() > user.otpExpiry) {
        return sendJson(res, 400, {
          success: false,
          error: 'Verification code has expired. Please request a new code.'
        });
      }

      // Mark verified
      user.verified = true;
      delete user.verifyOtp;
      delete user.otpExpiry;
      saveUsers(users);

      // Issue active session
      const token = 'ast_' + crypto.randomBytes(24).toString('hex');
      activeSessions.set(token, {
        userId: user.id,
        role: user.role,
        name: user.name,
        createdAt: Date.now()
      });

      return sendJson(res, 200, {
        success: true,
        message: '🎉 Email verified successfully! Your account is fully active.',
        token,
        user: sanitizeUser(user)
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 3b. AADHAAR e-KYC VERIFICATION API (UIDAI SIMULATOR FOR VOLUNTEERS)
  if (reqPath === '/api/auth/verify-aadhaar' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const rawNumber = String(body.aadhaarNumber || '').replace(/[\s-]/g, '');

      if (!/^\d{12}$/.test(rawNumber)) {
        return sendJson(res, 400, {
          success: false,
          error: 'Please enter a valid 12-digit Indian Aadhaar number.'
        });
      }

      // Generate Masked Aadhaar (e.g. XXXX-XXXX-4892) and 6-digit OTP
      const masked = `XXXX-XXXX-${rawNumber.slice(-4)}`;
      const demoOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const txnId = 'UIDAI-eKYC-' + Date.now().toString(36).toUpperCase();

      console.log(`\n========================================`);
      console.log(`[UIDAI e-KYC SIMULATOR - VOLUNTEER AUTH]`);
      console.log(`Aadhaar: ${masked}`);
      console.log(`Txn ID: ${txnId}`);
      console.log(`UIDAI OTP sent to linked mobile: >>> ${demoOtp} <<<`);
      console.log(`========================================\n`);

      return sendJson(res, 200, {
        success: true,
        message: `UIDAI e-KYC authentication initiated. 6-digit OTP sent to mobile registered with Aadhaar ${masked}.`,
        maskedAadhaar: masked,
        demoOtp,
        txnId
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 3c. FSSAI LICENSE KYC VERIFICATION API (FOSCOS SIMULATOR FOR DONORS)
  if (reqPath === '/api/auth/verify-fssai' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const rawFssai = String(body.fssaiNumber || '').replace(/\D/g, '');

      if (!/^\d{14}$/.test(rawFssai)) {
        return sendJson(res, 400, {
          success: false,
          error: 'FSSAI License must be exactly 14 numeric digits (e.g. 11521018000412).'
        });
      }

      console.log(`\n========================================`);
      console.log(`[FSSAI FoSCoS e-KYC VERIFIER - DONOR AUDIT]`);
      console.log(`FSSAI Number: ${rawFssai}`);
      console.log(`Hygiene Rating: 4.9/5 ★ (Green Grade Safe Surplus)`);
      console.log(`License Category: Central Food Business Operator`);
      console.log(`Safe Holding Audit: PASSED (Zero Contamination Protocol)`);
      console.log(`========================================\n`);

      return sendJson(res, 200, {
        success: true,
        message: `FSSAI License #${rawFssai} verified with national FoSCoS portal.`,
        fssaiNumber: rawFssai,
        licenseCategory: 'Central FSSAI License (Hotel & Commercial Kitchen)',
        hygieneRating: '4.9/5 ★ Food Hygiene Rating',
        expiryDate: '2029-12-31',
        safeSurplusClearance: true
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 3d. GSTIN VERIFICATION API (GSTN TAXPAYER REGISTRY SIMULATOR FOR DONORS)
  if (reqPath === '/api/auth/verify-gstin' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const rawGstin = String(body.gstin || '').trim().toUpperCase().replace(/[^0-9A-Z]/g, '');

      if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(rawGstin)) {
        return sendJson(res, 400, {
          success: false,
          error: 'Please enter a valid 15-character Indian GSTIN (e.g. 07AABCH1234F1Z9).'
        });
      }

      const stateCode = rawGstin.substring(0, 2);
      const panPart = rawGstin.substring(2, 12);

      console.log(`\n========================================`);
      console.log(`[GSTN TAXPAYER VERIFIER - DONOR AUDIT]`);
      console.log(`GSTIN: ${rawGstin}`);
      console.log(`State Jurisdiction: Code ${stateCode} (Active Regular Taxpayer)`);
      console.log(`Associated PAN: ${panPart}`);
      console.log(`========================================\n`);

      return sendJson(res, 200, {
        success: true,
        message: `GSTIN ${rawGstin} verified active on Goods & Services Tax Network.`,
        gstin: rawGstin,
        legalStatus: 'Active Regular Taxpayer',
        pan: panPart,
        stateCode
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 4. RESEND VERIFICATION CODE API
  if (reqPath === '/api/auth/resend-code' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { userId, email } = body;

      const users = readUsers();
      const user = users.find(u => 
        (userId && u.id.toLowerCase() === String(userId).trim().toLowerCase()) ||
        (email && u.email.toLowerCase() === String(email).trim().toLowerCase())
      );

      if (!user) {
        return sendJson(res, 404, { success: false, error: 'User account not found.' });
      }

      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      user.verifyOtp = newOtp;
      user.otpExpiry = Date.now() + 15 * 60 * 1000;
      saveUsers(users);

      console.log(`\n========================================`);
      console.log(`[SIMULATED EMAIL DISPATCH - RESEND CODE]`);
      console.log(`To: ${user.email}`);
      console.log(`Subject: New AnnaSetu Verification Code`);
      console.log(`Your 6-Digit OTP: >>> ${newOtp} <<<`);
      console.log(`========================================\n`);

      return sendJson(res, 200, {
        success: true,
        message: `A fresh 6-digit verification code has been dispatched to ${user.email}.`,
        demoOtp: newOtp,
        email: user.email
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 5. FORGOT PASSWORD API
  if (reqPath === '/api/auth/forgot-password' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { identifier } = body;

      if (!identifier) {
        return sendJson(res, 400, {
          success: false,
          error: 'Please enter your registered User ID or Email address.'
        });
      }

      const users = readUsers();
      const cleanInput = String(identifier).trim().toLowerCase();
      const user = users.find(u => 
        u.id.toLowerCase() === cleanInput || 
        (u.email && u.email.toLowerCase() === cleanInput)
      );

      if (!user) {
        return sendJson(res, 404, {
          success: false,
          error: 'No account registered with that User ID or Email. Please check spelling.'
        });
      }

      const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
      user.resetOtp = resetOtp;
      user.resetOtpExpiry = Date.now() + 15 * 60 * 1000;
      saveUsers(users);

      console.log(`\n========================================`);
      console.log(`[SIMULATED EMAIL DISPATCH - PASSWORD RESET]`);
      console.log(`To: ${user.email}`);
      console.log(`Subject: AnnaSetu Password Reset Request`);
      console.log(`Your Password Reset OTP: >>> ${resetOtp} <<<`);
      console.log(`========================================\n`);

      return sendJson(res, 200, {
        success: true,
        message: `Password reset OTP successfully sent to ${user.email}.`,
        email: user.email,
        userId: user.id,
        demoOtp: resetOtp
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 6. RESET PASSWORD API
  if (reqPath === '/api/auth/reset-password' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { userId, email, otp, newPassword } = body;

      if (!otp || !newPassword) {
        return sendJson(res, 400, {
          success: false,
          error: 'OTP code and new password are required.'
        });
      }

      if (newPassword.length < 6) {
        return sendJson(res, 400, {
          success: false,
          error: 'New password must be at least 6 characters.'
        });
      }

      const users = readUsers();
      const user = users.find(u => 
        (userId && u.id.toLowerCase() === String(userId).trim().toLowerCase()) ||
        (email && u.email.toLowerCase() === String(email).trim().toLowerCase())
      );

      if (!user) {
        return sendJson(res, 404, {
          success: false,
          error: 'User not found.'
        });
      }

      if (!user.resetOtp || user.resetOtp.trim() !== String(otp).trim()) {
        return sendJson(res, 400, {
          success: false,
          error: 'Invalid password reset code! Please re-check the OTP.'
        });
      }

      if (user.resetOtpExpiry && Date.now() > user.resetOtpExpiry) {
        return sendJson(res, 400, {
          success: false,
          error: 'Password reset code has expired. Please request a new one.'
        });
      }

      // Update password
      user.password = String(newPassword);
      delete user.resetOtp;
      delete user.resetOtpExpiry;
      // Also automatically mark email verified if they verified reset code
      user.verified = true;
      saveUsers(users);

      return sendJson(res, 200, {
        success: true,
        message: 'Password successfully updated! You can now log in with your new password.'
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 7. DEMO USERS INFO (Public endpoint for rapid judge demo auto-fill)
  if (reqPath === '/api/auth/demo-users' && req.method === 'GET') {
    return sendJson(res, 200, {
      success: true,
      demoAccounts: [
        {
          label: "🏨 Hotel Grand Palace (Donor)",
          userId: "donor_hotel",
          pass: "GrandPalace@2026",
          role: "donor",
          status: "Verified",
          email: "donor@grandpalace.com"
        },
        {
          label: "🤝 Asha Shelter (NGO)",
          userId: "ngo_asha",
          pass: "AshaShelter@2026",
          role: "ngo",
          status: "Verified",
          email: "contact@ashashelter.org"
        },
        {
          label: "⚠️ City Artisan Bakery (Test Unverified)",
          userId: "donor_bakery",
          pass: "Bakery@2026",
          role: "donor",
          status: "Needs Email Verification",
          email: "bakery@freshbuns.org"
        }
      ]
    });
  }

  // 8. SESSION CHECK
  if (reqPath === '/api/auth/session' && req.method === 'GET') {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const session = activeSessions.get(token);

    if (session) {
      const users = readUsers();
      const user = users.find(u => u.id === session.userId);
      if (user) {
        return sendJson(res, 200, {
          success: true,
          user: sanitizeUser(user)
        });
      }
    }
    return sendJson(res, 401, { success: false, error: 'No active session' });
  }

  // 9. LOGOUT
  if (reqPath === '/api/auth/logout' && req.method === 'POST') {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    activeSessions.delete(token);
    return sendJson(res, 200, { success: true, message: 'Logged out successfully' });
  }

  // ====================================================
  // STATIC FILE SERVING
  // ====================================================
  let staticPath = reqPath === '/' ? '/index.html' : reqPath;
  const filePath = path.join(__dirname, staticPath);

  // Security guard against directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(content, 'utf-8');
    }
  });
});

ensureDataStore();

server.listen(PORT, () => {
  console.log(`AnnaSetu backend server with Auth API running at http://localhost:${PORT}`);
});
