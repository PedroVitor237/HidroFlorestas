export type UserType = {
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    image?: string;
    role?: 'USER' | 'ADMIN' | 'DEVELOPER' | 'MODERATOR';
    createdAt?: string;
    updatedAt?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BLOCKED';
}

