"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/app/providers/auth";
import { SplitAuthLayout } from "@/components/auth/split-auth-layout";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import { GoogleButton } from "@/components/auth/google-button";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useFormDialog } from "@/app/hooks/dialog";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // DRY: Use form dialog hook
  const {
    formData,
    handleChange,
    error,
    setError,
    handleSubmit
  } = useFormDialog({
    email: "",
    password: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData.email, formData.password);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to sign in");
    }
  };

  return (
    <SplitAuthLayout
      welcomeTitle="Welcome back, legend."
      welcomeSubtitle="StarterSaaS kept working. You kept... building amazing products."
      highlightedWord="building amazing products"
    >
      <AuthFormWrapper
        title="Welcome to StarterSaaS."
        subtitle="Sign in to your account."
        alternateText="New user?"
        alternateLink="/register"
        alternateLinkText="Sign up"
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
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleButton />
        </form>
      </AuthFormWrapper>
    </SplitAuthLayout >
  );
}
