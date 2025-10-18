"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AdminDashboardLayout } from "@/components/dashboard/admin";
import { DashboardPage } from "@/components/dashboard/page";
import { ResourceTable } from "@/components/common/resource-table";
import { EditDialog } from "@/app/components/admin/edit";
import { useAdminData, useAdminResource } from "@/hooks/use-admin";

export default function ResourceManagementPage() {
  const params = useParams();
  const resource = params.resource as string;
  
  const { user, resourcesArray, isLoading: adminLoading, error: adminError } = useAdminData();
  const { data, isLoading: dataLoading, error: dataError, updateItem, deleteItem } = useAdminResource(resource);
  
  const [editingItem, setEditingItem] = React.useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const handleSaveEdit = async (updatedItem: any) => {
    try {
      await updateItem(updatedItem.id, updatedItem);
      setIsEditDialogOpen(false);
      setEditingItem(null);
    } catch (err) {
      alert('Failed to update item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteItem(id);
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const title = `Manage ${resource.charAt(0).toUpperCase() + resource.slice(1)}s`;

  return (
    <DashboardPage
      layout={(props) => <AdminDashboardLayout {...props} resources={resourcesArray} />}
      title={title}
      user={user}
      isLoading={adminLoading || dataLoading}
      error={adminError || dataError}
      onRetry={() => window.location.reload()}
    >
      <div className="px-4 lg:px-6">
        <ResourceTable
          title={`${resource.charAt(0).toUpperCase() + resource.slice(1)}s`}
          description={`Manage all ${resource}s in the system`}
          data={data}
          onEdit={setEditingItem}
          onDelete={handleDelete}
        />
      </div>

      {editingItem && (
        <EditDialog
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveEdit}
          item={editingItem}
          resourceName={resource}
        />
      )}
    </DashboardPage>
  );
}
