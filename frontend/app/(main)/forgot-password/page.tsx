"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authApi } from "@/app/api/fetcher"
import { SplitAuthLayout } from "@/components/auth/split-auth-layout"
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    try {
      await authApi.forgotPassword(email)
      setSuccess(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to process request")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SplitAuthLayout
      welcomeTitle="Welcome Back"
      welcomeSubtitle="Reset your password to continue accessing your account"
    >
      <AuthFormWrapper
        title="Forgot password"
        subtitle="Enter your email address and we'll send you a link to reset your password"
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
              Check your email for a reset link. If you don't see it, check your spam folder.
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  type="email" 
                  required 
                />
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </>
          )}
        </form>
      </AuthFormWrapper>
    </SplitAuthLayout>
  )
}
