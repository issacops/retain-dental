import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlatformDashboard from '../components/Platform/PlatformDashboard';
import { AppState } from '../types';

interface Props {
    data: AppState;
    onNavigate: (view: any) => void;
    // fast-track props passing
    [key: string]: any;
}

export const PlatformPage: React.FC<Props> = (props) => {
    const { data, ...handlers } = props;
    const navigate = useNavigate();

    // Wrapper to handle navigation explicitly since Auth Gates are removed
    const handleEnterClinic = (clinicId: string) => {
        handlers.onEnterClinic(clinicId);
        navigate('/doctor');
    };

    // Calculate real performance metrics from data
    const clinicPerformance = data.clinics.map(clinic => {
        const clinicPatients = data.users.filter(u => u.clinicId === clinic.id && u.role === 'PATIENT');
        const revenue = data.transactions
            .filter(t => t.clinicId === clinic.id)
            .reduce((sum, t) => sum + t.amountPaid, 0);

        return {
            id: clinic.id,
            name: clinic.name,
            revenue: revenue,
            patients: clinicPatients.length,
            rpp: clinicPatients.length > 0 ? Math.round(revenue / clinicPatients.length) : 0,
            tier: clinic.subscriptionTier || 'PRO',
            color: clinic.primaryColor,
            logo: clinic.logoUrl,
            createdAt: clinic.createdAt,
            slug: clinic.slug
        };
    });

    // Mock stats - Global Aggregates from calculated data
    const stats = {
        totalClinics: data.clinics.length,
        totalPatients: data.users.filter(u => u.role === 'PATIENT').length,
        mrr: clinicPerformance.reduce((sum, c) => sum + (c.revenue * 0.1), 0), // Mock 10% take rake
        totalSystemRevenue: clinicPerformance.reduce((sum, c) => sum + c.revenue, 0),
        subscriptionMix: [{ name: 'Growth', value: 12 }, { name: 'Enterprise', value: 4 }],
        clinicPerformance: clinicPerformance,
        recentActivity: [],
        config: { platformName: 'Prime OS', globalMfaEnabled: true, maintenanceMode: false },
        shards: [{ id: 'S1', region: 'Mumbai', health: 100, load: 45, latency: '24ms' }]
    };

    return (
        <div className="h-screen w-full bg-slate-950">
            <PlatformDashboard
                clinics={data.clinics}
                stats={stats}
                {...handlers}
                onEnterClinic={handleEnterClinic}
            />
        </div>
    );
};
