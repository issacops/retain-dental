
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
    User, Wallet, Transaction, Clinic, CarePlan, Appointment,
    AppointmentType, AppointmentStatus, ThemeTexture,
    TransactionCategory, TransactionType, FamilyGroup,
    DatabaseState, SystemConfig
} from '../types';
import { IBackendService, ServiceResponse } from './IBackendService';

// Environment variables should be used here
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export class SupabaseService implements IBackendService {
    private static instance: SupabaseService;
    private supabase: SupabaseClient;

    private constructor() {
        this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    public static getInstance(): SupabaseService {
        if (!SupabaseService.instance) {
            SupabaseService.instance = new SupabaseService();
        }
        return SupabaseService.instance;
    }

    // --- DATA FETCHING ---

    public async getData(): Promise<DatabaseState> {
        try {
            const [clinics, users, wallets, transactions, carePlans, appointments] = await Promise.all([
                this.supabase.from('clinics').select('*'),
                this.supabase.from('profiles').select('*'),
                this.supabase.from('wallets').select('*'),
                this.supabase.from('transactions').select('*'),
                this.supabase.from('care_plans').select('*'),
                this.supabase.from('appointments').select('*'),
            ]);

            if (clinics.error) throw clinics.error;
            if (users.error) throw users.error;

            return {
                clinics: (clinics.data || []) as any,
                users: (users.data || []) as any,
                wallets: (wallets.data || []) as any,
                transactions: (transactions.data || []) as any,
                familyGroups: [],
                carePlans: (carePlans.data || []) as any,
                appointments: (appointments.data || []) as any,
            };
        } catch (error) {
            console.error('Supabase Sync Error:', error);
            throw error;
        }
    }

    // --- CORE ---

    async getPlatformStats(): Promise<any> {
        return { error: 'Not implemented (RPC required)' };
    }

    async updateSystemConfig(updates: Partial<SystemConfig>): Promise<ServiceResponse> {
        return { success: true, message: 'Config updated (Mocked for Supabase)' };
    }

    async createClinic(
        name: string,
        color: string,
        texture: ThemeTexture,
        ownerName: string,
        logoUrl: string
    ): Promise<ServiceResponse<DatabaseState>> {
        try {
            const { data, error } = await this.supabase.from('clinics').insert({
                name,
                primary_color: color,
                theme_texture: texture,
                owner_name: ownerName,
                logo_url: logoUrl,
                slug: name.toLowerCase().replace(/\s+/g, '-')
            }).select().single();

            if (error) throw error;

            const newState = await this.getData();
            return { success: true, message: 'Clinic Deployed', updatedData: newState };
        } catch (e: any) {
            return { success: false, message: e.message || 'Deployment Failed', error: 'DB_ERR' };
        }
    }

    async deleteClinic(clinicId: string): Promise<ServiceResponse<DatabaseState>> {
        try {
            const { error } = await this.supabase.from('clinics').delete().eq('id', clinicId);
            if (error) throw error;

            const newState = await this.getData();
            return { success: true, message: 'Node Deleted', updatedData: newState };
        } catch (e: any) {
            return { success: false, message: e.message, error: 'DB_ERR' };
        }
    }

    // --- OPS ---

    async getDashboardStats(clinicId: string): Promise<any> {
        return {};
    }

    async scheduleAppointment(
        clinicId: string,
        patientId: string,
        doctorId: string | undefined,
        startTime: string,
        endTime: string,
        type: AppointmentType,
        notes?: string
    ): Promise<ServiceResponse> {
        const { error } = await this.supabase.from('appointments').insert({
            clinic_id: clinicId,
            patient_id: patientId,
            doctor_id: doctorId,
            start_time: startTime,
            end_time: endTime,
            type,
            notes
        });

        if (error) return { success: false, message: error.message, error: 'DB_ERR' };
        return { success: true, message: 'Scheduled', updatedData: await this.getData() };
    }

    async updateAppointmentStatus(appointmentId: string, status: AppointmentStatus): Promise<ServiceResponse> {
        const { error } = await this.supabase.from('appointments').update({ status }).eq('id', appointmentId);
        if (error) return { success: false, message: error.message };
        return { success: true, message: 'Updated', updatedData: await this.getData() };
    }

    // --- MEMBER ---

    async addPatient(clinicId: string, name: string, mobile: string): Promise<ServiceResponse> {
        return { success: false, message: 'Supabase Auth Flow required', error: 'NOT_IMPL' };
    }

    async addFamilyMember(headUserId: string, name: string, relation: string, age: string): Promise<ServiceResponse> {
        return { success: false, message: 'Not Implemented', error: 'NOT_IMPL' };
    }

    async linkFamilyMember(headUserId: string, memberMobile: string): Promise<ServiceResponse> {
        return { success: false, message: 'Not Implemented', error: 'NOT_IMPL' };
    }

    // --- FINANCIAL ---

    async processTransaction(
        clinicId: string,
        patientId: string,
        amount: number,
        category: TransactionCategory,
        type: TransactionType,
        carePlanTemplate?: any
    ): Promise<ServiceResponse> {
        return { success: false, message: 'Use RPC for transactions', error: 'NOT_IMPL' };
    }

    async updateCarePlan(carePlanId: string, updates: Partial<CarePlan>): Promise<ServiceResponse> {
        return { success: false, message: 'Not Implemented', error: 'NOT_IMPL' };
    }

    async toggleChecklistItem(carePlanId: string, itemId: string): Promise<ServiceResponse> {
        return { success: false, message: 'Not Implemented', error: 'NOT_IMPL' };
    }
}
