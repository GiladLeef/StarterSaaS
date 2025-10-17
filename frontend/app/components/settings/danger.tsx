import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface DangerZoneProps {
  title?: string;
  description?: string;
  actionText: string;
  actionLabel: string;
  onAction: () => void;
  isLoading?: boolean;
  confirmationMessage?: string;
  children?: ReactNode;
}

export function DangerZone({
  title = "Danger Zone",
  description,
  actionText,
  actionLabel,
  onAction,
  isLoading = false,
  confirmationMessage = "Are you sure? This action cannot be undone.",
  children
}: DangerZoneProps) {
  const handleAction = () => {
    if (window.confirm(confirmationMessage)) {
      onAction();
    }
  };

  return (
    <div className="border rounded-md p-4 border-destructive/30 bg-destructive/5">
      <div className="space-y-2 mb-4">
        <h3 className="text-sm font-medium">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      
      {children}
      
      <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1">{actionText}</p>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={handleAction}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : actionLabel}
        </Button>
      </div>
    </div>
  );
} 