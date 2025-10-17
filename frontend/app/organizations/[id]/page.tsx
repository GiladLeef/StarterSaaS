"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { organizationsApi, projectsApi, invitationsApi } from "@/app/api/fetcher";
import { formatRelativeTime } from "@/app/utils/date-utils";
import { PageHeader, PageHeaderAction } from "@/app/components/page-header";
import { LoadingState, ErrorState } from "@/app/components/loading-state";

export default function OrganizationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const organizationId = params?.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [organization, setOrganization] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState("");
  const [inviteError, setInviteError] = useState("");

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
          // Continue even if projects fetch fails
        }
      } catch (err) {
        console.error("Error fetching organization:", err);
        setError("Failed to load organization data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [organizationId]);

  const handleInviteMember = async () => {
    if (!inviteEmail || !organizationId) return;
    
    try {
      setIsInviting(true);
      setInviteError("");
      setInviteSuccess("");

      await invitationsApi.create({
        organizationId,
        email: inviteEmail
      });

      setInviteSuccess(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
    } catch (err) {
      console.error("Error inviting member:", err);
      setInviteError(
        err instanceof Error 
          ? err.message 
          : "Failed to send invitation. Please try again."
      );
    } finally {
      setIsInviting(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading organization..." />;
  }

  if (error || !organization) {
    return (
      <ErrorState 
        message={error || "Organization not found"} 
        actionLabel="Return to Organizations" 
        onAction={() => router.push("/organizations")} 
      />
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="container flex flex-col gap-6 py-8">
        <PageHeader
          title={organization.name}
          description={organization.description || "No description provided"}
          actions={
            <>
              <PageHeaderAction href={`/organizations/${organization.id}/settings`} variant="outline">
                Settings
              </PageHeaderAction>
              <PageHeaderAction onClick={() => router.push("/projects")}>
                Create Project
              </PageHeaderAction>
            </>
          }
        />

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                  <dd>{organization.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Slug</dt>
                  <dd>{organization.slug}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                  <dd>{new Date(organization.createdAt).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Members</dt>
                  <dd>{organization.memberCount || 1}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Organization Stats</CardTitle>
                <CardDescription>Overview of organization activity</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">Invite Member</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Member</DialogTitle>
                    <DialogDescription>
                      Invite a new member to join this organization by email
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {inviteSuccess && (
                      <div className="bg-green-100 p-3 rounded-md text-sm text-green-700">
                        {inviteSuccess}
                      </div>
                    )}
                    {inviteError && (
                      <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive">
                        {inviteError}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@example.com" 
                      />
                      <p className="text-xs text-muted-foreground">
                        The email must be registered on the platform for the invitation to be accepted.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="submit"
                      onClick={handleInviteMember}
                      disabled={isInviting || !inviteEmail}
                    >
                      {isInviting ? "Sending..." : "Send Invitation"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                  <p className="text-3xl font-bold">{projects.length}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-3xl font-bold">
                    {projects.filter(p => p.status?.toLowerCase() === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              Projects in this organization
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