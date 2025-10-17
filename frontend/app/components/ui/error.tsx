export function ErrorAlert({ error }: { error?: string | null }) {
  if (!error) return null;

  return (
    <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive mb-4 border border-destructive/20">
      <p className="font-medium">Error</p>
      <p className="mt-1">{error}</p>
    </div>
  );
}

