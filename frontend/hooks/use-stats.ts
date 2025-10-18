"use client"

import { useMemo } from "react"

export function useStatusCounts<T extends { status?: string }>(items: T[]) {
  return useMemo(() => ({
    active: items.filter(item => item.status?.toLowerCase() === 'active').length,
    completed: items.filter(item => item.status?.toLowerCase() === 'completed').length,
    inProgress: items.filter(item => item.status?.toLowerCase() === 'in-progress').length,
    pending: items.filter(item => item.status?.toLowerCase() === 'pending').length,
    total: items.length,
  }), [items])
}

export function useGroupByField<T extends Record<string, any>>(
  items: T[],
  fieldName: string,
  reference?: any[]
) {
  return useMemo(() => {
    const grouped = items.reduce((acc: Record<string, T[]>, item) => {
      const key = item[fieldName] || 'unassigned'
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    }, {})

    return Object.entries(grouped).map(([key, values]) => {
      const refItem = reference?.find((r: any) => r.id === key)
      return {
        id: key,
        name: refItem?.name || 'Unassigned',
        count: values.length,
        items: values,
        percentage: (values.length / items.length) * 100,
      }
    })
  }, [items, fieldName, reference])
}

export function useAggregateStats<T extends Record<string, any>>(
  items: T[],
  config: {
    totalKey: string
    filters?: Array<{
      key: string
      label: string
      condition: (item: T) => boolean
    }>
  }
) {
  return useMemo(() => {
    const stats: Record<string, number> = {
      [config.totalKey]: items.length,
    }

    config.filters?.forEach(filter => {
      stats[filter.key] = items.filter(filter.condition).length
    })

    return stats
  }, [items, config])
}

