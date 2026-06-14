# Retain Dental (MVP)

> **Multi-Tenant Dental Clinic Operation System with Integrated Loyalty & Gamification.**

Retain Dental is a comprehensive platform designed to modernize dental clinics by integrating practice management with modern patient engagement tools. It features a unique **Family Loyalty Program** where households pool points ("Smile Points") to earn higher tiers and cashback on treatments.

![Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## 🌟 Key Features

### For Clinics (`Doctor View`)
- **Multi-Tenancy**: Clinics get their own branded instance (colors, logo, url).
- **Patient Management**: Onboard patients, link family members.
- **Transaction Ledger**: Record treatments (General, Hygiene, Cosmetic) and payments.
- **Care Plans**: Assign digital treatment plans (e.g., Invisalign, Post-Op) with daily patient checklists.
- **Gamification**: Automatically calculate patient reward points based on spend and tier.

### For Patients (`Patient View`)
- **Mobile First Experience**: Optimized for smartphones.
- **Wallet**: View "Smile Points" balance and tier status.
- **Family Pooling**: Points are shared across the family group.
- **Digital Care Plans**: Interactive daily checklists for recovery or aligner tracking.

### For Platform (`Master View`)
- **Network Stats**: Monitor MRR, Total GTV, and Active Clinics.
- **Onboarding**: Provision new clinics in seconds with custom texture/theme.
- **Global Config**: Manage base currency, referral bonuses, and system alerts.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)

### Installation

1.  Clone the repository and install dependencies:
    ```bash
    npm install
    ```

2.  Run the development server:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📖 Usage Guide

The app simulates **3 Environments** in one. Use the **toggle buttons** in the top-right corner to switch views.

1.  **Platform View**: The Super Admin dashboard. Use this to create new clinics (`Create Clinic` button).
2.  **Platform View -> Enter Clinic**: Click "Login as Admin" on any clinic card to enter the **Doctor Kiosk** for that clinic.
3.  **Doctor Kiosk**:
    - **Add Patient**: Register a new patient.
    - **Process Transaction**: Charge a patient. Select "Cosmetic" or "General" to see different point rewards.
    - **Assign Care Plan**: Give a patient a digital protocol (e.g., "Invisalign").
4.  **Patient App**:
    - Click "Switch to Patient App" (top right) while in a clinic.
    - Select a user to simulate their view.
    - Check off daily tasks in the "Care Plan" tab.

---

## 🏗 Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a detailed technical breakdown, including data models and logic flow.

## 🛠 Tech Stack
- **React 19**
- **TypeScript**
- **TailwindCSS**
- **Vite**
- **Lucide Icons**

---

*Note: This is a Mock MVP. Data is stored in-memory and will reset upon page refresh.*
