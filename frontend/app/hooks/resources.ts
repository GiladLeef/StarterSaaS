import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface ResourceAPI<T> {
  list: (params?: any) => Promise<{ data?: any }>;
  create?: (data: any) => Promise<{ data?: any }>;
  update?: (id: string, data: any) => Promise<{ data?: any }>;
  delete?: (id: string) => Promise<any>;
}

interface UseResourceListOptions {
  autoLoad?: boolean;
  onError?: (error: string) => void;
}

export function useResourceList<T>(
  api: ResourceAPI<T>,
  resourceName: string,
  options: UseResourceListOptions = {}
) {
  const router = useRouter();
  const { autoLoad = true, onError } = options;

  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(autoLoad);
  const [error, setError] = useState("");

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await api.list();
      setItems(response.data?.[resourceName] || []);
    } catch (err) {
      const errorMessage = `Failed to load ${resourceName}`;
      setError(errorMessage);

      if (err instanceof Error && err.message.includes("unauthorized")) {
        router.push("/login");
      }

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [api, resourceName, router, onError]);

  useEffect(() => {
    if (autoLoad) {
      fetchItems();
    }
  }, [autoLoad, fetchItems]);

  const createItem = useCallback(
    async (data: any) => {
      if (!api.create) {
        throw new Error("Create operation not supported");
      }

      try {
        setError("");
        const response = await api.create(data);
        const newItem = response.data?.[resourceName.slice(0, -1)]; // singular form

        if (newItem) {
          setItems((prev) => [...prev, newItem]);
        } else {
          // Refetch if we don't get the item back
          await fetchItems();
        }

        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : `Failed to create ${resourceName}`;
        setError(errorMessage);
        throw err;
      }
    },
    [api, resourceName, fetchItems]
  );

  const updateItem = useCallback(
    async (id: string, data: any) => {
      if (!api.update) {
        throw new Error("Update operation not supported");
      }

      try {
        setError("");
        const response = await api.update(id, data);
        const updatedItem = response.data?.[resourceName.slice(0, -1)]; // singular form

        if (updatedItem) {
          setItems((prev) =>
            prev.map((item: any) => (item.id === id ? updatedItem : item))
          );
        } else {
          // Refetch if we don't get the item back
          await fetchItems();
        }

        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : `Failed to update ${resourceName}`;
        setError(errorMessage);
        throw err;
      }
    },
    [api, resourceName, fetchItems]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      if (!api.delete) {
        throw new Error("Delete operation not supported");
      }

      try {
        setError("");
        await api.delete(id);
        setItems((prev) => prev.filter((item: any) => item.id !== id));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : `Failed to delete ${resourceName}`;
        setError(errorMessage);
        throw err;
      }
    },
    [api, resourceName]
  );

  return {
    items,
    setItems,
    isLoading,
    error,
    setError,
    refetch: fetchItems,
    createItem,
    updateItem,
    deleteItem,
  };
}

