import { IconBuilding, IconFolder, IconUsers } from '@tabler/icons-react'

export const quickActions = [
  {
    title: 'Create Organization',
    description: 'Start a new organization to collaborate with your team.',
    icon: <IconBuilding className="w-8 h-8" />,
    actions: [
      {
        label: 'Create Organization',
        href: '/organizations'
      }
    ]
  },
  {
    title: 'Start a Project',
    description: 'Begin a new project within your organizations.',
    icon: <IconFolder className="w-8 h-8" />,
    actions: [
      {
        label: 'Create Project',
        href: '/projects'
      }
    ]
  },
  {
    title: 'Invite Team Members',
    description: 'Collaborate by inviting team members to your organizations.',
    icon: <IconUsers className="w-8 h-8" />,
    actions: [
      {
        label: 'Manage Team',
        href: '/organizations'
      }
    ]
  }
]

