import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"

interface QuickActionCardProps {
  title: string
  description: string
  icon: ReactNode
  href: string
}

export function QuickActionCard({ title, description, icon, href }: QuickActionCardProps) {
  return (
    <Link href={href}>
      <Card className="group transition-colors hover:bg-muted/50 cursor-pointer">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              {icon}
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription className="text-sm">
                {description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}

interface QuickActionGridProps {
  actions: Array<{
    title: string
    description: string
    icon: ReactNode
    href: string
  }>
  title?: string
  description?: string
}

export function QuickActionGrid({ actions, title, description }: QuickActionGridProps) {
  return (
    <div className="px-4 lg:px-6">
      <Card>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <div className="p-6 pt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {actions.map((action, idx) => (
              <QuickActionCard
                key={idx}
                title={action.title}
                description={action.description}
                icon={action.icon}
                href={action.href}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

