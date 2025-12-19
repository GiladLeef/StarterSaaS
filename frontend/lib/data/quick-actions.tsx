import { IconUser, IconSettings, IconShield } from '@tabler/icons-react'

export const quickActions = [
  {
    title: 'Update Profile',
    description: 'Keep your personal information up to date.',
    icon: <IconUser className="w-8 h-8" />,
    actions: [
      {
        label: 'Edit Profile',
        href: '/settings/profile'
      }
    ]
  },
  {
    title: 'Security Settings',
    description: 'Manage your password and account security.',
    icon: <IconShield className="w-8 h-8" />,
    actions: [
      {
        label: 'Manage Security',
        href: '/settings/security'
      }
    ]
  },
  {
    title: 'App Settings',
    description: 'Configure your application preferences.',
    icon: <IconSettings className="w-8 h-8" />,
    actions: [
      {
        label: 'Go to Settings',
        href: '/settings'
      }
    ]
  }
]
