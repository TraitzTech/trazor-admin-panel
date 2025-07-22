// services/userApi.ts
import { apiFetch } from '@/lib/api';
import { User, Intern, Supervisor, Admin, ApiResponse } from '@/types/user';

export class UserApiService {
    // Get all users (unified endpoint)
    static async getAllUsers(): Promise<User[]> {
        const response: ApiResponse<User[]> = await apiFetch('/admin/users');
        return response.data;
    }

    // Get users by type
    static async getAllInterns(): Promise<Intern[]> {
        const response: ApiResponse<Intern[]> = await apiFetch('/admin/interns');
        return response.data;
    }

    static async getAllSupervisors(): Promise<Supervisor[]> {
        const response: ApiResponse<Supervisor[]> = await apiFetch('/admin/supervisors');
        return response.data;
    }

    static async getAllAdmins(): Promise<Admin[]> {
        const response: ApiResponse<Admin[]> = await apiFetch('/admin/admins');
        return response.data;
    }

    // Toggle user status
    static async toggleUserStatus(userId: number): Promise<{ id: number; status: string }> {
        const response: ApiResponse<{ id: number; status: string }> = await apiFetch(
            `/admin/users/${userId}/toggle-status`,
            {
                method: 'PATCH',
            }
        );
        return response.data;
    }

    static async getUserById(userId: number): Promise<User> {
        const response: ApiResponse<User> = await apiFetch(`/admin/users/${userId}`);
        return response.data;
    }

    // Create user (placeholder - implement based on your create endpoints)
    static async createUser(userData: Partial<User>): Promise<User> {
        const response: ApiResponse<User> = await apiFetch('/admin/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        return response.data;
    }

    // Update user (placeholder - implement based on your update endpoints)
    static async updateUser(userId: number, userData: Partial<User>): Promise<User> {
        const response: ApiResponse<User> = await apiFetch(`/admin/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
        return response.data;
    }

    // Delete user (placeholder - implement based on your delete endpoints)
    static async deleteUser(userId: number): Promise<void> {
        await apiFetch(`/admin/users/${userId}`, {
            method: 'DELETE',
        });
    }
}