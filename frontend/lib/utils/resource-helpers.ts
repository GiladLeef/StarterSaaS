// Generic helpers for resource pages

export interface StatusCounts {
  active: number
  completed: number
  inProgress: number
  [key: string]: number
}

export function calculateStatusCounts<T extends { status?: string }>(items: T[]): StatusCounts {
  return items.reduce((acc, item) => {
    const status = item.status || 'inactive'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {
    active: 0,
    completed: 0,
    inProgress: 0
  } as StatusCounts)
}

export interface OrgGroup {
  id: string
  name: string
  count: number
  percentage: number
}

export function groupByOrganization<T extends { organizationId: string }>(
  items: T[],
  organizations: Array<{ id: string; name: string }>
): OrgGroup[] {
  const total = items.length
  const grouped = organizations.map(org => {
    const count = items.filter(item => item.organizationId === org.id).length
    return {
      id: org.id,
      name: org.name,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }
  })
  return grouped.sort((a, b) => b.count - a.count)
}

export function formatCount(count: number, singular: string, plural?: string): string {
  return `${count} ${count === 1 ? singular : (plural || `${singular}s`)}`
}

