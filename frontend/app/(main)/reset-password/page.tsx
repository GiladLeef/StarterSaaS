"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authApi } from "@/app/api/fetcher"
import { SplitAuthLayout } from "@/components/auth/split-auth-layout"
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [token, setToken] = useState("")
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      setError("Invalid or missing reset token")
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!token) {
      setError("Invalid reset token")
      return
    }

    setIsLoading(true)

    try {
      await authApi.resetPassword(token, formData.password)
      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to reset password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SplitAuthLayout
      welcomeTitle="Welcome Back"
      welcomeSubtitle="Create a new password to secure your account"
    >
      <AuthFormWrapper
        title="Reset password"
        subtitle="Enter your new password"
        alternateText="Remember your password?"
        alternateLinkText="Sign in"
        alternateLink="/login"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive">
              {error}
            </div>
          )}
          
          {success ? (
            <div className="bg-green-100 p-3 rounded-md text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
              Password has been reset successfully. Redirecting to login...
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input 
                  id="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type="password" 
                  required 
                />
              </div>
              <Button className="w-full" type="submit" disabled={isLoading || !token}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </>
          )}
        </form>
      </AuthFormWrapper>
    </SplitAuthLayout>
  )
}
