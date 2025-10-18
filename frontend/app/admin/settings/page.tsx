"use client"

import React, { useState, useEffect } from "react"
import { AdminDashboardLayout } from "@/components/dashboard/admin"
import { useAdminData } from "@/hooks/use-admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconSettings, IconShieldCheck, IconMail, IconDatabase, IconKey } from "@tabler/icons-react"
import { apiFetch } from "@/app/api/fetcher"

export default function AdminSettingsPage() {
  const { user, resourcesArray, isLoading } = useAdminData()
  const [settings, setSettings] = useState({
    siteName: "",
    siteUrl: "",
    supportEmail: "",
    enableRegistration: true,
    enableGoogleAuth: false,
    stripeConfigured: false,
  })

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await apiFetch('/api/v1/settings/all')
      if (response.success && response.data?.settings) {
        const apiSettings = response.data.settings
        setSettings({
          siteName: apiSettings.site_name || "",
          siteUrl: apiSettings.site_url || "",
          supportEmail: apiSettings.support_email || "",
          enableRegistration: apiSettings.enable_registration === "true",
          enableGoogleAuth: apiSettings.enable_google_auth === "true",
          stripeConfigured: apiSettings.stripe_configured === "true",
        })
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (section: string) => {
    setSaving(true)
    try {
      const settingsToSave: Record<string, string> = {
        site_name: settings.siteName,
        site_url: settings.siteUrl,
        support_email: settings.supportEmail,
        enable_registration: settings.enableRegistration.toString(),
        enable_google_auth: settings.enableGoogleAuth.toString(),
        stripe_configured: settings.stripeConfigured.toString(),
      }

      const response = await apiFetch('/api/v1/settings/batch', {
        method: 'PUT',
        body: JSON.stringify(settingsToSave),
      })

      if (response.success) {
        await loadSettings()
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  if (isLoading || loading) {
    return (
      <AdminDashboardLayout user={user} resources={resourcesArray} title="Settings">
        <div className="flex items-center justify-center p-8">
          <p>Loading settings...</p>
        </div>
      </AdminDashboardLayout>
    )
  }

  return (
    <AdminDashboardLayout user={user} resources={resourcesArray} title="Settings">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Platform Settings</h2>
          <p className="text-muted-foreground">
            Manage your platform configuration and preferences
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">
              <IconSettings className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="security">
              <IconShieldCheck className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="email">
              <IconMail className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <IconKey className="w-4 h-4 mr-2" />
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic platform settings and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  />
                </div>

                <Button onClick={() => handleSave('general')} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage authentication and access control
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register accounts
                    </p>
                  </div>
                  <Badge variant={settings.enableRegistration ? "default" : "secondary"}>
                    {settings.enableRegistration ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Google OAuth</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable Google authentication
                    </p>
                  </div>
                  <Badge variant={settings.enableGoogleAuth ? "default" : "secondary"}>
                    {settings.enableGoogleAuth ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Password Requirements</Label>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <IconShieldCheck className="w-4 h-4" />
                      Minimum 8 characters
                    </div>
                    <div className="flex items-center gap-2">
                      <IconShieldCheck className="w-4 h-4" />
                      Must contain uppercase and lowercase letters
                    </div>
                    <div className="flex items-center gap-2">
                      <IconShieldCheck className="w-4 h-4" />
                      Must contain at least one number
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('security')} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>
                  Configure SMTP settings for sending emails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    placeholder="smtp.example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      placeholder="587"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpEncryption">Encryption</Label>
                    <Input
                      id="smtpEncryption"
                      placeholder="TLS"
                      disabled
                      value="TLS"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    placeholder="username@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => handleSave('email')} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline">
                    Send Test Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Stripe Integration</CardTitle>
                <CardDescription>
                  Configure Stripe for payment processing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <IconDatabase className="w-8 h-8" />
                    <div>
                      <p className="font-medium">Stripe</p>
                      <p className="text-sm text-muted-foreground">
                        Payment processing and subscriptions
                      </p>
                    </div>
                  </div>
                  <Badge variant={settings.stripeConfigured ? "default" : "secondary"}>
                    {settings.stripeConfigured ? "Connected" : "Not Connected"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stripePublishable">Publishable Key</Label>
                  <Input
                    id="stripePublishable"
                    placeholder="pk_test_..."
                    type="password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stripeSecret">Secret Key</Label>
                  <Input
                    id="stripeSecret"
                    placeholder="sk_test_..."
                    type="password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stripeWebhook">Webhook Secret</Label>
                  <Input
                    id="stripeWebhook"
                    placeholder="whsec_..."
                    type="password"
                  />
                  <p className="text-sm text-muted-foreground">
                    Webhook URL: {typeof window !== 'undefined' ? window.location.origin : ''}/api/v1/billing/webhook
                  </p>
                </div>

                <Button onClick={() => handleSave('integrations')} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database</CardTitle>
                <CardDescription>
                  Database connection status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <IconDatabase className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-medium">PostgreSQL</p>
                      <p className="text-sm text-muted-foreground">
                        Connected and operational
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">Connected</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboardLayout>
  )
}

