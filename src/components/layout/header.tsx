
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
  Menu,
} from 'lucide-react';
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
  DropdownMenuGroup,
} from '../ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import { navItems } from './sidebar';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


function ThemeToggle() {
    const { setTheme, theme } = useTheme();
  
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="h-9 w-9"
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
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                 <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? 'User'} />
                    <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
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


export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center">
            <div className="mr-4 hidden md:flex">
                <Link href="/dashboard" className="flex items-center gap-2.5">
                    <Rocket className="w-7 h-7 text-primary" />
                    <span className="font-bold text-lg font-headline">
                        Studio AutoPilot
                    </span>
                </Link>
            </div>

            <div className="md:hidden">
                 <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-4">
                        <SheetHeader>
                            <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                        </SheetHeader>
                         <Link href="/dashboard" className="flex items-center gap-2.5 mb-8">
                            <Rocket className="w-7 h-7 text-primary" />
                            <span className="font-bold text-lg font-headline">
                                Studio AutoPilot
                            </span>
                        </Link>
                        <nav className="flex flex-col gap-2">
                         {navItems.map((section) => (
                            <div key={section.title}>
                                <h2 className="px-2 mb-2 text-xs font-semibold tracking-wider text-muted-foreground">
                                    {section.title}
                                </h2>
                                {section.links.map((link) => (
                                    <Button key={link.href} variant={pathname === link.href ? 'secondary' : 'ghost'} className="justify-start" asChild>
                                        <Link href={link.href}>
                                            {link.icon}
                                            <span>{link.label}</span>
                                        </Link>
                                    </Button>
                                ))}
                            </div>
                        ))}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>

            <nav className="items-center gap-2 text-sm font-medium hidden md:flex">
                 {navItems.map((section) => (
                    <DropdownMenu key={section.title}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">{section.title}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                {section.links.map(link => (
                                     <DropdownMenuItem key={link.href} asChild>
                                        <Link href={link.href} className={cn(pathname === link.href && "text-primary")}>
                                            {link.icon}
                                            {link.label}
                                        </Link>
                                     </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                 ))}
            </nav>

            <div className="flex flex-1 items-center justify-end gap-2">
                <ThemeToggle />
                <UserProfile />
            </div>
        </div>
    </header>
  );
}
