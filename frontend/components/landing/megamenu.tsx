"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { megaMenuData } from '@/lib/data/megamenu-data'
import { MenuColumn } from './menu-column'

interface MegaMenuProps {
  onClose?: () => void
  menuType?: string
}

export function MegaMenu({ onClose, menuType = 'Product' }: MegaMenuProps) {
  const renderMenu = () => {
    switch(menuType) {
      case 'Product':
        return (
          <>
            <MenuColumn title="Product" items={megaMenuData.product} variant="icon" />
            <MenuColumn title="Solutions" items={megaMenuData.solutions} variant="icon" />
            <MenuColumn title="Resources" items={megaMenuData.resources} variant="simple" />
            <div>
              <h3 className="text-sm font-semibold text-black mb-4 uppercase tracking-wider">Get Started</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-black to-gray-800 text-white">
                  <div className="text-3xl mb-3">🚀</div>
                  <h4 className="font-serif text-xl mb-2">Start building today</h4>
                  <p className="text-sm text-gray-300 mb-4">Launch your SaaS in minutes, not months. No credit card required.</p>
                  <Button className="w-full bg-white text-black hover:bg-gray-100 rounded-full font-medium" asChild>
                    <a href="/register">Sign up free →</a>
                  </Button>
                </div>
                <div className="border border-gray-200 rounded-xl p-5 bg-blue-50/50 hover:bg-blue-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">📖</div>
                    <div>
                      <h4 className="font-semibold text-sm text-black mb-1">View Documentation</h4>
                      <p className="text-xs text-gray-600">Complete guides and API reference</p>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-xl p-5 bg-green-50/50 hover:bg-green-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💬</div>
                    <div>
                      <h4 className="font-semibold text-sm text-black mb-1">Talk to Sales</h4>
                      <p className="text-xs text-gray-600">Enterprise plans & custom solutions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      case 'Solutions':
        return (
          <>
            <MenuColumn title="Solutions" items={megaMenuData.solutions} variant="icon" />
            <MenuColumn title="Resources" items={megaMenuData.resources} variant="simple" />
            <MenuColumn title="Company" items={megaMenuData.company} variant="simple" />
            <div>
              <h3 className="text-sm font-semibold text-black mb-4 uppercase tracking-wider">Why Choose Us</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-black to-gray-800 text-white">
                  <div className="text-3xl mb-3">⚡</div>
                  <h4 className="font-serif text-xl mb-2">Built for speed</h4>
                  <p className="text-sm text-gray-300 mb-4">Deploy your SaaS in minutes with production-ready infrastructure.</p>
                  <Button className="w-full bg-white text-black hover:bg-gray-100 rounded-full font-medium" asChild>
                    <a href="/pricing">View pricing →</a>
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-xl p-5 bg-purple-50/50 hover:bg-purple-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">🔒</div>
                        <div>
                          <h4 className="font-semibold text-sm text-black mb-1">Enterprise Security</h4>
                          <p className="text-xs text-gray-600">SOC 2 compliant infrastructure</p>
                        </div>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-5 bg-orange-50/50 hover:bg-orange-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">⚙️</div>
                        <div>
                          <h4 className="font-semibold text-sm text-black mb-1">5-Minute Setup</h4>
                          <p className="text-xs text-gray-600">Get started instantly</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-xl p-5 bg-teal-50/50 hover:bg-teal-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">💎</div>
                        <div>
                          <h4 className="font-semibold text-sm text-black mb-1">Premium Support</h4>
                          <p className="text-xs text-gray-600">24/7 dedicated assistance</p>
                        </div>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-5 bg-amber-50/50 hover:bg-amber-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">📊</div>
                        <div>
                          <h4 className="font-semibold text-sm text-black mb-1">Analytics Dashboard</h4>
                          <p className="text-xs text-gray-600">Real-time insights & metrics</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      case 'Resources':
        return (
          <>
            <MenuColumn title="Resources" items={megaMenuData.resources} variant="simple" />
            <MenuColumn title="Company" items={megaMenuData.company} variant="simple" />
            <div className="col-span-2">
              <h3 className="text-sm font-semibold text-black mb-4 uppercase tracking-wider">Learn More</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-black to-gray-800 text-white">
                  <div className="text-3xl mb-3">📚</div>
                  <h4 className="font-serif text-xl mb-2">Documentation</h4>
                  <p className="text-sm text-gray-300 mb-4">Complete guides, tutorials, and API reference to get started.</p>
                  <Button className="w-full bg-white text-black hover:bg-gray-100 rounded-full font-medium" asChild>
                    <a href="/docs">Read docs →</a>
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-xl p-5 bg-indigo-50/50 hover:bg-indigo-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">💬</div>
                        <div>
                          <h4 className="font-semibold text-sm text-black mb-1">Community</h4>
                          <p className="text-xs text-gray-600">Connect with developers</p>
                        </div>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-5 bg-cyan-50/50 hover:bg-cyan-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">🎓</div>
                        <div>
                          <h4 className="font-semibold text-sm text-black mb-1">Tutorials</h4>
                          <p className="text-xs text-gray-600">Step-by-step guides</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-xl p-5 bg-violet-50/50 hover:bg-violet-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">📝</div>
                        <div>
                          <h4 className="font-semibold text-sm text-black mb-1">Blog</h4>
                          <p className="text-xs text-gray-600">Latest updates & insights</p>
                        </div>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-5 bg-rose-50/50 hover:bg-rose-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">🎬</div>
                        <div>
                          <h4 className="font-semibold text-sm text-black mb-1">Video Guides</h4>
                          <p className="text-xs text-gray-600">Watch & learn</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      case 'Company':
        return (
          <>
            <MenuColumn title="Company" items={megaMenuData.company} variant="simple" />
            <MenuColumn title="Resources" items={megaMenuData.resources} variant="simple" />
            <div className="col-span-2">
              <h3 className="text-sm font-semibold text-black mb-4 uppercase tracking-wider">About Us</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-black to-gray-800 text-white">
                  <div className="text-3xl mb-3">🏢</div>
                  <h4 className="font-serif text-xl mb-2">Building the future of SaaS</h4>
                  <p className="text-sm text-gray-300 mb-4">Helping teams ship faster and build better products since day one.</p>
                  <Button className="w-full bg-white text-black hover:bg-gray-100 rounded-full font-medium" asChild>
                    <a href="/company">Learn more →</a>
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-xl p-5 bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">💼</div>
                        <div>
                          <h4 className="font-semibold text-sm text-black mb-1">Careers</h4>
                          <p className="text-xs text-gray-600">Join our growing team</p>
                        </div>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-5 bg-pink-50/50 hover:bg-pink-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">✉️</div>
                        <div>
                          <h4 className="font-semibold text-sm text-black mb-1">Contact Us</h4>
                          <p className="text-xs text-gray-600">Get in touch</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-xl p-5 bg-sky-50/50 hover:bg-sky-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">🌍</div>
                        <div>
                          <h4 className="font-semibold text-sm text-black mb-1">Global Team</h4>
                          <p className="text-xs text-gray-600">Distributed worldwide</p>
                        </div>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-5 bg-lime-50/50 hover:bg-lime-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">🎯</div>
                        <div>
                          <h4 className="font-semibold text-sm text-black mb-1">Our Mission</h4>
                          <p className="text-xs text-gray-600">Ship faster, build better</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full border-t border-gray-200 bg-white shadow-2xl">
      <div className="w-full px-6 lg:px-8 xl:px-12 py-12">
        <div className="grid md:grid-cols-4 gap-8 max-w-[1800px] mx-auto">
          {renderMenu()}
        </div>
      </div>
    </div>
  )
}

export function NavigationWithMegaMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (menuName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setActiveMenu(menuName)
    setIsMenuOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
      setIsMenuOpen(false)
    }, 200)
  }

  const handleMenuMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const navigationItems = [
    { label: 'Product', hasMenu: true, href: '#' },
    { label: 'Solutions', hasMenu: true, href: '#' },
    { label: 'Resources', hasMenu: true, href: '#' },
    { label: 'Company', hasMenu: true, href: '#' }
  ]

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full px-6 lg:px-8 xl:px-12 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <a href="/" className="text-xl font-serif text-black">StarterSaaS</a>
            <div className="hidden md:flex items-center gap-8 text-sm">
              {navigationItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.hasMenu && handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <a 
                    href={item.href}
                    className="text-gray-600 hover:text-black transition-colors py-2 block"
                  >
                    {item.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-black hover:bg-gray-100"
              asChild
            >
              <a href="/login">Log in</a>
            </Button>
            <Button 
              className="bg-black text-white hover:bg-gray-800 rounded-full"
              asChild
            >
              <a href="/register">Sign up</a>
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && activeMenu && (
        <div
          className="absolute left-0 right-0 top-full"
          onMouseEnter={handleMenuMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <MegaMenu menuType={activeMenu} />
        </div>
      )}
    </nav>
  )
}

