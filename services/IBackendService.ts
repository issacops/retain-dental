
import {
    Clinic,
    CarePlan,
    AppointmentType,
    ThemeTexture,
    TransactionType,
    TransactionCategory,
    AppointmentStatus,
    SystemConfig,
    DatabaseState,
    AuditLog,
    NotificationTemplate,
    NotificationCategory,
    PatientNotification
} from '../types';

export interface ServiceResponse<T = any> {
    success: boolean;
    message: string;
    updatedData?: T;
    error?: string;
}

export interface IBackendService {
    /**
     * Retrieves the initial state of the application.
     * Returns a Promise for compatibility with async backends (Supabase).
     */
    getData(): Promise<DatabaseState>;

    // --- CORE PLATFORM ---

    getPlatformStats(): Promise<any>;

    updateSystemConfig(updates: Partial<SystemConfig>): Promise<ServiceResponse>;

    createClinic(
        name: string,
        color: string,
        texture: ThemeTexture,
        ownerName: string,
        logoUrl: string,
        slug: string,
        adminEmail: string
    ): Promise<ServiceResponse<DatabaseState>>;

    updateClinic(clinicId: string, updates: Partial<Clinic>): Promise<ServiceResponse<DatabaseState>>;

    updateAdminAuth(clinicId: string, email: string, newPassword?: string): Promise<ServiceResponse>;

    deleteClinic(clinicId: string): Promise<ServiceResponse<DatabaseState>>;

    // --- CLINICAL OPS ---

    getDashboardStats(clinicId: string): Promise<any>;

    scheduleAppointment(
        clinicId: string,
        patientId: string,
        doctorId: string | undefined, // undefined if unassigned
        startTime: string,
        endTime: string,
        type: AppointmentType,
        notes?: string
    ): Promise<ServiceResponse>;

    updateAppointmentStatus(
        appointmentId: string,
        status: AppointmentStatus
    ): Promise<ServiceResponse>;

    // --- MEMBER & LOYALTY ---

    addPatient(clinicId: string, name: string, mobile: string, pin?: string): Promise<ServiceResponse>;

    updatePatient(
        clinicId: string,
        patientId: string,
        updates: { name?: string; email?: string; mobile?: string; status?: string; metadata?: Record<string, any> }
    ): Promise<ServiceResponse<DatabaseState>>;

    deletePatient(clinicId: string, patientId: string): Promise<ServiceResponse>;

    updatePatientMetadata(patientId: string, metadata: Record<string, any>): Promise<ServiceResponse>;

    addFamilyMember(
        headUserId: string,
        name: string,
        relation: string,
        age: string
    ): Promise<ServiceResponse>;

    linkFamilyMember(headUserId: string, memberMobile: string): Promise<ServiceResponse>;

    // --- FINANCIALS ---

    processTransaction(
        clinicId: string,
        patientId: string,
        amount: number,
        category: TransactionCategory,
        type: TransactionType,
        carePlanTemplate?: {
            name: string;
            instructions: string[];
            metadata?: Record<string, any>;
        }
    ): Promise<ServiceResponse>;

    // --- PROTOCOLS ---

    /**
     * Creates a new Care Plan for a patient.
     */
    assignCarePlan(
        clinicId: string,
        patientId: string,
        template: {
            name: string;
            category: TransactionCategory;
            description: string;
            instructions: string[];
            checklist: { id: string; task: string; completed: number }[]; // completed: 0 or 1
            metadata?: Record<string, any>;
            cost?: number;
        }
    ): Promise<ServiceResponse<CarePlan>>;

    updateCarePlan(carePlanId: string, updates: Partial<CarePlan>): Promise<ServiceResponse>;

    toggleChecklistItem(carePlanId: string, itemId: string): Promise<ServiceResponse>;

    terminateCarePlan(carePlanId: string): Promise<ServiceResponse>;

    // Landing Page
    joinWaitlist(data: { name: string, clinic: string, mobile: string, email: string }): Promise<ServiceResponse>;
    getWaitlist(): Promise<ServiceResponse<any[]>>;

    // Admin
    hardDeleteUser(userId: string): Promise<ServiceResponse>;

    getRetentionMetrics(clinicId: string): Promise<any>;

    /**
     * Clinic-scoped compliance trail (newest first).
     */
    getAuditLog(clinicId: string, limit?: number): Promise<ServiceResponse<AuditLog[]>>;

    // --- PATIENT MESSAGING & NOTIFICATIONS ---

    /** Built-in library templates plus any custom templates for the clinic. */
    getNotificationTemplates(clinicId: string): Promise<ServiceResponse<NotificationTemplate[]>>;

    /** Create or update a custom template (omit id to create). */
    saveNotificationTemplate(
        clinicId: string,
        template: { id?: string; name: string; category: NotificationCategory; title: string; body: string }
    ): Promise<ServiceResponse<NotificationTemplate[]>>;

    deleteNotificationTemplate(templateId: string): Promise<ServiceResponse<NotificationTemplate[]>>;

    /** Queue + deliver a notification to one or more patients. */
    sendNotifications(
        clinicId: string,
        patientIds: string[],
        payload: { title: string; body: string; category: NotificationCategory },
        actorName: string
    ): Promise<ServiceResponse<PatientNotification[]>>;

    getNotifications(clinicId: string, patientId?: string): Promise<ServiceResponse<PatientNotification[]>>;

    markNotificationRead(notificationId: string): Promise<ServiceResponse>;

    // --- WEB PUSH (PWA) ---

    savePushSubscription(
        userId: string,
        clinicId: string,
        sub: { endpoint: string; keys: { p256dh: string; auth: string } }
    ): Promise<ServiceResponse>;

    deletePushSubscription(endpoint: string): Promise<ServiceResponse>;

    /** How many devices are reachable by push for this clinic. */
    getPushSubscriptionCount(clinicId: string): Promise<ServiceResponse<number>>;
}
