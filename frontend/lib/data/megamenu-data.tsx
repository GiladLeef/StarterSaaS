import { 
  IconCode, 
  IconRocket, 
  IconShieldCheck, 
  IconUsers, 
  IconChartBar,
  IconDatabase,
  IconCloud,
  IconBolt
} from '@tabler/icons-react'

export const megaMenuData = {
  product: [
    { icon: <IconRocket className="w-6 h-6" />, title: "Platform", desc: "Build and deploy faster" },
    { icon: <IconCode className="w-6 h-6" />, title: "API", desc: "Integrate seamlessly" },
    { icon: <IconBolt className="w-6 h-6" />, title: "Automation", desc: "Automate workflows" },
    { icon: <IconChartBar className="w-6 h-6" />, title: "Analytics", desc: "Track performance" }
  ],
  solutions: [
    { icon: <IconUsers className="w-6 h-6" />, title: "For Startups", desc: "Launch your MVP fast" },
    { icon: <IconShieldCheck className="w-6 h-6" />, title: "For Enterprise", desc: "Scale with confidence" },
    { icon: <IconDatabase className="w-6 h-6" />, title: "For Developers", desc: "APIs you'll love" },
    { icon: <IconCloud className="w-6 h-6" />, title: "For Agencies", desc: "White-label ready" }
  ],
  resources: [
    { title: "Documentation", href: "#" },
    { title: "API Reference", href: "#" },
    { title: "Guides & Tutorials", href: "#" },
    { title: "Case Studies", href: "#" },
    { title: "Blog", href: "#" },
    { title: "Community", href: "#" }
  ]
}

export const navigationItems = [
  { label: 'Product', hasMenu: true },
  { label: 'Features', hasMenu: false },
  { label: 'Pricing', hasMenu: false },
  { label: 'Company', hasMenu: false }
]

