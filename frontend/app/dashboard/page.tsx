"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { organizationsApi, projectsApi } from "@/app/api/fetcher";
import { useAuth } from "@/app/providers/auth-provider";
import { formatRelativeTime } from "@/app/utils/date-utils";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const orgsResponse = await organizationsApi.list();
        setOrganizations(orgsResponse.data?.organizations || []);

        const projectsResponse = await projectsApi.list();
        setProjects(projectsResponse.data?.projects || []);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeProjectsCount = projects.filter(p => 
    p.status?.toLowerCase() === 'active').length;

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <p className="text-destructive">{error}</p>
        <Button className="mt-4" onClick={() => router.push("/login")}>
          Return to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="container flex flex-col gap-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! Here's an overview of your platform.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => router.push("/projects")}>
              Create Project
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organizations</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{organizations.length}</div>
              <p className="text-xs text-muted-foreground">
                {organizations.length === 0 ? 'No organizations yet' : `${organizations.length} ${organizations.length === 1 ? 'organization' : 'organizations'}`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjectsCount}</div>
              <p className="text-xs text-muted-foreground">
                {projects.length === 0 ? 'No projects yet' : `${projects.length} total projects`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.subscription?.status || "Free"}</div>
              <p className="text-xs text-muted-foreground">{user?.subscription?.plan || "Free Plan"}</p>
            </CardContent>
          </Card>
        </div>
        
        {projects.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>
                You have {activeProjectsCount} active {activeProjectsCount === 1 ? 'project' : 'projects'}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.slice(0, 4).map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.organization?.name || "—"}</TableCell>
                      <TableCell>
                        <StatusBadge status={project.status || "inactive"} />
                      </TableCell>
                      <TableCell className="text-right">
                        {formatRelativeTime(project.updatedAt || project.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {projects.length > 4 && (
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/projects">View All Projects</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Projects Yet</CardTitle>
              <CardDescription>
                Create your first project to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => router.push("/projects")}>
                Create Your First Project
              </Button>
            </CardContent>
          </Card>
        )}
        
        {organizations.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Organizations</CardTitle>
              <CardDescription>
                You belong to {organizations.length} {organizations.length === 1 ? 'organization' : 'organizations'}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {organizations.map((org) => (
                  <Card key={org.id}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{org.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">
                        {org.projectCount || 0} {(org.projectCount || 0) === 1 ? 'project' : 'projects'} • 
                        {org.memberCount || 0} {(org.memberCount || 0) === 1 ? 'member' : 'members'}
                      </p>
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/organizations/${org.id}`}>View</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Organizations Yet</CardTitle>
              <CardDescription>
                Create your first organization to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => router.push("/organizations")}>
                Create Your First Organization
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 