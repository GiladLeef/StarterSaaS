"use client"

import { SplitAuthLayout } from '@/components/auth/split-auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IconMail, IconMapPin, IconPhone, IconBrandTwitter, IconBrandLinkedin, IconBrandGithub } from '@tabler/icons-react'
import { appConfig } from '@/lib/config'
import { useFormDialog } from '@/app/hooks/dialog'

export default function ContactPage() {
  const contactMethods = [
    {
      icon: IconMail,
      title: "Email",
      description: "Our team will respond within 24 hours",
      value: appConfig.supportEmail,
      link: `mailto:${appConfig.supportEmail}`
    },
    {
      icon: IconPhone,
      title: "Phone",
      description: "Mon-Fri from 8am to 6pm EST",
      value: appConfig.companyPhone,
      link: `tel:${appConfig.companyPhone.replace(/[^0-9]/g, '')}`
    },
    {
      icon: IconMapPin,
      title: "Office",
      description: "Visit us in person",
      value: appConfig.companyAddress,
      link: `https://maps.google.com/maps?q=${encodeURIComponent(appConfig.companyAddress)}`
    }
  ]

  const socialLinks = [
    { icon: IconBrandTwitter, label: "Twitter", link: appConfig.twitterUrl },
    { icon: IconBrandLinkedin, label: "LinkedIn", link: appConfig.linkedinUrl },
    { icon: IconBrandGithub, label: "GitHub", link: appConfig.githubUrl }
  ]
  
  const {
    formData,
    handleChange,
    isSubmitting,
    error,
    reset,
    handleSubmit
  } = useFormDialog({
    name: '',
    email: '',
    company: '',
    message: ''
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleSubmit(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      reset()
    })
  }

  return (
    <SplitAuthLayout
      welcomeTitle="Get in Touch"
      welcomeSubtitle="We'd love to hear from you. Reach out anytime."
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>Fill out the form and we'll get back to you within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
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
                  <Label htmlFor="email">Email</Label>
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
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your Company"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange as any}
                    placeholder="Tell us how we can help..."
                    required
                    className="min-h-[150px]"
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Reach us through any of these channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, idx) => (
                  <a
                    key={idx}
                    href={method.link}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:border-primary transition-colors"
                  >
                    <method.icon className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <p className="font-medium">{method.title}</p>
                      <p className="text-sm text-muted-foreground mb-1">{method.description}</p>
                      <p className="text-sm font-medium">{method.value}</p>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
                <CardDescription>Stay connected on social media</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg border hover:border-primary hover:bg-primary/10 transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
                <CardDescription>We're available during these times</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="font-medium">8:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SplitAuthLayout>
  )
}
