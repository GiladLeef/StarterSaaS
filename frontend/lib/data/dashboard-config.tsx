import {
  IconDashboard,
  IconUser,
  IconSettings,
  IconHelp,
  IconInnerShadowTop,
} from '@tabler/icons-react'
import { appConfig } from '@/lib/config'

export const dashboardNav = {
  main: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    { title: "Profile", url: "/profile", icon: IconUser },
  ],
  secondary: [
    { title: "Settings", url: "/settings", icon: IconSettings },
    { title: "Help", url: "/help", icon: IconHelp },
  ]
}

export const dashboardConfig = {
  title: appConfig.siteName,
  titleUrl: "/dashboard",
  icon: <IconInnerShadowTop className="!size-5" />,
  variant: "inset" as const
}

export const getDashboardStats = (users: number, activeUsers: number) => {
  return [
    {
      title: "Active Users",
      value: activeUsers,
      description: "Users currently online",
      badge: "Live",
      footer: "Real-time activity",
    },
    {
      title: "Total Users",
      value: users,
      description: "Registered users",
      badge: "All",
      footer: "Total user base",
    },
  ]
}

export const formatUserForSidebar = (user: any) => ({
  name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "User",
  email: user?.email || appConfig.supportEmail,
  avatar: user?.avatar || appConfig.defaultUserAvatar,
})
