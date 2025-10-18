"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../providers/auth'
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, user, router])

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <p className="text-sm tracking-wider uppercase text-gray-600 mb-12">
              Stop hiring customer representatives and start creating them with Pearl
            </p>
          </div>
          
          <h1 className="text-[4rem] md:text-[6rem] lg:text-[8rem] leading-[0.9] tracking-tight mb-12 font-serif">
            The AI voice agent to automate your customer's phone & voice interactions
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-black text-white hover:bg-gray-900 rounded-full px-8 h-12 text-base font-normal"
              asChild
            >
              <a href="/register">
                Try for free
                <IconArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-black text-black hover:bg-gray-50 rounded-full px-8 h-12 text-base font-normal"
              asChild
            >
              <a href="/login">
                Book a demo
                <IconArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 border-t border-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16">
            <div>
              <h3 className="text-2xl font-serif mb-4">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Built with performance in mind. Experience blazing-fast load times and smooth interactions.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-serif mb-4">Enterprise Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Bank-level encryption and security protocols to keep your data safe and compliant.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-serif mb-4">Real-time Sync</h3>
              <p className="text-gray-600 leading-relaxed">
                Instant updates across all your devices. Always stay in sync with your team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6 border-t border-black/10 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="text-5xl font-serif mb-2">10K+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif mb-2">99.9%</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif mb-2">24/7</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Support</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif mb-2">50+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Integrations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 px-6 border-t border-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-5xl font-serif mb-8 leading-tight">
                Built for teams of all sizes
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-12">
                From startups to enterprises, our platform scales with your needs. 
                Get the tools and support you need to grow.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Advanced analytics and reporting",
                  "24/7 customer support",
                  "99.9% uptime guarantee",
                  "SOC 2 Type II compliant",
                  "Custom integrations",
                  "Dedicated success manager"
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-lg">
                    <span className="text-black mt-1">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="border border-black/10 p-8 hover:border-black/30 transition-colors">
                <div className="text-4xl font-serif mb-4">Analytics</div>
                <p className="text-gray-600">Deep insights into your business</p>
              </div>
              <div className="border border-black/10 p-8 hover:border-black/30 transition-colors mt-12">
                <div className="text-4xl font-serif mb-4">Security</div>
                <p className="text-gray-600">Enterprise-grade protection</p>
              </div>
              <div className="border border-black/10 p-8 hover:border-black/30 transition-colors">
                <div className="text-4xl font-serif mb-4">Collaboration</div>
                <p className="text-gray-600">Work together seamlessly</p>
              </div>
              <div className="border border-black/10 p-8 hover:border-black/30 transition-colors mt-12">
                <div className="text-4xl font-serif mb-4">Cloud Native</div>
                <p className="text-gray-600">Scale without limits</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 border-t border-black/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-serif mb-8 leading-tight">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Join thousands of teams already using our platform to build better products faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-black text-white hover:bg-gray-900 rounded-full px-8 h-12 text-base font-normal"
              asChild
            >
              <a href="/register">
                Start Free Trial
                <IconArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-black text-black hover:bg-gray-50 rounded-full px-8 h-12 text-base font-normal"
              asChild
            >
              <a href="/login">Talk to Sales</a>
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-8">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-2xl font-serif mb-2">StarterSaaS</div>
              <p className="text-gray-600">Build your SaaS in hours, not months</p>
            </div>
            
            <div className="text-sm text-gray-500">
              © 2025 StarterSaaS. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
