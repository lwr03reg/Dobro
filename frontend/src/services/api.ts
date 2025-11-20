const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
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
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || data.message || 'An error occurred',
        };
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Auth
  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', response.data.token);
    }

    return response;
  }

  async register(email: string, password: string, name: string) {
    const response = await this.request<{ token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    if (response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', response.data.token);
    }

    return response;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Guides
  async getGuides() {
    return this.request<any[]>('/api/guides');
  }

  async getGuide(id: string) {
    return this.request<any>(`/api/guides/${id}`);
  }

  async createGuide(data: any) {
    return this.request<any>('/api/guides', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGuide(id: string, data: any) {
    return this.request<any>(`/api/guides/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteGuide(id: string) {
    return this.request<void>(`/api/guides/${id}`, {
      method: 'DELETE',
    });
  }

  // AI
  async getTrendingTopics() {
    return this.request<any[]>('/api/ai/trending-topics');
  }

  async generateGuide(topic: string) {
    return this.request<any>('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ topic }),
    });
  }

  // Analytics
  async getStats() {
    return this.request<any>('/api/analytics/stats');
  }

  async getActivity() {
    return this.request<any[]>('/api/analytics/activity');
  }
}

export const api = new ApiService();
export default api;
