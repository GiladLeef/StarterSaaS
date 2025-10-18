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

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-black">
              Email
            </Label>
            <Input 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email" 
              type="email" 
              className="h-12"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-black">
              Password
            </Label>
            <div className="relative">
              <Input 
                id="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="h-12 pr-10"
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <IconEyeOff className="w-5 h-5" />
                ) : (
                  <IconEye className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-gray-600 hover:text-black underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button 
            className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-md" 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          <GoogleButton disabled={isLoading} />
        </form>
      </AuthFormWrapper>
    </SplitAuthLayout>
  );
} 