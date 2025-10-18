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
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Customize the look and feel of your interface',
    icon: <IconPalette className="w-5 h-5" />,
    href: '/settings/appearance'
  },
  {
    id: 'api',
    title: 'API Keys',
    description: 'Manage API keys and integrations',
    icon: <IconKey className="w-5 h-5" />,
    href: '/settings/api'
  },
  {
    id: 'danger',
    title: 'Danger Zone',
    description: 'Delete your account and data',
    icon: <IconTrash className="w-5 h-5" />,
    href: '/settings/danger'
  }
]

export interface BillingPlan {
  id: string
  name: string
  description: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  popular?: boolean
  current?: boolean
}

export const billingPlans: BillingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out the platform',
    price: 0,
    interval: 'month',
    features: [
      '1 organization',
      '3 projects',
      'Basic features',
      'Community support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing teams and businesses',
    price: 29,
    interval: 'month',
    popular: true,
    features: [
      'Unlimited organizations',
      'Unlimited projects',
      'Advanced features',
      'Priority support',
      'Custom integrations',
      'Advanced analytics'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: 99,
    interval: 'month',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom SLA',
      'Advanced security',
      'SSO',
      'Custom contracts'
    ]
  }
]

