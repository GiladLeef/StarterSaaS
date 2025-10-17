"use client";

import { useAuth } from "@/app/providers/auth-provider";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/terms",
  "/privacy",
];

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname?.startsWith(route + "/")
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If public route, or authenticated on a protected route, show content
  if (isPublicRoute || isAuthenticated) {
    return <>{children}</>;
  }

  // Otherwise, we've handled the redirect in the provider
  // but we'll show a minimal UI here just in case
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    </div>
  );
} 