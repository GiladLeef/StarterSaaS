import { appConfig } from '@/lib/config'

export const ctaContent = {
  title: `Try ${appConfig.siteName} for free`,
  primaryAction: {
    label: "Get started - It's free",
    href: "/register"
  },
  sideContent: [
    {
      title: "Built for Trust, Engineered for Security",
      badges: [
        { label: "SOC II", color: "bg-blue-600" },
        { label: "HIPAA", color: "bg-blue-600" },
        { label: "GDPR", color: "bg-blue-600" }
      ],
    }
  ]
}

