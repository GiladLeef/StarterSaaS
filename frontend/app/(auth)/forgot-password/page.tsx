"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authApi } from "@/app/api/fetcher"
import { SplitAuthLayout } from "@/components/auth/split-auth-layout"
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper"
import { useFormDialog } from "@/app/hooks/dialog"

export default function ForgotPasswordPage() {
  const {
    formData,
    handleChange,
    isSubmitting,
    error,
    handleSubmit
  } = useFormDialog({
    email: ""
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleSubmit(async () => {
      await authApi.forgotPassword(formData.email)
    })
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
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending reset link..." : "Send reset link"}
          </Button>
          
          <div className="text-center text-sm">
            <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
              Back to sign in
            </Link>
          </div>
        </form>
      </AuthFormWrapper>
    </SplitAuthLayout>
  )
}
