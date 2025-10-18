"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard/layout"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardStats } from "@/components/dashboard/stats"
import { AdminResources } from "@/components/admin-resources"
import {
  IconDashboard,
  IconUsers,
  IconBuilding,
  IconFolder,
  IconFileDescription,
  IconSettings,
  IconHelp,
  IconInnerShadowTop,
} from "@tabler/icons-react"

const apiFetch = async (url: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${url}`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    },
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

function getIconForResource(key: string) {
  switch (key) {
    case "user": return IconUsers
    case "organization": return IconBuilding
    case "project": return IconFolder
    case "invitation":
    case "subscription": return IconFileDescription
    default: return IconDashboard
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = React.useState<any>(null);
  const [resources, setResources] = React.useState<Record<string, any>>({});
  const [user, setUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsResponse, resourcesResponse, userResponse] = await Promise.all([
          apiFetch('/api/v1/admin/stats'),
          apiFetch('/api/v1/admin/resources'),
          apiFetch('/api/v1/users/me'),
        ]);

        if (statsResponse.success && statsResponse.data.stats) {
          setStats(statsResponse.data.stats);
        }
        if (resourcesResponse.success && resourcesResponse.data.resources) {
          setResources(resourcesResponse.data.resources);
        }
        if (userResponse.success && userResponse.data.user) {
          setUser(userResponse.data.user);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load admin data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const resourcesArray = Object.entries(resources || {}).map(([key, value]) => ({ key, ...value }));

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const adminStats = [
    {
      title: "Total Users",
      value: stats?.users || 0,
      description: "Registered accounts",
      badge: "Active",
      footer: "Registered accounts",
      footerDescription: "Total platform users",
    },
    {
      title: "Organizations",
      value: stats?.organizations || 0,
      description: "Active organizations",
      badge: "Active",
      footer: "Active organizations",
      footerDescription: "Collaborative workspaces",
    },
    {
      title: "Total Projects",
      value: stats?.projects || 0,
      description: "All projects",
      badge: "All",
      footer: "Project portfolio",
      footerDescription: "All platform projects",
    },
    {
      title: "Active Projects",
      value: stats?.activeProjects || 0,
      description: "Currently active",
      badge: "Live",
      footer: "Currently active",
      footerDescription: "In-progress projects",
    },
  ];

  return (
    <DashboardLayout
      sidebar={
        <DashboardSidebar
          title="Admin Panel"
          titleUrl="/admin"
          icon={<IconInnerShadowTop className="!size-5" />}
          user={{
            name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Admin",
            email: user?.email || "admin@example.com",
            avatar: "/avatars/admin.jpg",
          }}
          navMain={[
            { title: "Dashboard", url: "/admin", icon: IconDashboard },
            ...resourcesArray.map((resource: any) => ({
              title: resource.pluralName || resource.name,
              url: `/admin/resources/${resource.key}`,
              icon: getIconForResource(resource.key),
            })),
          ]}
          navSecondary={[
            { title: "Settings", url: "/admin/settings", icon: IconSettings },
            { title: "Help", url: "/admin/help", icon: IconHelp },
          ]}
          variant="inset"
        />
      }
      header={<DashboardHeader title="Admin Dashboard" />}
    >
      <DashboardStats stats={adminStats} />
      <AdminResources resources={resourcesArray} />
    </DashboardLayout>
  )
}
