/**
 * API Service for GP Dashboard
 * Connects to the EMAAT Backend
 */

// @ts-ignore - Vite environment variable
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:3001/api';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    code?: string;
}

class ApiService {
    private token: string | null = null;

    constructor() {
        this.token = localStorage.getItem('gp_token');
    }

    setToken(token: string | null) {
        this.token = token;
        if (token) {
            localStorage.setItem('gp_token', token);
        } else {
            localStorage.removeItem('gp_token');
        }
    }

    getToken(): string | null {
        return this.token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle token expiration
                if (response.status === 401) {
                    this.setToken(null);
                    window.dispatchEvent(new CustomEvent('auth:logout'));
                }
                return {
                    success: false,
                    error: data.error || 'An error occurred',
                    code: data.code,
                };
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            return {
                success: false,
                error: 'Network error. Please check your connection.',
                code: 'NETWORK_ERROR',
            };
        }
    }

    // ============================================
    // AUTHENTICATION
    // ============================================

    async login(email: string, password: string) {
        const response = await this.request<{ user: any; token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (response.success && response.data) {
            if (response.data.user.role !== 'gp') {
                return {
                    success: false,
                    error: 'Toegang geweigerd. Alleen artsen kunnen inloggen.',
                    code: 'INVALID_ROLE',
                };
            }
            this.setToken(response.data.token);
        }

        return response;
    }

    async logout() {
        this.setToken(null);
    }

    async getProfile() {
        return this.request<any>('/auth/me');
    }

    // ============================================
    // PATIENTS
    // ============================================

    async getPatients(page = 1, limit = 20, search?: string) {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        });
        if (search) {
            params.append('search', search);
        }
        return this.request<{ patients: any[]; pagination: any }>(`/gp/patients?${params}`);
    }

    async getPatientDetail(patientId: string) {
        return this.request<any>(`/gp/patients/${patientId}`);
    }

    async getPatientHealthDomains(patientId: string) {
        return this.request<any>(`/gp/patients/${patientId}/health-domains`);
    }

    // ============================================
    // PATIENT MEASUREMENTS
    // ============================================

    async getPatientMeasurements(patientId: string, type?: string) {
        const params = type ? `?type=${type}` : '';
        return this.request<any[]>(`/gp/patients/${patientId}/measurements${params}`);
    }

    // ============================================
    // PATIENT CHALLENGES
    // ============================================

    async getPatientChallenges(patientId: string, status?: string) {
        const params = status ? `?status=${status}` : '';
        return this.request<any[]>(`/gp/patients/${patientId}/challenges${params}`);
    }

    async getPatientChallengeDetail(patientId: string, challengeId: string) {
        return this.request<any>(`/gp/patients/${patientId}/challenges/${challengeId}`);
    }

    async prescribeChallenge(patientId: string, type: string, notes?: string) {
        return this.request<any>(`/gp/patients/${patientId}/challenges`, {
            method: 'POST',
            body: JSON.stringify({ type, notes }),
        });
    }

    // ============================================
    // PATIENT SURVEYS
    // ============================================

    async getPatientSurveys(patientId: string, type?: string) {
        const params = type ? `?type=${type}` : '';
        return this.request<any[]>(`/gp/patients/${patientId}/surveys${params}`);
    }

    // ============================================
    // PATIENT GOALS
    // ============================================

    async getPatientGoals(patientId: string) {
        return this.request<any[]>(`/gp/patients/${patientId}/goals`);
    }

    // ============================================
    // PATIENT LIFE STEPS
    // ============================================

    async getPatientLifeSteps(patientId: string, startDate?: string, endDate?: string) {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        const queryString = params.toString() ? `?${params}` : '';
        return this.request<any[]>(`/gp/patients/${patientId}/life-steps${queryString}`);
    }

    // ============================================
    // PATIENT JOURNALS
    // ============================================

    async getPatientJournals(patientId: string, type?: string) {
        const params = type ? `?type=${type}` : '';
        return this.request<any[]>(`/gp/patients/${patientId}/journals${params}`);
    }

    // ============================================
    // DASHBOARD STATS
    // ============================================

    async getDashboardStats() {
        return this.request<any>('/gp/stats');
    }

    // ============================================
    // ACCESS CODES
    // ============================================

    async generateAccessCodes(count = 1) {
        return this.request<{ codes: string[] }>('/auth/access-codes', {
            method: 'POST',
            body: JSON.stringify({ count }),
        });
    }
}

export const apiService = new ApiService();
export default apiService;
