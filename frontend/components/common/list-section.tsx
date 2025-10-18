import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ListItem {
  id: string
  primary: string
  secondary?: string
  badge?: ReactNode
  actions?: Array<{
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost'
  }>
}

interface ListSectionProps {
  title: string
  description?: string
  items: ListItem[]
  emptyMessage?: string
  emptyAction?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function ListSection({
  title,
  description,
  items,
  emptyMessage = 'No items found',
  emptyAction,
  className = ''
}: ListSectionProps) {
  if (items.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            {emptyMessage}
          </p>
        </CardContent>
        {emptyAction && (
          <CardFooter className="justify-center">
            <Button onClick={emptyAction.onClick}>
              {emptyAction.label}
            </Button>
          </CardFooter>
        )}
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{item.primary}</h3>
                  {item.badge}
                </div>
                {item.secondary && (
                  <p className="text-sm text-muted-foreground">
                    {item.secondary}
                  </p>
                )}
              </div>
              {item.actions && item.actions.length > 0 && (
                <div className="flex gap-2">
                  {item.actions.map((action, idx) => (
                    <Button
                      key={idx}
                      variant={action.variant || 'outline'}
                      size="sm"
                      onClick={action.onClick}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

