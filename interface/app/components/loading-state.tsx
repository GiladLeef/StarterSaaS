interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <p>{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorState({ message, actionLabel, onAction }: ErrorStateProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <p className="text-destructive">{message}</p>
      {onAction && actionLabel && (
        <button
          className="mt-4 rounded-md bg-primary px-4 py-2 text-white"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
} 