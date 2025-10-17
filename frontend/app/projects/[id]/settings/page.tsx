"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { projectsApi, organizationsApi } from "@/app/api/fetcher";
import { PageHeader } from "@/app/components/layout/header";
import { LoadingState, ErrorState } from "@/app/components/ui/state";
import { EntityForm } from "@/app/components/forms/entity";
import { DangerZone } from "@/app/components/settings/danger";
import { Label } from "@/components/ui/label";

export default function ProjectSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [project, setProject] = useState<any>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });
  
  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;
      
      try {
        setIsLoading(true);
        setError("");

        // Fetch project
        const projectResponse = await projectsApi.get(projectId);
        const projectData = projectResponse.data?.project || projectResponse.data;
        
        if (!projectData) {
          setError("Project not found");
          setIsLoading(false);
          return;
        }
        
        setProject(projectData);
        setFormData({
          name: projectData.name || "",
          description: projectData.description || "",
          status: projectData.status || "active",
        });

        // Fetch organizations for context
        const orgsResponse = await organizationsApi.list();
        setOrganizations(orgsResponse.data?.organizations || []);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      await projectsApi.update(projectId, formData);
      setSuccess("Project updated successfully");
    } catch (err) {
      setError("Failed to update project");
      console.error("Error updating project:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectId) return;
    
    try {
      setIsDeleting(true);
      await projectsApi.delete(projectId);
      router.push("/projects");
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project. Please try again.");
    } finally {
      setIsDeleting(false);
    }
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

  // Find organization name for display
  const organizationName = organizations.find(org => org.id === project?.organizationId)?.name || "Unknown";

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
            isLoading={isSaving}
            error={error}
            success={success}
            onSubmit={handleSubmit}
            fields={[
              {
                id: "name",
                name: "name",
                label: "Name",
                value: formData.name,
                onChange: handleInputChange,
                placeholder: "Project name",
                required: true,
              },
              {
                id: "description",
                name: "description",
                label: "Description (Optional)",
                value: formData.description,
                onChange: handleInputChange,
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
                onChange={handleInputChange}
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
                onAction={handleDeleteProject}
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