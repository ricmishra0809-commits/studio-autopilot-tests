
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
  Sparkles,
  ClipboardCheck,
  ShieldCheck,
  ChevronRight,
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
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  sidebarMenuSubButtonVariants,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import React from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
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

type NavLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

type NavSection = {
  title: string;
  icon: React.ReactNode;
  links: NavLink[];
  defaultOpen?: boolean;
};

export const navItems: NavSection[] = [
  {
    title: 'Overview',
    icon: <LayoutDashboard className="h-4 w-4" />,
    links: [
      { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
      { href: '/workflow', label: 'Workflow', icon: <Workflow className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Generate',
    icon: <Sparkles className="h-4 w-4" />,
    links: [
      { href: '/test-strategy', label: 'Test Strategy', icon: <FileText className="h-4 w-4" /> },
      { href: '/test-scripts', label: 'Test Scripts', icon: <FileCode2 className="h-4 w-4" /> },
    ],
    defaultOpen: true,
  },
  {
    title: 'AI Tools',
    icon: <Bot className="h-4 w-4" />,
    links: [
      { href: '/ai-agent', label: 'AI Test Agent', icon: <Bot className="h-4 w-4" /> },
      { href: '/visual-recorder', label: 'Visual Recorder', icon: <MousePointerClick className="h-4 w-4" /> },
      { href: '/summarize-ci', label: 'Summarize CI', icon: <ClipboardCheck className="h-4 w-4" /> },
      { href: '/security-rules', label: 'Security Rules', icon: <ShieldCheck className="h-4 w-4" /> },
      { href: '/test-video', label: 'Test Video Gen', icon: <Video className="h-4 w-4" /> },
    ],
    defaultOpen: true,
  },
  {
    title: 'Automation',
    icon: <Terminal className="h-4 w-4" />,
    links: [
      { href: '/cicd-config', label: 'CI/CD Config', icon: <Github className="h-4" /> },
      { href: '/n8n-workflow', label: 'n8n Workflow', icon: <Workflow className="h-4" /> },
      { href: '/cicd-integration', label: 'CI/CD Integration', icon: <Workflow className="h-4" /> },
      { href: '/docs', label: 'Runbook', icon: <BookOpenText className="h-4 w-4" /> },
      { href: '/api-test', label: 'API Test', icon: <TestTube className="h-4 w-4" /> },
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
        className="group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:h-9"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isLinkActive = (href: string) => {
    return pathname === href;
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <Sidebar collapsible="icon" className="hidden md:flex md:flex-col bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Rocket className="w-8 h-8 text-primary" />
          <span className="font-bold text-lg font-headline group-data-[collapsible=icon]:hidden">
            Studio AutoPilot
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2 pr-1">
        <SidebarMenu>
          {navItems.map((section) => (
            <Collapsible key={section.title} className="w-full" defaultOpen={section.defaultOpen || section.links.some(link => isLinkActive(link.href))}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    className="justify-between group-data-[collapsible=icon]:hidden"
                    variant='ghost'
                  >
                      <div className="flex items-center gap-2">
                          {section.icon}
                          <span className='group-data-[collapsible=icon]:hidden'>{section.title}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {/* Collapsed View Icons */}
                 <div className="hidden group-data-[collapsible=icon]:flex flex-col gap-1">
                    {section.links.map((link) => (
                        <Link href={link.href} key={link.href}>
                             <Button
                                variant={isLinkActive(link.href) ? 'secondary' : 'ghost'}
                                size="icon"
                                className="w-9 h-9"
                                aria-label={link.label}
                                asChild
                            >
                                <span>{link.icon}</span>
                            </Button>
                        </Link>
                    ))}
                 </div>

                <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                  <SidebarMenuSub>
                      {section.links.map((link) => (
                        <SidebarMenuSubItem key={link.href}>
                          <Link
                            href={link.href}
                            className={cn(
                              sidebarMenuSubButtonVariants({ size: 'md' }),
                              'w-full',
                              isLinkActive(link.href) &&
                                'bg-sidebar-accent/80 text-sidebar-accent-foreground font-medium'
                            )}
                          >
                            <span className='truncate'>{link.label}</span>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 mt-auto">
        <div className="flex items-center justify-center group-data-[collapsible=icon]:justify-center">
            <div className="flex-grow group-data-[collapsible=icon]:hidden"></div>
            <ThemeToggle />
        </div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start h-auto p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:h-auto group-data-[collapsible=icon]:aspect-square">
                 <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? 'User'} />
                      <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left group-data-[collapsible=icon]:hidden">
                      <p className="text-sm font-medium truncate">{user?.displayName ?? 'Welcome'}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
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
                <Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem disabled><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
