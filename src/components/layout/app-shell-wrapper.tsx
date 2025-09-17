'use client';
import { usePathname } from 'next/navigation';
import { AppShell } from './app-shell';

export function AppShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show the AppShell for the landing page
  if (pathname === '/') {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
