"use client"

import React from "react"
import { AdminDashboardLayout } from "@/components/dashboard/admin"
import { DashboardStats } from "@/components/dashboard/stats"
import { DashboardLoading, DashboardError } from "@/components/dashboard/loading"
import { AdminResources } from "@/components/admin-resources"
import { useAdminData } from "@/hooks/use-admin"

const apiFetch = async (url: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${url}`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    },
  })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export default function AdminDashboard() {
  const { user, resourcesArray, isLoading, error } = useAdminData()
  const [stats, setStats] = React.useState<any>(null)

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsResponse = await apiFetch('/api/v1/admin/stats')
        if (statsResponse.success && statsResponse.data.stats) {
          setStats(statsResponse.data.stats)
        }
      } catch (err) {
        console.error('Failed to load stats')
      }
    }
    if (!isLoading) fetchStats()
  }, [isLoading])

  if (isLoading) {
    return (
      <AdminDashboardLayout user={user} resources={resourcesArray} title="Admin Dashboard">
        <DashboardLoading message="Loading admin dashboard..." />
      </AdminDashboardLayout>
    )
  }

  if (error) {
    return (
      <AdminDashboardLayout user={user} resources={resourcesArray} title="Admin Dashboard">
        <DashboardError message={error} onRetry={() => window.location.reload()} />
      </AdminDashboardLayout>
    )
  }

  const adminStats = stats ? [
    { title: "Total Users", value: stats.users, description: "Registered accounts", badge: "Active", footer: "Registered accounts", footerDescription: "Total platform users" },
    { title: "Organizations", value: stats.organizations, description: "Active organizations", badge: "Active", footer: "Active organizations", footerDescription: "Collaborative workspaces" },
    { title: "Total Projects", value: stats.projects, description: "All projects", badge: "All", footer: "Project portfolio", footerDescription: "All platform projects" },
    { title: "Active Projects", value: stats.activeProjects, description: "Currently active", badge: "Live", footer: "Currently active", footerDescription: "In-progress projects" },
  ] : []

  return (
    <AdminDashboardLayout user={user} resources={resourcesArray} title="Admin Dashboard">
      {stats && <DashboardStats stats={adminStats} />}
      <AdminResources resources={resourcesArray} />
    </AdminDashboardLayout>
  )
}
