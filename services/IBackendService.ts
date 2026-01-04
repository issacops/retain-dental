
import {
    Clinic,
    CarePlan,
    AppointmentType,
    ThemeTexture,
    TransactionType,
    TransactionCategory,
    AppointmentStatus,
    SystemConfig,
    DatabaseState
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
        logoUrl: string
    ): Promise<ServiceResponse<DatabaseState>>;

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

    addPatient(clinicId: string, name: string, mobile: string): Promise<ServiceResponse>;

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

    updateCarePlan(carePlanId: string, updates: Partial<CarePlan>): Promise<ServiceResponse>;

    toggleChecklistItem(carePlanId: string, itemId: string): Promise<ServiceResponse>;
}
