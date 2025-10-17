export function LoadingPage({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      <p className="mt-4 text-muted-foreground">{message}</p>
    </div>
  );
}

