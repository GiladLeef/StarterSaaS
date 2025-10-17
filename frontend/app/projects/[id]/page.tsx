"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";
import { projectsApi, organizationsApi } from "@/app/api/fetcher";
import { PageHeader, PageHeaderAction } from "@/app/components/layout/header";
import { LoadingState, ErrorState } from "@/app/components/ui/state";
import { DangerZone } from "@/app/components/settings/danger";

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [project, setProject] = useState<any>(null);
  const [organization, setOrganization] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;
      
      try {
        setIsLoading(true);
        setError("");

        const projectResponse = await projectsApi.get(projectId);
        const projectData = projectResponse.data?.project || projectResponse.data;
        
        if (!projectData) {
          setError("Project not found");
          setIsLoading(false);
          return;
        }
        
        setProject(projectData);

        if (projectData?.organizationId) {
          try {
            const orgResponse = await organizationsApi.get(projectData.organizationId);
            const organizationData = orgResponse.data?.organization || orgResponse.data;
            setOrganization(organizationData);
          } catch (orgErr) {
            console.error("Error fetching organization:", orgErr);
          }
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleDeleteProject = async () => {
    if (!project?.id) return;
    
    try {
      setIsDeleting(true);
      await projectsApi.delete(project.id);
      router.push("/projects");
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!project?.id) return;
    
    try {
      setIsUpdatingStatus(true);
      await projectsApi.update(project.id, { status });
      setProject((prev: any) => ({ ...prev, status }));
    } catch (err) {
      console.error("Error updating project status:", err);
      alert("Failed to update project status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading project..." />;
  }

  if (error || !project) {
    return (
      <ErrorState 
        message={error || "Project not found"} 
        actionLabel="Return to Projects" 
        onAction={() => router.push("/projects")} 
      />
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="container flex flex-col gap-6 py-8">
        <PageHeader
          title={project.name}
          description={project.description || "No description provided"}
          actions={
            <>
              <StatusBadge status={project.status || "inactive"} />
              <PageHeaderAction href={`/projects/${project.id}/settings`} variant="outline">
                Settings
              </PageHeaderAction>
            </>
          }
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                  <dd>{project.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                  <dd>
                    <StatusBadge status={project.status || "inactive"} />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Organization</dt>
                  <dd>
                    {organization ? (
                      <Link 
                        href={`/organizations/${organization.id}`}
                        className="text-primary hover:underline"
                      >
                        {organization.name}
                      </Link>
                    ) : (
                      "Unknown"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                  <dd>{new Date(project.createdAt).toLocaleDateString()}</dd>
                </div>
                {project.updatedAt && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                    <dd>{new Date(project.updatedAt).toLocaleDateString()}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Actions</CardTitle>
              <CardDescription>Common actions for this project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Update Status</p>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant={project.status === 'active' ? 'default' : 'outline'}
                    onClick={() => handleUpdateStatus('active')}
                    disabled={isUpdatingStatus}
                  >
                    Active
                  </Button>
                  <Button 
                    size="sm" 
                    variant={project.status === 'completed' ? 'default' : 'outline'}
                    onClick={() => handleUpdateStatus('completed')}
                    disabled={isUpdatingStatus}
                  >
                    Completed
                  </Button>
                  <Button 
                    size="sm" 
                    variant={project.status === 'paused' ? 'default' : 'outline'}
                    onClick={() => handleUpdateStatus('paused')}
                    disabled={isUpdatingStatus}
                  >
                    Paused
                  </Button>
                </div>
              </div>
              
              <DangerZone 
                actionText="Permanently delete this project."
                actionLabel="Delete Project"
                onAction={handleDeleteProject}
                isLoading={isDeleting}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>
              Summary of project details and information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p>
                {project.description || "No detailed description provided for this project."}
              </p>
              <p className="mt-4">
                This project is part of the{" "}
                {organization ? (
                  <Link 
                    href={`/organizations/${organization.id}`}
                    className="text-primary hover:underline"
                  >
                    {organization.name}
                  </Link>
                ) : (
                  "Unknown"
                )}{" "}
                organization and is currently{" "}
                <span className="font-medium">{project.status || "inactive"}</span>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 