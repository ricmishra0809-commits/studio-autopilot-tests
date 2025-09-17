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
    if (!loading) {
      // If user is not logged in and trying to access a protected route
      if (!user && !PUBLIC_ROUTES.includes(pathname)) {
        router.push('/login');
      }
      // If user is logged in and trying to access login/signup
      if (user && AUTH_ROUTES.includes(pathname)) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);


  // Show a global loader while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <LoadingSpinner className="h-12 w-12" />
      </div>
    );
  }

  // If user is authenticated or on a public page, show the content
  if (user || PUBLIC_ROUTES.includes(pathname)) {
     // Don't show the AppShell for landing, login, or signup pages
    if (PUBLIC_ROUTES.includes(pathname)) {
        return <>{children}</>;
    }
    return <AppShell>{children}</AppShell>;
  }
  
  // This will be shown briefly while redirecting
  return (
    <div className="flex items-center justify-center h-screen bg-background">
        <LoadingSpinner className="h-12 w-12" />
    </div>
  );
}
