export default function OrganizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full">
      {children}
    </div>
  );
}

