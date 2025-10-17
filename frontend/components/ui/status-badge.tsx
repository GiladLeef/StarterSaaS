import { cn } from "@/lib/utils";

type StatusType = 'active' | 'inactive' | 'pending' | 'planning' | 'in-progress' | 'completed';

type StatusConfig = {
  bg: string;
  text: string;
  label: string;
};

const statusConfigs: Record<StatusType, StatusConfig> = {
  active: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Active',
  },
  inactive: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: 'Inactive',
  },
  pending: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    label: 'Pending',
  },
  planning: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Planning',
  },
  'in-progress': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'In Progress',
  },
  completed: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    label: 'Completed',
  },
};

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
  customLabel?: string;
}

export function StatusBadge({ status, className, customLabel }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(' ', '-') as StatusType;
  const config = statusConfigs[normalizedStatus] || statusConfigs.inactive;
  
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        config.bg,
        config.text,
        className
      )}
    >
      {customLabel || config.label}
    </span>
  );
} 