import { type ReactNode } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { LandingPage } from '../pages/LandingPage';
import { PaymentWallPage } from '../pages/PaymentWallPage';

interface SubscriptionGuardProps {
    children: ReactNode;
}

export const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
    const { status } = useSubscription();

    // If loading or just starting, shows nothing or a spinner
    // For better UX during "Auth Loading", we might want a splash screen
    // But for now, we rely on AppRouter's loader or similar.
    // However, useSubscription relies on useAuth which has its own loading.

    // Status Logic
    if (status === 'loading') {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-black text-white">
                Loading...
            </div>
        );
    }

    if (status === 'guest') {
        return <LandingPage />;
    }

    if (status === 'expired') {
        return <PaymentWallPage />;
    }

    // Trial or Active -> Render App
    return <>{children}</>;
};
