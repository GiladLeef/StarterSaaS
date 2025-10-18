"use client"

import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/app/api/fetcher"

interface UseResourceOptions {
  endpoint: string
  dataKey?: string
  autoFetch?: boolean
}

export function useResource<T = any>({ endpoint, dataKey, autoFetch = true }: UseResourceOptions) {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(autoFetch)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiFetch(endpoint)
      
      if (response.success && response.data) {
        const items = dataKey ? response.data[dataKey] : response.data
        setData(Array.isArray(items) ? items : [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }, [endpoint, dataKey])

  useEffect(() => {
    if (autoFetch) fetch()
  }, [autoFetch, fetch])

  const create = useCallback(async (item: Partial<T>) => {
    const response = await apiFetch(endpoint, { method: 'POST', body: item })
    await fetch()
    return response
  }, [endpoint, fetch])

  const update = useCallback(async (id: string, updates: Partial<T>) => {
    await apiFetch(`${endpoint}/${id}`, { method: 'PUT', body: updates })
    await fetch()
  }, [endpoint, fetch])

  const remove = useCallback(async (id: string) => {
    await apiFetch(`${endpoint}/${id}`, { method: 'DELETE' })
    await fetch()
  }, [endpoint, fetch])

  return {
    data,
    isLoading,
    error,
    refetch: fetch,
    create,
    update,
    remove,
    setData,
  }
}

export function useSingleResource<T = any>(endpoint: string, id?: string) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(!!id)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!id) return
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiFetch(`${endpoint}/${id}`)
      
      if (response.success && response.data) {
        const key = Object.keys(response.data).find(k => typeof response.data[k] === 'object')
        setData(key ? response.data[key] : response.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }, [endpoint, id])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, isLoading, error, refetch: fetch }
}

