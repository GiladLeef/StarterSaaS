"use client"

import { useState } from 'react'
import { NavigationWithMegaMenu } from '@/components/landing/megamenu'
import { Footer } from '@/components/landing/footer'
import { Section, SectionHeader } from '@/components/landing/section'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { IconCheck, IconSparkles, IconCrown, IconRocket, IconX } from '@tabler/icons-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for getting started",
    icon: IconRocket,
    features: [
      "Up to 3 team members",
      "5 projects",
      "Basic analytics",
      "Community support",
      "API access",
      "1 GB storage"
    ],
    limitations: [
      "No custom domain",
      "No priority support",
      "Limited integrations"
    ],
    cta: "Start Free",
    popular: false
  },
  {
    name: "Pro",
    price: { monthly: 29, yearly: 290 },
    description: "For growing teams",
    icon: IconSparkles,
    features: [
      "Up to 15 team members",
      "Unlimited projects",
      "Advanced analytics",
      "Priority email support",
      "All integrations",
      "50 GB storage",
      "Custom domain",
      "Remove branding",
      "Advanced security"
    ],
    limitations: [],
    cta: "Start Pro Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: { monthly: 99, yearly: 990 },
    description: "For large organizations",
    icon: IconCrown,
    features: [
      "Unlimited team members",
      "Unlimited projects",
      "Enterprise analytics",
      "24/7 phone support",
      "All integrations",
      "Unlimited storage",
      "Custom domain",
      "White-label solution",
      "Advanced security",
      "SSO / SAML",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom integrations",
      "On-premise deployment"
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false
  }
]

const faqs = [
  {
    question: "Can I change plans later?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any payments."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can also pay via invoice."
  },
  {
    question: "Is there a free trial?",
    answer: "The Free plan is available forever with no credit card required. Pro and Enterprise plans come with a 14-day free trial."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely! You can cancel your subscription at any time with no cancellation fees. Your service will continue until the end of your billing period."
  },
  {
    question: "Do you offer discounts for non-profits?",
    answer: "Yes! We offer 50% discounts for qualified non-profit organizations and educational institutions. Contact our sales team for more information."
  },
  {
    question: "What happens if I exceed my plan limits?",
    answer: "We'll notify you when you're approaching your limits. You can either upgrade your plan or we'll work with you to find the best solution."
  }
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div className="min-h-screen">
      <NavigationWithMegaMenu />

      <Section variant="light" className="pt-32 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-6 bg-green-100 text-green-700 border-green-300">
            <IconSparkles className="w-3 h-3 mr-1" />
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-5xl md:text-6xl mb-6">
            Choose the perfect plan for your team
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>

          <div className="inline-flex items-center gap-3 bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={cn(
                "px-6 py-2 rounded-full font-medium transition-colors",
                billingPeriod === 'monthly' 
                  ? "bg-white shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={cn(
                "px-6 py-2 rounded-full font-medium transition-colors",
                billingPeriod === 'yearly' 
                  ? "bg-white shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </Section>

      <Section variant="light" className="pt-0">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <Card 
              key={idx} 
              className={cn(
                "relative",
                plan.popular && "border-2 border-purple-500 shadow-xl"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white border-purple-600">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">
                    ${plan.price[billingPeriod]}
                  </span>
                  <span className="text-gray-600 ml-2">
                    /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-3">
                      <IconCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, limitIdx) => (
                    <li key={limitIdx} className="flex items-start gap-3 text-gray-400">
                      <IconX className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  asChild
                  className={cn(
                    "w-full rounded-full",
                    plan.popular && "bg-purple-600 hover:bg-purple-700"
                  )}
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link href="/register">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Section>

      <Section variant="dark">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about our pricing"
            centered
          />
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section variant="light">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl mb-6">
            Still have questions?
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Our team is here to help. Get in touch and we'll answer any questions you have.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>
      </Section>

      <Footer />
    </div>
  )
}

