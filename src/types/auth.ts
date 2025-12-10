export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    description?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    fullName?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken?: string;
}
