import { authApi } from "@/app/api/fetcher";

// Error class for API errors
export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

// Handle errors from API responses
export function handleApiError(error: unknown): never {
  // If it's already an ApiError, just throw it
  if (error instanceof ApiError) {
    throw error;
  }
  
  // If it's another Error object
  if (error instanceof Error) {
    // Check for unauthorized error and handle session expiry
    if (error.message.toLowerCase().includes('unauthorized')) {
      // Clean up the session
      authApi.logout();
      throw new ApiError("Your session has expired. Please log in again.", 401);
    }
    
    throw new ApiError(error.message);
  }
  
  // For unknown errors
  throw new ApiError("An unknown error occurred");
}

// Common response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Type guards
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isUnauthorizedError(error: unknown): boolean {
  return isApiError(error) && error.statusCode === 401;
} 