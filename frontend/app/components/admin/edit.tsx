"use client";

import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  resourceName: string;
  item: any;
  onSave: (updatedItem: any) => Promise<void>;
}

export function EditDialog({ isOpen, onClose, resourceName, item, onSave }: EditDialogProps) {
  const [formData, setFormData] = React.useState(item);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFormData(item);
    setError(null);
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Get editable fields (exclude system fields)
  const excludedFields = ['id', 'createdAt', 'updatedAt', 'deletedAt', 'passwordHash', 'password'];
  const editableFields = Object.keys(item).filter(key => !excludedFields.includes(key));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="capitalize">Edit {resourceName}</DialogTitle>
          <DialogDescription>
            Make changes to this {resourceName}. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {editableFields.map((field) => (
              <div key={field} className="grid gap-2">
                <Label htmlFor={field} className="capitalize">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                {typeof item[field] === 'boolean' ? (
                  <select
                    id={field}
                    value={String(formData[field])}
                    onChange={(e) => handleChange(field, e.target.value === 'true')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : (
                  <Input
                    id={field}
                    value={formData[field] ?? ''}
                    onChange={(e) => handleChange(field, e.target.value)}
                    type={typeof item[field] === 'number' ? 'number' : 'text'}
                  />
                )}
              </div>
            ))}

            {error && (
              <div className="rounded-md bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

