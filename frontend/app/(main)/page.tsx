"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../providers/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NavigationWithMegaMenu } from '@/components/landing/megamenu'
import { ScrollSection } from '@/components/landing/scroll-section'
import { Hero } from '@/components/landing/hero'
import { Section, SectionHeader } from '@/components/landing/section'
import { FeatureGrid } from '@/components/landing/feature-card'
import { StatGrid } from '@/components/landing/stat-card'
import { TestimonialGrid } from '@/components/landing/testimonial-card'
import { IntegrationGrid } from '@/components/landing/integration-grid'
import { Footer } from '@/components/landing/footer'
import { 
  IconArrowRight, 
  IconSparkles, 
  IconShieldCheck,
  IconCheck,
  IconDatabase
} from '@tabler/icons-react'
import { 
  useCases, 
  integrations, 
  securityFeatures, 
  securityStats, 
  platformStats, 
  testimonials 
} from '@/lib/data/landing-content'

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
    <div className="min-h-screen">
      {/* Navigation with Megamenu */}
      <NavigationWithMegaMenu />

      {/* Hero Section */}
      <Hero />

      {/* Features Section - DARK */}
      <section className="w-full bg-black text-white px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <ScrollSection>
            <div className="grid lg:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
              <Badge className="bg-purple-600/20 text-purple-400 border-purple-600/30 mb-6">
                <IconSparkles className="w-3 h-3 mr-1" />
                Instant AI Workflows - No Code, Just Prompts
              </Badge>
              
              <h3 className="text-2xl font-serif mb-4">
                Tell Pearl what you need—it builds your conversation flow in seconds
              </h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                No coding, no complexity. Just seamless AI-powered interactions tailored to your use case.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 border-2 border-white/50 rounded" />
                  </div>
                  <div>
                    <div className="font-medium mb-2">Qualify potential customers for a debt relief program</div>
                    <p className="text-sm text-gray-500">
                      Ask about their financial situation, check eligibility, offer a consultation, 
                      schedule a follow-up call, and handle objections.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-400 mb-1">Initial Screening</div>
                    <div className="text-xs text-gray-500">Hi, I'm Pearl. I'd love to...</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-400 mb-1">Eligibility Questions</div>
                    <div className="text-xs text-gray-500">Are you currently making...</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-400 mb-1">Consultation Booking</div>
                    <div className="text-xs text-gray-500">You qualify for our debt rel...</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
              <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 mb-6">
                <IconSparkles className="w-3 h-3 mr-1" />
                Automated Actions in Real-Time
              </Badge>
              
              <h3 className="text-2xl font-serif mb-4">
                Pearl doesn't just handle calls
              </h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                It executes actions that save you time and drive results. Pearl works in real-time 
                to keep your operations seamless and customer-focused.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-center mb-8 py-8">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                    <div className="text-xs bg-white/10 px-2 py-1 rounded">API</div>
                    <span className="text-sm">API Integration</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                    <div className="text-xs bg-white/10 px-2 py-1 rounded">📞</div>
                    <span className="text-sm">Transfer Call</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                    <div className="text-xs bg-white/10 px-2 py-1 rounded">📅</div>
                    <span className="text-sm">Booking</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                    <div className="text-xs bg-white/10 px-2 py-1 rounded">✉️</div>
                    <span className="text-sm">Send Email</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                    <div className="text-xs bg-white/10 px-2 py-1 rounded">💬</div>
                    <span className="text-sm">Send SMS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </ScrollSection>
        </div>
      </section>

      {/* Use Cases Section - WHITE */}
      <Section variant="light">
        <ScrollSection>
          <SectionHeader
            title="Built for every team"
            subtitle="From startups to enterprises, our platform adapts to your workflow"
            centered
          />
        </ScrollSection>

        <ScrollSection delay={100}>
          <FeatureGrid features={useCases} columns={3} />
        </ScrollSection>
      </Section>

      {/* Integration Section - DARK */}
      <Section variant="dark">
        <SectionHeader
          title="Connects with your favorite tools"
          subtitle="Seamless integration with the tools you already use every day"
          badge={{
            icon: <IconDatabase className="w-3 h-3 mr-1" />,
            text: '50+ Integrations',
            className: 'bg-purple-600/20 text-purple-400 border-purple-600/30'
          }}
          centered
        />

        <IntegrationGrid integrations={integrations} />

        <div className="mt-16 text-center">
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10 rounded-full px-8"
          >
            View all integrations
            <IconArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </Section>

      {/* Security & Compliance Section - WHITE */}
      <Section variant="light">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge className="bg-green-100 text-green-700 border-green-300 mb-6">
              <IconShieldCheck className="w-3 h-3 mr-1" />
              Enterprise Security
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-black">
              Security & compliance built-in
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Your data is protected by industry-leading security standards. We take compliance seriously so you can focus on growth.
            </p>
            
            <div className="space-y-4">
              {securityFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <IconCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <StatGrid stats={securityStats} columns={2} variant="large" />
        </div>
      </Section>

      {/* Stats Section - DARK */}
      <Section variant="dark">
        <StatGrid stats={platformStats} columns={4} />
      </Section>

      {/* Testimonials Section - WHITE */}
      <Section variant="light">
        <SectionHeader
          title="Loved by teams worldwide"
          subtitle="Join thousands of companies building better products faster"
          centered
        />

        <TestimonialGrid testimonials={testimonials} columns={3} />
      </Section>

      {/* CTA Section - DARK with side content like screenshot */}
      <section className="w-full bg-black text-white px-6 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Main CTA */}
            <div>
              <h2 className="text-5xl md:text-6xl font-serif mb-8 leading-tight">
                Try Pearl for free
              </h2>
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-200 rounded px-8 h-14 text-base"
                asChild
              >
                <a href="/register">
                  Get started - It's free
                  <IconArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </div>

            {/* Right: Info boxes */}
            <div className="space-y-8">
              {/* Built for Trust */}
              <div>
                <h3 className="text-2xl font-serif mb-4">Built for Trust, Engineered for Security</h3>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-gray-400">We are</span>
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded">SOC II</span>
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded">HIPAA</span>
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded">GDPR</span>
                  <span className="text-sm text-gray-400">compliant.</span>
                </div>
              </div>

              {/* Book a Demo */}
              <div className="border-t border-white/10 pt-8">
                <h3 className="text-xl font-semibold mb-3">Book a Demo</h3>
                <p className="text-gray-400 mb-4">
                  Interested in seeing Pearl in action? Schedule a personalized demo with our team.
                </p>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10 rounded"
                  asChild
                >
                  <a href="#demo">
                    Schedule a Demo
                    <IconArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </div>

              {/* View Pricing */}
              <div className="border-t border-white/10 pt-8">
                <h3 className="text-xl font-semibold mb-3">View Pricing</h3>
                <p className="text-gray-400 mb-4">
                  Explore our flexible pricing plans and find the perfect fit for your business.
                </p>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10 rounded"
                  asChild
                >
                  <a href="#pricing">
                    Pricing
                    <IconArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
