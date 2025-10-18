import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ResourceCardsProps {
  data: any[]
  title?: string
  description?: string
  titleKey?: string
  descriptionKey?: string
  getHref?: (item: any) => string
  actions?: Array<{
    label: string
    href?: (item: any) => string
    onClick?: (item: any) => void
    variant?: "default" | "outline" | "destructive"
  }>
  emptyMessage?: string
  emptyAction?: () => void
  emptyActionLabel?: string
}

export function ResourceCards({
  data,
  title,
  description,
  titleKey = 'name',
  descriptionKey = 'description',
  getHref,
  actions = [],
  emptyMessage = "No items found",
  emptyAction,
  emptyActionLabel = "Create New",
}: ResourceCardsProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{emptyMessage}</CardTitle>
          <CardDescription>Get started by creating your first item.</CardDescription>
        </CardHeader>
        {emptyAction && (
          <CardContent className="flex justify-center">
            <Button onClick={emptyAction}>{emptyActionLabel}</Button>
          </CardContent>
        )}
      </Card>
    )
  }

  return (
    <>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => {
          const CardWrapper = getHref ? ({ children }: any) => <Link href={getHref(item)}>{children}</Link> : ({ children }: any) => <>{children}</>
          
          return (
            <CardWrapper key={item.id}>
              <Card className={getHref ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}>
                <CardHeader>
                  <CardTitle>{item[titleKey]}</CardTitle>
                  {item[descriptionKey] && (
                    <CardDescription>{item[descriptionKey]}</CardDescription>
                  )}
                </CardHeader>
                {Object.keys(item).filter(k => k !== 'id' && k !== titleKey && k !== descriptionKey && k !== 'createdAt' && k !== 'updatedAt' && k !== 'deletedAt').length > 0 && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {item[descriptionKey] || "No description provided."}
                    </p>
                  </CardContent>
                )}
                {actions.length > 0 && (
                  <CardFooter className="flex justify-between gap-2">
                    {actions.map((action, idx) => (
                      action.href ? (
                        <Button key={idx} variant={action.variant || "outline"} size="sm" asChild>
                          <Link href={action.href(item)}>{action.label}</Link>
                        </Button>
                      ) : (
                        <Button 
                          key={idx} 
                          variant={action.variant || "outline"} 
                          size="sm"
                          onClick={() => action.onClick?.(item)}
                        >
                          {action.label}
                        </Button>
                      )
                    ))}
                  </CardFooter>
                )}
              </Card>
            </CardWrapper>
          )
        })}
      </div>
    </>
  )
}

