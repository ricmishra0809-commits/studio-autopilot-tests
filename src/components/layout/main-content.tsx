'use client';

import { usePathname } from 'next/navigation';
import { Rocket } from 'lucide-react';

import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { navItems } from './sidebar';

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    const currentNavItem = navItems.flatMap(item => item.links).find(link => link.href === pathname);
    return currentNavItem ? currentNavItem.label : '';
  }

  const pageTitle = getPageTitle();

  return (
    <SidebarInset className="w-full">
      <header className="flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-30">
        <SidebarTrigger className="md:hidden" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold md:text-xl font-headline">
            {pageTitle && <>
                <span className="text-muted-foreground">AutoPilot /</span> {pageTitle}
            </>}
          </h1>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </SidebarInset>
  );
}
