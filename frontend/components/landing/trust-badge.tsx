import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TrustBadgeProps {
  icon: ReactNode
  text: string
  className?: string
}

export function TrustBadge({ icon, text, className = '' }: TrustBadgeProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {icon}
      <span>{text}</span>
    </div>
  )
}

interface TrustBadgesProps {
  badges: Array<{
    icon: ReactNode
    text: string
  }>
  className?: string
}

export function TrustBadges({ badges, className = '' }: TrustBadgesProps) {
  return (
    <div className={cn('flex items-center gap-8 text-sm text-gray-500', className)}>
      {badges.map((badge, idx) => (
        <TrustBadge key={idx} icon={badge.icon} text={badge.text} />
      ))}
    </div>
  )
}

