// types/user.ts
export interface BaseUser {
    id: number;
    user_id: number;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
    joinDate: string;
    avatar: string;
    bio: string;
    location: string;
    role: 'intern' | 'supervisor' | 'admin';
    institution: string;
    specialty: string;
    lastLogin?: string;
    settings?: {
        email_notifications: boolean;
        profile_public: boolean;
        two_factor_auth: boolean;
    };
    applications?: {
        id: number;
        internshipTitle: string;
        company: string;
        appliedDate: string;
        status: string;
    }[];
    activities?: {
        action: string;
        time: string;
    }[];
    stats?: {
        applications: number;
        interviews: number;
        offers: number;
    };
}

export interface Intern extends BaseUser {
    role: 'intern';
    institution: string;
    matricNumber: string;
    hortNumber?: string;
    startDate?: string;
    endDate?: string;
    specialty: string;
    supervisors: Supervisor[];
}

export interface Supervisor extends BaseUser {
    role: 'supervisor';
    department: string;
    position: string;
    specialty: string;
    internCount: number;
}

export interface Admin extends BaseUser {
    role: 'admin';
    department: string;
    permissions?: string[];
}

export type User = Intern | Supervisor | Admin;

export interface UserStats {
    total: number;
    interns: number;
    supervisors: number;
    admins: number;
    active: number;
    inactive: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}