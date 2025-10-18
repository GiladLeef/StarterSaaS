import { IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface StatCard {
  title: string
  value: number
  description: string
  badge: string
  footer: string
  footerDescription?: string
}

interface DashboardStatsProps {
  stats: StatCard[]
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription>{stat.title}</CardDescription>
            <CardTitle className="text-3xl font-serif font-semibold tabular-nums @[250px]/card:text-4xl">
              {stat.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                {stat.badge}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {stat.footer} <IconTrendingUp className="size-4" />
            </div>
            {stat.footerDescription && (
              <div className="text-muted-foreground">{stat.footerDescription}</div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

