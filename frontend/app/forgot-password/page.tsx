"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { authApi } from "@/app/api/fetcher";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to process request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive">
                {error}
              </div>
            )}
            
            {success ? (
              <div className="bg-green-100 p-3 rounded-md text-sm text-green-800">
                Check your email for a reset link. If you don't see it, check your spam folder.
              </div>
            ) : (
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
                <Button className="w-full mt-2" type="submit" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </div>
            )}
          </CardContent>
        </form>
        <CardFooter className="flex flex-col items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-primary font-medium underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 