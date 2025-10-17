import { authApi } from "@/app/api/fetcher";

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export function handleApiError(error: unknown): never {
  if (error instanceof ApiError) throw error;
  
  if (error instanceof Error) {
    if (error.message.toLowerCase().includes('unauthorized')) {
      authApi.logout();
      throw new ApiError("Your session has expired. Please log in again.", 401);
    }
    throw new ApiError(error.message);
  }
  
  throw new ApiError("An unknown error occurred");
}

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

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isUnauthorizedError(error: unknown): boolean {
  return isApiError(error) && error.statusCode === 401;
}

export function extractApiData<T>(response: any, entityKey?: string): T {
  if (!response) return null as unknown as T;
  if (response.data && entityKey && response.data[entityKey]) return response.data[entityKey] as T;
  if (response.data) return response.data as T;
  return response as T;
}

export function safeFilter<T>(data: any, predicate: (item: T) => boolean): T[] {
  return Array.isArray(data) ? data.filter(predicate) : [];
}

