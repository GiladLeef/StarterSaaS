interface FormAlertProps {
  success?: string;
  error?: string;
}

export function FormAlert({ success, error }: FormAlertProps) {
  if (!success && !error) return null;
  
  return (
    <>
      {success && (
        <div className="bg-green-100 p-3 rounded-md text-sm text-green-700 mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-destructive/15 p-3 rounded-md text-sm text-destructive mb-4">
          {error}
        </div>
      )}
    </>
  );
} 