"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { megaMenuData } from '@/lib/data/megamenu-data'
import { MenuColumn } from './menu-column'

interface MegaMenuProps {
  onClose?: () => void
}

export function MegaMenu({ onClose }: MegaMenuProps) {
  return (
    <div className="w-full border-t border-gray-200 bg-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Product Column */}
          <MenuColumn 
            title="Product" 
            items={megaMenuData.product}
            variant="icon"
          />

          {/* Solutions Column */}
          <MenuColumn 
            title="Solutions" 
            items={megaMenuData.solutions}
            variant="icon"
          />

          {/* Resources Column */}
          <MenuColumn 
            title="Resources" 
            items={megaMenuData.resources}
            variant="simple"
          />

          {/* CTA Column */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-4 uppercase tracking-wider">Get Started</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-xl p-6">
                <h4 className="font-serif text-xl mb-2 text-black">Start building today</h4>
                <p className="text-sm text-gray-600 mb-4">Launch your project in minutes with our platform</p>
                <Button 
                  className="w-full bg-black text-white hover:bg-gray-800 rounded-full"
                  asChild
                >
                  <a href="/register">Sign up free</a>
                </Button>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Already have an account?</p>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 rounded-full"
                  asChild
                >
                  <a href="/login">Log in</a>
                </Button>
              </div>
            </div>
          </div>
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
    }, 200) // 200ms delay before closing
  }

  const handleMenuMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <a href="/" className="text-xl font-serif text-black">StarterSaaS</a>
          <div className="hidden md:flex items-center gap-8 text-sm">
            {[
              { label: 'Product', hasMenu: true },
              { label: 'Features', hasMenu: false },
              { label: 'Pricing', hasMenu: false },
              { label: 'Company', hasMenu: false }
            ].map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasMenu && handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <a 
                  href={`#${item.label.toLowerCase()}`}
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

      {/* Megamenu Dropdown - Absolutely positioned */}
      {isMenuOpen && activeMenu === 'Product' && (
        <div
          className="absolute left-0 right-0 top-full"
          onMouseEnter={handleMenuMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <MegaMenu />
        </div>
      )}
    </nav>
  )
}

