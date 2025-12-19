import { ReactNode } from 'react'
import { IconUser, IconShield, IconBell, IconPalette, IconKey, IconTrash } from '@tabler/icons-react'

export interface SettingsSection {
  id: string
  title: string
  description: string
  icon: ReactNode
  href: string
}

export const settingsSections: SettingsSection[] = [
  {
    id: 'profile',
    title: 'Profile',
    description: 'Manage your personal information and public profile',
    icon: <IconUser className="w-5 h-5" />,
    href: '/settings/profile'
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Password, two-factor authentication, and security settings',
    icon: <IconShield className="w-5 h-5" />,
    href: '/settings/security'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure how you receive notifications and updates',
    icon: <IconBell className="w-5 h-5" />,
    href: '/settings/notifications'
  },
]



