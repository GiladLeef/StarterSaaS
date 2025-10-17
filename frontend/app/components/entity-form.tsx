import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormAlert } from "./form-alert";

interface EntityFormProps {
  title: string;
  description?: string;
  isLoading: boolean;
  error?: string;
  success?: string;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  fields: {
    id: string;
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
  }[];
  children?: ReactNode;
}

export function EntityForm({
  title,
  description,
  isLoading,
  error,
  success,
  onSubmit,
  submitLabel = "Save Changes",
  fields,
  children
}: EntityFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <FormAlert success={success} error={error} />
        
        <form onSubmit={onSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                name={field.name}
                type={field.type || "text"}
                value={field.value}
                onChange={field.onChange}
                placeholder={field.placeholder}
                required={field.required}
              />
            </div>
          ))}
          
          {children}
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 