"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useResourceList } from "@/app/hooks/resources";
import { useFormDialog } from "@/app/hooks/dialog";
import { CreateDialog } from "@/app/components/forms/dialog";
import { projectsApi, organizationsApi } from "@/app/api/fetcher";
import { formatRelativeTime } from "@/app/utils/dates";
import { LoadingPage } from "@/app/components/ui/loading";
import { ErrorAlert } from "@/app/components/ui/error";
import { useStatusCounts, useGroupByOrg } from "@/app/hooks/auto";

interface Organization {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  status?: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  
  const {
    items: projects,
    isLoading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useResourceList<Project>(projectsApi, "projects");

  const {
    items: organizations,
    isLoading: orgsLoading,
  } = useResourceList<Organization>(organizationsApi, "organizations");

  const dialog = useFormDialog({
    name: "",
    organizationId: "",
    description: "",
  });

  const handleCreate = async () => {
    await dialog.handleSubmit(async (data) => {
      if (!data.name || !data.organizationId) {
        throw new Error("Project name and organization are required");
      }
      
      const response = await projectsApi.create(data);
      const createdProject = response.data?.project;
      
      if (createdProject && createdProject.id) {
        router.push(`/projects/${createdProject.id}`);
      } else {
        await refetchProjects();
      }
    });
  };

  if (projectsLoading || orgsLoading) {
    return <LoadingPage message="Loading projects..." />;
  }

  const statusCounts = useStatusCounts(projects);
  const projectsByOrg = useGroupByOrg(projects, organizations);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="container flex flex-col gap-6 py-8">
        {(projectsError || dialog.error) && (
          <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive mb-4">
            {projectsError || dialog.error}
          </div>
        )}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
            <p className="text-muted-foreground">Manage your projects across all organizations.</p>
          </div>

          <CreateDialog
            title="Create Project"
            description="Add a new project to one of your organizations."
            triggerText="Create Project"
            fields={[
              {
                name: "name",
                label: "Project Name",
                placeholder: "New Website",
                required: true,
              },
              {
                name: "organizationId",
                label: "Organization",
                type: "select",
                required: true,
                options: organizations.map((org) => ({
                  value: org.id,
                  label: org.name,
                })),
              },
              {
                name: "description",
                label: "Description",
                placeholder: "A brief description of your project",
              },
            ]}
            isOpen={dialog.isOpen}
            onOpenChange={dialog.setIsOpen}
            formData={dialog.formData}
            onChange={dialog.handleChange}
            onSubmit={handleCreate}
            isSubmitting={dialog.isSubmitting}
            error={dialog.error}
          />
        </div>

        {projects.length > 0 ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>All Projects</CardTitle>
                <CardDescription>View and manage all your projects across organizations.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>
                          {organizations.find((o) => o.id === project.organizationId)?.name || "—"}
                        </TableCell>
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
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Project Stats</CardTitle>
                  <CardDescription>Overview of your project portfolio.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Active Projects</p>
                        <p className="text-2xl font-bold">{statusCounts.active}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Completed Projects</p>
                        <p className="text-2xl font-bold">{statusCounts.completed}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">In Progress</p>
                        <p className="text-2xl font-bold">{statusCounts.inProgress}</p>
                      </div>
                    </div>

                    {projectsByOrg
                      .filter((org) => org.count > 0)
                      .map((org) => (
                        <div className="space-y-1" key={org.id}>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{org.name}</p>
                            <p className="text-sm font-medium">{org.count} projects</p>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div
                              className="h-2 rounded-full bg-primary"
                              style={{ width: `${Math.min(100, Math.max(0, org.percentage))}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Projects Yet</CardTitle>
              <CardDescription>Create your first project to get started.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => dialog.setIsOpen(true)}>
                Create Your First Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

