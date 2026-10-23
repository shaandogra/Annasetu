# AnnaSetu — Surplus Food Rescue & Verification Platform
**Srijan Setu 2026 Hackathon Prototype**  
*Theme: Bridging Problems & Solutions · Food Security & Sustainability*

---

## 🌟 Executive Overview
Every night, commercial kitchens, banquet halls, and corporate dining facilities discard dozens of fresh, untouched food portions while community shelters and kitchens 2 to 5 km away scramble for resources. Traditional charity directories fail because **cooked food has a strict perishable countdown window**. 

**AnnaSetu** solves this through a real-time, time-critical logistics engine that:
1. Calculates **proximity and remaining shelf-life urgency** to rank matches.
2. Uses **atomic reservation locks** to prevent double-claiming.
3. Secures physical handovers with **cryptographic 4-digit verification PINs**.
4. Auto-expires unallocated food and maintains an immutable **FSSAI-aligned audit log**.

---

## 🚀 Key Features Built in This Prototype

* **🔐 Unified Authentication & Verification Gateway:**
  * Single-page access for both **Food Donors** and **Recipient NGOs** with dynamic role theming and instant credential auto-fill.
  * Backend REST API (`/api/auth/login`, `/api/auth/register`, `/api/auth/verify-email`, `/api/auth/forgot-password`, `/api/auth/reset-password`).
  * **Email Verification Engine:** Prevents unverified accounts from claiming/posting surplus meals with interactive simulated inbox dispatch & 1-click code auto-fill.
  * **Forgot Password Flow:** Secure 6-digit OTP dispatch and reset modal with credential validation.
  * **Dynamic Error Handling:** Animated red alert banners with shake effect for incorrect passwords, unmatched roles, or unverified accounts.

* **🏨 Donor Portal (Hotel Grand Palace):**
  * Rapid surplus meal publishing with dietary tags (Veg, Non-Veg, Vegan), packaging notes, and expiry limits.
  * Live ticking countdown timers and status indicators (`AVAILABLE`, `CLAIMED`, `COMPLETED`, `EXPIRED`).
  * Physical handover verification modal to enter the recipient's 4-digit PIN.

* **🤝 Recipient NGO Portal (Asha Community Shelter):**
  * Distance and category radar filters (Cooked, Bakery, Veg, Urgent &lt; 2 hrs).
  * Real-time match scoring algorithm ($50\%$ distance weight + $50\%$ time urgency).
  * Atomic 1-click claim that instantly generates the secure pickup PIN.

* **🛡️ Coordinator Operations & GIS Command:**
  * Interactive SVG city telemetry map showing donors, shelters, and in-route couriers.
  * Real-time KPI counters: Total Meals Rescued, Active Handoffs, CO₂ Prevented.
  * Immutable chain-of-custody audit timeline logging every status change.

* **🏆 Interactive Hackathon Judge Pitch Mode:**
  * Step-by-step walkthrough buttons embedded directly into the application for a flawless 3-minute presentation.
  * Reset Demo button to restore clean baseline data at any time.

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** Semantic HTML5, Vanilla CSS3 (Custom Glassmorphism & High-Contrast Design System), Modern Vanilla JavaScript (ES6+).
* **Telemetry & Visuals:** Pure SVG Vector Mapping, Web Audio API Sound Synthesizer.
* **State & Resilience:** LocalStorage reactive store with pre-seeded offline fallback dataset (guaranteed 100% demo uptime without external API failures).

---

## 🏁 How to Run Locally

You can run this project instantly with zero dependency installations:

### Option 1: Direct Browser Launch
Simply double-click or open `index.html` in Chrome, Edge, Firefox, or Safari.

### Option 2: Local HTTP Server (PowerShell / Command Prompt)
```powershell
cd C:\Users\dogra\.gemini\antigravity-ide\scratch\annasetu
python -m http.server 3000
```
Then navigate to: `http://localhost:3000`

---

## 🎯 3-Minute Judge Presentation Script

1. **Minute 0:00 - 0:45 (The Problem Hook):**
   * Open the app. Point out the hero stats: "Cooked food discarded tonight could feed dozens nearby, but existing directories are static phonebooks with no expiry tracking."
2. **Minute 0:45 - 1:30 (Live Listing Creation):**
   * On **Donor View**, fill the quick form for 40 portions of fresh food with a 3-hour expiry. Click **Publish Surplus Listing**.
3. **Minute 1:30 - 2:15 (Instant Discovery & Atomic Claim):**
   * Switch to **Recipient NGO View**. Notice the listing instantly appear at the top with a **96% Match Score**.
   * Click **Claim This Food**. Show the generated **4-digit PIN (e.g., 7419)**. Explain that this listing is now locked to prevent any other NGO from double-booking.
4. **Minute 2:15 - 2:45 (Secure Handover Verification):**
   * Switch back to **Donor View**. The item now shows "Enter Recipient PIN".
   * Enter the 4-digit code. Status changes to **COMPLETED**, and meals rescued increments!
5. **Minute 2:45 - 3:00 (Operations & Audit Trail):**
   * Switch to **Coordinator View**. Show the live telemetry map and audit timeline proving full chain of custody without relying on hallucinating AI chatbots.
