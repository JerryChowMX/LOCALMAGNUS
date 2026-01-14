import { strapiClient } from '../../../api/strapiClient';
import { withMockFallback } from '../../../api/mockFallback';
import type { UserProfile, AppSettings } from '../../../types/perfil';
import { MOCK_PROFILE, MOCK_SETTINGS } from '../mocks/profile.mock';

// Helper to map Strapi User to UserProfile
const mapStrapiUser = (user: any): UserProfile => {
    const strapiUrl = import.meta.env.VITE_STRAPI_URL?.replace('/api', '') || 'http://localhost:1337';

    // Handle different avatar structures
    let avatarUrl: string | undefined;
    if (user.avatar) {
        // Direct url property
        if (user.avatar.url) {
            avatarUrl = user.avatar.url.startsWith('http')
                ? user.avatar.url
                : `${strapiUrl}${user.avatar.url}`;
        }
        // Nested data structure (Strapi v4/v5)
        else if (user.avatar.data?.attributes?.url) {
            const url = user.avatar.data.attributes.url;
            avatarUrl = url.startsWith('http') ? url : `${strapiUrl}${url}`;
        }
    }

    return {
        id: user.id.toString(),
        name: user.username,
        email: user.email,
        avatarUrl,
        plan: 'Plan Gratuito',
        memberSince: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Reciente',
        description: user.description
    };
};

export const perfilApi = {
    updateUserProfile: async (data: Partial<UserProfile> & { avatarFile?: File }) => {
        return withMockFallback<UserProfile>(
            async () => {
                let avatarId: number | undefined;

                if (data.avatarFile) {
                    const uploadResult = await strapiClient.upload(data.avatarFile);
                    avatarId = uploadResult.id;
                }

                // Build update payload
                const updatePayload: any = {};
                if (data.name) updatePayload.username = data.name;
                if (data.description !== undefined) updatePayload.description = data.description;

                // For Strapi v5 Users-permissions, try setting avatar directly by ID
                if (avatarId) {
                    updatePayload.avatar = avatarId;
                }

                if (Object.keys(updatePayload).length > 0) {
                    try {
                        await strapiClient.put<any>(`/users/${data.id}`, updatePayload);
                    } catch (err) {
                        console.error('[perfilApi] User update failed:', err);
                        throw err;
                    }
                }

                // Fetch fresh data to get populated avatar
                const updatedUser = await strapiClient.get<any>('/users/me?populate=avatar');
                return mapStrapiUser(updatedUser);
            },
            { ...MOCK_PROFILE, ...data }, // Optimistic mock update
            'perfil/update-profile'
        );
    },

    getUserProfile: async () => {
        return withMockFallback<UserProfile>(
            async () => {
                // Explicit populate - NO populate=*
                const response = await strapiClient.get<any>('/users/me?populate=avatar');
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
