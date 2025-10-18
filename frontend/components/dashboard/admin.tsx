"use client"

import React from "react"
import { DashboardLayout } from "./layout"
import { DashboardSidebar } from "./sidebar"
import { DashboardHeader } from "./header"
import {
  IconDashboard,
  IconUsers,
  IconBuilding,
  IconFolder,
  IconFileDescription,
  IconSettings,
  IconHelp,
  IconInnerShadowTop,
} from "@tabler/icons-react"

function getIconForResource(key: string) {
  const icons: Record<string, any> = {
    user: IconUsers,
    organization: IconBuilding,
    project: IconFolder,
    invitation: IconFileDescription,
    subscription: IconFileDescription,
  }
  return icons[key] || IconDashboard
}

interface AdminDashboardLayoutProps {
  user: any
  resources?: Array<{ key: string; [key: string]: any }>
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}

export function AdminDashboardLayout({ 
  user, 
  resources = [], 
  title, 
  action, 
  children 
}: AdminDashboardLayoutProps) {
  return (
    <DashboardLayout
      sidebar={
        <DashboardSidebar
          title="Admin Panel"
          titleUrl="/admin"
          icon={<IconInnerShadowTop className="!size-5" />}
          user={{
            name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Admin",
            email: user?.email || "admin@example.com",
            avatar: "/avatars/admin.jpg",
          }}
          navMain={[
            { title: "Dashboard", url: "/admin", icon: IconDashboard },
            ...resources.map((resource) => ({
              title: resource.pluralName || resource.name || resource.key,
              url: `/admin/resources/${resource.key}`,
              icon: getIconForResource(resource.key),
            })),
          ]}
          navSecondary={[
            { title: "Settings", url: "/admin/settings", icon: IconSettings },
            { title: "Help", url: "/admin/help", icon: IconHelp },
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

