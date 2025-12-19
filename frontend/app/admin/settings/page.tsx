"use client"

import React from "react"
import { AdminDashboardLayout } from "@/components/dashboard/admin"
import { useAdminData } from "@/hooks/use-admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconDatabase } from "@tabler/icons-react"

export default function AdminSettingsPage() {
  const { user, resourcesArray, isLoading } = useAdminData()

  if (isLoading) {
    return (
      <AdminDashboardLayout user={user} resources={resourcesArray} title="Settings">
        <div className="flex items-center justify-center p-8">
          <p>Loading...</p>
        </div>
      </AdminDashboardLayout>
    )
  }

  return (
    <AdminDashboardLayout user={user} resources={resourcesArray} title="Settings">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Platform Status</h2>
          <p className="text-muted-foreground">
            System information and connection status
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Database</CardTitle>
              <CardDescription>
                Connection status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <IconDatabase className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-600">Connected</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  )
}
