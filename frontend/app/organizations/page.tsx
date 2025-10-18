"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useResourceList } from "@/app/hooks/resources"
import { useFormDialog } from "@/app/hooks/dialog"
import { CreateDialog } from "@/app/components/forms/dialog"
import { organizationsApi, invitationsApi } from "@/app/api/fetcher"
import { useAutoFetch } from "@/app/hooks/auto"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/providers/auth"
import { useEffect } from "react"
import { UserDashboardLayout } from "@/components/dashboard/user"
import { PageHeader } from "@/components/common/page-header"
import { ListSection } from "@/components/common/list-section"
import { formatCount } from "@/lib/utils/resource-helpers"

interface Organization {
  id: string
  name: string
  slug: string
  description?: string
  projectCount?: number
  memberCount?: number
}

interface Invitation {
  id: string
  organization: Organization
  inviter: { email: string }
}

export default function OrganizationsPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/admin/resources/organization')
    }
  }, [user, router])

  const {
    items: organizations,
    isLoading,
    error,
    setError,
    refetch,
  } = useResourceList<Organization>(organizationsApi, "organizations")

  const { data: invitations, refetch: refetchInvitations } = useAutoFetch<Invitation>(
    () => invitationsApi.list(),
    "invitations",
    { onError: () => console.error("Failed to load invitations") }
  )

  const dialog = useFormDialog({
    name: "",
    slug: "",
    description: "",
  })

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    dialog.handleChange(e)
    if (e.target.name === "name") {
      dialog.updateField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))
    }
  }

  const handleCreate = async () => {
    await dialog.handleSubmit(async (data) => {
      await organizationsApi.create(data)
      await refetch()
    })
  }

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      await invitationsApi.accept(invitationId)
      await Promise.all([refetchInvitations(), refetch()])
    } catch (err) {
      setError("Failed to accept invitation")
    }
  }

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      await invitationsApi.decline(invitationId)
      await refetchInvitations()
    } catch (err) {
      setError("Failed to decline invitation")
    }
  }

  if (user?.role === 'admin') {
    return null
  }

  if (isLoading) {
    return (
      <UserDashboardLayout user={user} title="Organizations">
        <div className="flex items-center justify-center p-8">
          <p>Loading organizations...</p>
        </div>
      </UserDashboardLayout>
    )
  }

  return (
    <UserDashboardLayout user={user} title="Organizations">
      <div className="px-4 lg:px-6">
        {error && (
          <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6">
          <PageHeader
            title="Organizations"
            description="Manage your organizations and team collaborations."
            action={
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
            }
          />

          {organizations.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {organizations.map((org) => (
                <Card key={org.id}>
                  <CardHeader>
                    <CardTitle>{org.name}</CardTitle>
                    <CardDescription>
                      {formatCount(org.projectCount || 0, 'project')} • {formatCount(org.memberCount || 0, 'member')}
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
            <ListSection
              title="Organization Invitations"
              description="Organizations you've been invited to join."
              items={invitations.map((invitation) => ({
                id: invitation.id,
                primary: invitation.organization.name,
                secondary: `Invited by: ${invitation.inviter.email}`,
                actions: [
                  {
                    label: 'Decline',
                    onClick: () => handleDeclineInvitation(invitation.id),
                    variant: 'outline' as const
                  },
                  {
                    label: 'Accept',
                    onClick: () => handleAcceptInvitation(invitation.id),
                    variant: 'default' as const
                  }
                ]
              }))}
              className="mt-6"
            />
          )}
        </div>
      </div>
    </UserDashboardLayout>
  )
}
