import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

export interface FieldConfig {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
}

export interface CreateDialogProps {
  title: string;
  description?: string;
  trigger?: ReactNode;
  triggerText?: string;
  fields: FieldConfig[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Record<string, any>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitText?: string;
  error?: string;
}

/**
 * Generic dialog component for creating resources
 * Supports text, email, password, textarea, and select inputs
 */
export function CreateDialog({
  title,
  description,
  trigger,
  triggerText = "Create",
  fields,
  isOpen,
  onOpenChange,
  formData,
  onChange,
  onSubmit,
  isSubmitting,
  submitText,
  error,
}: CreateDialogProps) {
  const isFormValid = fields
    .filter((field) => field.required)
    .every((field) => formData[field.name]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || <Button>{triggerText}</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {error && (
          <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-4 py-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>

              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={onChange}
                  placeholder={field.placeholder}
                  rows={field.rows || 3}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={onChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {field.placeholder || `Select ${field.label.toLowerCase()}`}
                  </option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type || "text"}
                  value={formData[field.name] || ""}
                  onChange={onChange}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? "Creating..." : submitText || title}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

