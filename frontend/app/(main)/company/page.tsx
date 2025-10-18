"use client"

import { NavigationWithMegaMenu } from '@/components/landing/megamenu'
import { Footer } from '@/components/landing/footer'
import { Section, SectionHeader } from '@/components/landing/section'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IconSparkles, IconUsers, IconTarget, IconHeart } from '@tabler/icons-react'
import Link from 'next/link'

const values = [
  {
    icon: IconSparkles,
    title: "Innovation First",
    description: "We're constantly pushing boundaries to deliver cutting-edge solutions that make a difference."
  },
  {
    icon: IconUsers,
    title: "Customer Obsessed",
    description: "Our users are at the heart of everything we do. Their success is our success."
  },
  {
    icon: IconTarget,
    title: "Results Driven",
    description: "We focus on delivering real, measurable outcomes that drive business growth."
  },
  {
    icon: IconHeart,
    title: "Built with Care",
    description: "Quality and attention to detail in every feature, every interaction, every time."
  }
]

const team = [
  {
    name: "Alex Johnson",
    role: "CEO & Co-founder",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
  },
  {
    name: "Sarah Chen",
    role: "CTO & Co-founder",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    name: "Marcus Williams",
    role: "Head of Product",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
  },
  {
    name: "Emma Rodriguez",
    role: "Head of Engineering",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"
  }
]

export default function CompanyPage() {
  return (
    <div className="min-h-screen">
      <NavigationWithMegaMenu />

      <Section variant="light" className="pt-32 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-6 bg-purple-100 text-purple-700 border-purple-300">
            <IconSparkles className="w-3 h-3 mr-1" />
            About Us
          </Badge>
          <h1 className="text-5xl md:text-6xl mb-6">
            Building the future of SaaS
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We're on a mission to help teams build and ship great products faster. 
            Our platform empowers thousands of companies to turn ideas into reality.
          </p>
        </div>
      </Section>

      <Section variant="dark">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Founded in 2024, StarterSaaS was born from a simple frustration: 
                building a SaaS product from scratch took way too long. Months were 
                spent on authentication, team management, billing, and other foundational 
                features before even starting on the core product.
              </p>
              <p>
                We knew there had to be a better way. So we built StarterSaaS — a 
                production-ready foundation that handles all the boring stuff, so you 
                can focus on what makes your product unique.
              </p>
              <p>
                Today, we're proud to serve thousands of developers and businesses 
                who've launched their SaaS products in days instead of months.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl opacity-20 blur-3xl absolute inset-0"></div>
            <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">10K+</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <div className="text-sm text-gray-400">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-sm text-gray-400">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section variant="light">
        <SectionHeader
          title="Our Values"
          subtitle="The principles that guide everything we do"
          centered
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {values.map((value, idx) => (
            <div key={idx} className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section variant="dark">
        <SectionHeader
          title="Meet the Team"
          subtitle="The people building the future of SaaS"
          centered
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {team.map((member, idx) => (
            <div key={idx} className="text-center">
              <div className="w-32 h-32 rounded-full bg-white/10 mx-auto mb-4 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-gray-400">{member.role}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section variant="light">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl mb-6">
            Join us on our journey
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            We're always looking for talented people who share our vision. 
            Check out our open positions or get in touch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/careers">View Open Positions</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  )
}

