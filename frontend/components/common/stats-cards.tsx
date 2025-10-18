import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StatCard {
  title: string
  value: number | string
  description?: string
  badge?: string
  footer?: string
  footerDescription?: string
  icon?: React.ElementType
  trend?: {
    value: number
    isPositive: boolean
  }
}

interface StatsCardsProps {
  stats: StatCard[]
  columns?: 2 | 3 | 4
}

export function StatsCards({ stats, columns = 4 }: StatsCardsProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={`grid gap-4 ${gridCols[columns]}`}>
      {stats.map((stat, idx) => (
        <Card key={idx}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            {stat.badge && (
              <Badge variant="secondary" className="text-xs">
                {stat.badge}
              </Badge>
            )}
            {stat.icon && <stat.icon className="h-4 w-4 text-muted-foreground" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            )}
            {stat.trend && (
              <p className={`text-xs mt-1 ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend.isPositive ? '↑' : '↓'} {stat.trend.value}% from last month
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

