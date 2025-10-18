import { MainNav } from "../components/layout/nav";
import { Footer } from "../components/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
}

