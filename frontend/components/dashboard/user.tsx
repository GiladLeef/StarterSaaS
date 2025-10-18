"use client"

import React from "react"
import { DashboardLayout } from "./layout"
import { DashboardSidebar } from "./sidebar"
import { DashboardHeader } from "./header"
import {
  IconDashboard,
  IconBuilding,
  IconFolder,
  IconUser,
  IconSettings,
  IconHelp,
  IconInnerShadowTop,
} from "@tabler/icons-react"

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
          title="Platform"
          titleUrl="/dashboard"
          icon={<IconInnerShadowTop className="!size-5" />}
          user={{
            name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "User",
            email: user?.email || "user@example.com",
            avatar: "/avatars/user.jpg",
          }}
          navMain={[
            { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
            { title: "Organizations", url: "/organizations", icon: IconBuilding },
            { title: "Projects", url: "/projects", icon: IconFolder },
            { title: "Profile", url: "/profile", icon: IconUser },
          ]}
          navSecondary={[
            { title: "Settings", url: "/settings", icon: IconSettings },
            { title: "Help", url: "/help", icon: IconHelp },
          ]}
          variant="inset"
        />
      }
      header={<DashboardHeader title={title} action={action} />}
    >
      {children}
    </DashboardLayout>
  )
}

