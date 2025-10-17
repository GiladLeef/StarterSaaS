"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useResourceList } from "@/app/hooks/resources";
import { useFormDialog } from "@/app/hooks/dialog";
import { CreateDialog } from "@/app/components/forms/dialog";
import { organizationsApi, invitationsApi } from "@/app/api/fetcher";
import { useState, useEffect } from "react";

interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  projectCount?: number;
  memberCount?: number;
}

interface Invitation {
  id: string;
  organization: Organization;
  inviter: { email: string };
}

export default function OrganizationsPage() {
  const {
    items: organizations,
    isLoading,
    error,
    setError,
    refetch,
  } = useResourceList<Organization>(organizationsApi, "organizations");

  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const dialog = useFormDialog({
    name: "",
    slug: "",
    description: "",
  });

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    dialog.handleChange(e);
    if (e.target.name === "name") {
      dialog.updateField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"));
    }
  };

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await invitationsApi.list();
        setInvitations(response.data?.invitations || []);
      } catch (err) {
        console.error("Failed to load invitations:", err);
      }
    };
    fetchInvitations();
  }, []);

  const handleCreate = async () => {
    await dialog.handleSubmit(async (data) => {
      await organizationsApi.create(data);
      await refetch();
    });
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      await invitationsApi.accept(invitationId);
      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
      await refetch();
    } catch (err) {
      setError("Failed to accept invitation");
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      await invitationsApi.decline(invitationId);
      setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
    } catch (err) {
      setError("Failed to decline invitation");
    }
  };

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

          <CreateDialog
            title="Create Organization"
            description="Add a new organization to collaborate with your team."
            triggerText="Create Organization"
            fields={[
              {
                name: "name",
                label: "Organization Name",
                placeholder: "Acme Inc.",
                required: true,
              },
              {
                name: "description",
                label: "Description",
                placeholder: "A brief description of your organization",
              },
            ]}
            isOpen={dialog.isOpen}
            onOpenChange={dialog.setIsOpen}
            formData={dialog.formData}
            onChange={handleNameChange}
            onSubmit={handleCreate}
            isSubmitting={dialog.isSubmitting}
            error={dialog.error}
          />
        </div>

        {organizations.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
              <Card key={org.id}>
                <CardHeader>
                  <CardTitle>{org.name}</CardTitle>
                  <CardDescription>
                    {org.projectCount || 0} {(org.projectCount || 0) === 1 ? "project" : "projects"} •
                    {org.memberCount || 0} {(org.memberCount || 0) === 1 ? "member" : "members"}
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
              <Button onClick={() => dialog.setIsOpen(true)}>
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
                      <Button size="sm" onClick={() => handleAcceptInvitation(invitation.id)}>
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

