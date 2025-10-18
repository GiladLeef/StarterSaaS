"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLoading, DashboardError } from "./loading"

interface DashboardPageProps {
  layout: (props: { user: any; title: string; children: React.ReactNode }) => React.ReactNode
  title: string
  user: any
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  requireAuth?: boolean
  redirectAdmins?: boolean
  children: React.ReactNode
}

export function DashboardPage({
  layout: Layout,
  title,
  user,
  isLoading = false,
  error = null,
  onRetry,
  requireAuth = true,
  redirectAdmins = false,
  children,
}: DashboardPageProps) {
  const router = useRouter()

  useEffect(() => {
    if (redirectAdmins && user?.role === 'admin') {
      router.push('/admin')
    }
  }, [redirectAdmins, user, router])

  if (redirectAdmins && user?.role === 'admin') {
    return null
  }

  if (isLoading) {
    return (
      <Layout user={user} title={title}>
        <DashboardLoading />
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout user={user} title={title}>
        <DashboardError message={error} onRetry={onRetry} />
      </Layout>
    )
  }

  return (
    <Layout user={user} title={title}>
      {children}
    </Layout>
  )
}

