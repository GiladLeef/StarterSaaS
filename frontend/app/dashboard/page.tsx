"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../providers/auth"
import { DashboardLayout } from "@/components/dashboard/layout"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardStats } from "@/components/dashboard/stats"
import { UserQuickActions } from "@/components/user-quick-actions"
import {
  IconDashboard,
  IconBuilding,
  IconFolder,
  IconUser,
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

export default function UserDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [organizations, setOrganizations] = React.useState<any[]>([]);
  const [projects, setProjects] = React.useState<any[]>([]);
  const [invitations, setInvitations] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/admin');
      return;
    }
  }, [user, router]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [orgsResponse, projectsResponse, invitationsResponse] = await Promise.all([
          apiFetch('/api/v1/organizations'),
          apiFetch('/api/v1/projects'),
          apiFetch('/api/v1/invitations'),
        ]);

        if (orgsResponse.success && orgsResponse.data.organizations) {
          setOrganizations(orgsResponse.data.organizations);
        }
        if (projectsResponse.success && projectsResponse.data.projects) {
          setProjects(projectsResponse.data.projects);
        }
        if (invitationsResponse.success && invitationsResponse.data.invitations) {
          setInvitations(invitationsResponse.data.invitations);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
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

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const pendingInvitations = invitations.filter(i => i.status === 'pending').length;

  const stats = [
    {
      title: "Organizations",
      value: organizations.length,
      description: "Your organizations",
      badge: "Active",
      footer: "Your organizations",
      footerDescription: "Teams you're part of",
    },
    {
      title: "Total Projects",
      value: projects.length,
      description: "Your projects",
      badge: "All",
      footer: "Your projects",
      footerDescription: "All your projects",
    },
    {
      title: "Active Projects",
      value: activeProjects,
      description: "Currently active",
      badge: "Live",
      footer: "Currently active",
      footerDescription: "In-progress projects",
    },
    {
      title: "Invitations",
      value: pendingInvitations,
      description: "Pending invitations",
      badge: "Pending",
      footer: "Pending invitations",
      footerDescription: "Review and accept",
    },
  ];

  return (
    <DashboardLayout
      sidebar={
        <DashboardSidebar
          title="Platform"
          titleUrl="/dashboard"
          icon={<IconInnerShadowTop className="!size-5" />}
          user={{
            name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "User",
            email: user?.email || "user@example.com",
            avatar: "/avatars/user.jpg",
          }}
          navMain={[
            { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
            { title: "Organizations", url: "/organizations", icon: IconBuilding },
            { title: "Projects", url: "/projects", icon: IconFolder },
            { title: "Profile", url: "/profile", icon: IconUser },
          ]}
          navSecondary={[
            { title: "Settings", url: "/settings", icon: IconSettings },
            { title: "Help", url: "/help", icon: IconHelp },
          ]}
          variant="inset"
        />
      }
      header={<DashboardHeader title="Dashboard" />}
    >
      <DashboardStats stats={stats} />
      <UserQuickActions />
    </DashboardLayout>
  )
}
