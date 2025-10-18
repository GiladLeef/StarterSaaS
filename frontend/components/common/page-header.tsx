import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function PageHeader({ 
  title, 
  description, 
  action,
  className = '' 
}: PageHeaderProps) {
  return (
    <div className={cn(
      'flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-4 lg:px-6',
      className
    )}>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

