'use client';
import { usePathname } from 'next/navigation';
import { AppShell } from './app-shell';
import { useAuth } from '@/context/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '../shared/loading-spinner';


const AUTH_ROUTES = ['/login', '/signup'];
const PUBLIC_ROUTES = ['/', ...AUTH_ROUTES];

export function AppShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return; // Do nothing while loading
    }

    const isProtectedRoute = !PUBLIC_ROUTES.includes(pathname);

    // If user is not logged in and trying to access a protected route
    if (!user && isProtectedRoute) {
      router.push('/login');
    }

    // If user is logged in and trying to access landing, login, or signup
    if (user && PUBLIC_ROUTES.includes(pathname)) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);


  // Show a global loader while checking auth state or during initial redirects
  if (loading || (!user && !PUBLIC_ROUTES.includes(pathname)) || (user && PUBLIC_ROUTES.includes(pathname))) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <LoadingSpinner className="h-12 w-12" />
      </div>
    );
  }

  // Render the shell for protected routes, otherwise just render children for public routes
  if (!PUBLIC_ROUTES.includes(pathname)) {
    return <AppShell>{children}</AppShell>;
  }

  return <>{children}</>;
}
