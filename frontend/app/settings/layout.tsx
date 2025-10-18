"use client"

import { UserDashboardLayout } from "@/components/dashboard/user"
import { useAuth } from "@/app/providers/auth"
import { SettingsNav } from "@/components/settings/settings-nav"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  return (
    <UserDashboardLayout user={user} title="Settings">
      <div className="px-4 lg:px-6">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
            <aside className="lg:sticky lg:top-4 lg:self-start">
              <SettingsNav />
            </aside>
            
            <main>{children}</main>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  )
}

