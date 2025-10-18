import { footerLinks } from '@/lib/data/landing-content'

interface FooterLinkGroup {
  title: string
  links: Array<{ label: string; href: string }>
}

const linkGroups: FooterLinkGroup[] = [
  { title: 'Product', links: footerLinks.product },
  { title: 'Industries', links: footerLinks.industries },
  { title: 'Company', links: footerLinks.company },
  { title: 'Resources', links: footerLinks.resources },
  { title: 'Terms & Policies', links: footerLinks.legal },
  { title: 'Platform', links: footerLinks.platform }
]

export function Footer() {
  return (
    <footer className="w-full bg-black text-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="font-semibold mb-4 text-white">{group.title}</h4>
              <ul className="space-y-3 text-sm">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-400">All services are online</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-xs">S</span>
              </div>
              <span className="text-sm text-gray-400">© StarterSaaS 2025. All rights reserved.</span>
            </div>

            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 border border-white/20 rounded flex items-center justify-center hover:bg-white/10 transition-colors">
                <span className="text-sm">𝕏</span>
              </a>
              <a href="#" className="w-8 h-8 border border-white/20 rounded flex items-center justify-center hover:bg-white/10 transition-colors">
                <span className="text-sm">in</span>
              </a>
              <a href="#" className="w-8 h-8 border border-white/20 rounded flex items-center justify-center hover:bg-white/10 transition-colors">
                <span className="text-sm">▶</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

