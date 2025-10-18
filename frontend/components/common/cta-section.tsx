import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface CTAAction {
  label: string
  href: string
  variant?: 'default' | 'outline'
  icon?: boolean
}

interface CTASectionProps {
  title: string
  subtitle?: string
  description?: string
  actions: CTAAction[]
  variant?: 'light' | 'dark'
  sideContent?: ReactNode
  className?: string
}

export function CTASection({
  title,
  subtitle,
  description,
  actions,
  variant = 'dark',
  sideContent,
  className = ''
}: CTASectionProps) {
  const isDark = variant === 'dark'
  
  return (
    <section className={cn(
      'w-full px-6 py-32',
      isDark ? 'bg-black text-white' : 'bg-white text-black',
      className
    )}>
      <div className="max-w-7xl mx-auto">
        <div className={cn(
          'grid gap-16 items-center',
          sideContent ? 'lg:grid-cols-2' : 'justify-center text-center'
        )}>
          <div className={cn(!sideContent && 'max-w-3xl mx-auto')}>
            {subtitle && (
              <p className={cn(
                'text-sm font-medium uppercase tracking-wider mb-4',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {subtitle}
              </p>
            )}
            <h2 className={cn(
              'text-5xl md:text-6xl font-serif mb-8 leading-tight',
              isDark ? 'text-white' : 'text-black'
            )}>
              {title}
            </h2>
            {description && (
              <p className={cn(
                'text-xl mb-8',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                {description}
              </p>
            )}
            <div className={cn(
              'flex flex-wrap gap-4',
              !sideContent && 'justify-center'
            )}>
              {actions.map((action, idx) => (
                <Button
                  key={idx}
                  size="lg"
                  variant={action.variant || 'default'}
                  className={cn(
                    'rounded-full px-8 h-14 text-base',
                    action.variant === 'outline' && isDark
                      ? 'border-white/20 text-white hover:bg-white/10'
                      : action.variant === 'outline'
                      ? 'border-gray-300'
                      : isDark
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-black text-white hover:bg-gray-800'
                  )}
                  asChild
                >
                  <a href={action.href}>
                    {action.label}
                    {action.icon !== false && <IconArrowRight className="ml-2 w-5 h-5" />}
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {sideContent && (
            <div>
              {sideContent}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

