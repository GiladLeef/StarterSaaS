export function DashboardLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>{message}</p>
      </div>
    </div>
  )
}

export function DashboardError({ 
  message, 
  onRetry 
}: { 
  message: string
  onRetry?: () => void 
}) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <p className="text-destructive mb-4">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  )
}

