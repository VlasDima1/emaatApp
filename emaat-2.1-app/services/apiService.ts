/**
 * API Service for Patient App
 * Handles communication with the backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
    private token: string | null = null;

    constructor() {
        this.token = localStorage.getItem('patientToken');
    }

    setToken(token: string | null) {
        this.token = token;
        if (token) {
            localStorage.setItem('patientToken', token);
        } else {
            localStorage.removeItem('patientToken');
        }
    }

    getToken(): string | null {
        return this.token;
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<{ success: boolean; data?: T; error?: string }> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, error: data.error || 'Request failed' };
            }

            return { success: true, data: data.data };
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, error: 'Network error. Please check your connection.' };
        }
    }

    // ============================================
    // AUTH ENDPOINTS
    // ============================================
    async login(email: string, password: string) {
        const result = await this.request<{ user: any; token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (result.success && result.data?.token) {
            this.setToken(result.data.token);
        }

        return result;
    }

    async register(data: { 
        name: string; 
        email: string; 
        password: string; 
        accessCode: string;
        dateOfBirth?: string;
        gender?: string;
        height?: number;
        weight?: number;
        photoDataUrl?: string;
    }) {
        return this.request<{ user: any; token: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ ...data, role: 'patient' }),
        });
    }

    async getProfile() {
        return this.request<any>('/auth/me');
    }

    logout() {
        this.setToken(null);
    }

    // ============================================
    // MEASUREMENTS ENDPOINTS
    // ============================================
    async addMeasurement(measurement: any) {
        return this.request<any>('/patient/measurements', {
            method: 'POST',
            body: JSON.stringify(measurement),
        });
    }

    async getMeasurements(type?: string, startDate?: string, endDate?: string) {
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        return this.request<any[]>(`/patient/measurements?${params}`);
    }

    // ============================================
    // CHALLENGES ENDPOINTS
    // ============================================
    async getActiveChallenges() {
        return this.request<any[]>('/patient/challenges/active');
    }

    async startChallenge(challengeType: string, settings?: any) {
        return this.request<any>('/patient/challenges', {
            method: 'POST',
            body: JSON.stringify({ type: challengeType, settings }),
        });
    }

    async updateChallengeProgress(challengeId: string, data: any) {
        return this.request<any>(`/patient/challenges/${challengeId}/progress`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async completeChallenge(challengeId: string, outcome?: string) {
        return this.request<any>(`/patient/challenges/${challengeId}/complete`, {
            method: 'POST',
            body: JSON.stringify({ outcome }),
        });
    }

    async cancelChallenge(challengeId: string) {
        return this.request<any>(`/patient/challenges/${challengeId}/cancel`, {
            method: 'POST',
        });
    }

    // ============================================
    // GOALS ENDPOINTS
    // ============================================
    async getGoals() {
        return this.request<any[]>('/patient/goals');
    }

    async setGoal(goal: any) {
        return this.request<any>('/patient/goals', {
            method: 'POST',
            body: JSON.stringify(goal),
        });
    }

    async updateGoal(goalId: string, data: any) {
        return this.request<any>(`/patient/goals/${goalId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteGoal(goalId: string) {
        return this.request<any>(`/patient/goals/${goalId}`, {
            method: 'DELETE',
        });
    }

    // ============================================
    // SURVEYS ENDPOINTS
    // ============================================
    async getSurveys() {
        return this.request<any[]>('/patient/surveys');
    }

    async submitSurvey(survey: any) {
        return this.request<any>('/patient/surveys', {
            method: 'POST',
            body: JSON.stringify(survey),
        });
    }

    // ============================================
    // JOURNALS ENDPOINTS
    // ============================================
    async getJournals() {
        return this.request<any[]>('/patient/journals');
    }

    async addJournalEntry(entry: any) {
        return this.request<any>('/patient/journals', {
            method: 'POST',
            body: JSON.stringify(entry),
        });
    }

    // ============================================
    // LIFE STEPS ENDPOINTS
    // ============================================
    async getLifeSteps() {
        return this.request<any[]>('/patient/life-steps');
    }

    async addLifeStep(step: any) {
        return this.request<any>('/patient/life-steps', {
            method: 'POST',
            body: JSON.stringify(step),
        });
    }

    // ============================================
    // POINTS ENDPOINTS
    // ============================================
    async getPoints() {
        return this.request<any>('/patient/points');
    }

    async addPoints(data: { points: number; reason: string }) {
        return this.request<any>('/patient/points', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // ============================================
    // REMINDERS ENDPOINTS
    // ============================================
    async getReminders() {
        return this.request<any[]>('/patient/reminders');
    }

    async setReminder(reminder: any) {
        return this.request<any>('/patient/reminders', {
            method: 'POST',
            body: JSON.stringify(reminder),
        });
    }

    // ============================================
    // USER PROFILE ENDPOINTS
    // ============================================
    async updateProfile(data: any) {
        return this.request<any>('/auth/me', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async syncUserData(data: any) {
        return this.request<any>('/patient/sync', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

export const apiService = new ApiService();
export default apiService;
