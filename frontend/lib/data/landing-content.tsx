import { 
  IconRocket, 
  IconCode, 
  IconShieldCheck, 
  IconUsers, 
  IconBolt, 
  IconChartBar,
  IconDatabase,
  IconCloud,
  IconLock,
  IconCheck,
  IconSparkles
} from '@tabler/icons-react'

export const heroContent = {
  badge: {
    icon: <IconSparkles className="w-4 h-4 text-purple-600" />,
    text: 'Trusted by 10,000+ teams worldwide'
  },
  title: 'Build your SaaS in',
  highlightedText: 'hours',
  subtitle: ', not months',
  description: 'The modern platform for launching SaaS products. Authentication, teams, billing, and everything you need—ready to deploy.',
  trustBadges: [
    { icon: <IconCheck className="w-5 h-5 text-green-600" />, text: 'No credit card required' },
    { icon: <IconCheck className="w-5 h-5 text-green-600" />, text: '14-day free trial' },
    { icon: <IconCheck className="w-5 h-5 text-green-600" />, text: 'Cancel anytime' }
  ]
}

export const useCases = [
  {
    icon: <IconRocket className="w-6 h-6" />,
    title: "Startups",
    description: "Launch your MVP in days, not months. Focus on your product while we handle the infrastructure.",
    color: "blue"
  },
  {
    icon: <IconUsers className="w-6 h-6" />,
    title: "SMBs",
    description: "Scale your business with enterprise-grade features at startup prices. No complexity, just results.",
    color: "green"
  },
  {
    icon: <IconShieldCheck className="w-6 h-6" />,
    title: "Enterprise",
    description: "SOC 2 compliant, SSO ready, dedicated support. Everything your team needs to move fast.",
    color: "purple"
  },
  {
    icon: <IconCode className="w-6 h-6" />,
    title: "Developers",
    description: "Built by developers, for developers. Clean APIs, great docs, and a CLI you'll actually use.",
    color: "orange"
  },
  {
    icon: <IconBolt className="w-6 h-6" />,
    title: "Agencies",
    description: "White-label ready, client management built-in. Launch client projects in hours, not weeks.",
    color: "cyan"
  },
  {
    icon: <IconChartBar className="w-6 h-6" />,
    title: "Sales Teams",
    description: "Track leads, manage pipelines, close deals faster. Your CRM-friendly automation platform.",
    color: "pink"
  }
]

export const integrations = [
  'Stripe', 'Slack', 'GitHub', 'Notion', 'Figma', 'Linear',
  'Salesforce', 'HubSpot', 'Intercom', 'Zapier', 'MongoDB', 'PostgreSQL'
]

export const securityFeatures = [
  'SOC 2 Type II Certified',
  'GDPR & CCPA Compliant',
  'End-to-end encryption',
  '99.99% uptime SLA',
  'Regular security audits',
  '24/7 security monitoring'
]

export const securityStats = [
  { icon: <IconLock className="w-10 h-10" />, value: '256-bit', label: 'AES Encryption' },
  { icon: <IconCloud className="w-10 h-10" />, value: '99.99%', label: 'Uptime SLA' },
  { icon: <IconDatabase className="w-10 h-10" />, value: 'Daily', label: 'Backups' },
  { icon: <IconShieldCheck className="w-10 h-10" />, value: 'SOC 2', label: 'Certified' }
]

export const platformStats = [
  { value: '10K+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
  { value: '50+', label: 'Integrations' }
]

export const testimonials = [
  {
    quote: "Cut our development time by 60%. Best investment we've made this year.",
    author: "Sarah Chen",
    role: "CTO, TechCorp",
    rating: 5
  },
  {
    quote: "The automation features saved us countless hours. Highly recommend!",
    author: "Michael Rodriguez",
    role: "CEO, StartupHub",
    rating: 5
  },
  {
    quote: "Enterprise-grade security without the enterprise complexity. Perfect.",
    author: "Emily Watson",
    role: "VP Engineering, FinanceApp",
    rating: 5
  }
]

export const footerLinks = {
  product: [
    { label: 'Platform', href: '#platform' },
    { label: 'API', href: '#api' },
    { label: 'Pricing', href: '#pricing' }
  ],
  industries: [
    { label: 'Startups', href: '#startups' },
    { label: 'E-commerce', href: '#ecommerce' },
    { label: 'SaaS', href: '#saas' },
    { label: 'Enterprise', href: '#enterprise' }
  ],
  company: [
    { label: 'About us', href: '#about' },
    { label: 'Careers', href: '#careers' },
    { label: 'Contact us', href: '#contact' },
    { label: 'Affiliate Program', href: '#affiliate' }
  ],
  resources: [
    { label: 'API', href: '#api' },
    { label: 'Documentation', href: '#docs' },
    { label: 'Support', href: '#support' },
    { label: 'Blog', href: '#blog' },
    { label: 'FAQ', href: '#faq' }
  ],
  legal: [
    { label: 'Terms of use', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' }
  ],
  platform: [
    { label: 'Log in', href: '/login' },
    { label: 'Sign up', href: '/register' }
  ]
}

