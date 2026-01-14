import { type ReactNode } from 'react';
// import { useSubscription } from '../hooks/useSubscription';
// import { LandingPage } from '../pages/LandingPage';
// import { PaymentWallPage } from '../pages/PaymentWallPage';

interface SubscriptionGuardProps {
    children: ReactNode;
}

export const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
    // For local dev, disable login
    return <>{children}</>;

    /* 
    const { status } = useSubscription();

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
    */
};
