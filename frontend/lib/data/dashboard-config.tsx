import {
  IconDashboard,
  IconBuilding,
  IconFolder,
  IconUser,
  IconSettings,
  IconHelp,
  IconInnerShadowTop,
} from '@tabler/icons-react'

export const dashboardNav = {
  main: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    { title: "Organizations", url: "/organizations", icon: IconBuilding },
    { title: "Projects", url: "/projects", icon: IconFolder },
    { title: "Profile", url: "/profile", icon: IconUser },
  ],
  secondary: [
    { title: "Settings", url: "/settings", icon: IconSettings },
    { title: "Help", url: "/help", icon: IconHelp },
  ]
}

export const dashboardConfig = {
  title: "Platform",
  titleUrl: "/dashboard",
  icon: <IconInnerShadowTop className="!size-5" />,
  variant: "inset" as const
}

export const getDashboardStats = (organizations: any[], projects: any[], invitations: any[]) => {
  const activeProjects = projects.filter((p: any) => p.status === 'active').length
  const pendingInvitations = invitations.filter((i: any) => i.status === 'pending').length

  return [
    {
      title: "Organizations",
      value: organizations.length,
      description: "Your organizations",
      badge: "Active",
      footer: "Teams you're part of",
    },
    {
      title: "Total Projects",
      value: projects.length,
      description: "Your projects",
      badge: "All",
      footer: "All your projects",
    },
    {
      title: "Active Projects",
      value: activeProjects,
      description: "Currently active",
      badge: "Live",
      footer: "In-progress projects",
    },
    {
      title: "Invitations",
      value: pendingInvitations,
      description: "Pending invitations",
      badge: "Pending",
      footer: "Review and accept",
    },
  ]
}

export const formatUserForSidebar = (user: any) => ({
  name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "User",
  email: user?.email || "user@example.com",
  avatar: "/avatars/user.jpg",
})

