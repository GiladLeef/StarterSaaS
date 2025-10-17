"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { useAutoFetch } from "@/app/hooks/auto";
import { useState } from "react";
import { formatRelativeTime } from "@/app/utils/dates";

const apiFetch = async (url: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${url}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

interface FieldMetadata {
  name: string;
  type: string;
  label: string;
  required: boolean;
  editable: boolean;
}

interface ResourceMetadata {
  name: string;
  pluralName: string;
  capabilities: string[];
  fields: FieldMetadata[];
  searchFields: string[];
  displayFields: string[];
}

export default function AdminResourcePage() {
  const params = useParams();
  const router = useRouter();
  const resource = params.resource as string;
  const [searchTerm, setSearchTerm] = useState("");

  const { data: responseData, isLoading, refetch } = useAutoFetch<any>(
    () => apiFetch(`/api/v1/admin/resources/${resource}`),
    resource + "s"
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <p>Loading {resource} data...</p>
      </div>
    );
  }

  const items = responseData || [];
  const metadata: ResourceMetadata = (responseData as any)?.[0]?.metadata;

  const filteredItems = items.filter((item: any) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return metadata?.searchFields?.some((field) =>
      String(item[field] || "").toLowerCase().includes(searchLower)
    );
  });

  const getDisplayValue = (item: any, fieldName: string) => {
    const value = item[fieldName];
    const field = metadata?.fields?.find((f) => f.name === fieldName);
    
    if (value === null || value === undefined) return "-";
    if (field?.type?.includes("time.Time")) return formatRelativeTime(value);
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="container flex flex-col gap-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin")}
              className="mb-2"
            >
              ← Back to Admin
            </Button>
            <h2 className="text-2xl font-bold tracking-tight capitalize">
              Manage {metadata?.pluralName || resource}
            </h2>
            <p className="text-muted-foreground">
              {items.length} total items
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder={`Search ${metadata?.searchFields?.join(", ") || ""}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={refetch}>Refresh</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="capitalize">{metadata?.pluralName || resource} List</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No items found
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {metadata?.displayFields?.map((field) => (
                        <TableHead key={field} className="capitalize">
                          {metadata.fields.find((f) => f.name === field)?.label || field}
                        </TableHead>
                      ))}
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item: any) => (
                      <TableRow key={item.id || item.ID}>
                        {metadata?.displayFields?.map((field) => (
                          <TableCell key={field}>
                            {getDisplayValue(item, field)}
                          </TableCell>
                        ))}
                        <TableCell>
                          <div className="flex gap-2">
                            {metadata?.capabilities?.includes("view") && (
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            )}
                            {metadata?.capabilities?.includes("edit") && (
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            )}
                            {metadata?.capabilities?.includes("delete") && (
                              <Button variant="destructive" size="sm">
                                Delete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {metadata && (
          <Card>
            <CardHeader>
              <CardTitle>Resource Schema</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Editable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metadata.fields.map((field) => (
                    <TableRow key={field.name}>
                      <TableCell className="font-medium">{field.label}</TableCell>
                      <TableCell className="font-mono text-sm">{field.type}</TableCell>
                      <TableCell>{field.required ? "Yes" : "No"}</TableCell>
                      <TableCell>{field.editable ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

