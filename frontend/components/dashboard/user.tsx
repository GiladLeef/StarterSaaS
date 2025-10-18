"use client"

import React from "react"
import { DashboardLayout } from "./layout"
import { DashboardSidebar } from "./sidebar"
import { DashboardHeader } from "./header"
import { dashboardNav, dashboardConfig, formatUserForSidebar } from "@/lib/data/dashboard-config"

interface UserDashboardLayoutProps {
  user: any
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}

export function UserDashboardLayout({ user, title, action, children }: UserDashboardLayoutProps) {
  return (
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
      header={<DashboardHeader title={title} action={action} />}
    >
      {children}
    </DashboardLayout>
  )
}

