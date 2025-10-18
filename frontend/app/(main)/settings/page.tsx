"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/providers/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { userApi } from "@/app/api/fetcher"
import { UserDashboardLayout } from "@/components/dashboard/user"
import { PageHeader } from "@/components/common/page-header"

export default function SettingsPage() {
  const router = useRouter()
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      await userApi.updateProfile(formData)
      setSuccess("Profile updated successfully")
      
      // Update the user in the auth context
      if (updateUser) {
        updateUser({
          ...user,
          ...formData
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = () => {
    router.push("/forgot-password")
  }

  if (!user) {
    return (
      <UserDashboardLayout user={user} title="Settings">
        <div className="flex items-center justify-center p-8">
          <p>Loading user information...</p>
        </div>
      </UserDashboardLayout>
    )
  }

  return (
    <UserDashboardLayout user={user} title="Settings">
      <div className="px-4 lg:px-6">
        <PageHeader
          title="Settings"
          description="Manage your account settings and preferences."
        />

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account profile information.</CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <div className="bg-green-100 p-3 rounded-md text-sm text-green-700 mb-4 dark:bg-green-900/20 dark:text-green-400">
                  {success}
                </div>
              )}
              {error && (
                <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Password</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Change your password to keep your account secure.
                </p>
                <Button variant="outline" onClick={handleChangePassword}>
                  Change Password
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add an extra layer of security to your account.
                </p>
                <Button variant="outline" disabled>
                  Configure 2FA (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserDashboardLayout>
  )
}
