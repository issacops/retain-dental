
import { IBackendService } from './IBackendService';
import { MockBackendService } from './mockBackend';
import { SupabaseService } from './SupabaseService';

export const getBackendService = (): IBackendService => {
    // Check env var. If 'true', use Supabase. Default to Mock.
    const useRealBackend = import.meta.env.VITE_USE_REAL_BACKEND === 'true';

    if (useRealBackend) {
        console.log('[BackendFactory] Using Supabase Backend');
        return SupabaseService.getInstance();
    }

    console.log('[BackendFactory] Using Mock Backend');
    return MockBackendService.getInstance();
};
