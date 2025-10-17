"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { organizationsApi, invitationsApi } from "@/app/api/fetcher";
import Link from "next/link";

export default function OrganizationsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newOrg, setNewOrg] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Fetch organizations
        const response = await organizationsApi.list();
        setOrganizations(response.data?.organizations || []);
        
        // Fetch invitations
        const invitationsResponse = await invitationsApi.list();
        setInvitations(invitationsResponse.data?.invitations || []);
      } catch (err) {
        console.error('Error fetching organizations:', err);
        setError("Failed to load organizations");
        if (err instanceof Error && err.message.includes("unauthorized")) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOrg(prev => ({
      ...prev,
      [name]: value,
      // Always auto-generate slug from name
      ...(name === "name" ? { slug: value.toLowerCase().replace(/\s+/g, "-") } : {})
    }));
  };

  const handleCreateOrg = async () => {
    try {
      setIsCreating(true);
      setError("");

      await organizationsApi.create(newOrg);
      
      // Close dialog and reset form
      setDialogOpen(false);
      setNewOrg({
        name: "",
        slug: "",
        description: "",
      });
      
      // Navigate to the dashboard to refresh the data
      // This prevents client-side errors from happening
      router.refresh();
    } catch (err) {
      console.error('Error creating organization:', err);
      setError(err instanceof Error ? err.message : "Failed to create organization");
    } finally {
      setIsCreating(false);
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      await invitationsApi.accept(invitationId);
      
      // Remove the invitation from the list
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      
      // Refresh organizations to show the newly joined one
      const response = await organizationsApi.list();
      setOrganizations(response.data?.organizations || []);
    } catch (err) {
      setError("Failed to accept invitation");
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      await invitationsApi.decline(invitationId);
      
      // Remove the invitation from the list
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    } catch (err) {
      setError("Failed to decline invitation");
    }
  };

  // Early loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <p>Loading organizations...</p>
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
            <h2 className="text-2xl font-bold tracking-tight">Organizations</h2>
            <p className="text-muted-foreground">Manage your organizations and team access.</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Create Organization</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Organization</DialogTitle>
                  <DialogDescription>
                    Add a new organization to collaborate with your team.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Organization Name</Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={newOrg.name}
                      onChange={handleInputChange}
                      placeholder="Acme Inc." 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input 
                      id="description" 
                      name="description"
                      value={newOrg.description}
                      onChange={handleInputChange}
                      placeholder="A brief description of your organization" 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    onClick={handleCreateOrg}
                    disabled={isCreating || !newOrg.name}
                  >
                    {isCreating ? "Creating..." : "Create Organization"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {organizations.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
              <Card key={org.id}>
                <CardHeader>
                  <CardTitle>{org.name}</CardTitle>
                  <CardDescription>
                    {org.projectCount || 0} {(org.projectCount || 0) === 1 ? 'project' : 'projects'} • 
                    {org.memberCount || 0} {(org.memberCount || 0) === 1 ? 'member' : 'members'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {org.description || "No description provided."}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/organizations/${org.id}/settings`}>Manage</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/organizations/${org.id}/projects`}>View Projects</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Organizations Yet</CardTitle>
              <CardDescription>Create your first organization to get started.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => setDialogOpen(true)}>
                Create Your First Organization
              </Button>
            </CardContent>
          </Card>
        )}
        
        {invitations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Organization Invitations</CardTitle>
              <CardDescription>Organizations you've been invited to join.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <h3 className="font-medium">{invitation.organization.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Invited by: {invitation.inviter.email}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeclineInvitation(invitation.id)}
                      >
                        Decline
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleAcceptInvitation(invitation.id)}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 