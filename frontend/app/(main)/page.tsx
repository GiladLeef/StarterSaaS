"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../providers/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AnimatedLines from '../components/animated/lines'
import AnimatedLine from '../components/animated/line'
import { 
  IconRocket, 
  IconShield, 
  IconBolt, 
  IconCloud,
  IconCode,
  IconUsers,
  IconChartBar,
  IconLock,
  IconArrowRight,
  IconCheck,
  IconSparkles
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

  const features = [
    {
      icon: IconRocket,
      title: "Lightning Fast",
      description: "Built with performance in mind. Experience blazing-fast load times and smooth interactions.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: IconShield,
      title: "Enterprise Security",
      description: "Bank-level encryption and security protocols to keep your data safe and compliant.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: IconBolt,
      title: "Real-time Sync",
      description: "Instant updates across all your devices. Always stay in sync with your team.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: IconCloud,
      title: "Cloud Native",
      description: "Scalable infrastructure that grows with your business. No limits, no compromises.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: IconCode,
      title: "Developer Friendly",
      description: "Clean APIs and extensive documentation. Integrate seamlessly with your workflow.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: IconUsers,
      title: "Team Collaboration",
      description: "Work together effortlessly. Share, comment, and collaborate in real-time.",
      gradient: "from-pink-500 to-rose-500"
    }
  ]

  const benefits = [
    "Advanced analytics and reporting",
    "24/7 customer support",
    "99.9% uptime guarantee",
    "SOC 2 Type II compliant",
    "Custom integrations",
    "Dedicated success manager"
  ]

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
    { value: "50+", label: "Integrations" }
  ]

  return (
    <div className="min-h-screen relative">
      <AnimatedLines />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="container px-4 mx-auto text-center relative z-10">
          <Badge variant="secondary" className="mb-8 px-4 py-2">
            <IconSparkles className="w-4 h-4 mr-2 inline" />
            New: AI-powered insights now available
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            Build Faster,
            <br />
            Scale Smarter
          </h1>
          
          <div className="relative inline-block mb-8">
            <AnimatedLine direction="horizontal" length={200} />
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            The all-in-one platform for modern teams. Manage projects, collaborate seamlessly, 
            and scale your business with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="text-lg px-8 py-6 group" asChild>
              <a href="/register">
                Get Started Free
                <IconArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <a href="/login">Sign In</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help your team work smarter, not harder.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
                <Card 
                key={idx} 
                className="relative group border-2 transition-all duration-300 hover:shadow-2xl hover:border-primary/50"
              >
                <CardHeader>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-muted/30 relative">
        <div className="container px-4 mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Enterprise Ready</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Built for teams of all sizes
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                From startups to enterprises, our platform scales with your needs. 
                Get the tools and support you need to grow.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <IconCheck className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" className="mt-8 group" asChild>
                <a href="/register">
                  Start Free Trial
                  <IconArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                  <IconChartBar className="w-8 h-8 mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">Analytics</h3>
                  <p className="text-sm text-muted-foreground">Deep insights into your business</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 mt-8">
                  <IconLock className="w-8 h-8 mb-4 text-purple-600" />
                  <h3 className="font-semibold mb-2">Security</h3>
                  <p className="text-sm text-muted-foreground">Enterprise-grade protection</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                  <IconUsers className="w-8 h-8 mb-4 text-green-600" />
                  <h3 className="font-semibold mb-2">Collaboration</h3>
                  <p className="text-sm text-muted-foreground">Work together seamlessly</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 mt-8">
                  <IconCloud className="w-8 h-8 mb-4 text-orange-600" />
                  <h3 className="font-semibold mb-2">Cloud Native</h3>
                  <p className="text-sm text-muted-foreground">Scale without limits</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="container px-4 mx-auto">
          <Card className="relative overflow-hidden border-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
            <CardContent className="relative z-10 py-20 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to get started?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of teams already using our platform to build better products faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6 group" asChild>
                  <a href="/register">
                    Start Free Trial
                    <IconArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                  <a href="/login">Talk to Sales</a>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
