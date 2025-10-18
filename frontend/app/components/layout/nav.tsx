"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/providers/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavItem {
  title: string;
  href: string;
  requiresAuth: boolean;
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", requiresAuth: true },
  { title: "Organizations", href: "/organizations", requiresAuth: true },
  { title: "Projects", href: "/projects", requiresAuth: true },
];

const adminNavItems: NavItem[] = [];

const publicNavItems: NavItem[] = [];

export function MainNav() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "GU"; // Guest User
    
    const firstInitial = user.firstName?.[0] || user.email?.[0] || "";
    const lastInitial = user.lastName?.[0] || "";
    
    return (firstInitial + lastInitial).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link 
            href={
              isAuthenticated 
                ? (user?.role === 'admin' ? '/admin' : '/dashboard')
                : '/'
            } 
            className="mr-6 flex items-center space-x-2 font-bold"
          >
            <span>Platform</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {(isAuthenticated 
              ? (user?.role === 'admin' ? adminNavItems : navItems)
              : publicNavItems
            ).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href || pathname?.startsWith(item.href + "/")
                    ? "text-foreground font-semibold"
                    : "text-foreground/60"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {user?.role === 'admin' ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin">🛡️ Admin Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/resources/user">Manage Users</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/resources/organization">Manage Organizations</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/resources/project">Manage Projects</Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings">Settings</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <nav className="flex items-center space-x-4">
              <Link href="/login" className="text-sm font-medium">
                Sign in
              </Link>
              <Button asChild size="sm">
                <Link href="/register">Sign up</Link>
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
} 