import { useState, useEffect } from 'react';
import { perfilApi } from '../services/perfilApi';
import type { UserProfile, AppSettings } from '../../../types/perfil';

export const useProfile = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isFallback, setIsFallback] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setIsLoading(true);
            try {
                const [
                    { data: profileData, isFallback: pfFallback },
                    { data: settingsData, isFallback: stFallback }
                ] = await Promise.all([
                    perfilApi.getUserProfile(),
                    perfilApi.getAppSettings()
                ]);

                if (cancelled) return;

                setProfile(profileData);
                setSettings(settingsData);
                setIsFallback(pfFallback || stFallback);
            } catch (err) {
                if (cancelled) return;
                setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    const updateSettings = async (newSettings: Partial<AppSettings>) => {
        try {
            const { data } = await perfilApi.updateAppSettings(newSettings);
            setSettings(data);
        } catch (err) {
            console.error('Failed to update settings', err);
            // Optimistic update could go here, or just alert user
        }
    };

    const updateProfile = async (data: Partial<UserProfile> & { id?: string }, avatarFile?: File) => {
        const userId = data.id || profile?.id;
        if (!userId) {
            console.error('Cannot update profile: No profile ID provided or loaded');
            throw new Error('No profile ID available');
        }

        try {
            const { data: updatedProfile } = await perfilApi.updateUserProfile({
                ...data,
                id: userId,
                avatarFile
            });
            setProfile(updatedProfile);
            return updatedProfile;
        } catch (err) {
            console.error('Failed to update profile', err);
            throw err;
        }
    };

    return { profile, settings, updateSettings, updateProfile, isLoading, error, isFallback };
};
