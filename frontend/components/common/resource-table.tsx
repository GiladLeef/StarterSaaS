import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface ResourceTableProps {
  title: string
  description?: string
  data: any[]
  columns?: string[]
  excludeColumns?: string[]
  onEdit?: (item: any) => void
  onDelete?: (id: string) => void
  searchPlaceholder?: string
}

export function ResourceTable({
  title,
  description,
  data,
  columns: customColumns,
  excludeColumns = ['deletedAt', 'password', 'passwordHash'],
  onEdit,
  onDelete,
  searchPlaceholder = "Search...",
}: ResourceTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const columns = customColumns || (data.length > 0 
    ? Object.keys(data[0]).filter(key => !excludeColumns.includes(key))
    : [])

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder={searchPlaceholder}
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
                {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center">
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
                    {(onEdit || onDelete) && (
                      <TableCell>
                        <div className="flex gap-2">
                          {onEdit && (
                            <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                              Edit
                            </Button>
                          )}
                          {onDelete && (
                            <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)}>
                              Delete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

