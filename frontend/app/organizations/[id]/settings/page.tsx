"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { organizationsApi } from "@/app/api/fetcher";
import { PageHeader } from "@/app/components/page-header";
import { LoadingState, ErrorState } from "@/app/components/loading-state";
import { EntityForm } from "@/app/components/entity-form";
import { DangerZone } from "@/app/components/danger-zone";

export default function OrganizationSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const organizationId = params?.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [organization, setOrganization] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  
  useEffect(() => {
    const fetchData = async () => {
      if (!organizationId) return;
      
      try {
        setIsLoading(true);
        setError("");

        const orgResponse = await organizationsApi.get(organizationId);
        const orgData = orgResponse.data?.organization || orgResponse.data;
        
        if (!orgData) {
          setError("Organization not found");
          setIsLoading(false);
          return;
        }
        
        setOrganization(orgData);
        setFormData({
          name: orgData.name || "",
          description: orgData.description || "",
        });
      } catch (err) {
        console.error("Error fetching organization:", err);
        setError("Failed to load organization data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [organizationId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await organizationsApi.update(organizationId, formData);
      setSuccess("Organization updated successfully");
    } catch (err) {
      setError("Failed to update organization");
      console.error("Error updating organization:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteOrganization = async () => {
    if (!organizationId) return;
    
    try {
      setIsDeleting(true);
      await organizationsApi.delete(organizationId);
      router.push("/organizations");
    } catch (err) {
      console.error("Error deleting organization:", err);
      alert("Failed to delete organization. Please try again.");
    } finally {
      setIsDeleting(false);
    }
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
                placeholder: "Organization name",
                required: true,
              },
              {
                id: "description",
                name: "description",
                label: "Description (Optional)",
                value: formData.description,
                onChange: handleInputChange,
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
                onAction={handleDeleteOrganization}
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