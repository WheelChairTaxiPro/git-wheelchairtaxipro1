# WheelchairTaxiPro – Wireframe Description

## Phase 1 – MVP Wireframe

![Phase 1 Wireframe](sandbox:/mnt/data/Wireframe-Phase1.jpg)

### Overview
This wireframe represents the Phase 1 (MVP) layout for the WheelchairTaxiPro booking interface. The design focuses on simplicity, accessibility, and fast booking, targeting users who may require minimal interaction complexity.

---

### 1. Header Section
- Includes a **Logo** centered or aligned for branding.
- A **hamburger menu** on the left provides access to:
  - About
  - Pricing
  - Contact
  - Help / FAQ
- Designed for mobile-first navigation.

---

### 2. Price Model / Pricing Section
- Displays a **simple pricing model or price list**.
- Can be static in Phase 1 (e.g., base fare + per km).
- Future-ready for dynamic pricing in Phase 2.

---

### 3. Booking Inputs
- Core booking form with required fields:
  - **From (Pick-up location)**
  - **To (Drop-off location)**
  - **Booking Date & Time**
  - **Phone Number (required)**
  - **Email Address (required)**
- Designed for quick entry and clarity.

---

### 4. Send Booking Action
- A clear primary action button:

```
[ 🚀 Send Booking Request ]
```

- Behavior:
  - Submits form data to backend API
  - Backend sends booking details via **email** to the driver/operator
  - Sends confirmation email to the user
  - Shows loading state and success confirmation on UI

---

### 5. Map Section
- Central visual component of the interface.
- Displays:
  - User’s **current location**
  - **Pick-up location**
  - **Drop-off location**
  - **Route path** between locations
- Helps users confirm journey visually.

---

### 6. Quick Contact Actions
- Located at the bottom for easy access.
- Includes buttons for:
  - 📞 Phone Call
  - 💬 WhatsApp
  - 🟢 WeChat
- Serves as fallback if user prefers direct communication

---

## Booking Flow Architecture

```
Frontend (Angular)
        ↓
Backend (.NET API)
        ↓
Notify driver via:
- Email
```

### Explanation
- User submits booking via the website (mobile or desktop)
- Frontend sends request to backend API
- Backend processes booking and sends email notification to driver
- Backend also sends confirmation email to the user
- Ensures consistent experience across all devices

---

## UX Considerations
- Mobile-first design
- Large buttons for accessibility
- Clear primary action: **Send Booking Request**
- Call remains available for urgent users
- Email ensures consistent cross-device booking submission

---

## Phase 2 (Preview – Enhancements)
- Booking database & dashboard
- Real-time tracking
- SMS/WhatsApp notification upgrade
- Payment integration

---

## Summary
The Phase 1 design uses **email-based booking submission via backend API**, ensuring reliability across both mobile and desktop environments while remaining simple, consistent, and easy to implement.

