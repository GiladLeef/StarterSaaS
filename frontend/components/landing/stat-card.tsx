import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  value: string | number
  label: string
  icon?: ReactNode
  variant?: 'default' | 'large' | 'bordered'
  className?: string
}

export function StatCard({ 
  value, 
  label, 
  icon,
  variant = 'default',
  className = ''
}: StatCardProps) {
  if (variant === 'large') {
    return (
      <div className={cn(
        'border border-gray-200 dark:border-white/10 rounded-2xl p-8 hover:border-gray-300 dark:hover:border-white/20 transition-colors',
        className
      )}>
        {icon && <div className="mb-4 text-black dark:text-white">{icon}</div>}
        <div className="text-3xl font-serif mb-2 text-black dark:text-white">{value}</div>
        <p className="text-gray-600 dark:text-gray-400">{label}</p>
      </div>
    )
  }

  return (
    <div className={cn('text-center', className)}>
      {icon && <div className="mb-2 flex justify-center">{icon}</div>}
      <div className="text-5xl font-serif mb-2">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</div>
    </div>
  )
}

interface StatGridProps {
  stats: Array<{
    value: string | number
    label: string
    icon?: ReactNode
  }>
  columns?: 2 | 3 | 4
  variant?: 'default' | 'large' | 'bordered'
}

export function StatGrid({ 
  stats, 
  columns = 4,
  variant = 'default' 
}: StatGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4'
  }

  return (
    <div className={cn(
      'grid gap-6',
      variant === 'large' ? 'md:grid-cols-2' : gridCols[columns]
    )}>
      {stats.map((stat, idx) => (
        <StatCard
          key={idx}
          value={stat.value}
          label={stat.label}
          icon={stat.icon}
          variant={variant}
        />
      ))}
    </div>
  )
}

