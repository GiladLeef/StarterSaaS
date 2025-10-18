"use client"

import { useState, useEffect } from "react"
import { apiFetch } from "@/app/api/fetcher"

interface UseAdminDataResult {
  user: any
  resources: Record<string, any>
  resourcesArray: Array<{ key: string; [key: string]: any }>
  isLoading: boolean
  error: string | null
}

export function useAdminData(): UseAdminDataResult {
  const [user, setUser] = useState<any>(null)
  const [resources, setResources] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [resourcesResponse, userResponse] = await Promise.all([
          apiFetch('/api/v1/admin/resources'),
          apiFetch('/api/v1/users/me'),
        ])

        if (resourcesResponse.success && resourcesResponse.data.resources) {
          setResources(resourcesResponse.data.resources)
        }
        if (userResponse.success && userResponse.data.user) {
          setUser(userResponse.data.user)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const resourcesArray = Object.entries(resources || {}).map(([key, value]) => ({ 
    key, 
    ...(typeof value === 'object' && value !== null ? value : {}) 
  }))

  return { user, resources, resourcesArray, isLoading, error }
}

interface UseAdminResourceResult<T = any> {
  data: T[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateItem: (id: string, updates: any) => Promise<void>
  deleteItem: (id: string) => Promise<void>
}

export function useAdminResource<T = any>(resourceName: string): UseAdminResourceResult<T> {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiFetch(`/api/v1/admin/resources/${resourceName}`)
      
      if (response.success && response.data) {
        const resourceKey = resourceName + 's'
        const items = response.data[resourceKey] || []
        setData(Array.isArray(items) ? items : [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [resourceName])

  const updateItem = async (id: string, updates: any) => {
    await apiFetch(`/api/v1/admin/resources/${resourceName}/${id}`, {
      method: 'PUT',
      body: updates,
    })
    await fetchData()
  }

  const deleteItem = async (id: string) => {
    await apiFetch(`/api/v1/admin/resources/${resourceName}/${id}`, {
      method: 'DELETE',
    })
    await fetchData()
  }

  return { data, isLoading, error, refetch: fetchData, updateItem, deleteItem }
}

