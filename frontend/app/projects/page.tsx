"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useResourceList } from "@/app/hooks/resources";
import { CreateDialog } from "@/app/components/forms/dialog";
import { useFormDialog } from "@/app/hooks/dialog";
import { projectsApi, organizationsApi } from "@/app/api/fetcher";
import { useAuth } from "@/app/providers/auth";
import { useEffect } from "react";
import { UserDashboardLayout } from "@/components/dashboard/user";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { calculateStatusCounts, groupByOrganization, formatCount } from "@/lib/utils/resource-helpers";

interface Organization {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
  organizationId: string;
  status?: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/admin/resources/project');
    }
  }, [user, router]);

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
    description: "",
    organizationId: "",
  });

  const handleCreate = async () => {
    await dialog.handleSubmit(async (data) => {
      await projectsApi.create(data);
      await refetchProjects();
    });
  };

  if (user?.role === 'admin') {
    return null;
  }

  const isLoading = projectsLoading || orgsLoading;
  const error = projectsError;

  if (isLoading) {
    return (
      <UserDashboardLayout user={user} title="Projects">
        <div className="flex items-center justify-center p-8">
          <p>Loading projects...</p>
        </div>
      </UserDashboardLayout>
    );
  }

  // Calculate statistics
  const statusCounts = calculateStatusCounts(projects);
  const projectsByOrg = groupByOrganization(projects, organizations);

  return (
    <UserDashboardLayout user={user} title="Projects">
      <div className="px-4 lg:px-6">
        {error && (
          <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6">
          <PageHeader
            title="Projects"
            description="Manage your projects and track their progress."
            action={
              <CreateDialog
                title="Create Project"
                description="Add a new project to get started."
                triggerText="Create Project"
                fields={[
                  {
                    name: "name",
                    label: "Project Name",
                    placeholder: "My Awesome Project",
                    required: true,
                  },
                  {
                    name: "description",
                    label: "Description",
                    placeholder: "A brief description of your project",
                  },
                  {
                    name: "organizationId",
                    label: "Organization",
                    type: "select",
                    options: organizations.map(org => ({
                      label: org.name,
                      value: org.id,
                    })),
                    required: true,
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
            }
          />

          {/* Statistics Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Projects"
              value={projects.length}
              description="All your projects"
            />
            <StatCard
              title="Active"
              value={statusCounts.active}
              description="Currently in progress"
            />
            <StatCard
              title="Completed"
              value={statusCounts.completed}
              description="Successfully finished"
            />
            <StatCard
              title="Organizations"
              value={Object.keys(projectsByOrg).length}
              description="With projects"
            />
          </div>

          {/* Projects by Organization */}
          {Object.entries(projectsByOrg).map(([orgName, orgProjects]) => {
            const projectList = Array.isArray(orgProjects) ? orgProjects : [];
            return (
              <Card key={orgName}>
                <CardHeader>
                  <CardTitle>{orgName}</CardTitle>
                  <CardDescription>
                    {formatCount(projectList.length, 'project')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectList.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/projects/${project.id}`}
                            className="hover:underline"
                          >
                            {project.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={project.status || "inactive"} />
                        </TableCell>
                        <TableCell>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/projects/${project.id}/settings`}>
                              Settings
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}

          {projects.length === 0 && (
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
    </UserDashboardLayout>
  );
}
