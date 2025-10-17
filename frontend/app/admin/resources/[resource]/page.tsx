"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const apiFetch = async (url: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${url}`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    },
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export default function ResourceManagementPage() {
  const params = useParams();
  const router = useRouter();
  const resource = params.resource as string;

  const [data, setData] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await apiFetch(`/api/v1/admin/resources/${resource}`);
        
        if (response.success && response.data) {
          // Backend returns data as: { users: [...], metadata: {...} }
          // So we need to access response.data[resourceName + 's']
          const resourceKey = resource + 's';
          const items = response.data[resourceKey] || [];
          setData(Array.isArray(items) ? items : []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load resource data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [resource]);

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      return Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchLower)
      );
    });
  }, [data, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading {resource} data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const resourceName = resource.charAt(0).toUpperCase() + resource.slice(1);
  const columns = data.length > 0 ? Object.keys(data[0]).filter(key => 
    !['createdAt', 'updatedAt', 'deletedAt', 'passwordHash'].includes(key)
  ) : [];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="container flex flex-col gap-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Manage {resourceName}s</h2>
            <p className="text-muted-foreground">
              View and manage all {resource}s in the system.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push('/admin')}>
              Back to Admin
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>{resourceName}s</CardTitle>
                <CardDescription>
                  Total: {data.length} {resource}s
                </CardDescription>
              </div>
              <div className="w-full md:w-64">
                <Input
                  placeholder={`Search ${resource}s...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? `No ${resource}s match your search.` : `No ${resource}s found.`}
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead key={column} className="capitalize">
                          {column.replace(/([A-Z])/g, ' $1').trim()}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item, index) => (
                      <TableRow key={item.id || index}>
                        {columns.map((column) => (
                          <TableCell key={column}>
                            {typeof item[column] === 'boolean'
                              ? item[column] ? 'Yes' : 'No'
                              : typeof item[column] === 'object' && item[column] !== null
                              ? JSON.stringify(item[column])
                              : String(item[column] ?? '-')}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
