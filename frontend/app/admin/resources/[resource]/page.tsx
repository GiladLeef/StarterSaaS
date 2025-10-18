"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/layout";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditDialog } from "@/app/components/admin/edit";
import {
  IconDashboard,
  IconUsers,
  IconBuilding,
  IconFolder,
  IconFileDescription,
  IconSettings,
  IconHelp,
  IconInnerShadowTop,
} from "@tabler/icons-react";

const apiFetch = async (url: string, options?: { method?: string; body?: any }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${url}`, {
    method: options?.method || 'GET',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

function getIconForResource(key: string) {
  switch (key) {
    case "user": return IconUsers;
    case "organization": return IconBuilding;
    case "project": return IconFolder;
    case "invitation":
    case "subscription": return IconFileDescription;
    default: return IconDashboard;
  }
}

export default function ResourceManagementPage() {
  const params = useParams();
  const router = useRouter();
  const resource = params.resource as string;

  const [data, setData] = React.useState<any[]>([]);
  const [resources, setResources] = React.useState<Record<string, any>>({});
  const [user, setUser] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [editingItem, setEditingItem] = React.useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [dataResponse, resourcesResponse, userResponse] = await Promise.all([
          apiFetch(`/api/v1/admin/resources/${resource}`),
          apiFetch('/api/v1/admin/resources'),
          apiFetch('/api/v1/users/me'),
        ]);
        
        if (dataResponse.success && dataResponse.data) {
          const resourceKey = resource + 's';
          const items = dataResponse.data[resourceKey] || [];
          setData(Array.isArray(items) ? items : []);
        }

        if (resourcesResponse.success && resourcesResponse.data.resources) {
          setResources(resourcesResponse.data.resources);
        }

        if (userResponse.success && userResponse.data.user) {
          setUser(userResponse.data.user);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [resource]);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (updatedItem: any) => {
    try {
      await apiFetch(`/api/v1/admin/resources/${resource}/${updatedItem.id}`, {
        method: 'PUT',
        body: updatedItem,
      });
      
      setData(data.map(item => item.id === updatedItem.id ? updatedItem : item));
      setIsEditDialogOpen(false);
      setEditingItem(null);
    } catch (err) {
      alert('Failed to update item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await apiFetch(`/api/v1/admin/resources/${resource}/${id}`, {
        method: 'DELETE',
      });
      
      setData(data.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const resourcesArray = Object.entries(resources || {}).map(([key, value]) => ({ key, ...value }));

  if (isLoading) {
    return (
      <DashboardLayout
        sidebar={
          <DashboardSidebar
            title="Admin Panel"
            titleUrl="/admin"
            icon={<IconInnerShadowTop className="!size-5" />}
            user={{
              name: "Loading...",
              email: "loading...",
              avatar: "/avatars/admin.jpg",
            }}
            navMain={[{ title: "Dashboard", url: "/admin", icon: IconDashboard }]}
            navSecondary={[]}
            variant="inset"
          />
        }
        header={<DashboardHeader title={`${resource.charAt(0).toUpperCase() + resource.slice(1)}s`} />}
      >
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout
        sidebar={
          <DashboardSidebar
            title="Admin Panel"
            titleUrl="/admin"
            icon={<IconInnerShadowTop className="!size-5" />}
            user={{
              name: "Error",
              email: "error",
              avatar: "/avatars/admin.jpg",
            }}
            navMain={[{ title: "Dashboard", url: "/admin", icon: IconDashboard }]}
            navSecondary={[]}
            variant="inset"
          />
        }
        header={<DashboardHeader title={`${resource.charAt(0).toUpperCase() + resource.slice(1)}s`} />}
      >
        <div className="px-4 lg:px-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-destructive">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const columns = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'deletedAt') : [];

  return (
    <DashboardLayout
      sidebar={
        <DashboardSidebar
          title="Admin Panel"
          titleUrl="/admin"
          icon={<IconInnerShadowTop className="!size-5" />}
          user={{
            name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Admin",
            email: user?.email || "admin@example.com",
            avatar: "/avatars/admin.jpg",
          }}
          navMain={[
            { title: "Dashboard", url: "/admin", icon: IconDashboard },
            ...resourcesArray.map((r: any) => ({
              title: r.pluralName || r.name,
              url: `/admin/resources/${r.key}`,
              icon: getIconForResource(r.key),
            })),
          ]}
          navSecondary={[
            { title: "Settings", url: "/admin/settings", icon: IconSettings },
            { title: "Help", url: "/admin/help", icon: IconHelp },
          ]}
          variant="inset"
        />
      }
      header={
        <DashboardHeader 
          title={`Manage ${resource.charAt(0).toUpperCase() + resource.slice(1)}s`}
        />
      }
    >
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="capitalize">{resource}s</CardTitle>
            <CardDescription>
              Manage all {resource}s in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column} className="capitalize">
                        {column}
                      </TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1} className="text-center">
                        No data found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item) => (
                      <TableRow key={item.id}>
                        {columns.map((column) => (
                          <TableCell key={column}>
                            {typeof item[column] === 'object' && item[column] !== null
                              ? JSON.stringify(item[column])
                              : String(item[column] ?? '')}
                          </TableCell>
                        ))}
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {editingItem && (
        <EditDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSaveEdit}
          item={editingItem}
          resourceName={resource}
        />
      )}
    </DashboardLayout>
  );
}
