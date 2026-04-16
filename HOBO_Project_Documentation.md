# HOBO: Premium Hostel Management & Booking Platform
**Official Project Documentation**

---

## 1. Project Overview
HOBO is a full-stack, cloud-native premium hostel booking and management system. Designed to disrupt the cluttered and fragmented budget-travel industry, HOBO provides a centralized, SaaS-like dashboard environment that cleanly separates travelers, property owners, and administrators. 

The platform guarantees trust through strict Master Admin property approvals and elevates the user experience with fluid, native dark/light mode interfaces.

## 2. Technical Stack
- **Frontend Layer:** React.js, Vite
- **Global State Management:** Zustand, React Context API
- **Backend API Layer:** Node.js, Express.js
- **Database Engine:** MongoDB (via Mongoose ODM)
- **Security & Authentication:** JSON Web Tokens (JWT), bcrypt (Password Hashing)
- **UI Architecture:** Custom CSS Variables API (No external UI libraries like Bootstrap/Tailwind), React-hot-toast (Notifications)

---

## 3. Core Features by Role

### A. The Traveler / User Portal
The consumer-facing interface prioritizing ease of discovery and immersive property evaluation.

* **Advanced Search Matrix:** Users can filter properties dynamically by specific cities, exact price ranges, minimum user ratings, and selected micro-amenities (e.g., WiFi, AC, Housekeeping).
* **Live Availability Engine:** Real-time capacity checks ensure `availableBeds` accurately deduct concurrent bookings to prevent overbooking scenarios.
* **Wishlist Architecture:** Travelers can save properties to a persistent wishlist directly into their MongoDB `favorites` array to compare later.
* **Smart Review Ecosystem:** A dynamic 5-star graphical rating engine. *Security constraint:* The backend mathematically prevents users from leaving a review unless they have an officially completed booking history with that specific property.
* **Personalized Dashboard:** Tracks "Upcoming Bookings" logically separated from "Past Bookings" alongside Profile Preference editing.

### B. The Property Owner Matrix
A powerful, dedicated dashboard explicitly isolated from the traveler interface, designed to give hostel owners direct real-time control over their physical properties.

* **Property Launchpad:** Owners can independently list their properties, define base bed capacities, price, and upload gallery images.
* **Pending Approval Pipeline:** Newly created hostels are automatically set to `isApproved: false` and are completely hidden from Travelers until an Admin legally verifies them.
* **Live Booking Monitor:** A command-center view of all incoming reservations across all of the owner's properties.
* **Interactive Checkout Engine:** Owners possess a direct "Mark Checked-Out" action button that instantly routes the booking from `confirmed` to `completed` and unlocks the Review capability for the guest.

### C. The Master Admin Command Center
The highest authority tier on the platform managing security and quality control.

* **Quality Control Gatekeeping:** Admins receive alerts for freshly submitted properties and can toggle them to `isApproved: true` allowing them to render on the main search grid.
* **Omniscient User Tracking:** Admins have centralized visibility into every active account (sorting Travelers vs Owners) to monitor platform health.

---

## 4. Architectural Highlights & UI/UX

### A. Fluid Dual-Theming (Light/Dark Mode)
- Traditional React apps suffer from "faded UI" or "flicker" when toggling themes. HOBO bypasses React rerenders entirely by relying on **Strict Native CSS Variables**. 
- `var(--bg-main)` and `var(--text-main)` automatically adapt in `0.25s` via the root CSS structure, providing a luxury "Dark Mode at Night" / "Clean White at Day" experience seamlessly.

### B. Role-Based Access Control (RBAC)
- **Token Injection:** When a user logs in, the backend encrypts their MongoDB `_id` and strict `role` (user/owner/admin) into a secure JWT payload returning to the frontend.
- **Middleware Gating:** Every single backend API request mathematically verifies that token. If a User tries to POST to an `/owner` route, the Node.js middleware instantly deflects it with a `403 Forbidden` response.

### C. Image Handling Engine
- The backend utilizes Node's standard file-system mapping (Multer) to securely parse and host high-res property gallery uploads locally, mapping the static file paths directly efficiently to the MongoDB references.

---

## 5. Implementation Future Roadmap (For Reports)
*While currently stable and robust, the following architectures are slotted for the next major release phase:*
1. **Interactive Geospatial Mapping:** Integrating Mapbox GL JS to mathematically hook into a MongoDB GeoJSON index, generating beautiful dark-themed maps pinpointing absolute hostel physical coordinates.
2. **Payment Gateway Routing:** Integrating Stripe Connect to pre-authorize credit card payments before confirming booking statuses natively.
3. **Automated Nodemailer Alerts:** Firing digital email receipts dynamically upon completed checkouts. 

---
*Generated for the HOBO Development & Presentation Team*
