import { ReactNode } from 'react'
import { LoadingState, ErrorState } from '@/app/components/ui/state'
import { PageHeader } from './page-header'

interface ResourceDetailLayoutProps {
  isLoading: boolean
  error: string
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  emptyMessage?: string
  isEmpty?: boolean
}

/**
 * DRY layout component for resource detail pages
 * Handles loading, error, and empty states consistently
 */
export function ResourceDetailLayout({
  isLoading,
  error,
  title,
  description,
  action,
  children,
  emptyMessage,
  isEmpty = false
}: ResourceDetailLayoutProps) {
  if (isLoading) {
    return <LoadingState message={`Loading ${title.toLowerCase()}...`} />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  if (isEmpty && emptyMessage) {
    return <ErrorState message={emptyMessage} />
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title={title}
        description={description}
        action={action}
      />
      {children}
    </div>
  )
}

