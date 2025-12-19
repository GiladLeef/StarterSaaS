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
import { dashboardNav, dashboardConfig, formatUserForSidebar, getDashboardStats } from "@/lib/data/dashboard-config"

export default function UserDashboard() {
  const router = useRouter()
  const { user } = useAuth()

  // Fetch active users count (mock data for now, or implement real fetch if endpoint exists)
  // For this cleanup, we'll pass static or user-derived values that match the new signature
  // getDashboardStats(users: number, activeUsers: number)
  const stats = getDashboardStats(1, 1)

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
      redirectAdmins={true}
    >
      <DashboardStats stats={stats} />
      <UserQuickActions />
    </DashboardPage>
  )
}
