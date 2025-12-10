import { strapiClient } from '../../../api/strapiClient';
import { withMockFallback } from '../../../api/mockFallback';
import type { UserProfile, AppSettings } from '../../../types/perfil';
import { MOCK_PROFILE, MOCK_SETTINGS } from '../mocks/profile.mock';

// Helper to map Strapi User to UserProfile
const mapStrapiUser = (user: any): UserProfile => ({
    id: user.id.toString(),
    name: user.username,
    email: user.email,
    avatarUrl: user.avatar?.url ? `${import.meta.env.VITE_STRAPI_URL.replace('/api', '')}${user.avatar.url}` : undefined,
    plan: 'Plan Gratuito', // Default for now
    memberSince: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Reciente',
    description: user.description
});

export const perfilApi = {
    updateUserProfile: async (data: Partial<UserProfile> & { avatarFile?: File }) => {
        return withMockFallback<UserProfile>(
            async () => {
                let avatarId: number | undefined;

                if (data.avatarFile) {
                    const uploadResult = await strapiClient.upload(data.avatarFile);
                    avatarId = uploadResult.id;
                }

                const updatePayload: any = {};
                if (data.name) updatePayload.username = data.name;
                if (data.description) updatePayload.description = data.description;
                if (avatarId) updatePayload.avatar = avatarId;

                await strapiClient.put<any>(`/users/${data.id}`, updatePayload);

                // Fetch fresh data to get populated avatar using /me to avoid permission issues with /:id
                const updatedUser = await strapiClient.get<any>('/users/me?populate=*');
                return mapStrapiUser(updatedUser);
            },
            { ...MOCK_PROFILE, ...data }, // Optimistic mock update
            'perfil/update-profile'
        );
    },

    getUserProfile: async () => {
        return withMockFallback<UserProfile>(
            async () => {
                const response = await strapiClient.get<any>('/users/me?populate=*');
                return mapStrapiUser(response);
            },
            MOCK_PROFILE,
            'perfil/profile'
        );
    },

    getAppSettings: async () => {
        // PERFIL_FIX: We haven't created the 'app-settings' content type in Strapi yet.
        // So we return the mock directly to avoid 404/500 errors blocking the profile load.
        return { data: MOCK_SETTINGS, isFallback: true };
    },

    updateAppSettings: async (settings: Partial<AppSettings>) => {
        // PERFIL_FIX: Same here, just return the updated mock for now
        return {
            data: { ...MOCK_SETTINGS, ...settings },
            isFallback: true
        };
    }
};
