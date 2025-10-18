"use client"

import { useEffect } from "react"
import { useAuth } from "@/app/providers/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AvatarUpload } from "@/components/avatar-upload"
import { userApi } from "@/app/api/fetcher"
import { useFormDialog } from "@/app/hooks/dialog"

export default function ProfileSettingsPage() {
  const { user, updateUser } = useAuth()
  
  const {
    formData,
    setFormData,
    handleChange,
    isSubmitting,
    error,
    handleSubmit
  } = useFormDialog({
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
  }, [user, setFormData])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleSubmit(async () => {
      await userApi.updateProfile(formData)
      
      if (updateUser) {
        updateUser({
          ...user,
          ...formData
        })
      }
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Upload or generate your profile picture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AvatarUpload
            currentAvatar={user?.avatar}
            userName={`${formData.firstName} ${formData.lastName}`.trim()}
            userEmail={formData.email}
            onAvatarChange={(newAvatar) => {
              if (updateUser) {
                updateUser({
                  ...user,
                  avatar: newAvatar
                })
              }
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and how others see you
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                />
              </div>
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
              />
              <p className="text-xs text-muted-foreground">
                This is your primary email for notifications and account recovery
              </p>
            </div>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
