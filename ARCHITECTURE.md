# System Architecture

## Overview
RetainDental/PrimeOS is a multi-tenant Dental Operating System designed to manage clinics, patients, and platform-level administration. It uses a **Frontend-First** architecture with a robust **Mock Backend Service** for rapid prototyping.

## Core Entities (Hierarchical)

### 1. The Platform (Super User)
The root of the ecosystem.
- **Actor**: `SUPER_ADMIN` (Platform Master).
- **Scope**: "God Mode" view of all Clinics, Revenue, and System Health.
- **Responsibilities**:
  - Deploying new Clinics (Tenants).
  - Monitoring infrastructure (Shards/Regions).
  - Managing Global System Configuration.

### 2. Clinic (Tenant)
An isolated instance for a specific dental practice.
- **Relationship**: Created and managed by the Platform.
- **Actor**: `ADMIN` (Doctor/Owner).
- **Attributes**: `id`, `name`, `slug`, `subscriptionTier` (`STARTER`/`PRO`), `themeTexture`.
- **Scope**: Owns its own Users, Patients, Appointments, and Financial Ledger.

### 3. User Roles
Actors interacting within specific scopes.
- **`SUPER_ADMIN`**: Platform Governance.
- **`ADMIN`**: Clinic Operations (Doctor Dashboard).
- **`PATIENT`**: End-user access (Patient PWA).
- **Identity**: Users are linked via unique `mobile` numbers.

### 4. Patient Ecosystem
The end-user layer.
- **Wallet**: One-to-one mapping with User. Tracks `balance` (Smile Points).
- **Family Group**: Allows pooling of points with a Head User.
- **Care Plans**: Active treatments with tracked checklists.

---

## Technical Architecture

### Frontend (React + Vite)
- **Framework**: React 19 with TypeScript.
- **Routing**: `react-router-dom` (Auth disabled for Dev Mode).
- **Styling**: Tailwind CSS + Lucide Icons.
- **State**: `App.tsx` initializes state from `MockBackendService`.

### Data Layer (`MockBackendService`)
A **Singleton** service acting as an in-memory database.
- **Persistence**: Synchronizes with `localStorage` (`dentalOS_db_v2`).
- **Logic**: Handles business rules (Tier upgrades, Point calculations).
- **Data Flow**: `UI Action` -> `Service Logic` -> `Update State` -> `UI Re-render`.

## Deployment
- **CI/CD**: GitHub Actions verifies builds on push.
- **Hosting**: Vercel (Automatic deployment from `main` branch).
