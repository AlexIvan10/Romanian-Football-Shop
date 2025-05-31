// utils/api.ts
export const API_BASE_URL = 'http://localhost:8080/api';

export const apiRequest = async (url: string, options: RequestInit = {}) => {
    const defaultOptions: RequestInit = {
        credentials: 'include', // Always include session cookies
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    const response = await fetch(fullUrl, defaultOptions);

    // Handle authentication errors globally
    if (response.status === 401 || response.status === 403) {
        // You can emit a global event or use a store to handle logout
        window.dispatchEvent(new CustomEvent('auth-error', {
            detail: { status: response.status }
        }));
        throw new Error('Authentication required');
    }

    return response;
};

export const handleApiResponse = async (response: Response, successMessage?: string) => {
    if (response.ok) {
        let data = null;
        try {
            data = await response.json();
        } catch {
            // Response might not have JSON body
        }
        return {
            success: true,
            data,
            message: successMessage
        };
    } else {
        const errorMessage = await response.text().catch(() => 'Operation failed');
        return {
            success: false,
            error: errorMessage,
            status: response.status
        };
    }
};

// Convenience methods for common HTTP verbs
export const api = {
    get: (url: string, options?: RequestInit) =>
        apiRequest(url, { method: 'GET', ...options }),

    post: (url: string, data?: any, options?: RequestInit) =>
        apiRequest(url, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            ...options
        }),

    put: (url: string, data?: any, options?: RequestInit) =>
        apiRequest(url, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            ...options
        }),

    delete: (url: string, options?: RequestInit) =>
        apiRequest(url, { method: 'DELETE', ...options })
};

// Example usage in components:
/*
import { api, handleApiResponse } from '../utils/api';

// In your component:
const fetchUsers = async () => {
    try {
        const response = await api.get('/admin/user');
        const result = await handleApiResponse(response);

        if (result.success) {
            setUsers(result.data);
        } else {
            showSnackbar(result.error, 'error');
        }
    } catch (error) {
        if (error.message === 'Authentication required') {
            navigate('/login');
        } else {
            showSnackbar('Failed to fetch users', 'error');
        }
    }
};

const deleteUser = async (id: number) => {
    try {
        const response = await api.delete(`/admin/user/${id}`);
        const result = await handleApiResponse(response, 'User deleted successfully');

        if (result.success) {
            showSnackbar(result.message, 'success');
            fetchUsers(); // Refresh the list
        } else {
            showSnackbar(result.error, 'error');
        }
    } catch (error) {
        if (error.message === 'Authentication required') {
            navigate('/login');
        } else {
            showSnackbar('Failed to delete user', 'error');
        }
    }
};
*/