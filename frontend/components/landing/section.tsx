import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  children: ReactNode
  variant?: 'light' | 'dark'
  className?: string
  containerClassName?: string
}

export function Section({ 
  children, 
  variant = 'light',
  className = '',
  containerClassName = ''
}: SectionProps) {
  const bgClass = variant === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
  
  return (
    <section className={cn('w-full px-6 py-24', bgClass, className)}>
      <div className={cn('max-w-7xl mx-auto', containerClassName)}>
        {children}
      </div>
    </section>
  )
}

interface SectionHeaderProps {
  title: string
  subtitle?: string
  badge?: {
    icon?: ReactNode
    text: string
    variant?: 'light' | 'dark' | 'color'
    className?: string
  }
  centered?: boolean
  className?: string
}

export function SectionHeader({ 
  title, 
  subtitle, 
  badge,
  centered = false,
  className = ''
}: SectionHeaderProps) {
  return (
    <div className={cn(
      'mb-16',
      centered && 'text-center',
      className
    )}>
      {badge && (
        <div className={cn('mb-6', centered && 'flex justify-center')}>
          <div className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full border',
            badge.className
          )}>
            {badge.icon}
            <span className="text-sm font-medium">{badge.text}</span>
          </div>
        </div>
      )}
      <h2 className="text-4xl md:text-5xl font-serif mb-6">
        {title}
      </h2>
      {subtitle && (
        <p className={cn(
          'text-xl text-gray-600 dark:text-gray-400',
          centered && 'max-w-2xl mx-auto'
        )}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

