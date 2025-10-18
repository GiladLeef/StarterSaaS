"use client"

import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { cn } from '@/lib/utils'

interface ScrollSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function ScrollSection({ children, className, delay = 0 }: ScrollSectionProps) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-1000 ease-out",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-10",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

