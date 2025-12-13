import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../components/Layout/PageWrapper';
import { Section, Stack } from '../../../components/Layout';
import { HeaderContent } from '../../noticiasHub/components/HeaderContent';
import { Icons } from '../../../components/Icons';
import { ProfileCard } from '../components/ProfileCard';
import { MembershipCard } from '../components/MembershipCard';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsRow } from '../components/SettingsRow';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { OptionSelector } from '../components/OptionSelector';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../../../hooks/useAuth';
import { Body } from '../../../components/Typography/Typography';
import { useUserPreferences } from '../../../context/ThemeContext';
import { getAnalyticsConsent, setAnalyticsConsent } from '../../../lib/analytics';
import type { UserProfile } from '../../../types/perfil';
import './PerfilHubPage.css';

export const PerfilHubPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout, updateUser } = useAuth();
    const { settings, updateSettings, updateProfile, isLoading, error } = useProfile();
    const { theme, toggleTheme, fontSize, setFontSize } = useUserPreferences();
    const [analyticsEnabled, setAnalyticsEnabled] = React.useState(getAnalyticsConsent());

    const handleLogin = (): void => {
        navigate('/login');
    };

    const handleUpdateProfile = async (data: Partial<UserProfile>, file?: File) => {
        if (!user?.id) {
            console.error('Cannot update profile: No user ID');
            throw new Error('No user logged in');
        }

        try {
            const updated = await updateProfile({ ...data, id: user.id }, file);
            if (updated) {
                // Update global auth state
                updateUser({
                    name: updated.name,
                    avatarUrl: updated.avatarUrl,
                    description: updated.description,
                });
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    const handleLogout = (): void => {
        logout();
        navigate('/login');
    };

    if (isLoading) {
        return (
            <PageWrapper>
                <HeaderContent onBack={() => navigate('/')} />
                <Section padding="md">
                    <Body>Cargando perfil...</Body>
                </Section>
            </PageWrapper>
        );
    }

    if (error) {
        return (
            <PageWrapper>
                <HeaderContent onBack={() => navigate('/')} />
                <Section padding="md">
                    <Body color="error">Error al cargar el perfil. Por favor intente más tarde.</Body>
                </Section>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <HeaderContent
                onBack={() => navigate('/')}
                rightIcon={<Icons.settings size={24} stroke={1.5} />}
                onRightClick={() => {/* TODO: Implement settings navigation */ }}
            />

            <div className="perfil-hub-page__content">

                <Section padding="md">
                    <Stack spacing="lg">
                        {/* Profile Block */}
                        {user && (
                            <ProfileCard
                                user={{
                                    name: user.name,
                                    email: user.email,
                                    avatarUrl: user.avatarUrl,
                                    description: user.description // Pass description from auth context/user model if available
                                }}
                                onLogin={handleLogin}
                                onUpdateProfile={handleUpdateProfile}
                            />
                        )}

                        {/* Membership Section */}
                        <SettingsSection title="Tu membresía">
                            <MembershipCard
                                isPaying={true} // TODO: Connect to actual user subscription status
                                planName={"Plan Anual"}
                                renewalDate="15/04/2026"
                                benefits={[
                                    "Acceso ilimitado a contenido",
                                    "Lectura sin publicidad",
                                    "E-Paper incluido",
                                    "Acceso a funciones MAGNUS AI",
                                    "Acceso a descuentos exclusivos",
                                    "Acceso a eventos exclusivos"
                                ]}
                                onViewBenefits={() => window.open('https://Membresiavanguardia.com', '_blank')}
                                onManage={() => {/* TODO: Implement membership management */ }}
                            />
                        </SettingsSection>

                        {/* Main Settings Grid */}
                        <SettingsSection>
                            <SettingsRow
                                icon={<Icons.bell size={24} stroke={1.5} />}
                                label="Notificaciones"
                                onClick={() => {/* TODO: Implement notifications settings */ }}
                            />
                            <SettingsRow
                                icon={<Icons.privacy size={24} stroke={1.5} />}
                                label="Privacidad y seguridad"
                                onClick={() => {/* TODO: Implement privacy settings */ }}
                            />
                            <SettingsRow
                                icon={<Icons.info size={24} stroke={1.5} />}
                                label="Acerca de Magnus"
                                onClick={() => {/* TODO: Implement about page */ }}
                            />
                            <SettingsRow
                                icon={<Icons.help size={24} stroke={1.5} />}
                                label="Ayuda y soporte"
                                onClick={() => {/* TODO: Implement help & support */ }}
                            />
                        </SettingsSection>

                        {/* App Preferences */}
                        {settings && (
                            <SettingsSection title="Preferencias de la App">
                                <div className="perfil-hub-page__preferences-row">
                                    <span className="perfil-hub-page__preferences-label">Modo oscuro</span>
                                    <ToggleSwitch
                                        checked={theme === 'dark'}
                                        onChange={(checked) => {
                                            toggleTheme();
                                            updateSettings({ theme: checked ? 'dark' : 'light' });
                                        }}
                                    />
                                </div>
                                <div className="perfil-hub-page__preferences-row">
                                    <span className="perfil-hub-page__preferences-label">Tamaño de letra</span>
                                    <OptionSelector
                                        options={[
                                            { label: 'A', value: 'small' },
                                            { label: 'A+', value: 'medium' },
                                            { label: 'A++', value: 'large' },
                                        ]}
                                        value={fontSize}
                                        onChange={(val) => setFontSize(val as 'small' | 'medium' | 'large')}
                                    />
                                </div>

                                <div className="perfil-hub-page__preferences-row">
                                    <span className="perfil-hub-page__preferences-label">Permitir analíticas anónimas</span>
                                    <ToggleSwitch
                                        checked={analyticsEnabled}
                                        onChange={(checked) => {
                                            setAnalyticsEnabled(checked);
                                            setAnalyticsConsent(checked);
                                        }}
                                    />
                                </div>
                            </SettingsSection>
                        )}

                        <div className="perfil-hub-page__logout-container">
                            <button
                                onClick={handleLogout}
                                className="perfil-hub-page__logout-button"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </Stack>
                </Section>
            </div>
        </PageWrapper>
    );
};
