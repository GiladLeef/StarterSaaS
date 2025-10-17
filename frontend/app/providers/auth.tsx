"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi } from "@/app/api/fetcher";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/terms",
  "/privacy",
];

const isPublicRoutePath = (pathname: string | null): boolean => {
  if (!pathname) return false;
  return publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
};

// Extract user from different response formats
const extractUserFromResponse = (userData: any): User | null => {
  if (!userData) return null;
  
  const userObject = userData.user || userData;
  
  // Check for email instead of id (id might not be in public response)
  if (userObject && userObject.email) {
    return userObject;
  }
  
  return null;
};

const handleAuthSuccess = (router: any, user: any) => {
  // Redirect admin to /admin, regular users to /dashboard
  const redirectPath = user?.role === 'admin' ? '/admin' : '/dashboard';
  
  // Force a page reload to ensure token is properly loaded
  if (typeof window !== 'undefined') {
    window.location.href = redirectPath;
  } else {
    router.push(redirectPath);
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = isPublicRoutePath(pathname);
  
  const redirectIfUnauthorized = () => {
    if (!isPublicRoute) {
      router.push("/login");
    }
  };
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        const hasToken = typeof window !== 'undefined' && localStorage.getItem('authToken');
        
        if (!hasToken && !isPublicRoute) {
          setUser(null);
          router.push("/login");
          setIsLoading(false);
          return;
        }
        
        if (isPublicRoute) {
          setIsLoading(false);
          return;
        }
        
        try {
          const userData = await authApi.getCurrentUser();
          const userObject = extractUserFromResponse(userData);
          
          if (userObject) {
            setUser(userObject);
            return;
          }
          
          setUser(null);
          redirectIfUnauthorized();
        } catch (error) {
          setUser(null);
          redirectIfUnauthorized();
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [pathname, isPublicRoute, router]);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(email, password);
      
      if (!response || !response.user) {
        throw new Error("Login failed: Invalid response from server");
      }
      
      setUser(response.user);
      handleAuthSuccess(router, response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    authApi.logout();
    setUser(null);
    router.push("/login");
  };
  
  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(userData);
      
      if (!response || !response.user) {
        throw new Error("Registration failed: Invalid response from server");
      }
      
      setUser(response.user);
      handleAuthSuccess(router, response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...userData });
  };
  
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    updateUser,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 