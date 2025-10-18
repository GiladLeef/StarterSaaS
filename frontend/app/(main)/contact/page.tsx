"use client"

import { useState } from 'react'
import { NavigationWithMegaMenu } from '@/components/landing/megamenu'
import { Footer } from '@/components/landing/footer'
import { Section } from '@/components/landing/section'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IconMail, IconMapPin, IconPhone, IconBrandTwitter, IconBrandLinkedin, IconBrandGithub } from '@tabler/icons-react'

const contactMethods = [
  {
    icon: IconMail,
    title: "Email",
    description: "Our team will respond within 24 hours",
    value: "hello@startersaas.com",
    link: "mailto:hello@startersaas.com"
  },
  {
    icon: IconPhone,
    title: "Phone",
    description: "Mon-Fri from 8am to 6pm EST",
    value: "+1 (555) 123-4567",
    link: "tel:+15551234567"
  },
  {
    icon: IconMapPin,
    title: "Office",
    description: "Visit us in person",
    value: "123 SaaS Street, San Francisco, CA 94105",
    link: "https://maps.google.com"
  }
]

const socialLinks = [
  { icon: IconBrandTwitter, label: "Twitter", link: "https://twitter.com" },
  { icon: IconBrandLinkedin, label: "LinkedIn", link: "https://linkedin.com" },
  { icon: IconBrandGithub, label: "GitHub", link: "https://github.com" }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    setIsSubmitting(false)
    setFormData({ name: '', email: '', company: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen">
      <NavigationWithMegaMenu />

      <Section variant="light" className="pt-32 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-300">
            <IconMail className="w-3 h-3 mr-1" />
            Get in Touch
          </Badge>
          <h1 className="text-5xl md:text-6xl mb-6">
            Let's talk about your project
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Have a question or want to work together? We'd love to hear from you.
          </p>
        </div>
      </Section>

      <Section variant="light" className="pt-0">
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <method.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle>{method.title}</CardTitle>
                <CardDescription>{method.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <a 
                  href={method.link}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                  target={method.link.startsWith('http') ? '_blank' : undefined}
                  rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {method.value}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconMail className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Acme Inc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project..."
                      rows={6}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full rounded-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section variant="dark">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl mb-6">
            Follow us on social media
          </h2>
          <p className="text-gray-300 mb-8">
            Stay updated with our latest news, features, and announcements
          </p>
          <div className="flex justify-center gap-4">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  )
}

