# System Architecture

## Overview
RetainDental/PrimeOS is a multi-tenant Dental Operating System designed to manage clinics, patients, and platform-level administration. It uses a **Frontend-First** architecture with a robust **Mock Backend Service** for rapid prototyping, simulating a complex distributed system.

## Core Entities

### 1. Clinic (`Clinic`)
The central tenant unit.
- **Attributes**: `id`, `name`, `slug`, `adminUserId`, `subscriptionTier`, `themeTexture`.
- **Relationships**: Owns Users, Transactions, and Appointments.

### 2. User (`User`)
Represents an actor in the system.
- **Roles**:
  - `SUPER_ADMIN`: Platform owner (God View).
  - `ADMIN`: Clinic Doctor/Owner (Tenant View).
  - `PATIENT`: End-user (Patient App).
- **Attributes**: `clinicId`, `mobile` (Unique Identifier), `familyGroupId`, `currentTier`.

### 3. Wallet & Transactions (`Wallet`, `Transaction`)
The core of the Loyalty Engine.
- **Wallet**: One-to-one mapping with User (or Family Head). Tracks `balance`.
- **Transaction**: Immutable ledger entry.
  - Types: `EARN` (Treatment), `REDEEM` (Reward/Discount).
  - Categories: `TREATMENT`, `REFERRAL`, `REVIEW`.

### 4. Family Group (`FamilyGroup`)
Allows pooling of loyalty points.
- **Structure**: `Head` + `Members`.
- **Logic**: Members earn into the Head's wallet. Tier status is calculated based on group lifetime spend.

## Technical Architecture

### Frontend (React + Vite)
- **State Management**: Centralized `App.tsx` state initialized from `MockBackendService`.
- **Routing**: `react-router-dom` with role-based component rendering (Auth currently disabled for Dev Mode).
- **Styling**: Tailwind CSS + Lucide Icons.

### Data Layer (`MockBackendService`)
A **Singleton** service that mimics a REST/GraphQL API.
- **Persistence**: synchronizes with `localStorage` (`dentalOS_db_v2`).
- **Logic**: Handles business rules (Tier upgrades, Point calculations, Redemption validation) to keep UI components dumb.

## Data Flow
1.  **Action**: UI Component triggers handler (e.g. `onSchedule`).
2.  **Service**: `MockBackendService` executes logic, updates in-memory arrays, and saves to `localStorage`.
3.  **Update**: Service returns `{ success, updatedData }`.
4.  **Render**: `App.tsx` receives `updatedData` and sets React State, triggering re-render.
