import type { UserProfile, AppSettings } from '../../../types/perfil';

export const MOCK_PROFILE: UserProfile = {
    id: 'user-123',
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=carlos',
    plan: 'Premium',
    memberSince: '2023-01-15'
};

export const MOCK_SETTINGS: AppSettings = {
    theme: 'system',
    fontSize: 'medium',
    notifications: true
};
