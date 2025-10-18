"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { megaMenuData } from '@/lib/data/megamenu-data'
import { MenuColumn } from './menu-column'
import { FeatureBlock } from './feature-block'

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
            <MenuColumn title="Product Features" items={megaMenuData.product} variant="icon" />
            <MenuColumn title="Platform" items={megaMenuData.solutions} variant="simple" />
            <MenuColumn title="Resources" items={megaMenuData.resources} variant="simple" />
            <div>
              <div className="space-y-4">
                <FeatureBlock
                  icon="🔌"
                  title="API & Integrations"
                  description="Connect with 100+ tools and services. RESTful & GraphQL APIs included."
                  buttonText="View all integrations →"
                  buttonHref="/integrations"
                  gradientFrom="indigo"
                  gradientTo="indigo"
                />
                <FeatureBlock
                  icon="🚀"
                  title="Deploy Anywhere"
                  description="Multi-cloud support with one-click deployment to AWS, Azure, GCP."
                  gradientFrom="blue"
                  gradientTo="blue"
                />
              </div>
            </div>
          <div>
              <div className="space-y-4">
                <FeatureBlock
                  icon="🚀"
                  title="Start building"
                  description="Free forever for small teams. No credit card required."
                  buttonText="Sign up free →"
                  buttonHref="/register"
                  gradientFrom="black"
                  gradientTo="gray"
                  buttonColor="white"
                />
                <FeatureBlock
                  icon="📖"
                  title="Documentation"
                  description="Complete guides, tutorials, and API reference to get you started."
                  gradientFrom="violet"
                  gradientTo="violet"
                />
              </div>
            </div>
          </>
        )
      case 'Resources':
        return (
          <>
            <MenuColumn title="Developer" items={megaMenuData.product} variant="icon" />
            <MenuColumn title="Learn" items={megaMenuData.resources} variant="simple" />
            <MenuColumn title="Support" items={megaMenuData.company} variant="simple" />
            <div>
              <div className="space-y-4">
                <FeatureBlock
                  icon="🎓"
                  title="Learn & Grow"
                  description="Tutorials, videos, guides, and real-world use cases to master the platform."
                  buttonText="Start learning →"
                  buttonHref="/learn"
                  gradientFrom="purple"
                  gradientTo="purple"
                />
                <FeatureBlock
                  icon="📚"
                  title="eBooks & Guides"
                  description="In-depth resources and best practices from industry experts."
                  gradientFrom="indigo"
                  gradientTo="indigo"
                />
              </div>
            </div>
            <div>
              <div className="space-y-4">
                <FeatureBlock
                  icon="💬"
                  title="Join Community"
                  description="Connect with 10K+ developers on Discord. Events, webinars & meetups."
                  buttonText="Join now →"
                  buttonHref="/community"
                  gradientFrom="blue"
                  gradientTo="blue"
                />
                <FeatureBlock
                  icon="🏆"
                  title="Champions Program"
                  description="Become an advocate and share your expertise with others."
                  gradientFrom="violet"
                  gradientTo="violet"
                />
              </div>
            </div>
          </>
        )
      case 'Company':
        return (
          <>
            <MenuColumn title="About" items={megaMenuData.resources} variant="simple" />
            <div className="col-span-2">
              <div className="space-y-4">
                <FeatureBlock
                  icon="💼"
                  title="We're Hiring!"
                  description="12 open positions. Join our remote-first team with great benefits."
                  buttonText="View openings →"
                  buttonHref="/careers"
                  gradientFrom="indigo"
                  gradientTo="indigo"
                />
                <FeatureBlock
                  icon="🌟"
                  title="Life at Company"
                  description="Diversity, inclusion, and employee stories from around the world."
                  gradientFrom="purple"
                  gradientTo="purple"
                />
              </div>
            </div>
            <div className="col-span-2">
              <div className="space-y-4">
                <FeatureBlock
                  icon="🏢"
                  title="About Us"
                  description="Building the future of SaaS. Learn about our mission and values."
                  buttonText="Learn more →"
                  buttonHref="/about"
                  gradientFrom="black"
                  gradientTo="gray"
                  buttonColor="white"
                />
                <FeatureBlock
                  icon="📰"
                  title="Press & Media"
                  description="Latest news, press releases, and media kit downloads."
                  gradientFrom="violet"
                  gradientTo="violet"
                />
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full border-t border-gray-200 bg-white shadow-2xl max-h-[600px] overflow-y-auto">
      <div className="w-full px-6 lg:px-8 xl:px-12 py-8">
        <div className="grid md:grid-cols-5 gap-8 max-w-[1800px] mx-auto">
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
    { label: 'Resources', hasMenu: true, href: '#' },
    { label: 'Company', hasMenu: true, href: '#' }
  ]

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full px-6 lg:px-8 xl:px-12 py-4">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-12">
          <a href="/" className="text-xl font-sans text-black">StarterSaaS</a>
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

