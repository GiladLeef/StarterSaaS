"use client";

import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { organizationsApi, projectsApi } from "@/app/api/fetcher";
import { formatRelativeTime } from "@/app/utils/dates";
import { PageHeader } from "@/components/common/page-header";
import { LoadingState, ErrorState } from "@/app/components/ui/state";
import { useResourceDetail } from "@/app/hooks/use-resource-detail";
import { useResourceList } from "@/app/hooks/resources";

export default function OrganizationProjectsPage() {
  const router = useRouter();
  const params = useParams();
  const organizationId = params?.id as string;
  
  // DRY: Use hooks for data fetching
  const { data: organization, isLoading: orgLoading, error: orgError } = useResourceDetail(
    organizationsApi.get,
    organizationId,
    'organization'
  );

  const { items: allProjects, isLoading: projectsLoading } = useResourceList(
    projectsApi,
    'projects'
  );

  // Filter projects for this organization
  const projects = allProjects.filter((p: any) => p.organizationId === organizationId);
  
  const isLoading = orgLoading || projectsLoading;
  const error = orgError;

  if (isLoading) {
    return <LoadingState message="Loading organization projects..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!organization) {
    return <ErrorState message="Organization not found" />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="container flex flex-col gap-6 py-8">
        <PageHeader
          title={`${organization.name} - Projects`}
          description={`Manage projects for ${organization.name}`}
          actions={
            <>
              <Button variant="outline" asChild>
                <Link href={`/organizations/${organization.id}`}>Organization Details</Link>
              </Button>
              <Button onClick={() => router.push("/projects")}>
                Create Project
              </Button>
            </>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              Projects in {organization.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project: any) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>
                        <StatusBadge status={project.status || "inactive"} />
                      </TableCell>
                      <TableCell>{formatRelativeTime(project.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/projects/${project.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No projects found for this organization.</p>
                <Button onClick={() => router.push("/projects")}>Create a Project</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
