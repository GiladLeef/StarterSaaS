"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/providers/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AvatarUpload } from "@/components/avatar-upload"
import { userApi } from "@/app/api/fetcher"

export default function ProfileSettingsPage() {
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
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
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
                onChange={handleInputChange}
                placeholder="john@example.com"
              />
              <p className="text-xs text-muted-foreground">
                This is your primary email for notifications and account recovery
              </p>
            </div>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

