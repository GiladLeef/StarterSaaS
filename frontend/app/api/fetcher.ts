/**
 * API Fetcher for making requests to the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  auth?: boolean;
};

// Helper to safely access localStorage (only in browser)
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper to safely set localStorage (only in browser)
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

// Helper to safely remove localStorage (only in browser)
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

// Standard API response format from the backend
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Main fetch function that handles all API requests
 */
export async function apiFetch<T = any>(
  endpoint: string, 
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { 
    method = 'GET',
    headers = {},
    body,
    auth = true 
  } = options;

  // Prepare headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add auth token if needed and available
  if (auth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  // Prepare request options
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // Add body if provided
  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  // Make the request
  const response = await fetch(`${API_URL}${endpoint}`, requestOptions);

  // Parse the response
  const responseData = await response.json();

  // Handle error responses
  if (!response.ok || !responseData.success) {
    throw new Error(responseData.error || 'An error occurred');
  }

  return responseData;
}

// Common error handler for API requests
const handleApiError = (context: string, error: any) => {
  throw error;
};

/**
 * Auth API functions
 */
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiFetch<{ token: string; user: any }>('/api/v1/auth/login', {
        method: 'POST',
        body: { email, password },
        auth: false,
      });
      
      if (!response.data || !response.data.token) {
        throw new Error('No authentication token received');
      }
      
      // Store the token in localStorage
      setAuthToken(response.data.token);
      
      return response.data;
    } catch (error) {
      handleApiError('login', error);
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      const response = await apiFetch<{ token: string; user: any }>('/api/v1/auth/register', {
        method: 'POST',
        body: userData,
        auth: false,
      });
      
      if (!response.data || !response.data.token) {
        throw new Error('No authentication token received');
      }
      
      // Store the token in localStorage
      setAuthToken(response.data.token);
      
      return response.data;
    } catch (error) {
      handleApiError('registration', error);
      throw error;
    }
  },

  logout: () => {
    removeAuthToken();
  },

  forgotPassword: (email: string) => 
    apiFetch<{ message: string }>('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: { email },
      auth: false,
    }),

  resetPassword: (token: string, password: string) => 
    apiFetch<{ message: string }>('/api/v1/auth/reset-password', {
      method: 'POST',
      body: { token, password },
      auth: false,
    }),

  getCurrentUser: async () => {
    try {
      const response = await apiFetch<{ user: any }>('/api/v1/users/me');
      
      // Handle different response formats
      if (response && response.success && !response.data) {
        return { user: response };
      }
      return response.data || { user: null };
    } catch (error) {
      handleApiError('getCurrentUser', error);
      throw error;
    }
  },
};

// Generic API CRUD function creator
const createCrudApi = <T>(basePath: string, entityName: string) => ({
  list: async () => {
    try {
      const response = await apiFetch<{ [key: string]: T[] }>(`${basePath}`);
      return response;
    } catch (error) {
      handleApiError(`list ${entityName}`, error);
      throw error;
    }
  },

  create: async (data: any) => {
    try {
      const response = await apiFetch<{ [key: string]: T }>(`${basePath}`, {
        method: 'POST',
        body: data,
      });
      return response;
    } catch (error) {
      handleApiError(`create ${entityName}`, error);
      throw error;
    }
  },

  get: async (id: string) => {
    try {
      const response = await apiFetch<{ [key: string]: T }>(`${basePath}/${id}`);
      return response;
    } catch (error) {
      handleApiError(`get ${entityName}`, error);
      throw error;
    }
  },

  update: async (id: string, data: any) => {
    try {
      const response = await apiFetch<{ [key: string]: T }>(`${basePath}/${id}`, {
        method: 'PUT',
        body: data,
      });
      return response;
    } catch (error) {
      handleApiError(`update ${entityName}`, error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await apiFetch(`${basePath}/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      handleApiError(`delete ${entityName}`, error);
      throw error;
    }
  }
});

/**
 * Organizations API functions
 */
export const organizationsApi = createCrudApi<any>('/api/v1/organizations', 'organization');

/**
 * Organization Invitations API functions
 */
export const invitationsApi = {
  list: async () => {
    try {
      const response = await apiFetch<{ invitations: any[] }>('/api/v1/invitations');
      return response;
    } catch (error) {
      handleApiError('list invitations', error);
      throw error;
    }
  },

  create: async (data: { organizationId: string, email: string }) => {
    try {
      const response = await apiFetch<{ invitation: any }>('/api/v1/invitations', {
        method: 'POST',
        body: data,
      });
      return response;
    } catch (error) {
      handleApiError('create invitation', error);
      throw error;
    }
  },

  accept: async (id: string) => {
    try {
      const response = await apiFetch(`/api/v1/invitations/${id}/accept`, {
        method: 'POST',
      });
      return response;
    } catch (error) {
      handleApiError('accept invitation', error);
      throw error;
    }
  },

  decline: async (id: string) => {
    try {
      const response = await apiFetch(`/api/v1/invitations/${id}/decline`, {
        method: 'POST',
      });
      return response;
    } catch (error) {
      handleApiError('decline invitation', error);
      throw error;
    }
  },
};

/**
 * Projects API functions
 */
export const projectsApi = createCrudApi<any>('/api/v1/projects', 'project');


/**
 * Subscriptions API functions
 */
export const subscriptionsApi = createCrudApi<any>('/api/v1/subscriptions', 'subscription');

/**
 * User API functions
 */
export const userApi = {
  updateProfile: async (userData: { firstName?: string; lastName?: string; email?: string }) => {
    try {
      const response = await apiFetch<{ user: any }>('/api/v1/users/me', {
        method: 'PUT',
        body: userData,
      });
      return response;
    } catch (error) {
      handleApiError('update profile', error);
      throw error;
    }
  },
}; 