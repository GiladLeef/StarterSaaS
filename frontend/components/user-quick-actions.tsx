import { IconBuilding, IconFolder, IconUsers } from "@tabler/icons-react"
import { QuickActionGrid } from "@/components/common/quick-action-card"

const quickActions = [
  {
    title: "Edit Profile",
    description: "Update your personal details",
    icon: <IconUsers className="h-6 w-6 text-primary" />,
    href: "/settings/profile"
  },
  {
    title: "Security",
    description: "Manage password and security",
    icon: <IconBuilding className="h-6 w-6 text-primary" />,
    href: "/settings/security"
  }
]

export function UserQuickActions() {
  return (
    <QuickActionGrid
      title="Quick Actions"
      description="Get started quickly with these common actions"
      actions={quickActions}
    />
  )
}
