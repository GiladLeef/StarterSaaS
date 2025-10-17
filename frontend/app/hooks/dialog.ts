import { useState, useCallback } from "react";

/**
 * Generic hook for managing form dialogs
 * Handles open/close state, form data, and submission logic
 */
export function useFormDialog<T extends Record<string, any>>(
  initialState: T
) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<T>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const updateField = useCallback((name: keyof T, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const reset = useCallback(() => {
    setFormData(initialState);
    setIsOpen(false);
    setError("");
    setIsSubmitting(false);
  }, [initialState]);

  const handleSubmit = useCallback(
    async (onSubmit: (data: T) => Promise<void>) => {
      try {
        setIsSubmitting(true);
        setError("");
        await onSubmit(formData);
        reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, reset]
  );

  return {
    isOpen,
    setIsOpen,
    formData,
    setFormData,
    handleChange,
    updateField,
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    reset,
    handleSubmit,
  };
}

