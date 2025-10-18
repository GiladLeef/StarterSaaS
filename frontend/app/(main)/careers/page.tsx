"use client"

import { NavigationWithMegaMenu } from '@/components/landing/megamenu'
import { Footer } from '@/components/landing/footer'
import { Section, SectionHeader } from '@/components/landing/section'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IconMapPin, IconClock, IconBriefcase, IconArrowRight, IconHeart, IconRocket, IconUsers } from '@tabler/icons-react'

const openPositions = [
  {
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Help us build the next generation of SaaS infrastructure. You'll work on both frontend and backend systems that power thousands of applications."
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Create beautiful, intuitive experiences that delight our users. You'll own the design process from research to final implementation."
  },
  {
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote",
    type: "Full-time",
    description: "Be the voice of our customers and help them succeed. You'll build relationships, drive adoption, and ensure customer satisfaction."
  },
  {
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Build and maintain our infrastructure and deployment pipelines. Ensure reliability, scalability, and security of our platform."
  },
  {
    title: "Content Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: "Create compelling content that resonates with developers and founders. You'll own our blog, docs, and educational content."
  },
  {
    title: "Sales Development Representative",
    department: "Sales",
    location: "Remote",
    type: "Full-time",
    description: "Help us reach more customers and grow our business. You'll identify opportunities and build relationships with potential clients."
  }
]

const benefits = [
  {
    icon: IconHeart,
    title: "Health & Wellness",
    description: "Comprehensive health insurance, mental health support, and fitness stipend"
  },
  {
    icon: IconRocket,
    title: "Growth & Learning",
    description: "Annual learning budget, conference tickets, and professional development"
  },
  {
    icon: IconUsers,
    title: "Work-Life Balance",
    description: "Flexible hours, unlimited PTO, and fully remote work options"
  },
  {
    icon: IconBriefcase,
    title: "Competitive Compensation",
    description: "Top of market salary, equity options, and performance bonuses"
  }
]

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      <NavigationWithMegaMenu />

      <Section variant="light" className="pt-32 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-300">
            <IconBriefcase className="w-3 h-3 mr-1" />
            Careers
          </Badge>
          <h1 className="text-5xl md:text-6xl mb-6">
            Build the future with us
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Join a team of talented, passionate people who are shaping the future of SaaS. 
            We're always looking for exceptional talent to help us grow.
          </p>
        </div>
      </Section>

      <Section variant="dark">
        <SectionHeader
          title="Why Join StarterSaaS?"
          subtitle="More than just a job — it's a mission"
          centered
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section variant="light">
        <SectionHeader
          title="Open Positions"
          subtitle={`${openPositions.length} opportunities to make an impact`}
          centered
        />
        <div className="max-w-4xl mx-auto mt-12 space-y-6">
          {openPositions.map((position, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{position.title}</CardTitle>
                    <CardDescription className="text-base">{position.description}</CardDescription>
                  </div>
                  <Button className="rounded-full shrink-0">
                    Apply Now
                    <IconArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <IconBriefcase className="w-4 h-4" />
                    {position.department}
                  </div>
                  <div className="flex items-center gap-2">
                    <IconMapPin className="w-4 h-4" />
                    {position.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <IconClock className="w-4 h-4" />
                    {position.type}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section variant="dark">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl mb-6">
            Don't see the right role?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            We're always open to meeting talented people. Send us your resume 
            and tell us what you're passionate about.
          </p>
          <Button size="lg" variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10">
            Send Us Your Resume
            <IconArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </Section>

      <Footer />
    </div>
  )
}

