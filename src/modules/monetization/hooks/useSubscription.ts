import { useAuth } from '../../../context/AuthContext';
import { differenceInDays, parseISO } from 'date-fns';

export type SubscriptionStatus = 'guest' | 'trial' | 'active' | 'expired';

export const useSubscription = () => {
    const { user, isLoading } = useAuth();

    // Config
    const TRIAL_DAYS = 10;

    if (isLoading) {
        return { status: 'loading', daysLeft: 0, isLocked: true };
    }

    if (!user) {
        return {
            status: 'guest' as SubscriptionStatus,
            daysLeft: 0,
            isLocked: true
        };
    }

    // Default to 'now' if createdAt is missing (safety fallback)
    const startDate = user.createdAt ? parseISO(user.createdAt) : new Date();
    const today = new Date();
    const daysSinceCreation = differenceInDays(today, startDate);

    const daysLeft = Math.max(0, TRIAL_DAYS - daysSinceCreation);

    // In a real app, you'd also check if they have a Paid Active Subscription via Stripe/RevenueCat
    // For now, we only have Trial logic.
    const hasActiveSubscription = false;

    let status: SubscriptionStatus = 'trial';
    if (hasActiveSubscription) {
        status = 'active';
    } else if (daysSinceCreation > TRIAL_DAYS) {
        status = 'expired';
    }

    const isLocked = status === 'expired'; // Removed 'guest' check as it's handled above

    return {
        status,
        daysLeft,
        isLocked,
        user
    };
};
