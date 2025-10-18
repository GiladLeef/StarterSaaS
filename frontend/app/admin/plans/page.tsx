"use client"

import React, { useState, useEffect } from "react"
import { AdminDashboardLayout } from "@/components/dashboard/admin"
import { useAdminData } from "@/hooks/use-admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { IconPlus, IconEdit, IconTrash, IconCheck, IconX } from "@tabler/icons-react"
import { apiFetch } from "@/app/api/fetcher"

interface Plan {
  id: string
  name: string
  displayName: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  stripePriceIdMonthly?: string
  stripePriceIdYearly?: string
  maxOrganizations: number
  maxProjects: number
  maxMembers: number
  hasPrioritySupport: boolean
  hasAdvancedFeatures: boolean
  hasCustomIntegrations: boolean
  isActive: boolean
  sortOrder: number
}

export default function PlansManagementPage() {
  const { user, resourcesArray, isLoading } = useAdminData()
  const [plans, setPlans] = useState<Plan[]>([])
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<Partial<Plan>>({})

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const response = await apiFetch('/api/v1/plans')
      if (response.success && response.data) {
        setPlans(response.data)
      }
    } catch (error) {
      console.error('Failed to load plans:', error)
    }
  }

  const handleCreate = () => {
    setIsCreating(true)
    setFormData({
      name: '',
      displayName: '',
      description: '',
      monthlyPrice: 0,
      yearlyPrice: 0,
      maxOrganizations: -1,
      maxProjects: -1,
      maxMembers: -1,
      hasPrioritySupport: false,
      hasAdvancedFeatures: false,
      hasCustomIntegrations: false,
      isActive: true,
      sortOrder: plans.length + 1,
    })
  }

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setFormData(plan)
  }

  const handleSave = async () => {
    try {
      if (isCreating) {
        const response = await apiFetch('/api/v1/plans', {
          method: 'POST',
          body: JSON.stringify(formData),
        })
        if (response.success) {
          await loadPlans()
          setIsCreating(false)
          setFormData({})
        }
      } else if (editingPlan) {
        const response = await apiFetch(`/api/v1/plans/${editingPlan.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        })
        if (response.success) {
          await loadPlans()
          setEditingPlan(null)
          setFormData({})
        }
      }
    } catch (error) {
      console.error('Failed to save plan:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return
    
    try {
      const response = await apiFetch(`/api/v1/plans/${id}`, {
        method: 'DELETE',
      })
      if (response.success) {
        await loadPlans()
      }
    } catch (error) {
      console.error('Failed to delete plan:', error)
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingPlan(null)
    setFormData({})
  }

  if (isLoading) {
    return (
      <AdminDashboardLayout user={user} resources={resourcesArray} title="Subscription Plans">
        <div className="flex items-center justify-center p-8">
          <p>Loading plans...</p>
        </div>
      </AdminDashboardLayout>
    )
  }

  return (
    <AdminDashboardLayout 
      user={user} 
      resources={resourcesArray} 
      title="Subscription Plans"
      action={
        !isCreating && !editingPlan && (
          <Button onClick={handleCreate}>
            <IconPlus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        )
      }
    >
      <div className="p-6 space-y-6">
        {(isCreating || editingPlan) && (
          <Card>
            <CardHeader>
              <CardTitle>{isCreating ? 'Create New Plan' : 'Edit Plan'}</CardTitle>
              <CardDescription>
                Configure subscription plan details and pricing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Name (Slug)</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isCreating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName || ''}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyPrice">Monthly Price ($)</Label>
                  <Input
                    id="monthlyPrice"
                    type="number"
                    value={formData.monthlyPrice || 0}
                    onChange={(e) => setFormData({ ...formData, monthlyPrice: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearlyPrice">Yearly Price ($)</Label>
                  <Input
                    id="yearlyPrice"
                    type="number"
                    value={formData.yearlyPrice || 0}
                    onChange={(e) => setFormData({ ...formData, yearlyPrice: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stripePriceIdMonthly">Stripe Price ID (Monthly)</Label>
                  <Input
                    id="stripePriceIdMonthly"
                    value={formData.stripePriceIdMonthly || ''}
                    onChange={(e) => setFormData({ ...formData, stripePriceIdMonthly: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripePriceIdYearly">Stripe Price ID (Yearly)</Label>
                  <Input
                    id="stripePriceIdYearly"
                    value={formData.stripePriceIdYearly || ''}
                    onChange={(e) => setFormData({ ...formData, stripePriceIdYearly: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxOrganizations">Max Organizations</Label>
                  <Input
                    id="maxOrganizations"
                    type="number"
                    value={formData.maxOrganizations || -1}
                    onChange={(e) => setFormData({ ...formData, maxOrganizations: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">-1 for unlimited</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxProjects">Max Projects</Label>
                  <Input
                    id="maxProjects"
                    type="number"
                    value={formData.maxProjects || -1}
                    onChange={(e) => setFormData({ ...formData, maxProjects: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">-1 for unlimited</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxMembers">Max Members</Label>
                  <Input
                    id="maxMembers"
                    type="number"
                    value={formData.maxMembers || -1}
                    onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">-1 for unlimited</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasPrioritySupport"
                    checked={formData.hasPrioritySupport || false}
                    onChange={(e) => setFormData({ ...formData, hasPrioritySupport: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="hasPrioritySupport">Priority Support</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasAdvancedFeatures"
                    checked={formData.hasAdvancedFeatures || false}
                    onChange={(e) => setFormData({ ...formData, hasAdvancedFeatures: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="hasAdvancedFeatures">Advanced Features</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasCustomIntegrations"
                    checked={formData.hasCustomIntegrations || false}
                    onChange={(e) => setFormData({ ...formData, hasCustomIntegrations: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="hasCustomIntegrations">Custom Integrations</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  <IconCheck className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <IconX className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={!plan.isActive ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{plan.displayName}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </div>
                  {plan.isActive ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-bold">${plan.monthlyPrice}</p>
                  <p className="text-sm text-muted-foreground">per month</p>
                  <p className="text-sm text-muted-foreground">${plan.yearlyPrice}/year</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Organizations:</span>
                    <strong>{plan.maxOrganizations === -1 ? 'Unlimited' : plan.maxOrganizations}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Projects:</span>
                    <strong>{plan.maxProjects === -1 ? 'Unlimited' : plan.maxProjects}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Members:</span>
                    <strong>{plan.maxMembers === -1 ? 'Unlimited' : plan.maxMembers}</strong>
                  </div>
                </div>

                <div className="space-y-1">
                  {plan.hasPrioritySupport && (
                    <div className="flex items-center gap-2 text-sm">
                      <IconCheck className="w-4 h-4 text-green-600" />
                      <span>Priority Support</span>
                    </div>
                  )}
                  {plan.hasAdvancedFeatures && (
                    <div className="flex items-center gap-2 text-sm">
                      <IconCheck className="w-4 h-4 text-green-600" />
                      <span>Advanced Features</span>
                    </div>
                  )}
                  {plan.hasCustomIntegrations && (
                    <div className="flex items-center gap-2 text-sm">
                      <IconCheck className="w-4 h-4 text-green-600" />
                      <span>Custom Integrations</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(plan)}
                    className="flex-1"
                  >
                    <IconEdit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(plan.id)}
                  >
                    <IconTrash className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminDashboardLayout>
  )
}

