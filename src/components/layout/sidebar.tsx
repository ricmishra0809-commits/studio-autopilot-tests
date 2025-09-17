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
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import React from 'react';

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
      { href: '/', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
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
    icon: <Sparkles className="h-4 w-4" />,
    links: [
      { href: '/summarize-ci', label: 'Summarize CI', icon: <ClipboardCheck className="h-4 w-4" /> },
      { href: '/security-rules', label: 'Security Rules', icon: <ShieldCheck className="h-4 w-4" /> },
      { href: '/ai-agent', label: 'AI Test Agent', icon: <Bot className="h-4 w-4" /> },
      { href: '/test-video', label: 'Test Video Gen', icon: <Video className="h-4 w-4" /> },
    ],
    defaultOpen: true,
  },
  {
    title: 'Artifacts',
    icon: <Github className="h-4 w-4" />,
    links: [
      { href: '/n8n-workflow', label: 'n8n Workflow', icon: <Workflow className="h-4 w-4" /> },
      { href: '/cicd-config', label: 'CI/CD Config', icon: <Github className="h-4 w-4" /> },
      { href: '/cicd-integration', label: 'CI/CD Integration', icon: <Terminal className="h-4 w-4" /> },
      { href: '/docs', label: 'Documentation', icon: <BookOpenText className="h-4 w-4" /> },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    return pathname === href;
  };

  return (
    <Sidebar collapsible="icon" className="hidden md:flex md:flex-col bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <Rocket className="w-8 h-8 text-primary" />
          <span className="font-bold text-lg font-headline group-data-[collapsible=icon]:hidden">
            Studio AutoPilot
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2 pr-1">
        <SidebarMenu>
          {navItems.map((section) => (
            section.title === 'Overview' ? (
                <SidebarMenuItem key={section.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isLinkActive(section.links[0].href)}
                    tooltip={{children: section.links[0].label}}
                    variant='ghost'
                  >
                    <Link href={section.links[0].href}>
                      {section.links[0].icon}
                      <span className="group-data-[collapsible=icon]:hidden">{section.links[0].label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                <Collapsible key={section.title} className="w-full" defaultOpen={section.defaultOpen || section.links.some(link => isLinkActive(link.href))}>
                  <CollapsibleTrigger asChild>
                    <div className='w-full'>
                      <SidebarMenuButton 
                        className="justify-between group-data-[collapsible=icon]:justify-center"
                        tooltip={{children: section.title}}
                        variant='ghost'
                        >
                        <div className="flex items-center gap-2">
                          {section.icon}
                          <span className='group-data-[collapsible=icon]:hidden'>{section.title}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90 group-data-[collapsible=icon]:hidden" />
                      </SidebarMenuButton>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                    <SidebarMenuSub>
                      {section.links.map((link) => (
                        <SidebarMenuSubItem key={link.href}>
                          <SidebarMenuSubButton asChild isActive={isLinkActive(link.href)}>
                            <Link href={link.href}>
                              {/* {link.icon} */}
                              <span>{link.label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              )
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 mt-auto">
        <div className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          © {new Date().getFullYear()} Studio AutoPilot
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
