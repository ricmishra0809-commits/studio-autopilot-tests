'use client';
import { usePathname } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar';
import { MainContent } from '@/components/layout/main-content';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show the AppShell for the landing page
  if (pathname === '/') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="relative flex min-h-dvh">
        <AppSidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
