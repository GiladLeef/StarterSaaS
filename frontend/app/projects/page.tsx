"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { IconContainer } from "@/components/ui/icon-container";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { projectsApi, organizationsApi } from "@/app/api/fetcher";
import Link from "next/link";

// Reusable activity item component
function ActivityItem({ icon, title, time }: { icon: React.ReactNode, title: string, time: string }) {
  return (
    <div className="flex items-start gap-4">
      <IconContainer>
        {icon}
      </IconContainer>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}

// Progress bar component
function ProgressBar({ percentage }: { percentage: number }) {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  return (
    <div className="h-2 w-full rounded-full bg-muted">
      <div 
        className="h-2 rounded-full bg-primary"
        style={{ width: `${clampedPercentage}%` }}
      />
    </div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    organizationId: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Fetch projects
        const projectsResponse = await projectsApi.list();
        setProjects(projectsResponse.data?.projects || []);

        // Fetch organizations for the dropdown
        const orgsResponse = await organizationsApi.list();
        setOrganizations(orgsResponse.data?.organizations || []);
      } catch (err) {
        setError("Failed to load projects");
        if (err instanceof Error && err.message.includes("unauthorized")) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateProject = async () => {
    try {
      setIsCreating(true);
      setError("");

      if (!newProject.name || !newProject.organizationId) {
        setError("Project name and organization are required");
        return;
      }

      const response = await projectsApi.create(newProject);
      
      // Reset form and close dialog
      setNewProject({
        name: "",
        organizationId: "",
        description: "",
      });
      setDialogOpen(false);
      
      // Get the created project
      const createdProject = response.data?.project;
      if (createdProject && createdProject.id) {
        // Add to the list and navigate to the project detail page
        setProjects(prev => [...prev, createdProject]);
        router.push(`/projects/${createdProject.id}`);
      } else {
        // Just update the project list
        const projectsResponse = await projectsApi.list();
        setProjects(projectsResponse.data?.projects || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  // Helper function to format date relative to now
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
  };

  // Calculate project counts by organization
  const projectsByOrg = organizations.map(org => {
    const count = projects.filter(p => p.organizationId === org.id).length;
    const percentage = organizations.length > 0 
      ? (count / projects.length) * 100 
      : 0;
    return { ...org, count, percentage };
  });

  // Count projects by status
  const statusCounts = {
    active: projects.filter(p => p.status?.toLowerCase() === 'active').length,
    completed: projects.filter(p => p.status?.toLowerCase() === 'completed').length,
    inProgress: projects.filter(p => 
      p.status?.toLowerCase() === 'in progress' || 
      p.status?.toLowerCase() === 'in-progress'
    ).length,
  };

  // Early loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="container flex flex-col gap-6 py-8">
        {error && (
          <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive mb-4">
            {error}
          </div>
        )}
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
            <p className="text-muted-foreground">Manage your projects across all organizations.</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Create Project</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Project</DialogTitle>
                  <DialogDescription>
                    Add a new project to one of your organizations.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={newProject.name}
                      onChange={handleInputChange}
                      placeholder="New Website" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizationId">Organization</Label>
                    <select
                      id="organizationId"
                      name="organizationId"
                      value={newProject.organizationId}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select an organization</option>
                      {organizations.map(org => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input 
                      id="description" 
                      name="description"
                      value={newProject.description}
                      onChange={handleInputChange}
                      placeholder="A brief description of your project" 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit"
                    onClick={handleCreateProject}
                    disabled={isCreating || !newProject.name || !newProject.organizationId}
                  >
                    {isCreating ? "Creating..." : "Create Project"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {projects.length > 0 ? (
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
                  {projects.map(project => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>
                        {organizations.find(o => o.id === project.organizationId)?.name || "—"}
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
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Projects Yet</CardTitle>
              <CardDescription>Create your first project to get started.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => setDialogOpen(true)}>
                Create Your First Project
              </Button>
            </CardContent>
          </Card>
        )}
        
        {projects.length > 0 && (
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
                  
                  {projectsByOrg.filter(org => org.count > 0).map(org => (
                    <div className="space-y-1" key={org.id}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{org.name}</p>
                        <p className="text-sm font-medium">{org.count} projects</p>
                      </div>
                      <ProgressBar percentage={org.percentage} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 