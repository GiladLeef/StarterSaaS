"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../providers/auth"
import { DashboardLayout } from "@/components/dashboard/layout"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardStats } from "@/components/dashboard/stats"
import { DashboardPage } from "@/components/dashboard/page"
import { UserQuickActions } from "@/components/user-quick-actions"
import { useResource } from "@/hooks/use-resource"
import { dashboardNav, dashboardConfig, formatUserForSidebar, getDashboardStats } from "@/lib/data/dashboard-config"

export default function UserDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  
  const { data: organizations, isLoading: orgsLoading, error: orgsError } = useResource({
    endpoint: '/api/v1/organizations',
    dataKey: 'organizations',
  })
  
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useResource({
    endpoint: '/api/v1/projects',
    dataKey: 'projects',
  })
  
  const { data: invitations, isLoading: invitationsLoading, error: invitationsError } = useResource({
    endpoint: '/api/v1/invitations',
    dataKey: 'invitations',
  })

  React.useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/admin')
    }
  }, [user, router])

  const stats = getDashboardStats(organizations, projects, invitations)

  return (
    <DashboardPage
      layout={(props) => (
        <DashboardLayout
          sidebar={
            <DashboardSidebar
              title={dashboardConfig.title}
              titleUrl={dashboardConfig.titleUrl}
              icon={dashboardConfig.icon}
              user={formatUserForSidebar(user)}
              navMain={dashboardNav.main}
              navSecondary={dashboardNav.secondary}
              variant={dashboardConfig.variant}
            />
          }
          header={<DashboardHeader title={props.title} />}
        >
          {props.children}
        </DashboardLayout>
      )}
      title="Dashboard"
      user={user}
      isLoading={orgsLoading || projectsLoading || invitationsLoading}
      error={orgsError || projectsError || invitationsError}
      redirectAdmins={true}
    >
      <DashboardStats stats={stats} />
      <UserQuickActions />
    </DashboardPage>
  )
}
