import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  color?: string
  variant?: 'default' | 'border' | 'filled'
  className?: string
}

export function FeatureCard({ 
  icon, 
  title, 
  description, 
  color = 'blue',
  variant = 'border',
  className = ''
}: FeatureCardProps) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    cyan: 'bg-cyan-100 text-cyan-600',
    pink: 'bg-pink-100 text-pink-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  }

  return (
    <div className={cn(
      'rounded-2xl p-8 transition-all duration-300',
      variant === 'border' && 'border border-gray-200 hover:border-black/20 hover:shadow-lg',
      variant === 'filled' && 'bg-gray-50 hover:bg-gray-100',
      className
    )}>
      <div className={cn(
        'inline-flex p-3 rounded-xl mb-4',
        colorClasses[color] || colorClasses.blue
      )}>
        {icon}
      </div>
      <h3 className="text-xl font-serif mb-3 text-black">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

interface FeatureGridProps {
  features: Array<{
    icon: ReactNode
    title: string
    description: string
    color?: string
  }>
  columns?: 2 | 3 | 4
  variant?: 'default' | 'border' | 'filled'
}

export function FeatureGrid({ 
  features, 
  columns = 3,
  variant = 'border' 
}: FeatureGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={cn('grid gap-8', gridCols[columns])}>
      {features.map((feature, idx) => (
        <FeatureCard
          key={idx}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          color={feature.color}
          variant={variant}
        />
      ))}
    </div>
  )
}

