import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}

interface PageHeaderActionProps {
  href?: string;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  children: ReactNode;
}

export function PageHeaderAction({ href, onClick, variant = "default", children }: PageHeaderActionProps) {
  if (href) {
    return (
      <Button variant={variant} asChild>
        <Link href={href}>{children}</Link>
      </Button>
    );
  }
  
  return (
    <Button variant={variant} onClick={onClick}>
      {children}
    </Button>
  );
} 