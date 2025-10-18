"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../providers/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NavigationWithMegaMenu } from '@/components/landing/megamenu'
import { ScrollSection } from '@/components/landing/scroll-section'
import { 
  IconArrowRight, 
  IconSparkles, 
  IconCode,
  IconRocket,
  IconShieldCheck,
  IconUsers,
  IconBolt,
  IconChartBar,
  IconCheck,
  IconDatabase,
  IconCloud,
  IconLock
} from '@tabler/icons-react'

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

      {/* Hero Section - WHITE with subtle gradient */}
      <section className="relative w-full bg-gradient-to-b from-white to-gray-50 px-6 py-32 overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 left-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-4xl">
            {/* Small badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-gray-200 mb-8">
              <IconSparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Trusted by 10,000+ teams worldwide</span>
            </div>

            <h1 className="text-[3.5rem] md:text-[5rem] lg:text-[7rem] leading-[0.9] tracking-tight mb-8 font-serif text-black">
              Build your SaaS in{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                hours
              </span>
              , not months
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
              The modern platform for launching SaaS products. Authentication, teams, billing, and everything you need—ready to deploy.
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
            <div className="flex items-center gap-8 mt-16 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <IconCheck className="w-5 h-5 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <IconCheck className="w-5 h-5 text-green-600" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <IconCheck className="w-5 h-5 text-green-600" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
      <section className="w-full bg-white px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <ScrollSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-6 text-black">
                Built for every team
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                From startups to enterprises, our platform adapts to your workflow
              </p>
            </div>
          </ScrollSection>

          <ScrollSection delay={100}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
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
            ].map((useCase, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-2xl p-8 hover:border-black/20 hover:shadow-lg transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl bg-${useCase.color}-100 text-${useCase.color}-600 mb-4`}>
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-serif mb-3 text-black">{useCase.title}</h3>
                <p className="text-gray-600 leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
          </ScrollSection>
        </div>
      </section>

      {/* Integration Section - DARK */}
      <section className="w-full bg-black text-white px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-purple-600/20 text-purple-400 border-purple-600/30 mb-6">
              <IconDatabase className="w-3 h-3 mr-1" />
              50+ Integrations
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif mb-6">
              Connects with your favorite tools
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Seamless integration with the tools you already use every day
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              'Stripe', 'Slack', 'GitHub', 'Notion', 'Figma', 'Linear',
              'Salesforce', 'HubSpot', 'Intercom', 'Zapier', 'MongoDB', 'PostgreSQL'
            ].map((tool, idx) => (
              <div
                key={idx}
                className="border border-white/10 rounded-xl p-6 flex items-center justify-center hover:border-white/30 hover:bg-white/5 transition-all duration-300"
              >
                <span className="text-lg font-medium">{tool}</span>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 rounded-full px-8"
            >
              View all integrations
              <IconArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Security & Compliance Section - WHITE */}
      <section className="w-full bg-white px-6 py-24">
        <div className="max-w-7xl mx-auto">
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
                {[
                  'SOC 2 Type II Certified',
                  'GDPR & CCPA Compliant',
                  'End-to-end encryption',
                  '99.99% uptime SLA',
                  'Regular security audits',
                  '24/7 security monitoring'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <IconCheck className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-2xl p-8 hover:border-gray-300 transition-colors">
                <IconLock className="w-10 h-10 mb-4 text-black" />
                <div className="text-3xl font-serif mb-2 text-black">256-bit</div>
                <p className="text-gray-600">AES Encryption</p>
              </div>
              <div className="border border-gray-200 rounded-2xl p-8 hover:border-gray-300 transition-colors mt-8">
                <IconCloud className="w-10 h-10 mb-4 text-black" />
                <div className="text-3xl font-serif mb-2 text-black">99.99%</div>
                <p className="text-gray-600">Uptime SLA</p>
              </div>
              <div className="border border-gray-200 rounded-2xl p-8 hover:border-gray-300 transition-colors">
                <IconDatabase className="w-10 h-10 mb-4 text-black" />
                <div className="text-3xl font-serif mb-2 text-black">Daily</div>
                <p className="text-gray-600">Backups</p>
              </div>
              <div className="border border-gray-200 rounded-2xl p-8 hover:border-gray-300 transition-colors mt-8">
                <IconShieldCheck className="w-10 h-10 mb-4 text-black" />
                <div className="text-3xl font-serif mb-2 text-black">SOC 2</div>
                <p className="text-gray-600">Certified</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - DARK */}
      <section className="w-full bg-black text-white px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="text-5xl font-serif mb-2">10K+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif mb-2">99.9%</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif mb-2">24/7</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Support</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif mb-2">50+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">Integrations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - WHITE */}
      <section className="w-full bg-white px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-black">
              Loved by teams worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of companies building better products faster
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
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
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-2xl p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-black">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* Footer - DARK like nlpear.ai */}
      <footer className="w-full bg-black text-white px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
            {/* Product Column */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#platform" className="text-gray-400 hover:text-white transition-colors">Platform</a></li>
                <li><a href="#api" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Industries Column */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Industries</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#startups" className="text-gray-400 hover:text-white transition-colors">Startups</a></li>
                <li><a href="#ecommerce" className="text-gray-400 hover:text-white transition-colors">E-commerce</a></li>
                <li><a href="#saas" className="text-gray-400 hover:text-white transition-colors">SaaS</a></li>
                <li><a href="#enterprise" className="text-gray-400 hover:text-white transition-colors">Enterprise</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About us</a></li>
                <li><a href="#careers" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact us</a></li>
                <li><a href="#affiliate" className="text-gray-400 hover:text-white transition-colors">Affiliate Program</a></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#api" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#docs" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#support" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                <li><a href="#blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Terms & Policies Column */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Terms & Policies</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of use</a></li>
                <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Platform Column */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/login" className="text-gray-400 hover:text-white transition-colors">Log in</a></li>
                <li><a href="/register" className="text-gray-400 hover:text-white transition-colors">Sign up</a></li>
              </ul>
            </div>
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
    </div>
  )
}
