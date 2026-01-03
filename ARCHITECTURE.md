# Retain Dental - Architecture Documentation

## Overview
Retain Dental is a **multi-tenant Dental Operating System** designed to manage clinics, patients, and a loyalty/gamification layer. It is currently implemented as a **Mock MVP**, running entirely in the browser with simulated backend logic.

## Technical Stack
- **Framework**: React 19 (via Vite)
- **Language**: TypeScript
- **Styling**: TailwindCSS (utility-first)
- **Icons**: Lucide React
- **State Management**: React `useState` / `useMemo` (Lifted to `App.tsx`)
- **Routing**: Custom State-Based Routing (Simulated)

## Core Concepts

### 1. Multi-Tenancy
The application supports multiple dental clinics on a single platform.
- **Clinics**: Each clinic has a unique `slug`, `primaryColor`, and `themeTexture`.
- **Isolation**: Data (Patients, Transactions) is effectively isolated by `clinicId`, though currently held in a single global state object for the MVP.

### 2. The "Three Views" Pattern
The application is a "Monolith of Frontends". `App.tsx` orchestrates switching between three distinct sub-applications based on the `viewMode` state:

1.  **Platform Master (`PLATFORM_MASTER`)**:
    - **Audience**: Super Admins / Platform Owners.
    - **Functionality**: Create new clinics, view global revenue stats, manage system configuration.
    - **Component**: `components/Platform/PlatformDashboard.tsx`

2.  **Doctor Kiosk (`DESKTOP_KIOSK`)**:
    - **Audience**: Doctors, Receptionists.
    - **Functionality**: Patient management, processing payments, assigning Care Plans, linking families.
    - **Component**: `components/Doctor/DesktopDoctorView.tsx`

3.  **Patient App (`MOBILE_PATIENT`)**:
    - **Audience**: Patients (Mobile First).
    - **Functionality**: View "Smile Points" wallet, track Care Plan checklists, view transaction history.
    - **Component**: `components/Patient/MobilePatientView.tsx`

### 3. Mock Backend Service
Located in `services/mockBackend.ts`.
- **Purpose**: Decouples UI from data logic. It acts as a synchronous API.
- **Key Methods**: `processTransaction`, `addPatient`, `createClinic`, `linkFamilyMember`.
- **Data Persistence**: **None currently** (In-memory only; resets on refresh).
- **Gamification Engine**: Logic for calculating points based on Tiers (Member/Gold/Platinum) and Treatment Categories (Cosmetic/General/Hygiene).

### 4. Logic & Data Models
Defined in `types.ts` and `constants.ts`.

- **Loyalty Logic**: 
    - `Member`: 2% back
    - `Gold`: 5% back (Spend > 25k)
    - `Platinum`: 10% back (Spend > 100k)
    - **Note**: Points are pooled for `FamilyGroup`.
- **Care Plans**: Templates for treatments (e.g., Invisalign, RCT) with daily checklists for patients.

## Directory Structure
```
src/
├── App.tsx                 # Main Controller & State Holder
├── types.ts                # TypeScript Interfaces (Domain Models)
├── constants.ts            # Business Rules, Initial Data, Treatment Templates
├── services/
│   └── mockBackend.ts      # Simulated Database & Business Logic
└── components/
    ├── Doctor/             # Doctor Dashboard (Monolithic Component)
    ├── Patient/            # Patient Mobile App (Monolithic Component)
    └── Platform/           # Super Admin Dashboard (Monolithic Component)
```

## Future Improvements / Tech Debt
1.  **Monolithic Components**: The 3 main view components (`DesktopDoctorView`, etc.) are very large. They should be refactored into smaller, reusable atoms (e.g., `PatientCard`, `TransactionTable`).
2.  **Routing**: Switch to `react-router-dom` for true URL-based routing (e.g., `/app/:clinicSlug/dashboard`).
3.  **Backend**: Replace `MockBackendService` with a real API client (e.g., Supabase, Firebase, or Node.js).
4.  **State Management**: Move from `useState` at root to a context provider or global store (Zustand/Redux) to avoid prop drilling.
