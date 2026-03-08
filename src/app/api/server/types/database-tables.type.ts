export type UserType = {
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    image?: string;
    isAdmin?: boolean;
    createdAt?: string;
    updatedAt?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BLOCKED';
}

