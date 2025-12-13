export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    plan?: string;
    memberSince?: string;
    description?: string;
}

export interface AppSettings {
    theme: "light" | "dark" | "system";
    fontSize: "small" | "medium" | "large";

    notifications: boolean;
}
