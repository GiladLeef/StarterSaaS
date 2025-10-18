"use client"

import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingPage } from '@/app/components/ui/loading'

interface ResourcePageWrapperProps<T = any> {
  // Header props
  title: string
  description: string
  
  // Data props
  items: T[]
  isLoading: boolean
  error?: string | null
  
  // Dialog/Create props
  createDialog?: ReactNode
  
  // Empty state props
  emptyTitle?: string
  emptyDescription?: string
  onCreateFirst?: () => void
  
  // Content
  children: ReactNode
  
  // Additional stats/info sections
  statsSection?: ReactNode
}

export function ResourcePageWrapper<T = any>({
  title,
  description,
  items,
  isLoading,
  error,
  createDialog,
  emptyTitle = `No ${title} Yet`,
  emptyDescription = `Create your first ${title.toLowerCase()} to get started.`,
  onCreateFirst,
  children,
  statsSection
}: ResourcePageWrapperProps<T>) {
  if (isLoading) {
    return <LoadingPage message={`Loading ${title.toLowerCase()}...`} />
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="flex flex-col gap-6">
        {error && (
          <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>

          {createDialog}
        </div>

        {items.length > 0 ? (
          <>
            {children}
            {statsSection}
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{emptyTitle}</CardTitle>
              <CardDescription>{emptyDescription}</CardDescription>
            </CardHeader>
            {onCreateFirst && (
              <CardContent className="flex justify-center">
                <Button onClick={onCreateFirst}>
                  {`Create Your First ${title.slice(0, -1)}`}
                </Button>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}

