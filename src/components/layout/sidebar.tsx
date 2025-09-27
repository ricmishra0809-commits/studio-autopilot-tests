
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Rocket,
  LayoutDashboard,
  FileText,
  FileCode2,
  Workflow,
  Github,
  BookOpenText,
  ClipboardCheck,
  ShieldCheck,
  Bot,
  Terminal,
  Video,
  LogOut,
  User,
  Settings,
  MousePointerClick,
  Moon,
  Sun,
  TestTube,
  GitBranch,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import React from 'react';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';

type NavLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

type NavSection = {
  title: string;
  links: NavLink[];
};

export const navItems: NavSection[] = [
  {
    title: 'Overview',
    links: [
      { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
      { href: '/workflow', label: 'Workflow', icon: <Workflow /> },
    ],
  },
  {
    title: 'Generate',
    links: [
      { href: '/test-strategy', label: 'Test Strategy', icon: <FileText /> },
      { href: '/test-scripts', label: 'Test Scripts', icon: <FileCode2 /> },
    ],
  },
  {
    title: 'AI Tools',
    links: [
      { href: '/summarize-ci', label: 'Summarize CI', icon: <ClipboardCheck /> },
      { href: '/security-rules', label: 'Security Rules', icon: <ShieldCheck /> },
    ],
  },
  {
    title: 'Automation & Docs',
    links: [
      { href: '/cicd-config', label: 'CI/CD Config', icon: <Github /> },
      { href: '/n8n-workflow', label: 'n8n Workflow', icon: <Workflow /> },
      { href: '/cicd-integration', label: 'CI/CD Integration', icon: <Terminal /> },
      { href: '/docs', label: 'Runbook', icon: <BookOpenText /> },
      { href: '/technical-blueprint', label: 'Technical Blueprint', icon: <GitBranch /> },
      { href: '/api-test', label: 'API Test', icon: <TestTube /> },
    ],
  },
];

function ThemeToggle() {
    const { setTheme, theme } = useTheme();
  
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="h-9 w-9 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    );
}

function UserProfile() {
    const { user, logout } = useAuth();

    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start items-center p-2 h-auto text-left group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
                 <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? 'User'} />
                      <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left group-data-[collapsible=icon]:hidden">
                      <p className="text-sm font-medium truncate text-sidebar-foreground">{user?.displayName ?? 'Welcome'}</p>
                      <p className="text-xs text-sidebar-foreground/70 truncate">{user?.email}</p>
                    </div>
                  </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile"><User className="mr-2" />Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem disabled><Settings className="mr-2" />Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="floating" className="hidden md:flex md:flex-col bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="p-3">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Rocket className="w-7 h-7 text-primary" />
          <span className="font-bold text-lg font-headline group-data-[collapsible=icon]:hidden">
            Studio AutoPilot
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2 pr-1 overflow-y-auto">
        <SidebarMenu>
          {navItems.map((section) => (
            <div key={section.title} className="mb-4 last:mb-0">
              <h2 className="px-2 mb-2 text-xs font-semibold tracking-wider text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
                {section.title}
              </h2>
              {section.links.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === link.href}
                    tooltip={{ children: link.label }}
                    className="text-sidebar-foreground/80 hover:text-sidebar-foreground"
                  >
                    <Link href={link.href}>
                        {link.icon}
                        <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </div>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border/50">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
            <div className="group-data-[collapsible=icon]:hidden">
                 <ThemeToggle />
            </div>
             <div className="group-data-[collapsible=icon]:block hidden">
                 <ThemeToggle />
            </div>
        </div>
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}
