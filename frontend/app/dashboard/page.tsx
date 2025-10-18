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
import {
  IconDashboard,
  IconBuilding,
  IconFolder,
  IconUser,
  IconSettings,
  IconHelp,
  IconInnerShadowTop,
} from "@tabler/icons-react"

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

  const activeProjects = projects.filter((p: any) => p.status === 'active').length
  const pendingInvitations = invitations.filter((i: any) => i.status === 'pending').length

  const stats = [
    {
      title: "Organizations",
      value: organizations.length,
      description: "Your organizations",
      badge: "Active",
      footer: "Your organizations",
      footerDescription: "Teams you're part of",
    },
    {
      title: "Total Projects",
      value: projects.length,
      description: "Your projects",
      badge: "All",
      footer: "Your projects",
      footerDescription: "All your projects",
    },
    {
      title: "Active Projects",
      value: activeProjects,
      description: "Currently active",
      badge: "Live",
      footer: "Currently active",
      footerDescription: "In-progress projects",
    },
    {
      title: "Invitations",
      value: pendingInvitations,
      description: "Pending invitations",
      badge: "Pending",
      footer: "Pending invitations",
      footerDescription: "Review and accept",
    },
  ]

  const navItems = [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    { title: "Organizations", url: "/organizations", icon: IconBuilding },
    { title: "Projects", url: "/projects", icon: IconFolder },
    { title: "Profile", url: "/profile", icon: IconUser },
  ]

  const secondaryNavItems = [
    { title: "Settings", url: "/settings", icon: IconSettings },
    { title: "Help", url: "/help", icon: IconHelp },
  ]

  return (
    <DashboardPage
      layout={(props) => (
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
              navMain={navItems}
              navSecondary={secondaryNavItems}
              variant="inset"
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
