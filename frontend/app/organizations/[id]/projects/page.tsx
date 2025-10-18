"use client";

import { useState, useEffect } from "react";
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

export default function OrganizationProjectsPage() {
  const router = useRouter();
  const params = useParams();
  const organizationId = params?.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [organization, setOrganization] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!organizationId) return;
      
      try {
        setIsLoading(true);
        setError("");

        const orgResponse = await organizationsApi.get(organizationId);
        // The organization data is in orgResponse.data.organization or directly in data
        const orgData = orgResponse.data?.organization || orgResponse.data;
        
        if (!orgData) {
          setError("Organization not found");
          setIsLoading(false);
          return;
        }
        
        setOrganization(orgData);

        try {
          const projectsResponse = await projectsApi.list();
          const projectsData = projectsResponse.data?.projects || projectsResponse.data || [];
          
          const orgProjects = Array.isArray(projectsData) 
            ? projectsData.filter((p: any) => p.organizationId === organizationId) 
            : [];
          
          setProjects(orgProjects);
        } catch (projErr) {
          console.error("Error fetching projects:", projErr);
          setError("Failed to load projects data");
        }
      } catch (err) {
        console.error("Error fetching organization:", err);
        setError("Failed to load organization data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [organizationId, router]);

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
                <a href={`/organizations/${organization.id}`}>Organization Details</a>
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
                  {projects.map((project) => (
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