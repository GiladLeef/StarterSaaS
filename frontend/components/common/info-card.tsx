import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface InfoItem {
  label: string
  value: string | number
  icon?: ReactNode
}

interface InfoCardProps {
  title: string
  description?: string
  items: InfoItem[]
  className?: string
}

export function InfoCard({ 
  title, 
  description, 
  items,
  className = '' 
}: InfoCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <span className="text-sm text-muted-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface InfoCardsGridProps {
  cards: Array<{
    title: string
    description?: string
    items: InfoItem[]
  }>
  columns?: 2 | 3
}

export function InfoCardsGrid({ cards, columns = 2 }: InfoCardsGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3'
  }

  return (
    <div className={cn('grid gap-6', gridCols[columns])}>
      {cards.map((card, idx) => (
        <InfoCard
          key={idx}
          title={card.title}
          description={card.description}
          items={card.items}
        />
      ))}
    </div>
  )
}

