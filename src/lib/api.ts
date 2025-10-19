// API configuration and utilities
// Normalize NEXT_PUBLIC_API_URL so that if it already includes '/api' we don't append another one
function normalizeApiBase(envUrl?: string) {
  if (!envUrl) return 'http://localhost:5000/api';
  // Remove trailing slash
  let url = envUrl.replace(/\/+$/, '');
  // If env already ends with '/api', return as-is
  if (url.toLowerCase().endsWith('/api')) return url;
  // Otherwise append '/api'
  return `${url}/api`;
}

const API_BASE_URL = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL);

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Job {
  _id?: string;
  id?: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: 'entry' | 'mid' | 'senior' | 'lead';
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  remote: boolean;
  applicationUrl?: string;
  applicationEmail?: string;
  applicationDeadline?: string;
  featured: boolean;
  status: 'active' | 'paused' | 'closed';
  postedBy?: string;
  applicationsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  role: 'job-seeker' | 'employer' | 'admin';
  profile?: {
    bio?: string;
    skills?: string[];
    experience?: string;
    education?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  isActive?: boolean;
  createdAt?: string;
}

// Generic API request function
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('Making API request to:', url);
  console.log('API_BASE_URL:', API_BASE_URL);
  
  // Get token from localStorage if available
  const token = localStorage.getItem('authToken');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  console.log('Request config:', config);

  try {
    console.log('Sending fetch request...');
    const response = await fetch(url, config);
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Job API functions
export const jobsApi = {
  // Get all jobs with optional filters
  async getJobs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    experience?: string;
    location?: string;
    remote?: boolean;
    minSalary?: number;
    maxSalary?: number;
  }): Promise<ApiResponse<{ jobs: Job[]; total: number; page: number; pages: number }>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest<{ jobs: Job[]; total: number; page: number; pages: number }>(endpoint);
  },

  // Get a single job by ID
  async getJob(id: string): Promise<ApiResponse<Job>> {
    return apiRequest<Job>(`/jobs/${id}`);
  },

  // Create a new job (requires authentication)
  async createJob(jobData: any): Promise<ApiResponse<any>> {
    return apiRequest<any>('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },

  // Update an existing job (requires authentication)
  async updateJob(id: string, jobData: Partial<Job>): Promise<ApiResponse<Job>> {
    return apiRequest<Job>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  },

  // Delete a job (requires authentication)
  async deleteJob(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },

  // Get featured jobs
  async getFeaturedJobs(): Promise<ApiResponse<Job[]>> {
    return apiRequest<Job[]>('/jobs/featured');
  },
};

// User API functions
export const usersApi = {
  // Register a new user
  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: 'job-seeker' | 'employer';
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return apiRequest<{ user: User; token: string }>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  // Login user
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return apiRequest<{ user: User; token: string }>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get current user profile (requires authentication)
  async getProfile(): Promise<ApiResponse<User>> {
    return apiRequest<User>('/users/profile');
  },

  // Update user profile (requires authentication)
  async updateProfile(profileData: Partial<User>): Promise<ApiResponse<User>> {
    return apiRequest<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Change password (requires authentication)
  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiRequest<{ message: string }>('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  },
};

// Authentication utilities
export const auth = {
  // Save token to localStorage
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  },

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  // Remove token from localStorage
  removeToken(): void {
    localStorage.removeItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Save user data to localStorage
  saveUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  // Get user data from localStorage
  getUser(): User | null {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  },

  // Remove user data from localStorage
  removeUser(): void {
    localStorage.removeItem('currentUser');
  },

  // Logout user (remove token and user data)
  logout(): void {
    this.removeToken();
    this.removeUser();
  },
};

export default {
  jobs: jobsApi,
  users: usersApi,
  auth,
};
