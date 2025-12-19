"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authApi } from "@/app/api/fetcher"
import { SplitAuthLayout } from "@/components/auth/split-auth-layout"
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper"
import { IconEye, IconEyeOff } from "@tabler/icons-react"
import { useFormDialog } from "@/app/hooks/dialog"
import { useState } from "react"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    formData,
    handleChange,
    isSubmitting,
    error,
    handleSubmit
  } = useFormDialog({
    password: "",
    confirmPassword: ""
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await handleSubmit(async () => {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match")
      }
      
      if (!token) {
        throw new Error("Reset token is missing")
      }
      
      await authApi.resetPassword(token, formData.password)
    })
  }

  return (
    <SplitAuthLayout
      welcomeTitle="Create New Password"
      welcomeSubtitle="Set a strong password to secure your account"
    >
      <AuthFormWrapper
        title="Reset password"
        subtitle="Enter your new password below"
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
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Resetting password..." : "Reset password"}
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
