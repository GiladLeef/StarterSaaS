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
                <div className="border border-gray-200 rounded-xl p-6">
                  <h4 className="font-serif text-xl mb-2 text-black">Start building today</h4>
                  <p className="text-sm text-gray-600 mb-4">Launch your project in minutes</p>
                  <Button className="w-full bg-black text-white hover:bg-gray-800 rounded-full" asChild>
                    <a href="/register">Sign up free</a>
                  </Button>
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
            <div className="col-span-2">
              <h3 className="text-sm font-semibold text-black mb-4 uppercase tracking-wider">Why StarterSaaS</h3>
              <div className="border border-gray-200 rounded-xl p-6">
                <h4 className="font-serif text-xl mb-2 text-black">Built for modern teams</h4>
                <p className="text-sm text-gray-600 mb-4">Everything you need to build, deploy, and scale your SaaS</p>
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
              <div className="border border-gray-200 rounded-xl p-6">
                <h4 className="font-serif text-xl mb-2 text-black">Documentation</h4>
                <p className="text-sm text-gray-600 mb-4">Everything you need to get started</p>
              </div>
            </div>
          </>
        )
      case 'Company':
        return (
          <>
            <MenuColumn title="Company" items={megaMenuData.company} variant="simple" />
            <div className="col-span-3">
              <h3 className="text-sm font-semibold text-black mb-4 uppercase tracking-wider">About Us</h3>
              <div className="border border-gray-200 rounded-xl p-6">
                <h4 className="font-serif text-xl mb-2 text-black">Building the future of SaaS</h4>
                <p className="text-sm text-gray-600 mb-4">We're on a mission to help teams ship faster</p>
                <Button variant="outline" className="rounded-full" asChild>
                  <a href="/company">Learn more about us</a>
                </Button>
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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
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
    { label: 'Pricing', hasMenu: false, href: '/pricing' },
    { label: 'Resources', hasMenu: true, href: '#' },
    { label: 'Company', hasMenu: true, href: '#' }
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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

