import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface AutoFetchOptions {
  autoLoad?: boolean;
  onError?: (error: string) => void;
  redirectOnAuth?: boolean;
}

export function useAutoFetch<T>(
  fetchFn: () => Promise<any>,
  dataKey: string,
  options: AutoFetchOptions = {}
) {
  const { autoLoad = true, onError, redirectOnAuth = true } = options;
  const router = useRouter();
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(autoLoad);
  const [error, setError] = useState("");

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetchFn();
      setData(response?.data?.[dataKey] || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch data";
      setError(errorMessage);
      
      if (redirectOnAuth && errorMessage.includes("unauthorized")) {
        router.push("/login");
      }
      
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, dataKey, router, onError, redirectOnAuth]);

  useEffect(() => {
    if (autoLoad) {
      fetch();
    }
  }, [autoLoad, fetch]);

  return { data, isLoading, error, setError, refetch: fetch };
}

export function useSingleFetch<T>(
  fetchFn: () => Promise<any>,
  dataKey: string,
  options: AutoFetchOptions = {}
) {
  const { autoLoad = true, onError, redirectOnAuth = true } = options;
  const router = useRouter();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(autoLoad);
  const [error, setError] = useState("");

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetchFn();
      setData(response?.data?.[dataKey] || null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch data";
      setError(errorMessage);
      
      if (redirectOnAuth && errorMessage.includes("unauthorized")) {
        router.push("/login");
      }
      
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, dataKey, router, onError, redirectOnAuth]);

  useEffect(() => {
    if (autoLoad) {
      fetch();
    }
  }, [autoLoad, fetch]);

  return { data, isLoading, error, setError, refetch: fetch };
}

export function useStatusCounts<T extends { status?: string }>(items: T[]) {
  return {
    active: items.filter((item) => item.status?.toLowerCase() === "active").length,
    completed: items.filter((item) => item.status?.toLowerCase() === "completed").length,
    inProgress: items.filter((item) =>
      ["in progress", "in-progress"].includes(item.status?.toLowerCase() || "")
    ).length,
  };
}

export function useGroupByOrg<T extends { organizationId: string }>(
  items: T[],
  orgs: Array<{ id: string; name: string }>
) {
  return orgs.map((org) => {
    const count = items.filter((item) => item.organizationId === org.id).length;
    const percentage = items.length > 0 ? (count / items.length) * 100 : 0;
    return { ...org, count, percentage };
  });
}

