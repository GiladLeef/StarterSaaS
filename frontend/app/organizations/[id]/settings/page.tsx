"use client";

import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { organizationsApi } from "@/app/api/fetcher";
import { PageHeader } from "@/components/common/page-header";
import { LoadingState, ErrorState } from "@/app/components/ui/state";
import { EntityForm } from "@/app/components/forms/entity";
import { DangerZone } from "@/app/components/settings/danger";
import { useResourceDetail } from "@/app/hooks/use-resource-detail";
import { useFormDialog } from "@/app/hooks/dialog";
import { useMutation } from "@/app/hooks/api";
import { useEffect } from "react";

export default function OrganizationSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const organizationId = params?.id as string;
  
  // DRY: Use hooks for data fetching
  const { data: organization, isLoading, error } = useResourceDetail(
    organizationsApi.get,
    organizationId,
    'organization'
  ) as { data: any; isLoading: boolean; error: string };

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
  });

  // Update form when organization loads
  useEffect(() => {
    if (organization) {
      const org = organization as any;
      setFormData({
        name: org.name || "",
        description: org.description || "",
      });
    }
  }, [organization, setFormData]);

  // DRY: Use mutation hook for delete
  const { mutate: deleteOrganization, isLoading: isDeleting } = useMutation(
    organizationsApi.delete,
    {
      onSuccess: () => router.push("/organizations"),
      onError: () => alert("Failed to delete organization. Please try again.")
    }
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(async () => {
      await organizationsApi.update(organizationId, formData);
    });
  };

  if (isLoading) {
    return <LoadingState message="Loading organization settings..." />;
  }

  if (error && !organization) {
    return (
      <ErrorState 
        message={error} 
        actionLabel="Return to Organizations" 
        onAction={() => router.push("/organizations")} 
      />
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="container flex flex-col gap-6 py-8">
        <PageHeader
          title="Organization Settings"
          description="Manage your organization settings and preferences"
        />
        
        <div className="grid gap-6">
          <EntityForm
            title="Organization Information"
            description="Update your organization details"
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
                placeholder: "Organization name",
                required: true,
              },
              {
                id: "description",
                name: "description",
                label: "Description (Optional)",
                value: formData.description,
                onChange: handleChange,
                placeholder: "A brief description of your organization",
              },
            ]}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Actions that cannot be undone</CardDescription>
            </CardHeader>
            <CardContent>
              <DangerZone
                actionText="Permanently delete this organization and all its data."
                actionLabel="Delete Organization"
                onAction={() => deleteOrganization(organizationId)}
                isLoading={isDeleting}
                confirmationMessage="Are you sure you want to delete this organization? All projects in this organization will also be deleted. This action cannot be undone."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
