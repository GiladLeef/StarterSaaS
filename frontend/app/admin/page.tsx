"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAutoFetch } from "@/app/hooks/auto";
import Link from "next/link";

const apiFetch = async (url: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${url}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

interface AdminStats {
  users: number;
  organizations: number;
  projects: number;
  activeProjects: number;
}

interface ResourceMetadata {
  name: string;
  pluralName: string;
  capabilities: string[];
  fields: Array<{
    name: string;
    type: string;
    label: string;
    required: boolean;
    editable: boolean;
  }>;
  searchFields: string[];
  displayFields: string[];
}

export default function AdminDashboard() {
  const router = useRouter();
  
  const { data: statsData, isLoading: statsLoading } = useAutoFetch<AdminStats>(
    () => apiFetch("/api/v1/admin/stats"),
    "stats"
  );

  const { data: resourcesList, isLoading: resourcesLoading } = useAutoFetch<Record<string, ResourceMetadata>>(
    () => apiFetch("/api/v1/admin/resources"),
    "resources"
  );

  const isLoading = statsLoading || resourcesLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  const stats = statsData[0] || {};
  const resources = resourcesList[0] || {};

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="container flex flex-col gap-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
            <p className="text-muted-foreground">
              Manage your entire platform from one place.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users || 0}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.organizations || 0}</div>
              <p className="text-xs text-muted-foreground">Active organizations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.projects || 0}</div>
              <p className="text-xs text-muted-foreground">Total projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProjects || 0}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>
              Manage all platform resources automatically
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead>Capabilities</TableHead>
                  <TableHead>Searchable Fields</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(resources).map(([key, resource]) => (
                  <TableRow key={key}>
                    <TableCell>
                      <div className="font-medium capitalize">{resource.pluralName}</div>
                      <div className="text-sm text-muted-foreground">
                        {resource.fields.length} fields
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {resource.capabilities.map((cap) => (
                          <span
                            key={cap}
                            className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {resource.searchFields.join(", ")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/resources/${key}`}>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

