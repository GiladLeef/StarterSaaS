"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/providers/auth"
import { UserDashboardLayout } from "@/components/dashboard/user"
import { PageHeader } from "@/components/common/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlanGrid } from "@/components/billing/plan-card"
import { billingPlans } from "@/lib/data/settings-sections"
import { IconCreditCard, IconReceipt, IconDownload } from "@tabler/icons-react"
import { redirectToCheckout, getSubscriptionStatus } from "@/lib/stripe/stripe-client"
import { useResourceList } from "@/app/hooks/resources"
import { organizationsApi } from "@/app/api/fetcher"

export default function BillingPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [currentPlan, setCurrentPlan] = useState('free')
  const [error, setError] = useState('')
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly')

  // Get user's organizations
  const { items: organizations } = useResourceList<{ id: string; name: string }>(organizationsApi, 'organizations')
  const defaultOrganization = organizations[0]

  // Fetch current subscription status
  useEffect(() => {
    if (defaultOrganization?.id) {
      getSubscriptionStatus(defaultOrganization.id)
        .then((status) => {
          setCurrentPlan(status.plan || 'free')
        })
        .catch((err) => {
          console.error('Failed to fetch subscription:', err)
        })
    }
  }, [defaultOrganization])

  // Mark current plan
  const plansWithCurrent = billingPlans.map(plan => ({
    ...plan,
    current: plan.id === currentPlan
  }))

  const handleSelectPlan = async (planId: string) => {
    if (!defaultOrganization) {
      setError('Please create an organization first')
      return
    }

    if (planId === 'free') {
      setError('Please cancel your current subscription to downgrade to free')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await redirectToCheckout({
        planName: planId,
        billingInterval,
        organizationId: defaultOrganization.id
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout')
      setIsLoading(false)
    }
  }

  return (
    <UserDashboardLayout user={user} title="Billing">
      <div className="px-4 lg:px-6">
        <div className="space-y-6">
          <PageHeader
            title="Billing & Subscription"
            description="Manage your subscription, billing, and invoices"
          />

          {/* Current Subscription Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCreditCard className="w-5 h-5" />
                Current Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold capitalize">{currentPlan} Plan</p>
                    <Badge variant={currentPlan === 'free' ? 'outline' : 'default'}>
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentPlan === 'free' 
                      ? 'Free forever'
                      : `Next billing date: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}`
                    }
                  </p>
                </div>
                {currentPlan !== 'free' && (
                  <Button variant="outline">
                    Manage Subscription
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Plans */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
            <PlanGrid 
              plans={plansWithCurrent}
              onSelectPlan={handleSelectPlan}
              isLoading={isLoading}
            />
          </div>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Manage your payment methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentPlan === 'free' ? (
                <p className="text-sm text-muted-foreground">
                  No payment method required for the free plan
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <IconCreditCard className="w-5 h-5" />
                      <div>
                        <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                        <p className="text-xs text-muted-foreground">Expires 12/2025</p>
                      </div>
                    </div>
                    <Badge>Default</Badge>
                  </div>
                  <Button variant="outline">
                    Update Payment Method
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconReceipt className="w-5 h-5" />
                Billing History
              </CardTitle>
              <CardDescription>
                View and download your invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentPlan === 'free' ? (
                <p className="text-sm text-muted-foreground">
                  No billing history available
                </p>
              ) : (
                <div className="space-y-3">
                  {[
                    { date: '2025-10-01', amount: 29, status: 'Paid' },
                    { date: '2025-09-01', amount: 29, status: 'Paid' },
                    { date: '2025-08-01', amount: 29, status: 'Paid' },
                  ].map((invoice, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{invoice.date}</p>
                        <p className="text-xs text-muted-foreground">${invoice.amount}.00</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{invoice.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <IconDownload className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </UserDashboardLayout>
  )
}

