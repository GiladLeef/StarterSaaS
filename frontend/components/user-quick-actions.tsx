import { IconBuilding, IconFolder, IconUsers } from "@tabler/icons-react"
import { QuickActionGrid } from "@/components/common/quick-action-card"

const quickActions = [
  {
    title: "New Organization",
    description: "Create a team workspace",
    icon: <IconBuilding className="h-6 w-6 text-primary" />,
    href: "/organizations"
  },
  {
    title: "New Project",
    description: "Start a new project",
    icon: <IconFolder className="h-6 w-6 text-primary" />,
    href: "/projects"
  },
  {
    title: "View Invitations",
    description: "Check pending invites",
    icon: <IconUsers className="h-6 w-6 text-primary" />,
    href: "/organizations"
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

