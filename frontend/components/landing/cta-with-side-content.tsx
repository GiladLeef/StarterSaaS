import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface Badge {
  label: string
  color: string
}

interface SideContentItem {
  title: string
  description?: string
  badges?: Badge[]
  prefix?: string
  suffix?: string
  action?: {
    label: string
    href: string
  }
}

interface CTAWithSideContentProps {
  title: string
  primaryAction: {
    label: string
    href: string
  }
  sideContent: SideContentItem[]
  variant?: 'light' | 'dark'
  className?: string
}

export function CTAWithSideContent({
  title,
  primaryAction,
  sideContent,
  variant = 'dark',
  className = ''
}: CTAWithSideContentProps) {
  const isDark = variant === 'dark'
  
  return (
    <section className={cn(
      'w-full px-6 py-32',
      isDark ? 'bg-black text-white' : 'bg-white text-black',
      className
    )}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Main CTA */}
          <div>
            <h2 className={cn(
              'text-5xl md:text-6xl font-serif mb-8 leading-tight',
              isDark ? 'text-white' : 'text-black'
            )}>
              {title}
            </h2>
            <Button 
              size="lg" 
              className={cn(
                'rounded px-8 h-14 text-base',
                isDark 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-black text-white hover:bg-gray-800'
              )}
              asChild
            >
              <a href={primaryAction.href}>
                {primaryAction.label}
                <IconArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
          </div>

          {/* Right: Info boxes */}
          <div className="space-y-8">
            {sideContent.map((item, idx) => (
              <div 
                key={idx}
                className={cn(
                  idx > 0 && 'border-t pt-8',
                  isDark ? 'border-white/10' : 'border-gray-200'
                )}
              >
                <h3 className={cn(
                  'font-serif mb-4',
                  idx === 0 ? 'text-2xl' : 'text-xl font-semibold'
                )}>
                  {item.title}
                </h3>
                
                {item.badges && (
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {item.prefix && (
                      <span className={cn(
                        'text-sm',
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        {item.prefix}
                      </span>
                    )}
                    {item.badges.map((badge, badgeIdx) => (
                      <span 
                        key={badgeIdx}
                        className={cn(
                          'px-3 py-1 text-white text-xs font-semibold rounded',
                          badge.color
                        )}
                      >
                        {badge.label}
                      </span>
                    ))}
                    {item.suffix && (
                      <span className={cn(
                        'text-sm',
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        {item.suffix}
                      </span>
                    )}
                  </div>
                )}
                
                {item.description && (
                  <p className={cn(
                    'mb-4',
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {item.description}
                  </p>
                )}
                
                {item.action && (
                  <Button 
                    variant="outline" 
                    className={cn(
                      'rounded',
                      isDark 
                        ? 'border-white/20 text-white hover:bg-white/10' 
                        : 'border-gray-300 hover:bg-gray-50'
                    )}
                    asChild
                  >
                    <a href={item.action.href}>
                      {item.action.label}
                      <IconArrowRight className="ml-2 w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

