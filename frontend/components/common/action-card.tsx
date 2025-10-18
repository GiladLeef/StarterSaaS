import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Action {
  label: string
  href?: string
  onClick?: () => void
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link'
}

interface ActionCardProps {
  title: string
  description?: string
  icon?: ReactNode
  actions: Action[]
  className?: string
}

export function ActionCard({ 
  title, 
  description, 
  icon, 
  actions,
  className = '' 
}: ActionCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        {icon && <div className="mb-2">{icon}</div>}
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardFooter className="flex flex-wrap gap-2">
        {actions.map((action, idx) => (
          action.href ? (
            <Button 
              key={idx} 
              variant={action.variant || 'default'} 
              asChild
            >
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button
              key={idx}
              variant={action.variant || 'default'}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )
        ))}
      </CardFooter>
    </Card>
  )
}

interface ActionCardsGridProps {
  cards: Array<{
    title: string
    description?: string
    icon?: ReactNode
    actions: Action[]
  }>
  columns?: 2 | 3 | 4
}

export function ActionCardsGrid({ cards, columns = 3 }: ActionCardsGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={`grid gap-6 ${gridCols[columns]}`}>
      {cards.map((card, idx) => (
        <ActionCard
          key={idx}
          title={card.title}
          description={card.description}
          icon={card.icon}
          actions={card.actions}
        />
      ))}
    </div>
  )
}

