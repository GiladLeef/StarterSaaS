"use client";

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
import { formatRelativeTime } from "@/app/utils/dates";
import { PageHeader } from "@/components/common/page-header";
import { LoadingState, ErrorState } from "@/app/components/ui/state";
import { useResourceDetail } from "@/app/hooks/use-resource-detail";
import { useResourceList } from "@/app/hooks/resources";
import { useFormDialog } from "@/app/hooks/dialog";

export default function OrganizationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const organizationId = params?.id as string;
  
  // DRY: Use hooks for data fetching
  const { data: organization, isLoading: orgLoading, error: orgError } = useResourceDetail(
    organizationsApi.get,
    organizationId,
    'organization'
  );

  const { items: allProjects } = useResourceList(projectsApi, 'projects');
  
  // Filter projects for this organization
  const projects = allProjects.filter((p: any) => p.organizationId === organizationId);

  // DRY: Use form dialog for invite
  const inviteDialog = useFormDialog({
    email: "",
  });

  const handleInviteMember = async () => {
    await inviteDialog.handleSubmit(async () => {
      if (!inviteDialog.formData.email || !organizationId) return;
      
      await invitationsApi.create({
        organizationId,
        email: inviteDialog.formData.email,
      });
      
      inviteDialog.reset();
    });
  };

  const isLoading = orgLoading;
  const error = orgError;

  if (isLoading) {
    return <LoadingState message="Loading organization..." />;
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
          title={organization.name}
          description={organization.description || "No description provided"}
          actions={
            <>
              <Dialog open={inviteDialog.isOpen} onOpenChange={inviteDialog.setIsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Invite Member</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Send an invitation to join {organization.name}
                    </DialogDescription>
                  </DialogHeader>

                  {inviteDialog.error && (
                    <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive">
                      {inviteDialog.error}
                    </div>
                  )}

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="colleague@example.com"
                        value={inviteDialog.formData.email}
                        onChange={inviteDialog.handleChange}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      onClick={handleInviteMember}
                      disabled={inviteDialog.isSubmitting || !inviteDialog.formData.email}
                    >
                      {inviteDialog.isSubmitting ? "Sending..." : "Send Invitation"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button asChild>
                <Link href={`/organizations/${organization.id}/settings`}>Settings</Link>
              </Button>
            </>
          }
        />

        <div className="grid gap-6 md:grid-cols-2">
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
                  <dd className="font-mono text-sm">{organization.slug}</dd>
                </div>
                {organization.description && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                    <dd>{organization.description}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                  <dd>{new Date(organization.createdAt).toLocaleDateString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Organization overview</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-muted-foreground">Projects</dt>
                  <dd className="text-2xl font-bold">{projects.length}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-muted-foreground">Active Projects</dt>
                  <dd className="text-2xl font-bold">
                    {projects.filter((p: any) => p.status === 'active').length}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Projects in this organization</CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length > 0 ? (
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
                <p className="text-muted-foreground mb-4">No projects yet</p>
                <Button onClick={() => router.push('/projects')}>
                  Create a Project
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
