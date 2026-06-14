# Features & Roadmap

## Live Features

### Platform Dashboard (Super Admin)
- **Global Stats**: Real-time aggregated revenue, MRR, and patient counts.
- **Clinic Deployment**: "Deploy New Node" instantly creates a new Clinic, Admin, and Guest Patient.
- **Shard Monitoring**: Simulated infrastructure health status.

### Doctor Dashboard (Clinic OS)
- **Operational Hub**:
  - Financial Analytics (Revenue, Liability).
  - Daily Appointment Brief.
- **Patient Management**:
  - Search & Filter Patients.
  - One-click "Walk-in" Patient onboarding.
- **Transaction Terminal**:
  - Process Payments (Earn Points).
  - Redeem Points (Rewards/Discounts).
- **Intelligence Sidebar**: Context-aware insights.

### Patient App (PWA)
- **Loyalty Wallet**: View balance and tier status.
- **Family Hub**: Link family members to pool points.
- **Care Plan**: View active treatment plans and checklist.
- **Appointments**: View scheduled visits.

## Roadmap

### Phase 1: Stabilization (Completed)
- [x] Fix Loading/Flickering Performance.
- [x] Robust Clinic Creation Flow.

### Phase 2: Enhanced Features (Current)
- [ ] **WhatsApp Integration**: Automated reminders via `wa.me` links.
- [ ] **Inventory Management**: Track stock levels linked to treatments.
- [ ] **Smart Marketing**: AI-generated campaigns based on patient segments.

### Phase 3: Real Backend
- [ ] Migrate `MockBackendService` to Supabase/PostgreSQL.
- [ ] Implement Real Auth (Supabase Auth).
