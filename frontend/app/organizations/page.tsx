"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth";
import { useEffect } from "react";

export default function OrganizationsPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/admin/resources/organization');
    }
  }, [user, router]);

  if (user?.role === 'admin') {
    return null;
  }

  // Rest of the organizations page for regular users
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="container flex flex-col gap-6 py-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Organizations</h2>
          <p className="text-muted-foreground">
            Manage your organizations and teams.
          </p>
        </div>
      </div>
    </div>
  );
}
