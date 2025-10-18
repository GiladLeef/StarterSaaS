import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IconCheck } from '@tabler/icons-react'
import { BillingPlan } from '@/lib/data/settings-sections'
import { cn } from '@/lib/utils'

interface PlanCardProps {
  plan: BillingPlan
  onSelect?: (planId: string) => void
  isLoading?: boolean
}

export function PlanCard({ plan, onSelect, isLoading }: PlanCardProps) {
  const isCurrent = plan.current
  const isPopular = plan.popular

  return (
    <Card className={cn(
      'relative',
      isPopular && 'border-primary shadow-lg',
      isCurrent && 'border-green-500'
    )}>
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
          Most Popular
        </Badge>
      )}
      {isCurrent && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
          Current Plan
        </Badge>
      )}

      <CardHeader className="text-center pb-8 pt-8">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">${plan.price}</span>
          <span className="text-muted-foreground">/{plan.interval}</span>
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <IconCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrent ? "outline" : isPopular ? "default" : "outline"}
          onClick={() => onSelect?.(plan.id)}
          disabled={isCurrent || isLoading}
        >
          {isCurrent ? "Current Plan" : isLoading ? "Processing..." : "Select Plan"}
        </Button>
      </CardFooter>
    </Card>
  )
}

interface PlanGridProps {
  plans: BillingPlan[]
  onSelectPlan?: (planId: string) => void
  isLoading?: boolean
}

export function PlanGrid({ plans, onSelectPlan, isLoading }: PlanGridProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onSelect={onSelectPlan}
          isLoading={isLoading}
        />
      ))}
    </div>
  )
}

