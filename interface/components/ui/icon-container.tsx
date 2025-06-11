import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface IconContainerProps {
  children: ReactNode;
  className?: string;
}

export function IconContainer({ children, className }: IconContainerProps) {
  return (
    <div className={cn("rounded-full bg-primary/10 p-2", className)}>
      {children}
    </div>
  );
} 