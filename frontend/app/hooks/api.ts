import { useState, useEffect } from 'react';
import { handleApiError } from '../utils/helpers';

type FetchFn<T> = () => Promise<T>;

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  skip?: boolean;
}

export function useApi<T>(fetchFn: FetchFn<T>, options: UseApiOptions = {}) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchData = async () => {
    if (options.skip) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await fetchFn();
      setData(result);
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
    } catch (err) {
      try {
        const apiError = handleApiError(err);
        setError(apiError);
        
        if (options.onError) {
          options.onError(apiError);
        }
      } catch (handledError) {
        if (handledError instanceof Error) {
          setError(handledError);
          
          if (options.onError) {
            options.onError(handledError);
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [options.skip]);
  
  const refetch = () => {
    fetchData();
  };
  
  return { data, isLoading, error, refetch };
}

export function useMutation<T, P>(
  mutationFn: (params: P) => Promise<T>,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const mutate = async (params: P) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await mutationFn(params);
      setData(result);
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (err) {
      try {
        const apiError = handleApiError(err);
        setError(apiError);
        
        if (options.onError) {
          options.onError(apiError);
        }
        
        throw apiError;
      } catch (handledError) {
        if (handledError instanceof Error) {
          setError(handledError);
          
          if (options.onError) {
            options.onError(handledError);
          }
          
          throw handledError;
        }
        
        throw new Error('Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return { mutate, data, isLoading, error };
} 