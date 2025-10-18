"use client";

import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { projectsApi, organizationsApi } from "@/app/api/fetcher";
import { PageHeader } from "@/components/common/page-header";
import { LoadingState, ErrorState } from "@/app/components/ui/state";
import { EntityForm } from "@/app/components/forms/entity";
import { DangerZone } from "@/app/components/settings/danger";
import { Label } from "@/components/ui/label";
import { useResourceDetail } from "@/app/hooks/use-resource-detail";
import { useFormDialog } from "@/app/hooks/dialog";
import { useResourceList } from "@/app/hooks/resources";
import { useMutation } from "@/app/hooks/api";
import { useEffect } from "react";

export default function ProjectSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;
  
  // DRY: Use hooks for data fetching
  const { data: project, isLoading, error } = useResourceDetail(
    projectsApi.get,
    projectId,
    'project'
  ) as { data: any; isLoading: boolean; error: string };

  const { items: organizations } = useResourceList(organizationsApi, 'organizations');

  // DRY: Use form dialog hook
  const {
    formData,
    setFormData,
    handleChange,
    isSubmitting,
    error: formError,
    handleSubmit
  } = useFormDialog({
    name: "",
    description: "",
    status: "active",
  });

  // Update form when project loads
  useEffect(() => {
    if (project) {
      const proj = project as any;
      setFormData({
        name: proj.name || "",
        description: proj.description || "",
        status: proj.status || "active",
      });
    }
  }, [project, setFormData]);

  // DRY: Use mutation hook for delete
  const { mutate: deleteProject, isLoading: isDeleting } = useMutation(
    projectsApi.delete,
    {
      onSuccess: () => router.push("/projects"),
      onError: () => alert("Failed to delete project. Please try again.")
    }
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(async () => {
      await projectsApi.update(projectId, formData);
    });
  };

  if (isLoading) {
    return <LoadingState message="Loading project settings..." />;
  }

  if (error && !project) {
    return (
      <ErrorState 
        message={error} 
        actionLabel="Return to Projects" 
        onAction={() => router.push("/projects")} 
      />
    );
  }

  const foundOrg = organizations.find((org: any) => org.id === project?.organizationId) as any;
  const organizationName = foundOrg?.name || "Unknown";

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="container flex flex-col gap-6 py-8">
        <PageHeader
          title="Project Settings"
          description="Manage your project settings and preferences"
        />
        
        <div className="grid gap-6">
          <EntityForm
            title="Project Information"
            description="Update your project details"
            isLoading={isSubmitting}
            error={formError}
            onSubmit={onSubmit}
            fields={[
              {
                id: "name",
                name: "name",
                label: "Name",
                value: formData.name,
                onChange: handleChange,
                placeholder: "Project name",
                required: true,
              },
              {
                id: "description",
                name: "description",
                label: "Description (Optional)",
                value: formData.description,
                onChange: handleChange,
                placeholder: "A brief description of your project",
              },
            ]}
          >
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Organization</Label>
              <p className="text-sm text-muted-foreground">{organizationName}</p>
              <p className="text-xs text-muted-foreground">To move this project to another organization, please contact support.</p>
            </div>
          </EntityForm>
          
          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Actions that cannot be undone</CardDescription>
            </CardHeader>
            <CardContent>
              <DangerZone
                actionText="Permanently delete this project and all its data."
                actionLabel="Delete Project"
                onAction={() => deleteProject(projectId)}
                isLoading={isDeleting}
                confirmationMessage="Are you sure you want to delete this project? This action cannot be undone."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
