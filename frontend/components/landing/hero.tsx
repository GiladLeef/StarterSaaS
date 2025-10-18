import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'
import { TrustBadges } from './trust-badge'
import { heroContent } from '@/lib/data/landing-content'

export function Hero() {
  return (
    <section className="relative w-full bg-gradient-to-b from-white to-gray-50 px-6 py-32 overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 left-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-4xl">
          {/* Small badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-gray-200 mb-8">
            {heroContent.badge.icon}
            <span className="text-sm font-medium text-gray-700">{heroContent.badge.text}</span>
          </div>

          <h1 className="text-[3.5rem] md:text-[5rem] lg:text-[7rem] leading-[0.9] tracking-tight mb-8 font-serif text-black">
            {heroContent.title}{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {heroContent.highlightedText}
            </span>
            {heroContent.subtitle}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
            {heroContent.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Button 
              size="lg" 
              className="bg-black text-white hover:bg-gray-800 rounded-full px-10 h-16 text-lg shadow-xl hover:shadow-2xl transition-shadow"
              asChild
            >
              <a href="/register">
                Get started - It's free
                <IconArrowRight className="ml-2 w-6 h-6" />
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-gray-300 rounded-full px-10 h-16 text-lg hover:bg-gray-50"
              asChild
            >
              <a href="#demo">
                Watch demo
              </a>
            </Button>
          </div>

          {/* Trust badges */}
          <TrustBadges badges={heroContent.trustBadges} className="mt-16" />
        </div>
      </div>
    </section>
  )
}

