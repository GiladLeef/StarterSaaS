import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Generic hook for fetching and managing a single resource detail
 * Consolidates the repeated pattern of fetching a resource by ID with loading/error states
 */
export function useResourceDetail<T>(
  fetchFn: (id: string) => Promise<any>,
  id: string,
  dataKey: string
) {
  const router = useRouter()
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetch = useCallback(async () => {
    if (!id) return

    try {
      setIsLoading(true)
      setError('')
      const response = await fetchFn(id)
      const resourceData = response.data?.[dataKey] || response.data
      
      if (!resourceData) {
        setError(`${dataKey.charAt(0).toUpperCase() + dataKey.slice(1)} not found`)
        return
      }
      
      setData(resourceData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to load ${dataKey}`
      setError(errorMessage)
      
      if (errorMessage.includes('unauthorized')) {
        router.push('/login')
      }
    } finally {
      setIsLoading(false)
    }
  }, [fetchFn, id, dataKey, router])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, isLoading, error, refetch: fetch, setData, setError }
}

/**
 * Hook for managing form submission state
 * Consolidates isSubmitting, error, success state patterns
 */
export function useFormSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const submit = useCallback(async (submitFn: () => Promise<void>) => {
    try {
      setIsSubmitting(true)
      setError('')
      setSuccess('')
      await submitFn()
      setSuccess('Operation completed successfully')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed'
      setError(errorMessage)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const reset = useCallback(() => {
    setError('')
    setSuccess('')
    setIsSubmitting(false)
  }, [])

  return {
    isSubmitting,
    error,
    success,
    setError,
    setSuccess,
    submit,
    reset
  }
}

/**
 * Hook for managing delete operations
 * Consolidates the pattern of confirming and deleting resources
 */
export function useDeleteResource(
  deleteFn: (id: string) => Promise<void>,
  options?: {
    confirmMessage?: string
    onSuccess?: () => void
    onError?: (error: string) => void
  }
) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  const deleteResource = useCallback(async (id: string) => {
    const confirmed = window.confirm(
      options?.confirmMessage || 'Are you sure you want to delete this resource?'
    )

    if (!confirmed) return

    try {
      setIsDeleting(true)
      setError('')
      await deleteFn(id)
      options?.onSuccess?.()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete resource'
      setError(errorMessage)
      options?.onError?.(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }, [deleteFn, options])

  return { deleteResource, isDeleting, error }
}

